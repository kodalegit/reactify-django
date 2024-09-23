import { createBabelConfig } from "./createBabelConfig";
import { createWebpackConfig } from "./createWebpackConfig";
import { updatePackageJsonScripts } from "./updatePackageJsonScripts";

export async function configureBundling(
  appName: string,
  useTypescript: boolean,
  appPath: string
) {
  await createWebpackConfig(appName, useTypescript, appPath);
  await createBabelConfig(useTypescript, appPath);
  await updatePackageJsonScripts(appPath);
}
