import { Command } from "commander";
import prompts from "prompts";
import ora from "ora";
import { configureDjango } from "../configurators/django/configureDjango";
import { configureReact } from "../configurators/react/configureReact";
import { configureBundling } from "../configurators/bundling/configureBundling";
import { configureTypescript } from "../configurators/typescript/configureTypescript";
import { configureTailwind } from "../configurators/tailwind/configureTailwind";
import { configureEslint } from "../configurators/eslint/configureEslint";

export const init = new Command()
  .name("init")
  .description("initialize django project with react")
  .option("--typescript", "use typescript", false)
  .option("--tailwind", "use tailwind", false)
  .option(
    "-c, --cwd",
    "the working directory, defaults to current directory",
    process.cwd()
  )
  .action(async (options) => {
    const responses = await prompts([
      {
        type: "text",
        name: "projectName",
        message: "Enter the Django project name:",
        initial: "project",
      },
      {
        type: "text",
        name: "appName",
        message: "Enter the Django app name:",
        initial: "app",
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

    const spinner = ora("Configuring Django with React...").start();

    try {
      // Configuration steps
      await configureDjango(
        responses.projectName,
        responses.appName,
        responses.useTypescript
      );
      spinner.text = "Setting up React...";
      await configureReact(
        responses.appName,
        responses.useTypescript,
        responses.useTailwind
      );
      spinner.text = "Configuring ESLint...";
      await configureEslint(responses.useTypescript);
      spinner.text = "Setting up bundling...";
      await configureBundling(responses.appName, responses.useTypescript);

      if (responses.useTypescript) {
        spinner.text = "Configuring TypeScript...";
        await configureTypescript(responses.useTypescript);
      }

      if (responses.useTailwind) {
        spinner.text = "Setting up Tailwind CSS...";
        await configureTailwind(responses.useTypescript);
      }

      spinner.succeed(
        `✅ Django project '${responses.projectName}' configured with React and Webpack!`
      );
    } catch (error: any) {
      spinner.fail(`Encountered error: ${error.message}`);
    }
  });
