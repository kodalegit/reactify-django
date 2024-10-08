import { Command } from "commander";
import prompts from "prompts";
import ora from "ora";
import { configureDjango } from "../configurators/django/configureDjango";
import { configureReact } from "../configurators/react/configureReact";
import { configureBundling } from "../configurators/bundling/configureBundling";
import { configureTypescript } from "../configurators/typescript/configureTypescript";
import { configureTailwind } from "../configurators/tailwind/configureTailwind";
import { configureEslint } from "../configurators/eslint/configureEslint";
import path from "path";
import { highlighter } from "../utils/highlighter";

export const init = new Command()
  .name("init")
  .description("initialize django project with react")
  .option("--typescript", "use typescript", false)
  .option("--tailwind", "use tailwind", false)
  .option(
    "-c, --cwd <directory>",
    "the working directory, defaults to current directory",
    process.cwd()
  )
  .action(async (options) => {
    const cwd = path.resolve(options.cwd);
    const responses = await prompts([
      {
        type: "text",
        name: "projectName",
        message: "Enter the Django project name:",
        initial: "project",
        format: (value: string) => value.trim(),
        validate: (value: string) =>
          value.length > 128
            ? "Project name should be less than 128 characters."
            : true,
      },
      {
        type: "text",
        name: "appName",
        message: "Enter the Django app name:",
        initial: "app",
        format: (value: string) => value.trim(),
        validate: (value: string) =>
          value.length > 128
            ? "App name should be less than 128 characters."
            : true,
      },
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
      spinner.text = "Setting up Django";
      await configureDjango(responses.projectName, responses.appName, cwd);
      spinner.text = "Setting up React...";
      const appPath = path.join(cwd, responses.projectName, responses.appName);
      await configureReact(
        responses.useTypescript,
        responses.useTailwind,
        appPath
      );
      await configureEslint(responses.useTypescript, appPath);
      await configureBundling(
        responses.appName,
        responses.useTypescript,
        appPath
      );

      if (responses.useTypescript) {
        await configureTypescript(appPath);
      }

      if (responses.useTailwind) {
        await configureTailwind(responses.useTypescript, appPath);
      }

      spinner.succeed(
        `Django project '${highlighter.info(
          responses.projectName
        )}' configured with React and Webpack!`
      );
    } catch (error: any) {
      spinner.fail(`Encountered error: ${error.message}`);
      process.exit(1);
    }
  });
