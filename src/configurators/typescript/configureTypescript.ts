import { generateTsconfig } from "./generateTsconfig";

export async function configureTypescript(appPath: string) {
  try {
    await generateTsconfig(appPath);
  } catch (error) {
    console.error(`Error configuring bundling: ${(error as Error).message}`);
  }
}
