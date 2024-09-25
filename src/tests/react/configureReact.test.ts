import { describe, it, vi, expect, beforeEach } from "vitest";
import { promises as fs, mkdirSync } from "fs";
import * as path from "path";
import { configureReact } from "../../configurators/react/configureReact";
import { installNpmPackages } from "../../configurators/react/installNpmPackages";

vi.mock("fs", () => ({
  promises: {
    access: vi.fn(),
    writeFile: vi.fn(),
    constants: {
      W_OK: 2,
    },
  },
  mkdirSync: vi.fn(),
}));

vi.mock("../../configurators/react/installNpmPackages");

describe("configureReact", () => {
  const appPath = "/mocked/app/path";
  const srcPath = path.join(appPath, "src");
  const entryFileJsx = "index.jsx";
  const entryFileTsx = "index.tsx";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error if the directory is not writable", async () => {
    (fs.access as any).mockRejectedValue(new Error("Permission denied"));

    await expect(configureReact(false, false, appPath)).rejects.toThrow(
      "Permission denied"
    );

    expect(fs.access).toHaveBeenCalledWith(appPath, fs.constants.W_OK);
  });

  it("should create the src directory and write index.jsx when useTypeScript is false", async () => {
    (fs.access as any).mockResolvedValue(undefined);

    await configureReact(false, false, appPath);

    expect(fs.access).toHaveBeenCalledWith(appPath, fs.constants.W_OK);
    expect(installNpmPackages).toHaveBeenCalledWith(false, false, appPath);
    expect(mkdirSync).toHaveBeenCalledWith(srcPath, { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(srcPath, entryFileJsx),
      expect.stringContaining("ReactDOM.render")
    );
  });

  it("should create the src directory and write index.tsx when useTypeScript is true", async () => {
    (fs.access as any).mockResolvedValue(undefined);

    await configureReact(true, false, appPath);

    expect(fs.access).toHaveBeenCalledWith(appPath, fs.constants.W_OK);
    expect(installNpmPackages).toHaveBeenCalledWith(true, false, appPath);
    expect(mkdirSync).toHaveBeenCalledWith(srcPath, { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(srcPath, entryFileTsx),
      expect.stringContaining("ReactDOM.render")
    );
  });
});
