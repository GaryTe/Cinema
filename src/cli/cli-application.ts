import { Command } from '../shared/interface/index.js';
import { CommandCollection } from '../shared/type/index.js';
import { NameCommand } from '../shared/enum/index.js';
import { mistake } from '../shared/util/index.js';
import { CommandParser } from '../shared/libs/index.js';


export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = NameCommand.Help
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (!Object.hasOwn(this.commands, command.getName())) {
        this.commands[command.getName()] = command;
      }
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      throw new Error (mistake(`
          where: main.cli.ts
          mistake: The class "HelpCommand" is not registered.
          line: 3
        `));
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
