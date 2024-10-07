import { createTailwindConfig } from "./createTailwindConfig";
import { createPostcssConfig } from "./createPostcssConfig";
import { configureCss } from "./configureCss";
import { logger } from "@/src/utils/logger";
import { highlighter } from "@/src/utils/highlighter";

export async function configureTailwind(
  useTypescript: boolean,
  appPath: string
) {
  try {
    await createTailwindConfig(useTypescript, appPath);
    await createPostcssConfig(appPath);
    await configureCss(appPath);

    logger.break();
    logger.success(
      `${highlighter.info("Tailwind")} successfully configured with ${
        useTypescript
          ? highlighter.info("Typescript")
          : highlighter.info("Javascript")
      }`
    );
  } catch (error) {
    logger.break();
    logger.error(`Error configuring Tailwind: ${(error as Error).message}`);
  }
}
