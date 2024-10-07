import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureDjango } from "../../configurators/django/configureDjango";
import { execa } from "execa";
import * as fs from "fs/promises";
import path from "path";
import { checkAndInstallDjango } from "../../configurators/django/checkAndInstallDjango";
import { addAppToDjangoSettings } from "../../configurators/django/addAppToDjangoSettings";
import { createIndexHtml } from "../../configurators/django/createIndexHtml";
import { modifyViewsPy } from "../../configurators/django/modifyViewsPy";
import { modifyUrlsPy } from "../../configurators/django/modifyUrlsPy";
import { modifyRootUrlsPy } from "../../configurators/django/modifyRootUrlsPy";
import { createGitignore } from "../../configurators/django/createGitignore";
import { logger } from "../../utils/logger";

// Mock all external dependencies
vi.mock("execa");
vi.mock("fs/promises");
vi.mock("../../configurators/django/checkAndInstallDjango");
vi.mock("../../configurators/django/addAppToDjangoSettings");
vi.mock("../../configurators/django/createIndexHtml");
vi.mock("../../configurators/django/modifyViewsPy");
vi.mock("../../configurators/django/modifyUrlsPy");
vi.mock("../../configurators/django/modifyRootUrlsPy");
vi.mock("../../configurators/django/createGitignore");
vi.mock("../../utils/logger");

describe("configureDjango", () => {
  const mockProjectName = "testproject";
  const mockAppName = "testapp";
  const mockCwd = "/fake/path";

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup default successful mocks
    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(checkAndInstallDjango).mockResolvedValue(undefined);
    vi.mocked(execa).mockResolvedValue({} as any);
    vi.mocked(addAppToDjangoSettings).mockResolvedValue(undefined);
    vi.mocked(createIndexHtml).mockResolvedValue(undefined);
    vi.mocked(modifyViewsPy).mockResolvedValue(undefined);
    vi.mocked(modifyUrlsPy).mockResolvedValue(undefined);
    vi.mocked(modifyRootUrlsPy).mockResolvedValue(undefined);
    vi.mocked(createGitignore).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully configure Django when all operations succeed", async () => {
    await configureDjango(mockProjectName, mockAppName, mockCwd);

    expect(fs.access).toHaveBeenCalledWith(mockCwd, fs.constants.W_OK);
    expect(checkAndInstallDjango).toHaveBeenCalled();
    expect(execa).toHaveBeenCalledWith(
      "django-admin",
      ["startproject", mockProjectName],
      { cwd: mockCwd }
    );

    const expectedProjectPath = path.join(mockCwd, mockProjectName);
    expect(execa).toHaveBeenCalledWith(
      "django-admin",
      ["startapp", mockAppName],
      { cwd: expectedProjectPath }
    );

    expect(addAppToDjangoSettings).toHaveBeenCalled();
    expect(createIndexHtml).toHaveBeenCalled();
    expect(modifyViewsPy).toHaveBeenCalled();
    expect(modifyUrlsPy).toHaveBeenCalled();
    expect(modifyRootUrlsPy).toHaveBeenCalled();
    expect(createGitignore).toHaveBeenCalled();

    expect(logger.success).toHaveBeenCalled();
  });

  it("should exit when directory is not writable", async () => {
    const mockError = new Error("Permission denied");
    vi.mocked(fs.access).mockRejectedValue(mockError);

    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(
        (code?: string | number | null | undefined) => undefined as never
      );

    await configureDjango(mockProjectName, mockAppName, mockCwd);

    expect(logger.error).toHaveBeenCalledWith(
      "Error: The current directory is not writable."
    );
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it("should handle django-admin command not found error", async () => {
    const mockError = new Error("command not found");
    vi.mocked(execa).mockRejectedValue(mockError);

    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(
        (code?: string | number | null | undefined) => undefined as never
      );

    await configureDjango(mockProjectName, mockAppName, mockCwd);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("command not found")
    );
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it("should handle permission denied error for django-admin", async () => {
    const mockError = new Error("permission denied");
    vi.mocked(execa).mockRejectedValue(mockError);

    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(
        (code?: string | number | null | undefined) => undefined as never
      );

    await configureDjango(mockProjectName, mockAppName, mockCwd);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Permission denied")
    );
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it("should handle errors in configuration steps", async () => {
    const mockError = new Error("Configuration error");
    vi.mocked(addAppToDjangoSettings).mockRejectedValue(mockError);

    await configureDjango(mockProjectName, mockAppName, mockCwd);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error configuring django")
    );
  });
});
