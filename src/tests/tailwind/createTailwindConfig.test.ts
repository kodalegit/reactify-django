import { describe, it, expect, vi, afterEach } from "vitest";
import { createTailwindConfig } from "../../configurators/tailwind/createTailwindConfig";
import { writeFile } from "fs/promises";
import path from "path";

vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("path");

describe("createTailwindConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create Tailwind config for TypeScript project", async () => {
    const useTypescript = true;
    const appPath = "/path/to/app";
    const expectedPath = "/path/to/app/tailwind.config.js";

    vi.mocked(path.join).mockReturnValue(expectedPath);

    await createTailwindConfig(useTypescript, appPath);

    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining('"./src/**/*.{ts,tsx}"')
    );
  });

  it("should create Tailwind config for JavaScript project", async () => {
    const useTypescript = false;
    const appPath = "/path/to/app";
    const expectedPath = "/path/to/app/tailwind.config.js";

    vi.mocked(path.join).mockReturnValue(expectedPath);

    await createTailwindConfig(useTypescript, appPath);

    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining('"./src/**/*.{js,jsx}"')
    );
  });
});
