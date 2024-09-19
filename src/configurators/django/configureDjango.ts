import { execa } from "execa";
import { addAppToDjangoSettings } from "./addAppToDjangoSettings";
import { createTemplateTag } from "./createTemplateTag";
import { checkAndInstallDjango } from "./checkAndInstallDjango";
import { createGitignore } from "./createGitignore";

export async function configureDjango(projectName: string, appName: string) {
  // Check if Django is installed and install if necessary
  await checkAndInstallDjango();

  try {
    // Create Django project
    await execa("django-admin", ["startproject", projectName]);
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
  process.chdir(projectName);

  try {
    // Create Django app
    await execa("django-admin", ["startapp", appName]);
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

  // Modify Django settings to include app name
  await addAppToDjangoSettings(projectName, appName);

  // Add custom React root template tag
  await createTemplateTag(appName);

  // Create .gitignore file
  await createGitignore();
}
