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
  JWT_ACCESS_EXPIRED: string;
  JWT_REFRESH_EXPIRED: string;
  HOST: string;
  RABBITMQ_PORT: number;
  RABBITMQ_USER: string;
  RABBITMQ_PASSWORD: string;
  POSTGRES_DB: string
  POSTGRES_PORT: number
  POSTGRES_USER: string
  POSTGRES_PASSWORD: string
  PGADMIN_EMAIL: string
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
  JWT_ACCESS_EXPIRED: {
    doc: 'Expiration time for sccessToken',
    format: String,
    env: 'JWT_ACCESS_EXPIRED',
    default: null
  },
  JWT_REFRESH_EXPIRED: {
    doc: 'Expiration time for refreshToken',
    format: String,
    env: 'JWT_REFRESH_EXPIRED',
    default: null
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  },
  RABBITMQ_PORT: {
    doc: 'Port to connect to the RabbitMQ',
    format: 'port',
    env: 'RABBITMQ_PORT',
    default: null
  },
  RABBITMQ_USER: {
    doc: 'Username to connect to the RabbitMQ',
    format: String,
    env: 'RABBITMQ_USER',
    default: null,
  },
  RABBITMQ_PASSWORD: {
    doc: 'Password to connect to the RabbitMQ',
    format: String,
    env: 'RABBITMQ_PASSWORD',
    default: null,
  },
  POSTGRES_DB: {
    doc: 'DB-name PostgresDB',
    format: String,
    env: 'POSTGRES_DB',
    default: null
  },
  POSTGRES_PORT: {
    doc: 'Port for PostgresDB',
    format: 'port',
    env: 'POSTGRES_PORT',
    default: 5432
  },
  POSTGRES_USER: {
    doc: 'Username for PostgresDB',
    format: String,
    env: 'POSTGRES_USER',
    default: null
  },
  POSTGRES_PASSWORD: {
    doc: 'Password for PostgresDB',
    format: String,
    env: 'POSTGRES_PASSWORD',
    default: null
  },
  PGADMIN_EMAIL: {
    doc: 'Usre email for PostgresDB',
    format: String,
    env: 'PGADMIN_EMAIL',
    default: null
  }
});
