import { describe, it, vi, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { modifyViewsPy } from "../../configurators/django/modifyViewsPy";

vi.mock("fs");

describe("modifyViewsPy", () => {
  it("should create or overwrite the views.py file with the correct content", async () => {
    const appPath = "/some/app/path";
    const appName = "myApp";
    const viewsFilePath = path.join(appPath, "views.py");

    const expectedContent = `
from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "${appName}/index.html")
`;

    await modifyViewsPy(appPath, appName);

    expect(fs.writeFile).toHaveBeenCalledWith(viewsFilePath, expectedContent);
  });
});
