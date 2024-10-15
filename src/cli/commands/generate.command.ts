import axios from 'axios';

import { Command } from '../../shared/interface/index.js';
import { mistake, info } from '../../shared/util/index.js';
import { MockServerData } from '../../shared/type/index.js';
import { NameCommand } from '../../shared/enum/index.js';
import { TSVOfferGenerator, TSVFileWriter } from '../../shared/libs/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  public getName(): string {
    return NameCommand.Generate;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = (await axios.get(url)).data;
    } catch(error) {
      console.error(mistake(`
        where: src/cli/commands/generate.command.ts
        mistake: Resource ${url} request error.
        line: 21
        `));
      return;
    }

    const offerGeneratorString = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      try{
        await tsvFileWriter.write(offerGeneratorString.generate());
      }catch(error) {
        console.error(mistake(`
          where: generate.command.ts
          mistake: Error when writing data to file.
          line: 36
          `));
        return;
      }
    }

    console.info(info(`Data written to file ${filepath}!`));
  }
}
