import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import * as crypto from 'node:crypto';
import dayjs from 'dayjs';

import { Middleware } from '../interface/index.js';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const [ year, month ] = dayjs('2025-12').format('YYYY MM').split(' ');
    const underDirectory = `${year}/${month}`;

    const storage = diskStorage({
      destination: `${this.uploadDirectory}/${underDirectory}`,
      filename: (_req, file: Express.Multer.File, callback) => {
        const filename = crypto.randomUUID();
        const fileExtension = file.originalname.split('.');
        callback(null, `${filename}.${fileExtension[fileExtension.length - 1]}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
