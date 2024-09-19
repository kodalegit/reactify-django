import { writeFile } from "fs/promises";
import path from "path";

export async function createTailwindConfig(useTypescript: boolean) {
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
  await writeFile(
    path.join(process.cwd(), "tailwind.config.js"),
    tailwindConfig
  );

  console.log("Generated tailwind.config.js successfully");
}
