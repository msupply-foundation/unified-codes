import csv from 'csv-parser';
import * as fs from 'fs';

import { ICSVData, ICSVRow, ParserOptions } from './types';

export async function parseCsv(
  path: fs.PathLike,
  options?: ParserOptions
): Promise<ICSVData> {
  const data = [];

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
      .replace(REGEX.SPACE, '_');
  };

  // Read data stream.
  const stream = fs.createReadStream(path, options);
  await new Promise(resolve => {
    stream
      .pipe(csv())
      .on('data', (row: string) => {
        const entity = Object.entries<string>(row).reduce(
          (acc: ICSVRow, [column, value]: [string, string]) => {
            const key = parseColumn(column);
            return { ...acc, [key]: value };
          },
          {} as ICSVRow
        );
        data.push(entity);
      })
      .on('end', () => resolve(null));
  });

  return data;
}
