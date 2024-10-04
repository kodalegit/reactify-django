import { writeFile } from "fs/promises";
import path from "path";

export async function createTailwindConfig(
  useTypescript: boolean,
  appPath: string
) {
  const fileTypes = useTypescript ? "{ts,tsx}" : "{js,jsx}";

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.${fileTypes}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

  // Write the configuration to 'tailwind.config.js'
  await writeFile(path.join(appPath, "tailwind.config.js"), tailwindConfig);
}
