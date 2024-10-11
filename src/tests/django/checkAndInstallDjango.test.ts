import { describe, it, expect, vi, beforeEach } from "vitest";
import { execa } from "execa";
import { checkAndInstallDjango } from "../../configurators/django/checkAndInstallDjango";
import { logger } from "../../utils/logger";

vi.mock("execa");
vi.mock("../../utils/logger", () => ({
  logger: {
    log: vi.fn(),
    break: vi.fn(),
    error: vi.fn(),
  },
}));

describe("checkAndInstallDjango", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should log that Django is already installed if python check succeeds", async () => {
    (execa as any).mockResolvedValueOnce({ stdout: "Django 4.0" });

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(logger.break).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith("Django is already installed.");
  });

  it("should try python3 if python command is not found", async () => {
    const pythonError = new Error("Command failed");
    (pythonError as any).code = "ENOENT";
    (execa as any).mockRejectedValueOnce(pythonError);
    (execa as any).mockResolvedValueOnce({ stdout: "Django 4.0" });

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(logger.log).toHaveBeenCalledWith(
      "'python' command not found, trying 'python3'..."
    );
    expect(execa).toHaveBeenCalledWith("python3", [
      "-m",
      "django",
      "--version",
    ]);
    expect(logger.log).toHaveBeenCalledWith("Django is already installed.");
  });

  it("should install Django using python3 if Django check fails with python3", async () => {
    const pythonError = new Error("Command failed");
    (pythonError as any).code = "ENOENT";
    (execa as any).mockRejectedValueOnce(pythonError);
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));
    (execa as any).mockResolvedValueOnce({
      stdout: "Successfully installed Django",
    });

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python3", [
      "-m",
      "pip",
      "install",
      "django",
    ]);
    expect(logger.log).toHaveBeenCalledWith(
      "Django has been installed successfully."
    );
  });

  it("should exit if neither python nor python3 is found", async () => {
    const pythonError = new Error("Command failed");
    (pythonError as any).code = "ENOENT";
    const python3Error = new Error("Command failed");
    (python3Error as any).code = "ENOENT";

    (execa as any).mockRejectedValueOnce(pythonError);
    (execa as any).mockRejectedValueOnce(python3Error);

    const processExitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit(1) called");
    });

    await expect(checkAndInstallDjango()).rejects.toThrow(
      "process.exit(1) called"
    );

    expect(logger.error).toHaveBeenCalledWith(
      "Neither 'python' nor 'python3' is installed. Please install Python."
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    processExitSpy.mockRestore();
  });

  it("should install Django using python if Django check fails with python", async () => {
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));
    (execa as any).mockResolvedValueOnce({
      stdout: "Successfully installed Django",
    });

    await checkAndInstallDjango();

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
    const installError = new Error("Failed to install Django");
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));
    (execa as any).mockRejectedValueOnce(installError);

    const processExitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit(1) called");
    });

    await expect(checkAndInstallDjango()).rejects.toThrow(
      "process.exit(1) called"
    );

    expect(logger.error).toHaveBeenCalledWith(
      "Failed to install Django:",
      installError
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    processExitSpy.mockRestore();
  });
});
