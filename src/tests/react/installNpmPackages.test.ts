import { describe, it, expect, vi, beforeEach } from "vitest";
import { installNpmPackages } from "../../configurators/react/installNpmPackages";
import { execa } from "execa";

// Mock execa
vi.mock("execa", () => ({
  execa: vi.fn(),
}));

describe("installNpmPackages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should install packages correctly with TypeScript and Tailwind", async () => {
    const mockExeca = vi.mocked(execa);

    await installNpmPackages(true, true, "/test/app/path");

    expect(mockExeca).toHaveBeenCalledTimes(3);
    expect(mockExeca).toHaveBeenNthCalledWith(1, "npm", ["init", "-y"], {
      cwd: "/test/app/path",
    });
    expect(mockExeca).toHaveBeenNthCalledWith(
      2,
      "npm",
      ["install", "react", "react-dom"],
      { cwd: "/test/app/path" }
    );
    expect(mockExeca).toHaveBeenNthCalledWith(
      3,
      "npm",
      [
        "install",
        "--save-dev",
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "babel-loader",
        "@babel/core",
        "@babel/preset-env",
        "@babel/preset-react",
        "@pmmmwh/react-refresh-webpack-plugin",
        "react-refresh",
        "style-loader",
        "css-loader",
        "postcss-loader",
        "eslint",
        "eslint-plugin-react",
        "typescript",
        "@types/react",
        "@types/react-dom",
        "ts-loader",
        "@babel/preset-typescript",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "tailwindcss",
        "postcss",
        "autoprefixer",
      ],
      { cwd: "/test/app/path" }
    );
  });

  it("should install packages correctly without TypeScript and Tailwind", async () => {
    const mockExeca = vi.mocked(execa);

    await installNpmPackages(false, false, "/test/app/path");

    expect(mockExeca).toHaveBeenCalledTimes(3);
    expect(mockExeca).toHaveBeenNthCalledWith(1, "npm", ["init", "-y"], {
      cwd: "/test/app/path",
    });
    expect(mockExeca).toHaveBeenNthCalledWith(
      2,
      "npm",
      ["install", "react", "react-dom"],
      { cwd: "/test/app/path" }
    );
    expect(mockExeca).toHaveBeenNthCalledWith(
      3,
      "npm",
      [
        "install",
        "--save-dev",
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "babel-loader",
        "@babel/core",
        "@babel/preset-env",
        "@babel/preset-react",
        "@pmmmwh/react-refresh-webpack-plugin",
        "react-refresh",
        "style-loader",
        "css-loader",
        "postcss-loader",
        "eslint",
        "eslint-plugin-react",
      ],
      { cwd: "/test/app/path" }
    );
  });

  it("should throw an error if npm installation fails", async () => {
    const mockExeca = vi.mocked(execa);
    mockExeca.mockRejectedValue(new Error("npm installation failed"));

    await expect(
      installNpmPackages(false, false, "/test/app/path")
    ).rejects.toThrow("npm installation failed");
  });
});
