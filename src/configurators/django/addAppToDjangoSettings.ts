import { existsSync, promises as fs } from "fs";
import * as path from "path";

export async function addAppToDjangoSettings(
  projectName: string,
  appName: string,
  cwd: string
) {
  const settingsPath = path.join(cwd, projectName, "settings.py");
  if (!existsSync(settingsPath)) {
    throw new Error(`${settingsPath} does not exist`);
  }

  try {
    let settingsContent = await fs.readFile(settingsPath, "utf8");
    let inInstalledApps = false;
    let newContent = "";

    for (let line of settingsContent.split("/n")) {
      if (line.trim().startsWith("INSTALLED_APPS")) {
        inInstalledApps = true;
        newContent += line + "\n";
        continue;
      }
      if (inInstalledApps) {
        if (line.trim().endsWith("]")) {
          // Add app name before the closing bracket
          newContent += `    '${appName}',\n`;
          inInstalledApps = false;
        }
      }
      newContent += line + "\n";
    }

    await fs.writeFile(settingsPath, newContent);
    console.log(
      `App '${appName}' has been added to INSTALLED_APPS in ${settingsPath}`
    );
  } catch (e: any) {
    throw new Error(
      `An error occurred while accessing ${settingsPath}: ${e.message}`
    );
  }
}
