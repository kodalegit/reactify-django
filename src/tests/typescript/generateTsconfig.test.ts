import { describe, it, expect, vi } from "vitest";
import { writeFile } from "fs/promises";
import path from "path";
import { generateTsconfig } from "../../configurators/typescript/generateTsconfig";

vi.mock("fs/promises");

describe("generateTsconfig", () => {
  it("should generate tsconfig.json with correct content in the specified appPath", async () => {
    const mockAppPath = "/mock/app/path";
    const expectedFilePath = path.join(mockAppPath, "tsconfig.json");

    const expectedTsconfig = {
      compilerOptions: {
        target: "es6",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        noFallthroughCasesInSwitch: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        baseUrl: "./",
        paths: {
          "@/*": ["src/*"],
        },
      },
      include: ["**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    };

    await generateTsconfig(mockAppPath);

    expect(writeFile).toHaveBeenCalledWith(
      expectedFilePath,
      JSON.stringify(expectedTsconfig, null, 2)
    );
  });
});
