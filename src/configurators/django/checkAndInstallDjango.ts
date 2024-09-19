import { execa } from "execa";

export async function checkAndInstallDjango() {
  try {
    // Check if Django is installed by running 'python -m django --version'
    await execa("python", ["-m", "django", "--version"]);
    console.log("Django is already installed.");
  } catch (error) {
    // Django is not installed, so install it
    console.log("Django is not installed. Installing Django...");
    try {
      await execa("python", ["-m", "pip", "install", "django"]);
      console.log("Django has been installed successfully.");
    } catch (installError) {
      console.error("Failed to install Django:", installError);
      throw installError;
    }
  }
}
