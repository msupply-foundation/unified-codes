import * as fs from 'fs';

export class SchemaParser {
  public readonly path: fs.PathLike;
  public readonly options: {
    flags?: string;
    encoding?: BufferEncoding;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    emitClose?: boolean;
    start?: number;
    end?: number;
    highWaterMark?: number;
  };

  private schema: string;
  private isParsed: boolean;

  constructor(
    path: fs.PathLike,
    options?: {
      flags?: string;
      encoding?: BufferEncoding;
      fd?: number;
      mode?: number;
      autoClose?: boolean;
      emitClose?: boolean;
      start?: number;
      end?: number;
      highWaterMark?: number;
    }
  ) {
    this.path = path;
    this.options = options;

    this.isParsed = false;
    this.schema = '';
  }

  public async parseSchema(): Promise<string> {
    if (this.isParsed) return this.schema;

    // Read data stream.
    const stream = await fs.createReadStream(this.path, this.options);
    await new Promise((resolve) => {
      stream
        .on('data', (line) => {
          this.schema += line;
        })
        .on('end', () => resolve(null));
    });

    return this.schema;
  }

  public getSchema() {
    return this.schema;
  }
}

export default SchemaParser;
