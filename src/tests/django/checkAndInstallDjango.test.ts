import { describe, it, expect, vi } from "vitest";
import { execa } from "execa";
import { checkAndInstallDjango } from "../../configurators/django/checkAndInstallDjango"; // Replace with the actual path

// Mock the execa function
vi.mock("execa");

describe("checkAndInstallDjango", () => {
  it("should log that Django is already installed if the check command succeeds", async () => {
    // Mock execa to resolve for checking Django version
    (execa as any).mockResolvedValueOnce({ stdout: "Django 4.0" });

    const consoleLogSpy = vi.spyOn(console, "log");

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(consoleLogSpy).toHaveBeenCalledWith("Django is already installed.");

    // Clean up the spy
    consoleLogSpy.mockRestore();
  });

  it("should install Django if it is not installed", async () => {
    // Mock execa to throw an error for checking Django version (Django not installed)
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));

    // Mock execa to resolve for installing Django
    (execa as any).mockResolvedValueOnce({
      stdout: "Successfully installed Django",
    });

    const consoleLogSpy = vi.spyOn(console, "log");

    await checkAndInstallDjango();

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Django is not installed. Installing Django..."
    );
    expect(execa).toHaveBeenCalledWith("python", [
      "-m",
      "pip",
      "install",
      "django",
    ]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Django has been installed successfully."
    );

    // Clean up the spy
    consoleLogSpy.mockRestore();
  });

  it("should throw an error if installing Django fails", async () => {
    // Mock execa to throw an error for checking Django version (Django not installed)
    (execa as any).mockRejectedValueOnce(new Error("Django not found"));

    // Mock execa to throw an error for installing Django
    const installError = new Error("Failed to install Django");
    (execa as any).mockRejectedValueOnce(installError);

    const consoleLogSpy = vi.spyOn(console, "log");
    const consoleErrorSpy = vi.spyOn(console, "error");

    await expect(checkAndInstallDjango()).rejects.toThrow(installError);

    expect(execa).toHaveBeenCalledWith("python", ["-m", "django", "--version"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Django is not installed. Installing Django..."
    );
    expect(execa).toHaveBeenCalledWith("python", [
      "-m",
      "pip",
      "install",
      "django",
    ]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to install Django:",
      installError
    );

    // Clean up the spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
