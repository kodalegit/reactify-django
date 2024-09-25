import { describe, it, expect, vi } from "vitest";
import * as fs from "fs/promises";
import path from "path";
import { createPostcssConfig } from "../../configurators/tailwind/createPostcssConfig";

vi.mock("fs/promises");

describe("createPostcssConfig", () => {
  it("should create postcss.config.js with correct content in the specified appPath", async () => {
    const mockAppPath = "/mock/app/path";
    const expectedFilePath = path.join(mockAppPath, "postcss.config.js");
    const expectedPostcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

    // Call the function
    await createPostcssConfig(mockAppPath);

    // Expect fs.writeFile to have been called with the correct file path and content
    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedFilePath,
      expectedPostcssConfig
    );
  });
});
