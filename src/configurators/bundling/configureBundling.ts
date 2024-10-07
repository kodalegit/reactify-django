import { highlighter } from "../../utils/highlighter";
import { createBabelConfig } from "./createBabelConfig";
import { createWebpackConfig } from "./createWebpackConfig";
import { updatePackageJsonScripts } from "./updatePackageJsonScripts";
import { logger } from "../../utils/logger";

export async function configureBundling(
  appName: string,
  useTypescript: boolean,
  appPath: string
) {
  try {
    await createWebpackConfig(appName, useTypescript, appPath);
    await createBabelConfig(useTypescript, appPath);
    await updatePackageJsonScripts(appPath);
    logger.break();
    logger.success(
      `✅ ${highlighter.info(`Webpack`)} and ${highlighter.info(
        "Babel"
      )} successfully configured.`
    );
  } catch (error) {
    logger.break();
    logger.error(`Error configuring bundling: ${(error as Error).message}`);
  }
}
