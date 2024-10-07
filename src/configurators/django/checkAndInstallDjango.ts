import { execa } from "execa";
import { logger } from "../../utils/logger";

export async function checkAndInstallDjango() {
  try {
    // Check if Django is installed by running 'python -m django --version'
    await execa("python", ["-m", "django", "--version"]);
    logger.break();
    logger.log("Django is already installed.");
  } catch (error) {
    // Django is not installed, so install it
    logger.break();
    logger.log("Django is not installed. Installing Django...");
    try {
      await execa("python", ["-m", "pip", "install", "django"]);
      logger.log("Django has been installed successfully.");
    } catch (installError) {
      logger.error("Failed to install Django:", installError);
      process.exit(1);
    }
  }
}
