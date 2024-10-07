import { createBabelConfig } from "./createBabelConfig";
import { createWebpackConfig } from "./createWebpackConfig";
import { updatePackageJsonScripts } from "./updatePackageJsonScripts";
import { logger } from "@/src/utils/logger";

export async function configureBundling(
  appName: string,
  useTypescript: boolean,
  appPath: string
) {
  try {
    await createWebpackConfig(appName, useTypescript, appPath);
    await createBabelConfig(useTypescript, appPath);
    await updatePackageJsonScripts(appPath);
  } catch (error) {
    logger.break();
    logger.error(`Error configuring bundling: ${(error as Error).message}`);
  }
}
