import { promises as fs } from "fs";
import * as path from "path";

export async function modifyViewsPy(appPath: string, appName: string) {
  const viewsFilePath = path.join(appPath, "views.py");

  // Content to overwrite views.py
  const content = `
from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "${appName}/index.html")
`;

  await fs.writeFile(viewsFilePath, content);
}
