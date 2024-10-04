import { describe, it, vi, expect } from "vitest";
import { promises as fs } from "fs";
import { mkdirSync } from "fs";
import path from "path";
import { createIndexHtml } from "../../configurators/django/createIndexHtml";
import exp from "constants";

vi.mock("fs", () => ({
  promises: {
    writeFile: vi.fn(),
  },
  mkdirSync: vi.fn(),
}));

describe("createIndexHtml", () => {
  it("should create the index.html file with the correct content", async () => {
    const appPath = "/some/app/path";
    const appName = "myApp";
    const templateDir = path.join(appPath, "templates", appName);
    const filePath = path.join(templateDir, "index.html");

    const expectedContent = `{% load static %}
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

    await createIndexHtml(appPath, appName);

    expect(mkdirSync).toHaveBeenCalledWith(templateDir, { recursive: true });

    expect(fs.writeFile).toHaveBeenCalledWith(filePath, expectedContent);
  });

  it("should handle errors when creating the directory", async () => {
    const appPath = "/some/app/path";
    const appName = "myApp";

    vi.mocked(mkdirSync).mockImplementationOnce(() => {
      throw new Error("Failed to create directory");
    });

    await expect(createIndexHtml(appPath, appName)).rejects.toThrow(
      "Failed to create directory"
    );
  });
});
