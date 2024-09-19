#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";

async function main() {
  const program = new Command()
    .name("reactify-django")
    .description("configure react within django")
    .version("0.1.0");

  program.addCommand(init);
}

main();
