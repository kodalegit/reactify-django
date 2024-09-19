import { writeFile } from "fs/promises";

export async function generateTsconfig() {
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
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      baseUrl: "./",
      paths: {
        "@/*": ["src/*"],
      },
    },
    include: ["**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  };

  // Write the tsconfig to a file
  await writeFile("tsconfig.json", JSON.stringify(tsconfig, null, 2));

  console.log("Generated tsconfig.json successfully");
}
