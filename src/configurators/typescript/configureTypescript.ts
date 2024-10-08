import { logger } from "../../utils/logger";
import { generateTsconfig } from "./generateTsconfig";
import { highlighter } from "../../utils/highlighter";

export async function configureTypescript(appPath: string) {
  try {
    await generateTsconfig(appPath);
    logger.success(
      `✅ ${highlighter.info("Typescript")} successfully configured.`
    );
  } catch (error) {
    logger.error(`Error configuring Typescript: ${(error as Error).message}`);
  }
}
