import { inject, injectable } from 'inversify';
import pg from 'pg';

import {FilmRepositoryInterface, Config} from '../../shared/interface/index.js';
import {Component} from '../../shared/enum/index.js';
import {CreateFilmDto, RedactionFilmDto} from './index.js';
import {RestSchema} from '../../shared/libs/index.js';
import {_Film} from '../../shared/type/index.js';
import {filmKey, FilmKeys} from '../../shared/dictionary/index.js';

let client: pg.Pool;

@injectable()
export class FilmRepository implements FilmRepositoryInterface {
  constructor(
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {
    const { Pool } = pg;
    client = new Pool({
      user: this.config.get('POSTGRES_USER'),
      password: this.config.get('POSTGRES_PASSWORD'),
      host: this.config.get('HOST'),
      port: this.config.get('POSTGRES_PORT'),
      database: this.config.get('POSTGRES_DB'),
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 2000
    });
  }

  public async create(dto: CreateFilmDto): Promise<_Film> {
    const actorsList = dto.actors.join(',');

    const dataFilm = await client.query(`
      INSERT INTO films
      VALUES (
      DEFAULT, DEFAULT, $1, $2, $3, $4, 0, $5, $6, ARRAY[$7], $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *
      `,
    [
      dto.nameFilm,
      dto.description,
      dto.genres,
      dto.release,
      dto.previewVideo,
      dto.video,
      actorsList,
      dto.director,
      dto.movieDuration,
      dto.poster,
      dto.backgroundImag,
      dto.backgroundColor,
      dto.promoFilm ? 'TRUE' : 'FALSE',
      dto.idUser
    ]
    );

    return dataFilm.rows.find((item: _Film) => item);
  }

  public async editing(dto: RedactionFilmDto, idFilm: string): Promise<_Film> {
    const dataSet = Object.entries(dto).map((item) => {
      const key = item[0] as FilmKeys;
      const value = item[1];
      if(!Array.isArray(value)) {
        return `${filmKey[key]} = '${value}'`;
      }
      return `${filmKey[key]} = ARRAY['${value}']`;
    }).join(',');

    const dataFilm = await client.query(`
      WITH dataComments AS (
      SELECT
      array_agg(comments.rating) AS rating,
      COUNT(comments.id_film) AS count_comments
      FROM comments
      WHERE comments.id_film = $1
      )
      UPDATE films
      SET ${dataSet}
      FROM dataComments
      WHERE films.id = $1
      RETURNING
      *,
      dataComments.rating,
      dataComments.count_comments
      `,
    [Number(idFilm)]
    );

    return dataFilm.rows.find((item: _Film) => item);
  }

  public async delet(idFilm: string): Promise<number> {

    const dataFilm = await client.query(`
    WITH dataComments AS (
      DELETE FROM comments
      WHERE comments.id_film = $1
      )
      DELETE FROM films
      WHERE films.id = $1
      `,
    [Number(idFilm)]
    );

    return dataFilm.rowCount as number;
  }

  public async getAllFilms(count: number): Promise<_Film[] | []> {
    const filmsList = await client.query(`
      SELECT
      films.id,
      films.name_film,
      films.created_at,
      films.genres,
      films.preview_video,
      films.poster,
      films.promo_film,
      films.id_user,
      COUNT(comments.id_film) AS count_comments
      FROM films
      LEFT JOIN comments
      ON films.id = comments.id_film
      GROUP BY ALL((films.id))
      ORDER BY created_at DESC
      LIMIT $1
      `, [count]);

    return filmsList.rows;
  }


  public async getAllFilmsOfGenre(count: number, genre: string): Promise<_Film[] | []> {
    const filmsList = await client.query(`
      SELECT
      films.id,
      films.name_film,
      films.created_at,
      films.genres,
      films.preview_video,
      films.poster,
      films.promo_film,
      films.id_user,
      COUNT(comments.id_film) AS count_comments
      FROM films
      LEFT JOIN comments
      ON films.id = comments.id_film
      GROUP BY ALL((films.id))
      HAVING genres = $1
      ORDER BY created_at DESC
      LIMIT $2
      `, [genre, count]);

    return filmsList.rows;
  }

  public async show(idFilm: string): Promise<_Film> {
    const dataFilm = await client.query(`
      SELECT
      films.id,
      films.name_film,
      films.description,
      films.genres,
      films.release,
      films.preview_video,
      films.video,
      films.actors,
      films.director,
      films.movie_duration,
      films.poster,
      films.background_imag,
      films.background_color,
      films.created_at,
      films.promo_film,
      films.id_user,
      array_agg(comments.rating) AS rating,
      COUNT(comments.id_film) AS count_comments
      FROM films
      LEFT JOIN comments
      ON comments.id_film = $1
      GROUP BY ALL((films.id))
      HAVING films.id = $1
    `, [Number(idFilm)]);

    return dataFilm.rows.find((item: _Film) => item);
  }

  public async showPromoFilm(): Promise<_Film | undefined> {
    const dataFilm = await client.query(`WITH idFilmsList AS (
      SELECT
            array_agg(films.id) AS idList,
          TRUNC(RANDOM() * COUNT(films.id) + 1) AS namber
          FROM films
          WHERE films.promo_film = true
      ), idFilm AS (
      SELECT
            idFilmsList.idList[idFilmsList.namber] AS namberIdFilm
          FROM idFilmsList
      )

      SELECT
            films.id,
            films.name_film,
            films.created_at,
            films.genres,
            films.preview_video,
            films.poster,
            films.promo_film,
            films.id_user,
            COUNT(comments.id_film) AS count_comments
            FROM films
            LEFT JOIN comments
            ON films.id = comments.id_film
            GROUP BY ALL((films.id))
            HAVING films.id = (SELECT namberIdFilm FROM idFilm)
            `);

    return dataFilm.rows.find((item: _Film) => item);
  }
}
