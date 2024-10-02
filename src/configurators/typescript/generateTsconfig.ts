import { writeFile } from "fs/promises";
import path from "path";

export async function generateTsconfig(appPath: string) {
  const tsconfig = {
    compilerOptions: {
      target: "es6",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      noFallthroughCasesInSwitch: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      baseUrl: "./",
      paths: {
        "@/*": ["src/*"],
      },
    },
    include: ["src/**/*.ts", "src/**/*.tsx"],
    exclude: ["node_modules"],
  };

  // Write the tsconfig to a file
  await writeFile(
    path.join(appPath, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2)
  );

  console.log("Generated tsconfig.json successfully");
}
