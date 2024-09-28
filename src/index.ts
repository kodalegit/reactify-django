#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";

async function main() {
  const program = new Command()
    .name("reactify-django")
    .description("configure react within django")
    .version("0.1.0");

  program.addCommand(init).addCommand(add);
  program.parse();
}

main();
