import * as fs from "fs/promises";
import path from "path";

interface ESLintConfig {
  env: {
    browser: boolean;
    es2021: boolean;
  };
  extends: string[];
  parserOptions: {
    ecmaFeatures: {
      jsx: boolean;
    };
    ecmaVersion: number;
    sourceType: string;
  };
  parser?: string;
  plugins: string[];
}

export async function configureEslint(
  useTypescript: boolean,
  appPath: string
): Promise<void> {
  const eslintConfig: ESLintConfig = {
    env: { browser: true, es2021: true },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: ["react"],
  };

  if (useTypescript) {
    eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
    eslintConfig.parser = "@typescript-eslint/parser";
    eslintConfig.plugins.push("@typescript-eslint");
  }

  await fs.writeFile(
    path.join(appPath, ".eslintrc.json"),
    JSON.stringify(eslintConfig, null, 2)
  );

  // Create .eslintignore file
  const eslintIgnoreContent = `
node_modules/
build/
dist/
*.css
*.scss
  `.trim();

  await fs.writeFile(path.join(appPath, ".eslintignore"), eslintIgnoreContent);
}
