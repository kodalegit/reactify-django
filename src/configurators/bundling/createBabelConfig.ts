import { promises as fs } from "fs";
import * as path from "path";

export async function createBabelConfig(
  useTypescript: boolean,
  appPath: string
) {
  // Babel config template
  const config = `
module.exports = (api) => {
  // This caches the Babel config
  api.cache.using(() => process.env.NODE_ENV);
  const isProduction = api.env("production");
  return {
    presets: [
      "@babel/preset-env",
      // Enable development transform of React with new automatic runtime
      [
        "@babel/preset-react",
        { development: !isProduction, runtime: "automatic" },
      ],
      ${useTypescript ? '"@babel/preset-typescript",' : ""}
    ],
  };
};
`;

  try {
    const filePath = path.join(appPath, "babel.config.js");
    await fs.writeFile(filePath, config);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unexpected error occurred");
    }
    throw error;
  }
}
