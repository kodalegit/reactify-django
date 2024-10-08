import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { add } from "../../commands/add";
import prompts from "prompts";
import ora from "ora";
import fs from "fs";
import path from "path";
import { configureReact } from "../../configurators/react/configureReact";
import { configureBundling } from "../../configurators/bundling/configureBundling";
import { configureTypescript } from "../../configurators/typescript/configureTypescript";
import { configureTailwind } from "../../configurators/tailwind/configureTailwind";
import { configureEslint } from "../../configurators/eslint/configureEslint";
import { highlighter } from "../../utils/highlighter";
import { logger } from "../../utils/logger";

vi.mock("prompts");
vi.mock("fs");
vi.mock("path");
vi.mock("../../configurators/react/configureReact");
vi.mock("../../configurators/bundling/configureBundling");
vi.mock("../../configurators/typescript/configureTypescript");
vi.mock("../../configurators/tailwind/configureTailwind");
vi.mock("../../configurators/eslint/configureEslint");
vi.mock("../../utils/highlighter");
vi.mock("../../utils/logger");

describe("add command", () => {
  const mockCwd = "/fake/path/to/django-app";
  const mockAppName = "django-app";
  // Simulate the command-line arguments, including --cwd
  const mockArgv = ["node", "cli.js", "--cwd", mockCwd];

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(path.resolve).mockReturnValue(mockCwd);
    vi.mocked(path.basename).mockReturnValue(mockAppName);

    // Mock fs.existsSync to simulate a Django app directory
    vi.mocked(fs.existsSync).mockReturnValue(true);

    vi.mocked(prompts).mockResolvedValue({
      useTypescript: true,
      useTailwind: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should configure React, ESLint, bundling, TypeScript, and Tailwind when all options are selected", async () => {
    // Act
    await add.parseAsync(mockArgv);

    // Assert
    expect(path.resolve).toHaveBeenCalledWith(mockCwd);
    expect(path.basename).toHaveBeenCalledWith(mockCwd);
    expect(fs.existsSync).toHaveBeenCalled();
    expect(prompts).toHaveBeenCalled();
    expect(configureReact).toHaveBeenCalledWith(true, true, mockCwd);
    expect(configureEslint).toHaveBeenCalledWith(true, mockCwd);
    expect(configureBundling).toHaveBeenCalledWith(mockAppName, true, mockCwd);
    expect(configureTypescript).toHaveBeenCalledWith(mockCwd);
    expect(configureTailwind).toHaveBeenCalledWith(true, mockCwd);
  });

  it("should exit with an error if the directory is not a Django app", async () => {
    // Arrange
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    // Act
    await add.parseAsync(mockArgv);

    // Assert
    expect(logger.error).toHaveBeenCalledWith(
      `Error: ${highlighter.warn(
        mockCwd
      )} does not appear to be a Django app directory.`
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it("should handle errors during configuration", async () => {
    // Arrange
    const mockError = new Error("Configuration failed");
    vi.mocked(configureReact).mockRejectedValue(mockError);
    const processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    // Act
    await add.parseAsync(mockArgv);

    // Assert
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
