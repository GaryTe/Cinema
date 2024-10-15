import { WriteStream } from 'node:fs';
import { createWriteStream } from 'node:fs';

import { FileWriter } from '../interface/index.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    this.stream = createWriteStream(filename);
  }

  public async write(row: string): Promise<void> {

    if (! this.stream.write(row)) {
      await new Promise((resolve) => {
        this.stream.once('drain', () => resolve);
      });
    }
  }
}
