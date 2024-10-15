#!/usr/bin/env node

import {
  HelpCommand,
  VersionCommand,
  ImportCommand,
  GenerateCommand
} from './cli/commands/index.js';
import { CLIApplication } from './cli/cli-application.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);
  cliApplication.processCommand(process.argv);
}

bootstrap();
