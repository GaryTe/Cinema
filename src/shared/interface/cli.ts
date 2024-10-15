export interface Command {
  getName(): string;
  execute(...parameters: string[]): void;
}

export interface FileReader {
  read(): void;
}

export interface OfferGenerator {
  generate(): string;
}

export interface FileWriter {
  write(row: string): void;
}

export interface FileReader {
  read(): void;
}
