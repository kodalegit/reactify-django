import { mkdirSync, promises as fs } from "fs";
import * as path from "path";
import { installNpmPackages } from "./installNpmPackages";
import { createReactEntry } from "./createReactEntry";
import { createAppComponent } from "./createAppComponent";
import { logger } from "../../utils/logger";
import { highlighter } from "../../utils/highlighter";

export async function configureReact(
  useTypeScript: boolean,
  useTailwind: boolean,
  appPath: string
) {
  // Check if the current directory is writable
  try {
    await fs.access(appPath, fs.constants.W_OK);
  } catch (error) {
    console.error("Error: The current directory is not writable.");
    console.error(
      "Please check your permissions or try running with elevated privileges."
    );
    process.exit(1);
  }
  try {
    // Initialize npm and install packages
    await installNpmPackages(useTypeScript, useTailwind, appPath);

    // Create React entry point
    const srcPath = path.join(appPath, "src");
    mkdirSync(srcPath, { recursive: true });
    await createReactEntry(srcPath, useTailwind, useTypeScript);
    await createAppComponent(srcPath, useTypeScript);
    logger.break();
    logger.success(
      `✅ ${highlighter.info(
        "React"
      )} successfully configured with dependencies.`
    );
  } catch (error) {
    logger.break();
    logger.error(`Error configuring React: ${(error as Error).message}`);
  }
}
