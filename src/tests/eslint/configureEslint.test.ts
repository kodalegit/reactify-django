import { describe, it, expect, vi } from "vitest";
import * as fs from "fs/promises";
import path from "path";
import { configureEslint } from "../../configurators/eslint/configureEslint";

vi.mock("fs/promises");

describe("configureEslint", () => {
  it("should create the correct ESLint config for JavaScript projects", async () => {
    const appPath = "/mock/app/path";
    const useTypescript = false;

    await configureEslint(useTypescript, appPath);

    // Expect the ESLint config for JavaScript to be written
    const expectedEslintConfig = {
      env: { browser: true, es2021: true },
      extends: ["eslint:recommended", "plugin:react/recommended"],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["react"],
    };

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(appPath, ".eslintrc.json"),
      JSON.stringify(expectedEslintConfig, null, 2)
    );

    // Expect the .eslintignore file to be written
    const expectedEslintIgnore = `
node_modules/
build/
dist/
*.css
*.scss`.trim();

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(appPath, ".eslintignore"),
      expectedEslintIgnore
    );
  });

  it("should create the correct ESLint config for TypeScript projects", async () => {
    const appPath = "/mock/app/path";
    const useTypescript = true;

    await configureEslint(useTypescript, appPath);

    // Expect the ESLint config for TypeScript to be written
    const expectedEslintConfig = {
      env: { browser: true, es2021: true },
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["react", "@typescript-eslint"],
      parser: "@typescript-eslint/parser",
    };

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(appPath, ".eslintrc.json"),
      JSON.stringify(expectedEslintConfig, null, 2)
    );

    // Expect the .eslintignore file to be written
    const expectedEslintIgnore = `
node_modules/
build/
dist/
*.css
*.scss`.trim();

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(appPath, ".eslintignore"),
      expectedEslintIgnore
    );
  });
});
