import { StorageEngine } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

export class CustomStorage implements StorageEngine {
  destination: string;

  constructor(destination: string) {
    this.destination = destination;

    if (!fs.existsSync(this.destination)) {
      fs.mkdirSync(this.destination, { recursive: true });
    }
  }

  _handleFile(
    req: any,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    const ext = path.extname(file.originalname);
    const filename = uuid() + ext;
    const finalPath = path.join(this.destination, filename);
    const outStream = fs.createWriteStream(finalPath);

    file.stream.pipe(outStream);
    outStream.on('error', cb);
    outStream.on('finish', () => {
      cb(null, {
        path: finalPath,
        size: outStream.bytesWritten,
        filename,
      });
    });
  }

  _removeFile(
    req: any,
    file: Express.Multer.File,
    cb: (error?: any) => void,
  ): void {
    fs.unlink(file.path, cb);
  }
}
