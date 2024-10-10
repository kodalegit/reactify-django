# reactify-django CLI

[![NPM Version](https://img.shields.io/badge/NPM-0.1.0-blue)](https://www.npmjs.com/package/reactify-django)
![Code Coverage](https://img.shields.io/badge/Code_Coverage-92.57%25-green)
[![MIT License](https://img.shields.io/badge/License-MIT-red)](https://opensource.org/license/MIT)

A CLI that automates configuration of React within a Django project.

## Description

This CLI configures React within a Django project using sensible defaults. You can optionally set up Typescript and Tailwind for your Django project. Webpack is used as the bundler of choice. ESLint is used for linting.

This tool allows you to integrate React with Django, offering the flexibility to leverage Django's powerful server-side rendering (SSR) capabilities—such as templating and routing—alongside React’s dynamic client-side rendering. This enables you to create hybrid applications with the best of both worlds.

## Contents

- [Usage](#usage)
- [Commands](#commands)
  - [init](#init)
  - [add](#add)
- [Further Information](#further-information)
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

Optionally specify a path to the target Django app directory with the `-c` or `--cwd` option:

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

## Further Information

To begin using React from within Django after configuration, run `npm start` in your Django app directory where `package.json` is located. This will run the webpack dev server and bundle the React code into a JavaScript file and place it within the static folder. Webpack will automatically bundle on save allowing the Django development server to pick up the React code. When you're ready for production, run `npm run build` to bundle for production within the static folder.

When using the `add` command, there are some important details to note. Webpack, by default, is configured to bundle Javascript into the `static/your_app_name/js/` folder. The path to your JavaScript bundle will thus be `static/your_app_name/js/bundle.js`.
You can access this bundled code by injecting it into your template as follows:

```
{% load static %}

...

<div id="react-root"></div>
<script src="{% static 'your_app_name/js/bundle.js' %}"></script>
```

When using the `init` command, this is done automatically. An `index.html` file is created in `templates/your_app_name/` and mapped to the root url `path("", views.index, name="index")`. This provides a reasonable starting point.

All these default settings can be modified in the `webpack.config.js` and respective Django files.

## License

Licensed under the [MIT License](https://github.com/kodalegit/reactify-django/blob/main/LICENSE).
