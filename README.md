# reactify-django CLI

A CLI that automates configuration of React within a Django project with sensible defaults. You can optionally set up Typescript and Tailwind for your Django project. Webpack is used as the bundler of choice. ESLint is used for linting.

## Contents

- [Usage](#usage)
- [Commands](#commands)
  - [init](#init)
  - [add](#add)
- [License](#license)

## Usage

This tool runs on the terminal and requires Node.js installed to run.
To initialize a new Django project from scratch with React, run the `init` command.

`npx reactify-django init`

To set up React in an existing Django project, run the `add` command in the Django app directory.

`npx reactify-django add`

## Commands

### init

The `init` command is used to initialize a Django project from scratch with React installed within a Django app. You can optionally use Typescript and/or Tailwind for your project.

Simply run the following command in the target directory:

`npx reactify-django init`

Optionally specify a path to the target directory with the `-c` or `--cwd` option:

`npx reactify-django init -c ./target/dir`

You will be prompted a few questions to configure the Django project, Django app and required dependencies.

```
- Enter the Django project name: > project
- Enter the Django app name: > app
- Do you want to use TypeScript for React? > (y/N)
- Do you want to use Tailwind CSS in your project? > (y/N)
```

#### Options

```
Usage: reactify-django init [options]

initialize django project with react

Options:
--typescript use typescript (default: false)
--tailwind use tailwind (default: false)
-c, --cwd <directory> the working directory, defaults to current directory
-h, --help display help for command
```

### add

The `add` command is used to set up React within an existing Django project. Use this option to target an existing Django app where you need React. You can optionally use Typescript and/or Tailwind for your project.

`cd` into the target Django app directory and run the following command:

`npx reactify-django add`

Optionally specify a path to the target django app directory with the `-c` or `--cwd` option:

`npx reactify-django add -c ./path/to/app`

You will be prompted a few questions to set up React within the Django app.

```
- Do you want to use TypeScript for React? › (y/N)
- Do you want to use Tailwind CSS in your project? › (y/N)
```

#### Options

```
Usage: reactify-django add [options]

configure react within django app

Options:
--typescript use typescript (default: false)
--tailwind use tailwind (default: false)
-c, --cwd <directory> the working directory, defaults to current directory
-h, --help display help for command
```

## License

Licensed under the [MIT License](https://github.com/kodalegit/reactify-django/blob/main/LICENSE).
