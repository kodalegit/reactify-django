import { describe, it, expect, vi } from "vitest";
import { execa } from "execa";
import { checkAndInstallDjango } from "../../configurators/django/checkAndInstallDjango";
import { logger } from "../../utils/logger";

// Mock the execa function and logger
vi.mock("execa");
vi.mock("../../utils/logger", () => ({
  logger: {
    log: vi.fn(),
    break: vi.fn(),
    error: vi.fn(),
  },
}));

describe("checkAndInstallDjango", () => {
  it("should log that Django is already installed if the check command succeeds", async () => {
    // Mock execa to resolve for checking Django version
    (execa as any).mockResolvedValueOnce({ stdout: "Django 4.0" });

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(logger.break).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith("Django is already installed.");
  });

  it("should install Django if it is not installed", async () => {
    // Mock execa to throw an error for checking Django version (Django not installed)
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));

    // Mock execa to resolve for installing Django
    (execa as any).mockResolvedValueOnce({
      stdout: "Successfully installed Django",
    });

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(logger.break).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      "Django is not installed. Installing Django..."
    );
    expect(execa).toHaveBeenCalledWith("python", [
      "-m",
      "pip",
      "install",
      "django",
    ]);
    expect(logger.log).toHaveBeenCalledWith(
      "Django has been installed successfully."
    );
  });

  it("should log an error and exit if installing Django fails", async () => {
    // Mock execa to throw an error for checking Django version (Django not installed)
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));

    // Mock execa to throw an error for installing Django
    const installError = new Error("Failed to install Django");
    (execa as any).mockRejectedValueOnce(installError);

    const processExitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      // Prevent process.exit from actually exiting the test environment
      throw new Error("process.exit(1) called");
    });

    await expect(checkAndInstallDjango()).rejects.toThrow(
      "process.exit(1) called"
    );

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(logger.break).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith(
      "Django is not installed. Installing Django..."
    );
    expect(execa).toHaveBeenCalledWith("python", [
      "-m",
      "pip",
      "install",
      "django",
    ]);
    expect(logger.error).toHaveBeenCalledWith(
      "Failed to install Django:",
      installError
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    // Clean up the spy
    processExitSpy.mockRestore();
  });
});
