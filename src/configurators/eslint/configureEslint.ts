import * as fs from "fs/promises";

interface ESLintConfig {
  env: {
    browser: boolean;
    es2020: boolean;
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
  rules: {
    [key: string]: string;
  };
}

export async function configureEslint(useTypescript: boolean): Promise<void> {
  const eslintConfig: ESLintConfig = {
    env: { browser: true, es2020: true },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: ["react"],
    rules: { "react/prop-types": "off" },
  };

  if (useTypescript) {
    eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
    eslintConfig.parser = "@typescript-eslint/parser";
    eslintConfig.plugins.push("@typescript-eslint");
  }

  await fs.writeFile(".eslintrc.json", JSON.stringify(eslintConfig, null, 2));

  // Create .eslintignore file
  const eslintIgnoreContent = `
node_modules/
build/
dist/
*.css
*.scss
  `.trim();

  await fs.writeFile(".eslintignore", eslintIgnoreContent);

  console.log("ESLint configured successfully.");
}
