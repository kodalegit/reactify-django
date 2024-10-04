import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { modifyRootUrlsPy } from "../../configurators/django/modifyRootUrlsPy";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import * as path from "path";

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
  existsSync: vi.fn(),
}));

vi.mock("path", () => ({
  join: (...args: string[]) => args.join("/"),
}));

describe("modifyRootUrlsPy", () => {
  const mockProjectPath = "/fake/path";
  const mockProjectName = "myproject";
  const mockAppName = "myapp";
  const mockFilePath = `${mockProjectPath}/${mockProjectName}/urls.py`;

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should handle non-existent urls.py file", async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName);

    expect(existsSync).toHaveBeenCalledWith(mockFilePath);
    expect(console.error).toHaveBeenCalledWith("Root urls.py file not found!");
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("should add include import if missing", async () => {
    const originalContent = "from django.urls import path\n\nurlpatterns = []";
    const expectedContent =
      'from django.urls import include, path\n\nurlpatterns = [\n    path("", include("myapp.urls")),]';

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockResolvedValueOnce(originalContent);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    await modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName);

    expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, expectedContent);
  });

  it("should not modify include import if already present", async () => {
    const originalContent =
      "from django.urls import include, path\n\nurlpatterns = []";
    const expectedContent =
      'from django.urls import include, path\n\nurlpatterns = [\n    path("", include("myapp.urls")),]';

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockResolvedValueOnce(originalContent);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    await modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName);

    expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, expectedContent);
  });

  it("should handle file system errors gracefully", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockRejectedValueOnce(new Error("Read error"));

    await modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName);

    expect(console.error).toHaveBeenCalledWith(
      "Error updating root urls.py:",
      expect.any(Error)
    );
  });
});
