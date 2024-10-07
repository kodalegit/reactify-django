import { execa } from "execa";
import { logger } from "@/src/utils/logger";

export async function installNpmPackages(
  useTypescript: boolean,
  useTailwind: boolean,
  appPath: string
) {
  try {
    // Initialize npm in the app directory
    await execa("npm", ["init", "-y"], { cwd: appPath });

    // Regular dependencies
    const dependencies = ["react", "react-dom"];

    // Dev dependencies
    const devDependencies = [
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
    ];

    // If TypeScript is used, add TypeScript-related packages
    if (useTypescript) {
      devDependencies.push(
        "typescript",
        "@types/react",
        "@types/react-dom",
        "ts-loader",
        "@babel/preset-typescript",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser"
      );
    }

    // If Tailwind is used, add Tailwind-related packages
    if (useTailwind) {
      devDependencies.push("tailwindcss", "postcss", "autoprefixer");
    }

    // Install regular dependencies
    await execa("npm", ["install", ...dependencies], { cwd: appPath });

    // Install dev dependencies
    await execa("npm", ["install", "--save-dev", ...devDependencies], {
      cwd: appPath,
    });
  } catch (error) {
    logger.error(
      `An error occurred while installing npm packages: ${
        (error as Error).message
      }. Make sure Node is installed and try again.`
    );
    throw error;
  }
}
