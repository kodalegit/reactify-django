import { generateTsconfig } from "./generateTsconfig";

export async function configureTypescript(useTypescript: Boolean) {
  if (useTypescript) {
    await generateTsconfig();
  }
}
