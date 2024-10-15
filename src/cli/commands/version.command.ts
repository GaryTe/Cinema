import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { Command } from '../../shared/interface/index.js';
import { FILE_PATH } from '../../shared/const/index.js';
import { NameCommand } from '../../shared/enum/index.js';
import { isPackageJSONConfig } from '../../shared/util/index.js';
import { info, mistake } from '../../shared/util/index.js';


export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = FILE_PATH
  ) {}

  private async readVersion(): Promise<void> {
    try{
      const jsonContent = await readFile(resolve(this.filePath), {encoding:'utf-8'});
      const importedContent: unknown = JSON.parse(jsonContent);

      if (! isPackageJSONConfig(importedContent)) {
        throw new Error(`
          where: src/cli/commands/version.command.ts
          mistake: Failed to parse json content.
          line: 21
        `);
      }

      console.info(info(importedContent.version));
    }catch(error: unknown){
      if (error instanceof Error) {
        console.error(mistake(error.message));
      }
    }
  }

  public getName(): string {
    return NameCommand.Version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    await this.readVersion();
  }
}
