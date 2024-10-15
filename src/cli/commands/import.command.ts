import { Command } from '../../shared/interface/index.js';
import { NameCommand } from '../../shared/enum/index.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import { mistake, info, createOffer } from '../../shared/util/index.js';


export class ImportCommand implements Command {
  public getName(): string {
    return NameCommand.Import;
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(info(`${count} rows imported and converted to film object`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename);

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try{
      await fileReader.read();
    }catch(error){
      console.error(mistake(`
        where: src/cli/commands/tsv-file-reader.ts
        mistake: Could not read the full contents of the file in memory.
        line: 29
      `));
    }
  }
}
