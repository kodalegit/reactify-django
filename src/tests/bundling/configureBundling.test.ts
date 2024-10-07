import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureBundling } from "../../configurators/bundling/configureBundling";
import { createWebpackConfig } from "../../configurators/bundling/createWebpackConfig";
import { createBabelConfig } from "../../configurators/bundling/createBabelConfig";
import { updatePackageJsonScripts } from "../../configurators/bundling/updatePackageJsonScripts";
import { logger } from "@/src/utils/logger";
import { highlighter } from "@/src/utils/highlighter";

vi.mock("../../configurators/bundling/createWebpackConfig", () => ({
  createWebpackConfig: vi.fn(),
}));

vi.mock("../../configurators/bundling/createBabelConfig", () => ({
  createBabelConfig: vi.fn(),
}));

vi.mock("../../configurators/bundling/updatePackageJsonScripts", () => ({
  updatePackageJsonScripts: vi.fn(),
}));

vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/src/utils/highlighter", () => ({
  highlighter: {
    info: vi.fn((str: string) => str),
  },
}));

describe("configureBundling", () => {
  const mockAppName = "testApp";
  const mockAppPath = "/mock/app/path";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call createWebpackConfig, createBabelConfig, updatePackageJsonScripts and log success", async () => {
    const useTypescript = false;

    await configureBundling(mockAppName, useTypescript, mockAppPath);

    expect(createWebpackConfig).toHaveBeenCalledWith(
      mockAppName,
      useTypescript,
      mockAppPath
    );
    expect(createBabelConfig).toHaveBeenCalledWith(useTypescript, mockAppPath);
    expect(updatePackageJsonScripts).toHaveBeenCalledWith(mockAppPath);

    expect(logger.break).toHaveBeenCalled();
    expect(logger.success).toHaveBeenCalledWith(
      `✅ ${highlighter.info("Webpack")} and ${highlighter.info(
        "Babel"
      )} successfully configured.`
    );
  });

  it("should log an error if one of the bundling steps fails", async () => {
    const useTypescript = true;
    const mockError = new Error("Test error");

    (createWebpackConfig as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      mockError
    );

    await configureBundling(mockAppName, useTypescript, mockAppPath);

    expect(createWebpackConfig).toHaveBeenCalledWith(
      mockAppName,
      useTypescript,
      mockAppPath
    );
    expect(createBabelConfig).not.toHaveBeenCalled(); // because Webpack failed
    expect(updatePackageJsonScripts).not.toHaveBeenCalled();

    expect(logger.break).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      `Error configuring bundling: ${mockError.message}`
    );
  });
});
