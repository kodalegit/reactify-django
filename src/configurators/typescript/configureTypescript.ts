import { generateTsconfig } from "./generateTsconfig";

export async function configureTypescript(appPath: string) {
  await generateTsconfig(appPath);
}
