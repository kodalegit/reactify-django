import { createTailwindConfig } from "./createTailwindConfig";
import { createPostcssConfig } from "./createPostcssConfig";
import { configureCss } from "./configureCss";

export async function configureTailwind(
  useTypescript: boolean,
  appPath: string
) {
  await createTailwindConfig(useTypescript, appPath);
  await createPostcssConfig(appPath);
  await configureCss(appPath);

  console.log(
    `Tailwind has been configured with ${
      useTypescript ? "Typescript" : "Javascript"
    }`
  );
}
