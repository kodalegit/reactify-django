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

export async function configureDjango(
  projectName: string,
  appName: string,
  cwd: string
) {
  // Check if the current directory is writable
  try {
    await fs.access(cwd, fs.constants.W_OK);
  } catch (error) {
    console.error("Error: The current directory is not writable.");
    console.error(
      "Please check your permissions or try running with elevated privileges."
    );
    throw error;
  }
  // Check if Django is installed and install if necessary
  await checkAndInstallDjango();

  try {
    // Create Django project
    await execa("django-admin", ["startproject", projectName], { cwd });
  } catch (error: any) {
    if (error.message.includes("command not found")) {
      console.error("Error: 'django-admin' command not found.");
      console.error(
        "Ensure Django is installed and added to your system's PATH."
      );
      console.error("You can try running 'python -m django' instead.");
    } else if (error.message.includes("permission denied")) {
      console.error(
        "Error: Permission denied while trying to run 'django-admin'."
      );
      console.error("On macOS or Unix-based systems, you might need to run:");
      console.error("  sudo chmod +x $(which django-admin)");
    } else {
      console.error(
        `An error occurred while creating the Django project: ${error.message}`
      );
    }
    throw error;
  }

  // Change to the Django project directory
  const projectPath = path.join(cwd, projectName);

  try {
    // Create Django app
    await execa("django-admin", ["startapp", appName], { cwd: projectPath });
  } catch (error: any) {
    if (error.message.includes("command not found")) {
      console.error("Error: 'django-admin' command not found.");
    } else {
      console.error(
        `An error occurred while creating the Django app: ${error.message}`
      );
    }
    throw error;
  }

  const appPath = path.join(projectPath, appName);
  // Modify Django settings to include app name
  await addAppToDjangoSettings(projectPath, projectName, appName);

  // Add custom React root template tag
  // await createTemplateTag(appName, appPath);

  // Create index.html template with React root and script
  await createIndexHtml(appPath, appName);

  // Point root URL path to index.html in views.py and urls.py
  await modifyViewsPy(appPath, appName);
  await modifyUrlsPy(appPath);
  await modifyRootUrlsPy(projectPath, projectName, appName);

  // Create .gitignore file
  await createGitignore(projectPath);
}
