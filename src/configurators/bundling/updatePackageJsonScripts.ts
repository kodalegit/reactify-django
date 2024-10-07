import { existsSync, promises as fs } from "fs";
import path from "path";

export async function updatePackageJsonScripts(appPath: string) {
  const packageJsonPath = path.join(appPath, "package.json");

  // Check if the package.json file exists
  if (!existsSync(packageJsonPath)) {
    throw new Error(`${packageJsonPath} does not exist.`);
  }

  const data = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

  // Update the scripts section
  data.scripts = {
    start: "webpack serve",
    build: "webpack --mode production",
  };

  // Write the updated package.json back to the file
  await fs.writeFile(packageJsonPath, JSON.stringify(data, null, 2));
}
