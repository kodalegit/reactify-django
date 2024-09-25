import { configureCss } from "../../configurators/tailwind/configureCss";
import * as fs from "fs/promises";
import * as path from "path";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("path");
vi.mock("fs/promises");

describe("configureCss", () => {
  it("configure CSS with tailwind directives", async () => {
    const appPath = "path/to/app";
    const expectedFilePath = path.join(appPath, "src", "index.css");
    const expectedCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    await configureCss(appPath);
    expect(fs.writeFile).toHaveBeenCalledWith(expectedFilePath, expectedCss);
  });
});
