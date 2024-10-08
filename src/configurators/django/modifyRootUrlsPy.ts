import { existsSync, promises as fs } from "fs";
import * as path from "path";

export async function modifyRootUrlsPy(
  projectPath: string,
  projectName: string,
  appName: string
) {
  const rootUrlsFilePath = path.join(projectPath, projectName, "urls.py");

  if (!existsSync(rootUrlsFilePath)) {
    throw new Error(
      "Root urls.py file not found! Modify the urls.py manually to include installed app."
    );
  }

  // Read the current content to check for docstring
  const currentContent = await fs.readFile(rootUrlsFilePath, "utf-8");
  const docstringMatch = currentContent.match(/^"""[\s\S]*?"""\n/);
  const docstring = docstringMatch ? docstringMatch[0] : "";

  // Create new content with the include import and app URL
  const newContent = `${docstring}from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("${appName}.urls")),
    path('admin/', admin.site.urls),
]
`;

  await fs.writeFile(rootUrlsFilePath, newContent);
}
