import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  MONGO_PORT: string;
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  MONGO_DB_NAME: string;
  MONGO_DB_HOST: string;
  SALT: string;
  UPLOAD_DIRECTORY: string;
  STATIC_DIRECTORY: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ALGORITHM: string;
  TYP: string;
  JWT_EXPIRED: string;
  HOST: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 3500
  },
  MONGO_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'MONGO_PORT',
    default: '4500',
  },
  MONGO_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'MONGO_USER',
    default: null,
  },
  MONGO_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'MONGO_PASSWORD',
    default: null,
  },
  MONGO_DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'MONGO_DB_NAME',
    default: null
  },
  MONGO_DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'MONGO_DB_HOST',
    default: null
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  },
  STATIC_DIRECTORY: {
    doc: 'Directory for static files',
    format: String,
    env: 'STATIC_DIRECTORY',
    default: null
  },
  JWT_ACCESS_SECRET: {
    doc: 'Secret for sccessToken',
    format: String,
    env: 'JWT_ACCESS_SECRET',
    default: null
  },
  JWT_REFRESH_SECRET: {
    doc: 'Secret for refreshToken',
    format: String,
    env: 'JWT_REFRESH_SECRET',
    default: null
  },
  JWT_ALGORITHM: {
    doc: 'Encryption algorithm for token',
    format: String,
    env: 'JWT_ALGORITHM',
    default: null
  },
  TYP: {
    doc: 'Typ for token',
    format: String,
    env: 'TYP',
    default: null
  },
  JWT_EXPIRED: {
    doc: 'Expiration time for sccessToken',
    format: String,
    env: 'JWT_EXPIRED',
    default: null
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  },
});
