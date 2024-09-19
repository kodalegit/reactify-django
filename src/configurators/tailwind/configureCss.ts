import * as fs from "fs/promises";
import * as path from "path";

export async function configureCss(): Promise<void> {
  // Define the Tailwind directives for the CSS file
  const tailwindCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  // Path to the index.css file
  const cssFilePath = path.join("src", "index.css");

  // Write the Tailwind directives to the index.css file
  await fs.writeFile(cssFilePath, tailwindCSS);
}
