import { execa } from "execa";
import { logger } from "../../utils/logger";
import { type ExecaError } from "execa";

export async function checkAndInstallDjango() {
  try {
    // Try 'python' command first
    await execa("python", ["-m", "django", "--version"]);
    logger.break();
    logger.log("Django is already installed.");
  } catch (error) {
    const execaError = error as ExecaError;

    // If 'python' isn't found, try 'python3'
    if (execaError.code === "ENOENT") {
      logger.break();
      logger.log("'python' command not found, trying 'python3'...");
      try {
        await execa("python3", ["-m", "django", "--version"]);
        logger.break();
        logger.log("Django is already installed.");
      } catch (python3Error) {
        const python3ExecaError = python3Error as ExecaError;

        if (python3ExecaError?.code === "ENOENT") {
          logger.error(
            "Neither 'python' nor 'python3' is installed. Please install Python."
          );
          process.exit(1);
        } else {
          await installDjango("python3");
        }
      }
    } else {
      // If Python is found but Django isn't installed
      await installDjango("python");
    }
  }
}

async function installDjango(pythonCommand: string) {
  logger.log("Django is not installed. Installing Django...");
  try {
    await execa(pythonCommand, ["-m", "pip", "install", "django"]);
    logger.break();
    logger.log("Django has been installed successfully.");
  } catch (installError) {
    logger.break();
    logger.error("Failed to install Django:", installError);
    process.exit(1);
  }
}
