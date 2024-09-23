import * as fs from "fs/promises";
import path from "path";

export async function createPostcssConfig(appPath: string): Promise<void> {
  const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  // Write the PostCSS configuration to postcss.config.js
  await fs.writeFile(path.join(appPath, "postcss.config.js"), postcssConfig);
}
