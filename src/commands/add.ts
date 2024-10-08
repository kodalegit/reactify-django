import { Command } from "commander";
import prompts from "prompts";
import ora from "ora";
import { configureReact } from "../configurators/react/configureReact";
import { configureBundling } from "../configurators/bundling/configureBundling";
import { configureTypescript } from "../configurators/typescript/configureTypescript";
import { configureTailwind } from "../configurators/tailwind/configureTailwind";
import { configureEslint } from "../configurators/eslint/configureEslint";
import path from "path";
import fs from "fs";
import { highlighter } from "../utils/highlighter";

export const add = new Command()
  .name("add")
  .description("configure react within django app")
  .option("--typescript", "use typescript", false)
  .option("--tailwind", "use tailwind", false)
  .option(
    "-c, --cwd <directory>",
    "the working directory, defaults to current directory",
    process.cwd()
  )
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);
    const appName = path.basename(cwd);

    const isdjangoApp =
      fs.existsSync(path.join(cwd, "apps.py")) ||
      fs.existsSync(path.join(cwd, "models.py")) ||
      fs.existsSync(path.join(cwd, "views.py"));

    if (!isdjangoApp) {
      console.error(
        `Error: ${cwd} does not appear to be a Django app directory.`
      );
      process.exit(1);
    }
    const responses = await prompts([
      {
        type: "confirm",
        name: "useTypescript",
        message: "Do you want to use TypeScript for React?",
        initial: false,
      },
      {
        type: "confirm",
        name: "useTailwind",
        message: "Do you want to use Tailwind CSS in your project?",
        initial: false,
      },
    ]);

    const spinner = ora().start();

    try {
      // Configuration steps
      spinner.text = "Setting up React...";
      await configureReact(responses.useTypescript, responses.useTailwind, cwd);
      await configureEslint(responses.useTypescript, cwd);
      await configureBundling(appName, responses.useTypescript, cwd);

      if (responses.useTypescript) {
        await configureTypescript(cwd);
      }

      if (responses.useTailwind) {
        await configureTailwind(responses.useTypescript, cwd);
      }

      spinner.succeed(
        `Django app '${highlighter.info(
          appName
        )}' configured with React and Webpack!`
      );
    } catch (error: any) {
      spinner.fail(`Encountered error: ${error.message}`);
      process.exit(1);
    }
  });
