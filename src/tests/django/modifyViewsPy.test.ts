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

  it("should log an error if writing to views.py fails", async () => {
    const appPath = "/some/app/path";
    const appName = "myApp";
    const errorMessage = "Error writing file";
    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Make writeFile throw an error
    (fs.writeFile as any).mockRejectedValueOnce(new Error(errorMessage));

    await modifyViewsPy(appPath, appName);

    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Error overwriting views.py"),
      expect.any(Error)
    );

    // Restore the original console.error implementation
    consoleErrorMock.mockRestore();
  });
});
