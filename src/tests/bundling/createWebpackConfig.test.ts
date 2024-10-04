import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import * as path from "path";
import { createWebpackConfig } from "../../configurators/bundling/createWebpackConfig";

vi.mock("fs", () => ({
  promises: {
    writeFile: vi.fn(),
  },
}));

vi.mock("path");

describe("createWebpackConfig", () => {
  const mockAppName = "testApp";
  const mockAppPath = "/path/to/app";
  const mockFilePath = "/path/to/app/webpack.config.js";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create webpack config for JavaScript project", async () => {
    vi.mocked(path.join).mockReturnValue(mockFilePath);
    await createWebpackConfig(mockAppName, false, mockAppPath);
    expect(path.join).toHaveBeenCalledWith(mockAppPath, "webpack.config.js");
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.stringContaining("entry: './src/index.jsx'")
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.not.stringContaining("test: /\\.tsx?$/")
    );
  });

  it("should create webpack config for TypeScript project", async () => {
    vi.mocked(path.join).mockReturnValue(mockFilePath);
    await createWebpackConfig(mockAppName, true, mockAppPath);
    expect(path.join).toHaveBeenCalledWith(mockAppPath, "webpack.config.js");
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.stringContaining("entry: './src/index.tsx'")
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.stringContaining("test: /\\.tsx?$/")
    );
  });

  it("should throw and log error when file creation fails", async () => {
    const mockError = new Error("File creation failed");
    (fs.writeFile as any).mockRejectedValue(mockError);

    const consoleSpy = vi.spyOn(console, "error");

    await expect(
      createWebpackConfig(mockAppName, false, mockAppPath)
    ).rejects.toThrow("File creation failed");
    expect(consoleSpy).toHaveBeenCalledWith("Error: File creation failed");
  });
});
