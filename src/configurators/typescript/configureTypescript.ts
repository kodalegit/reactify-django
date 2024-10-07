import { logger } from "@/src/utils/logger";
import { generateTsconfig } from "./generateTsconfig";
import { highlighter } from "@/src/utils/highlighter";

export async function configureTypescript(appPath: string) {
  try {
    await generateTsconfig(appPath);
    logger.break();
    logger.success(
      `${highlighter.info("Typescript")} successfully configured.`
    );
  } catch (error) {
    logger.break();
    logger.error(`Error configuring Typescript: ${(error as Error).message}`);
  }
}
