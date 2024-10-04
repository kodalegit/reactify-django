import { mkdirSync, promises as fs } from "fs";
import * as path from "path";

export async function createIndexHtml(appPath: string, appName: string) {
  const templateDir = path.join(appPath, "templates", appName);
  const filePath = path.join(templateDir, "index.html");

  // Ensure the templates/appName directory exists
  mkdirSync(templateDir, { recursive: true });

  const content = `{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Django + React</title>
</head>
<body>
    <div id="react-root"></div>
    <script src="{% static '${appName}/js/bundle.js' %}"></script>
</body>
</html>`;

  await fs.writeFile(filePath, content, "utf-8");
}
