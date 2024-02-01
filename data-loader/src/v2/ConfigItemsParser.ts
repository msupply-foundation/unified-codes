import * as fs from 'fs';
import csv from 'csv-parser';
import { ConfigItems } from './types';

export class ConfigItemsDataParser {
  public readonly path: fs.PathLike;

  private data: ConfigItems;

  private isParsed: boolean;
  private isBuilt: boolean;

  constructor(path: fs.PathLike) {
    this.path = path;

    this.isParsed = false;
    this.isBuilt = false;

    this.data = {
      forms: [],
      immediatePackaging: [],
      routes: [],
    };
  }

  public async parseData(): Promise<ConfigItems> {
    if (this.isParsed) return this.data;

    this.data = {
      forms: [],
      immediatePackaging: [],
      routes: [],
    };

    const parseColumn = (column: string) => {
      const REGEX = {
        CR_LF: /[\r\n]/g,
        BRACKETED_DESCRIPTION: / *\([^)]*\) */g,
        SPACE: / /g,
      };

      return column
        .trim()
        .toLowerCase()
        .replace(REGEX.CR_LF, '')
        .replace(REGEX.BRACKETED_DESCRIPTION, '')
        .replace(REGEX.SPACE, '_')
        .split('_')
        .map((word, index) =>
          index === 0 ? word : word[0].toUpperCase() + word.slice(1)
        )
        .join('');
    };

    // Read data stream.
    const stream = fs.createReadStream(this.path);
    await new Promise(resolve => {
      stream
        .pipe(csv())
        .on('data', (row: string) => {
          Object.entries<string>(row).forEach(
            ([column, value]: [string, string]) => {
              if (value) {
                const key = parseColumn(column);
                this.data[key].push(value);
              }
            }
          );
        })
        .on('end', () => resolve(null));
    });

    this.isParsed = true;
    return this.data;
  }

  public getItems(): ConfigItems {
    return this.data;
  }
}
