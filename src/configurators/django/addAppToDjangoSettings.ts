import * as fs from "fs";
import * as path from "path";

export async function addAppToDjangoSettings(
  projectName: string,
  appName: string
) {
  const settingsPath = path.join(projectName, "settings.py");
  if (!fs.existsSync(settingsPath)) {
    throw new Error(`${settingsPath} does not exist`);
  }

  try {
    let settingsContent = fs.readFileSync(settingsPath, "utf8").split("\n");
    let inInstalledApps = false;
    let newContent = "";

    for (let line of settingsContent) {
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

    fs.writeFileSync(settingsPath, newContent);
    console.log(
      `App '${appName}' has been added to INSTALLED_APPS in ${settingsPath}`
    );
  } catch (e) {
    throw new Error(`An error occurred while accessing ${settingsPath}: ${e}`);
  }
}
