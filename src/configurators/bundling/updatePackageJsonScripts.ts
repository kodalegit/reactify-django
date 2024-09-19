import fs from "fs";
import path from "path";

export async function updatePackageJsonScripts() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  try {
    // Check if the package.json file exists
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`${packageJsonPath} does not exist.`);
    }

    const data = JSON.parse(
      await fs.promises.readFile(packageJsonPath, "utf-8")
    );

    // Update the scripts section
    data.scripts = {
      start: "webpack serve",
      build: "webpack --mode production",
    };

    // Write the updated package.json back to the file
    await fs.promises.writeFile(packageJsonPath, JSON.stringify(data, null, 2));

    console.log(`Successfully updated ${packageJsonPath} with new scripts.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`An unexpected error occurred: ${error}`);
    }
    throw error;
  }
}
