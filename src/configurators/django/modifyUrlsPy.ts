import { existsSync, promises as fs } from "fs";
import path from "path";

export async function modifyUrlsPy(appPath: string) {
  const urlsFilePath = path.join(appPath, "urls.py");

  const initialContent = `
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
`;
  await fs.writeFile(urlsFilePath, initialContent);
}
