import { createTailwindConfig } from "./createTailwindConfig";
import { createPostcssConfig } from "./createPostcssConfig";
import { configureCss } from "./configureCss";

export async function configureTailwind(
  useTypescript: boolean,
  appPath: string
) {
  try {
    await createTailwindConfig(useTypescript, appPath);
    await createPostcssConfig(appPath);
    await configureCss(appPath);

    console.log(
      `Tailwind has been configured with ${
        useTypescript ? "Typescript" : "Javascript"
      }`
    );
  } catch (error) {
    console.error(`Error configuring Tailwind: ${(error as Error).message}`);
  }
}
