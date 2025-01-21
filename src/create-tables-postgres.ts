import pg from 'pg';

import {PinoLogger, RestConfig} from './shared/libs/index.js';
import {errorComments, errorFilms} from './shared/const/index.js';

export async function createTables () {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);
  const { Client } = pg;

  const client = new Client({
    user: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    host: config.get('HOST'),
    port: config.get('POSTGRES_PORT'),
    database: config.get('POSTGRES_DB'),
  });

  logger.info('Try to connect to Postgres.');
  await client.connect();

  logger.info('Connection established to Postgres !!!');

  logger.info('Creatng table comments.');
  await client.query(`
    CREATE TABLE comments (
    id bigserial NOT NULL,
    created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_user text,
    text text,
    rating integer,
    id_film bigserial,
    PRIMARY KEY (id)
    )
    `, (error) => {
    if(error && error.message === errorComments) {
      logger.warn('Relation "comments" already exists.');
    }

    if(error && error.message !== errorComments) {
      throw new Error(`Error while executing request: ${error.message}`);
    }

    if(!error) {
      logger.info('Table created !!!');
    }
  });

  logger.info('Creatng table films.');
  await client.query(`
    CREATE TABLE films (
    id bigserial NOT NULL,
    created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name_film text,
    description text,
    genres text,
    release text,
    rating integer,
    preview_video text,
    video text,
    actors text[],
    director text,
    movie_duration text,
    poster text,
    background_imag text,
    background_color text,
    promo_film boolean,
    id_user text,
    PRIMARY KEY (id)
    )
    `, (error) => {
    if(error && error.message === errorFilms) {
      logger.warn('Relation "films" already exists.');
      client.end();
      logger.info('Client has disconnected !!!');
    }

    if(error && error.message !== errorFilms) {
      throw new Error(`Error while executing request: ${error.message}`);
    }

    if(!error) {
      logger.info('Table created !!!');
      client.end();
      logger.info('Client has disconnected !!!');
    }
  });
}
