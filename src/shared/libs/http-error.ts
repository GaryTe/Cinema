import {Detail} from '../type/index.js';

export class HttpError extends Error {
  public httpStatusCode!: number;
  public detail?: string | Detail;

  constructor(httpStatusCode: number, message: string, detail?: string | Detail) {
    super(message);

    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.detail = detail;
  }
}
