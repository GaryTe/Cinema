import { TokenPayload } from './src/shared/type/index.ts';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}

declare module 'express-serve-static-core' {
export interface IncomingHttpHeaders {
  refreshToken: string;
}
}
