import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureTypescript } from "../../configurators/typescript/configureTypescript";
import { generateTsconfig } from "../../configurators/typescript/generateTsconfig";

vi.mock("../../configurators/typescript/generateTsconfig", () => ({
  generateTsconfig: vi.fn(),
}));

describe("configureTypescript", () => {
  it("should call generate tsconfig with correct path", async () => {
    const appPath = "path/to/app";
    await configureTypescript(appPath);
    expect(generateTsconfig).toHaveBeenCalledWith(appPath);
  });
});
