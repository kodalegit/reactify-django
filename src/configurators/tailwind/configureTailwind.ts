import { createTailwindConfig } from "./createTailwindConfig";
import { createPostcssConfig } from "./createPostcssConfig";
import { configureCss } from "./configureCss";

export async function configureTailwind(useTypescript: boolean) {
  await createTailwindConfig(useTypescript);
  await createPostcssConfig();
  await configureCss();

  console.log(
    `Typescript has been configured with ${
      useTypescript ? "Typescript" : "Javascript"
    }`
  );
}
