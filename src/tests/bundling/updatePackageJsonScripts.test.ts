import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { updatePackageJsonScripts } from "../../configurators/bundling/updatePackageJsonScripts";

vi.mock("fs");
vi.mock("path");

describe("updatePackageJsonScripts", () => {
  const mockAppPath = "/mock/app/path";
  const mockPackageJsonPath = "/mock/app/path/package.json";

  beforeEach(() => {
    vi.resetAllMocks();
    (path.join as any).mockReturnValue(mockPackageJsonPath);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should update package.json scripts successfully", async () => {
    const mockPackageJson = {
      name: "test-app",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
    };

    vi.mocked(existsSync).mockReturnValue(true);
    (fs.readFile as any).mockResolvedValue(JSON.stringify(mockPackageJson));
    const writeFileMock = vi
      .spyOn(fs, "writeFile")
      .mockResolvedValue(undefined);

    await updatePackageJsonScripts(mockAppPath);

    expect(existsSync).toHaveBeenCalledWith(mockPackageJsonPath);
    expect(fs.readFile).toHaveBeenCalledWith(mockPackageJsonPath, "utf-8");
    expect(writeFileMock).toHaveBeenCalledWith(
      mockPackageJsonPath,
      JSON.stringify(
        {
          ...mockPackageJson,
          scripts: {
            start: "webpack serve",
            build: "webpack --mode production",
          },
        },
        null,
        2
      )
    );
  });

  it("should throw an error if package.json does not exist", async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await expect(updatePackageJsonScripts(mockAppPath)).rejects.toThrow(
      `${mockPackageJsonPath} does not exist.`
    );

    expect(existsSync).toHaveBeenCalledWith(mockPackageJsonPath);
  });

  it("should handle and rethrow errors during file operations", async () => {
    const mockError = new Error("Mock file operation error");

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockRejectedValue(mockError);

    await expect(updatePackageJsonScripts(mockAppPath)).rejects.toThrow(
      mockError
    );

    expect(existsSync).toHaveBeenCalledWith(mockPackageJsonPath);
    expect(fs.readFile).toHaveBeenCalledWith(mockPackageJsonPath, "utf-8");
  });
});
