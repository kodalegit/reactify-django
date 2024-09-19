import { Command } from "commander";
import prompts from "prompts"; // Import prompts for interactive CLI input
import ora from "ora"; // For spinners
import { configureDjango } from "../configurators/django";
import { configureReact } from "../configurators/react";
import { configureBundling } from "../configurators/bundling";
import { configureTypescript } from "../configurators/typescript";
import { configureTailwind } from "../configurators/tailwind";
import { configureEslint } from "../configurators/eslint";

// Command for initialization
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
    // Interactive prompts using prompts package
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

    // Spinner using Ora
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
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
    }
  });
