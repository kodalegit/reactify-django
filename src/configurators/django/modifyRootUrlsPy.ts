import { promises as fs } from "fs";
import * as path from "path";

export async function modifyRootUrlsPy(
  projectPath: string,
  projectName: string,
  appName: string
): Promise<void> {
  const rootUrlsFilePath = path.join(projectPath, projectName, "urls.py");
  try {
    // Check if the root urls.py file exists
    const fileExists = await fs
      .access(rootUrlsFilePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.error("Root urls.py file not found!");
      return;
    }

    // Read the current contents of the root urls.py
    const currentContent = await fs.readFile(rootUrlsFilePath, "utf-8");

    // Check if 'include' import exists, if not, add the import
    let newContent = currentContent;
    if (!currentContent.includes("from django.urls import include")) {
      newContent = newContent.replace(
        "from django.urls import path",
        "from django.urls import include, path"
      );
    }

    // Add the path to the app's urls if not already present
    const appUrlPattern = `path("", include("${appName}.urls")),`;
    if (!currentContent.includes(appUrlPattern)) {
      newContent = newContent.replace(
        "urlpatterns = [",
        `urlpatterns = [\n    ${appUrlPattern}`
      );
    }

    // Write the modified content back to the root urls.py file
    await fs.writeFile(rootUrlsFilePath, newContent, "utf-8");
  } catch (error) {
    console.error("Error updating root urls.py:", error);
  }
}
