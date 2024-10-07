import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureReact } from "../../configurators/react/configureReact";
import { installNpmPackages } from "../../configurators/react/installNpmPackages";
import { createAppComponent } from "../../configurators/react/createAppComponent";
import { createReactEntry } from "../../configurators/react/createReactEntry";
import { logger } from "../../utils/logger";
import { mkdirSync, promises as fs } from "fs";

vi.mock("../../configurators/react/installNpmPackages");
vi.mock("../../utils/logger");
vi.mock("../../configurators/react/createAppComponent");
vi.mock("../../configurators/react/createReactEntry");
vi.mock("fs");

describe("configureReact", () => {
  const appPath = "test/app/path";
  const srcPath = "test/app/path/src";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should configure React successfully", async () => {
    vi.spyOn(fs, "access").mockResolvedValueOnce(undefined);
    (installNpmPackages as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      undefined
    );

    await configureReact(true, true, appPath);

    expect(fs.access).toHaveBeenCalledWith(appPath, fs.constants.W_OK);
    expect(mkdirSync).toHaveBeenCalledWith(srcPath, { recursive: true });
    expect(installNpmPackages).toHaveBeenCalledWith(true, true, appPath);
    expect(createReactEntry).toHaveBeenCalledWith(srcPath, true, true);
    expect(createAppComponent).toHaveBeenCalledWith(srcPath, true);
    expect(logger.success).toHaveBeenCalledWith(
      expect.stringContaining("successfully configured with dependencies.")
    );
  });

  it("should log an error and exit if the directory is not writable", async () => {
    vi.spyOn(fs, "access").mockRejectedValueOnce(new Error("not writable"));

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await configureReact(true, true, appPath);

    expect(logger.error).toHaveBeenCalledWith(
      "Error: The current directory is not writable."
    );
    expect(logger.error).toHaveBeenCalledWith(
      "Please check your permissions or try running with elevated privileges."
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should log an error if an error occurs during configuration", async () => {
    vi.spyOn(fs, "access").mockResolvedValueOnce(undefined);

    (installNpmPackages as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Failed to install")
    );

    await configureReact(true, true, appPath);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error configuring React: Failed to install")
    );
  });
});
