import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureDjango } from "../../configurators/django/configureDjango";
import { execa } from "execa";
import * as fs from "fs/promises";
import path from "path";
import { addAppToDjangoSettings } from "../../configurators/django/addAppToDjangoSettings";
import { checkAndInstallDjango } from "../../configurators/django/checkAndInstallDjango";
import { createGitignore } from "../../configurators/django/createGitignore";
import { modifyRootUrlsPy } from "../../configurators/django/modifyRootUrlsPy";
import { modifyUrlsPy } from "../../configurators/django/modifyUrlsPy";
import { modifyViewsPy } from "../../configurators/django/modifyViewsPy";
import { createIndexHtml } from "../../configurators/django/createIndexHtml";

// Mock external modules
vi.mock("execa");
vi.mock("fs/promises");
vi.mock("../../configurators/django/addAppToDjangoSettings");
vi.mock("../../configurators/django/checkAndInstallDjango");
vi.mock("../../configurators/django/createGitignore");
vi.mock("../../configurators/django/modifyRootUrlsPy");
vi.mock("../../configurators/django/modifyUrlsPy");
vi.mock("../../configurators/django/modifyViewsPy");
vi.mock("../../configurators/django/createIndexHtml");

describe("configureDjango", () => {
  const projectName = "myProject";
  const appName = "myApp";
  const cwd = "/fake/directory";
  const projectPath = path.join(cwd, projectName);
  const appPath = path.join(projectPath, appName);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a Django project and app and configure them correctly", async () => {
    // Mock fs.access to simulate writable directory
    vi.spyOn(fs, "access").mockResolvedValue(undefined);

    // Mock checkAndInstallDjango to simulate Django installation
    (checkAndInstallDjango as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    );

    // Mock execa to simulate the successful creation of the project and app
    (execa as ReturnType<typeof vi.fn>).mockResolvedValue({});

    // Mock the helper functions to simulate their success
    (addAppToDjangoSettings as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    );

    (createGitignore as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (createIndexHtml as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (modifyRootUrlsPy as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (modifyUrlsPy as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (modifyViewsPy as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    // Call the configureDjango function
    await configureDjango(projectName, appName, cwd);

    // Assertions
    expect(fs.access).toHaveBeenCalledWith(cwd, fs.constants.W_OK);
    expect(checkAndInstallDjango).toHaveBeenCalled();

    // Assert that 'django-admin startproject' was called with the correct arguments
    expect(execa).toHaveBeenNthCalledWith(
      1,
      "django-admin",
      ["startproject", projectName],
      { cwd }
    );

    // Assert that 'django-admin startapp' was called with the correct arguments
    expect(execa).toHaveBeenNthCalledWith(
      2,
      "django-admin",
      ["startapp", appName],
      { cwd: projectPath }
    );

    // Assert that Django settings were modified correctly
    expect(addAppToDjangoSettings).toHaveBeenCalledWith(
      projectPath,
      projectName,
      appName
    );

    // Assert that django files were modified and .gitignore were created
    expect(createIndexHtml).toHaveBeenCalledWith(appPath, appName);
    expect(modifyUrlsPy).toHaveBeenCalledWith(appPath);
    expect(modifyViewsPy).toHaveBeenCalledWith(appPath, appName);
    expect(modifyRootUrlsPy).toHaveBeenCalledWith(
      projectPath,
      projectName,
      appName
    );
    expect(createGitignore).toHaveBeenCalledWith(projectPath);
  });

  it("should throw an error if the directory is not writable", async () => {
    // Mock fs.access to simulate an unwritable directory
    const accessError = new Error("Permission denied");
    vi.spyOn(fs, "access").mockRejectedValue(accessError);

    // Call the function and expect it to throw
    await expect(configureDjango(projectName, appName, cwd)).rejects.toThrow(
      accessError
    );

    // Ensure that no other steps were executed
    expect(checkAndInstallDjango).not.toHaveBeenCalled();
    expect(execa).not.toHaveBeenCalled();
    expect(addAppToDjangoSettings).not.toHaveBeenCalled();
    expect(modifyRootUrlsPy).not.toHaveBeenCalled();
    expect(modifyUrlsPy).not.toHaveBeenCalled();
    expect(modifyViewsPy).not.toHaveBeenCalled();
    expect(createGitignore).not.toHaveBeenCalled();
    expect(createIndexHtml).not.toHaveBeenCalled();
  });

  it("should handle errors during Django project creation", async () => {
    // Mock fs.access to simulate writable directory
    vi.spyOn(fs, "access").mockResolvedValue(undefined);

    // Mock checkAndInstallDjango to simulate Django installation
    (checkAndInstallDjango as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    );

    // Mock execa to throw an error when creating the project
    const projectCreationError = new Error("command not found");
    (execa as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      projectCreationError
    );

    // Call the function and expect it to throw
    await expect(configureDjango(projectName, appName, cwd)).rejects.toThrow(
      projectCreationError
    );

    // Ensure the app creation step was not reached
    expect(execa).toHaveBeenCalledTimes(1); // Only project creation attempted
    expect(addAppToDjangoSettings).not.toHaveBeenCalled();
    expect(modifyRootUrlsPy).not.toHaveBeenCalled();
    expect(modifyUrlsPy).not.toHaveBeenCalled();
    expect(modifyViewsPy).not.toHaveBeenCalled();
    expect(createGitignore).not.toHaveBeenCalled();
    expect(createIndexHtml).not.toHaveBeenCalled();
  });
});
