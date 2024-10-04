import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { addAppToDjangoSettings } from "../../configurators/django/addAppToDjangoSettings";
import { existsSync, promises as fs } from "fs";
import * as path from "path";

vi.mock("fs");
vi.mock("path");

describe("addAppToDjangoSettings", () => {
  const mockProjectName = "testproject";
  const mockAppName = "testapp";
  const mockCwd = "/mock/path";
  const mockProjecPath = "/mock/path/testproject";
  const mockSettingsPath = "/mock/path/testproject/settings.py";

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(path.join).mockReturnValue(mockSettingsPath);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should add app to INSTALLED_APPS", async () => {
    const mockSettingsContent = `
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
]
    `;
    const expectedNewContent = `
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'testapp',
]
    `;

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockResolvedValue(mockSettingsContent);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    await addAppToDjangoSettings(mockProjecPath, mockProjectName, mockAppName);

    expect(existsSync).toHaveBeenCalledWith(mockSettingsPath);
    expect(fs.readFile).toHaveBeenCalledWith(mockSettingsPath, "utf8");
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockSettingsPath,
      expectedNewContent.trim()
    );
  });

  it("should throw an error if settings.py does not exist", async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await expect(
      addAppToDjangoSettings(mockProjectName, mockAppName, mockCwd)
    ).rejects.toThrow(`${mockSettingsPath} does not exist`);
  });

  it("should throw an error if there is an issue reading or writing the file", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockRejectedValue(new Error("Read error"));

    await expect(
      addAppToDjangoSettings(mockProjectName, mockAppName, mockCwd)
    ).rejects.toThrow(
      `An error occurred while accessing ${mockSettingsPath}: Read error`
    );
  });
});
