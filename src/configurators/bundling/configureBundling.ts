import { createBabelConfig } from "./createBabelConfig";
import { createWebpackConfig } from "./createWebpackConfig";
import { updatePackageJsonScripts } from "./updatePackageJsonScripts";

export async function configureBundling(
  appName: string,
  useTypescript: boolean
) {
  await createWebpackConfig(appName, useTypescript);
  await createBabelConfig(useTypescript);
  await updatePackageJsonScripts();
}
