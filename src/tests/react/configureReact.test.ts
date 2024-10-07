import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureReact } from "../../configurators/react/configureReact";
import { installNpmPackages } from "../../configurators/react/installNpmPackages";
import { logger } from "../../utils/logger";
import { promises as fs } from "fs";

vi.mock("../../configurators/react/installNpmPackages");
vi.mock("../../utils/logger");

describe("configureReact", () => {
  const appPath = "test/app/path";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should configure React successfully", async () => {
    // Mock fs.access to resolve
    vi.spyOn(fs, "access").mockResolvedValueOnce(undefined);

    // Mock the installNpmPackages function to resolve
    (installNpmPackages as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      undefined
    );

    await configureReact(true, true, appPath);

    expect(fs.access).toHaveBeenCalledWith(appPath, fs.constants.W_OK);
    expect(installNpmPackages).toHaveBeenCalledWith(true, true, appPath);
    expect(logger.success).toHaveBeenCalledWith(
      expect.stringContaining("successfully configured with dependencies.")
    );
  });

  it("should log an error and exit if the directory is not writable", async () => {
    // Mock fs.access to reject
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
    // Mock fs.access to resolve
    vi.spyOn(fs, "access").mockResolvedValueOnce(undefined);

    // Mock the installNpmPackages function to reject
    (installNpmPackages as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Failed to install")
    );

    await configureReact(true, true, appPath);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error configuring React: Failed to install")
    );
  });
});
