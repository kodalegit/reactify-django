import { execa } from "execa";
import { addAppToDjangoSettings } from "./addAppToDjangoSettings";
import { createIndexHtml } from "./createIndexHtml";
import { checkAndInstallDjango } from "./checkAndInstallDjango";
import { createGitignore } from "./createGitignore";
import * as fs from "fs/promises";
import path from "path";
import { modifyViewsPy } from "./modifyViewsPy";
import { modifyUrlsPy } from "./modifyUrlsPy";
import { modifyRootUrlsPy } from "./modifyRootUrlsPy";
import { logger } from "@/src/utils/logger";
import { highlighter } from "@/src/utils/highlighter";

export async function configureDjango(
  projectName: string,
  appName: string,
  cwd: string
) {
  // Check if the current directory is writable
  try {
    await fs.access(cwd, fs.constants.W_OK);
  } catch (error) {
    logger.break();
    logger.error("Error: The current directory is not writable.");
    logger.error(
      "Please check your permissions or try running with elevated privileges."
    );
    process.exit(1);
  }
  // Check if Django is installed and install if necessary
  await checkAndInstallDjango();

  try {
    // Create Django project
    await execa("django-admin", ["startproject", projectName], { cwd });
  } catch (error: any) {
    if (error.message.includes("command not found")) {
      logger.break();
      logger.error(
        `Error: ${highlighter.warn("django-admin")} command not found.`
      );
      logger.error(
        "Ensure Django is installed and added to your system's PATH."
      );
      logger.error(
        `You can try running ${highlighter.warn("python -m django")} instead.`
      );
    } else if (error.message.includes("permission denied")) {
      logger.break();
      logger.error(
        `Error: Permission denied while trying to run ${highlighter.warn(
          "django-admin"
        )}.`
      );
      logger.error("On macOS or Unix-based systems, you might need to run:");
      logger.error(`${highlighter.warn("sudo chmod +x $(which django-admin")}`);
    } else {
      logger.break();
      logger.error(
        `An error occurred while creating the Django project: ${error.message}`
      );
    }
    process.exit(1);
  }

  // Change to the Django project directory
  const projectPath = path.join(cwd, projectName);

  try {
    // Create Django app
    await execa("django-admin", ["startapp", appName], { cwd: projectPath });
  } catch (error: any) {
    if (error.message.includes("command not found")) {
      logger.break();
      logger.error(
        `Error: ${highlighter.warn("django-admin")} command not found.`
      );
    } else {
      logger.break();
      logger.error(
        `An error occurred while creating the Django app: ${error.message}`
      );
    }
    process.exit(1);
  }

  const appPath = path.join(projectPath, appName);
  try {
    // Modify Django settings to include app name
    await addAppToDjangoSettings(projectPath, projectName, appName);

    // Create index.html template with React root and script
    await createIndexHtml(appPath, appName);

    // Point root URL path to index.html in views.py and urls.py
    await modifyViewsPy(appPath, appName);
    await modifyUrlsPy(appPath);
    await modifyRootUrlsPy(projectPath, projectName, appName);

    // Create .gitignore file
    await createGitignore(projectPath);
    logger.break();
    logger.success(`${highlighter.info("Django")} configured successfully.`);
  } catch (error) {
    logger.break();
    logger.error(`Error configuring django: ${(error as Error).message}`);
  }
}
