import { describe, it, expect, vi, afterEach } from "vitest";
import { createBabelConfig } from "../../configurators/bundling/createBabelConfig";
import { promises as fs } from "fs";
import * as path from "path";

vi.mock("fs", () => ({
  promises: {
    writeFile: vi.fn(),
  },
}));

vi.mock("path", () => ({
  join: vi.fn(),
}));

describe("createBabelConfig", () => {
  const mockAppPath = "/mock/app/path";

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a babel config file with TypeScript", async () => {
    const mockFilePath = "/mock/app/path/babel.config.js";
    vi.mocked(path.join).mockReturnValue(mockFilePath);

    await createBabelConfig(true, mockAppPath);

    expect(path.join).toHaveBeenCalledWith(mockAppPath, "babel.config.js");
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.stringContaining('"@babel/preset-typescript",')
    );
  });

  it("creates a babel config file without TypeScript", async () => {
    const mockFilePath = "/mock/app/path/babel.config.js";
    vi.mocked(path.join).mockReturnValue(mockFilePath);

    await createBabelConfig(false, mockAppPath);

    expect(path.join).toHaveBeenCalledWith(mockAppPath, "babel.config.js");
    expect(fs.writeFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.not.stringContaining('"@babel/preset-typescript",')
    );
  });

  it("throws and logs error when file creation fails", async () => {
    const mockError = new Error("File creation failed");
    vi.mocked(fs.writeFile).mockRejectedValue(mockError);
    const consoleErrorSpy = vi.spyOn(console, "error");

    await expect(createBabelConfig(true, mockAppPath)).rejects.toThrow(
      "File creation failed"
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: File creation failed");
  });
});
