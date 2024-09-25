import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureTailwind } from "../../configurators/tailwind/configureTailwind";
import { createTailwindConfig } from "../../configurators/tailwind/createTailwindConfig";
import { createPostcssConfig } from "../../configurators/tailwind/createPostcssConfig";
import { configureCss } from "../../configurators/tailwind/configureCss";

vi.mock("../../configurators/tailwind/createTailwindConfig", () => ({
  createTailwindConfig: vi.fn(),
}));

vi.mock("../../configurators/tailwind/createPostcssConfig", () => ({
  createPostcssConfig: vi.fn(),
}));

vi.mock("../../configurators/tailwind/configureCss", () => ({
  configureCss: vi.fn(),
}));

describe("configureTailwind", () => {
  const mockAppPath = "/path/to/app";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should configure Tailwind for a JavaScript project", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    await configureTailwind(false, mockAppPath);

    expect(createTailwindConfig).toHaveBeenCalledWith(false, mockAppPath);
    expect(createPostcssConfig).toHaveBeenCalledWith(mockAppPath);
    expect(configureCss).toHaveBeenCalledWith(mockAppPath);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Tailwind has been configured with Javascript"
    );
  });

  it("should configure Tailwind for a TypeScript project", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    await configureTailwind(true, mockAppPath);

    expect(createTailwindConfig).toHaveBeenCalledWith(true, mockAppPath);
    expect(createPostcssConfig).toHaveBeenCalledWith(mockAppPath);
    expect(configureCss).toHaveBeenCalledWith(mockAppPath);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Tailwind has been configured with Typescript"
    );
  });
});
