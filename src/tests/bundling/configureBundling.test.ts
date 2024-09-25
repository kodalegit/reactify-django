import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureBundling } from "../../configurators/bundling/configureBundling";
import { createWebpackConfig } from "../../configurators/bundling/createWebpackConfig";
import { createBabelConfig } from "../../configurators/bundling/createBabelConfig";
import { updatePackageJsonScripts } from "../../configurators/bundling/updatePackageJsonScripts";

vi.mock("../../configurators/bundling/createWebpackConfig", () => ({
  createWebpackConfig: vi.fn(),
}));

vi.mock("../../configurators/bundling/createBabelConfig", () => ({
  createBabelConfig: vi.fn(),
}));

vi.mock("../../configurators/bundling/updatePackageJsonScripts", () => ({
  updatePackageJsonScripts: vi.fn(),
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

  it("should call createWebpackConfig, createBabelConfig, and updatePackageJsonScripts with the correct parameters", async () => {
    const useTypescript = false;

    await configureBundling(mockAppName, useTypescript, mockAppPath);

    expect(createWebpackConfig).toHaveBeenCalledWith(
      mockAppName,
      useTypescript,
      mockAppPath
    );
    expect(createBabelConfig).toHaveBeenCalledWith(useTypescript, mockAppPath);
    expect(updatePackageJsonScripts).toHaveBeenCalledWith(mockAppPath);
  });

  it("should handle calls with TypeScript enabled", async () => {
    const useTypescript = true;

    await configureBundling(mockAppName, useTypescript, mockAppPath);

    expect(createWebpackConfig).toHaveBeenCalledWith(
      mockAppName,
      useTypescript,
      mockAppPath
    );
    expect(createBabelConfig).toHaveBeenCalledWith(useTypescript, mockAppPath);
    expect(updatePackageJsonScripts).toHaveBeenCalledWith(mockAppPath);
  });
});
