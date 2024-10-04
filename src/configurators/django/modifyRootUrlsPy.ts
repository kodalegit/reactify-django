import { existsSync, promises as fs } from "fs";
import * as path from "path";

export async function modifyRootUrlsPy(
  projectPath: string,
  projectName: string,
  appName: string
) {
  const rootUrlsFilePath = path.join(projectPath, projectName, "urls.py");
  try {
    if (!existsSync(rootUrlsFilePath)) {
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

    const appUrlPattern = `path("", include("${appName}.urls")),`;
    if (!currentContent.includes(appUrlPattern)) {
      newContent = newContent.replace(
        "urlpatterns = [",
        `urlpatterns = [\n    ${appUrlPattern}`
      );
    }

    await fs.writeFile(rootUrlsFilePath, newContent);
  } catch (error) {
    console.error("Error updating root urls.py:", error);
  }
}
