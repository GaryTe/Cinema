import { HttpError } from '../libs/index.js';
import {Detail} from '../type/index.js';

export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string, detail?: string | Detail) {
    super(httpStatusCode, message, detail);
  }
}
