import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {StatusCodes} from 'http-status-codes';

import {FilmRepositoryInterface} from '../../shared/interface/index.js';
import {Component} from '../../shared/enum/index.js';
import {FilmEntity, CreateFilmDto, RedactionFilmDto} from './index.js';
import {SORT_DESCENDING} from '../../shared/const/index.js';
import {HttpError} from '../../shared/libs/index.js';

@injectable()
export class FilmRepository implements FilmRepositoryInterface {
  constructor(
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    return (await this.filmModel.create(dto)).populate('user');
  }

  public async editing(dto: RedactionFilmDto, idFilm: string): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel
      .findByIdAndUpdate(idFilm, dto, {new: true})
      .populate('user');

    if(!film) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film: ${idFilm} dose not exist`,
        {
          where: 'film.repository.ts',
          line: '27'
        }
      );
    }

    return film;
  }

  public async delet(idFilm: string): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel
      .findByIdAndDelete(idFilm)
      .populate('user');

    if(!film) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film: ${idFilm}, cannot be deleted because it dose not exist`,
        {
          where: 'film.repository.ts',
          line: '46'
        }
      );
    }

    return film;
  }

  public async getAllFilms(count: number): Promise<DocumentType<FilmEntity>[] | []> {
    return await this.filmModel
      .find({})
      .sort({createdAt: SORT_DESCENDING})
      .limit(count)
      .populate('user');
  }

  public async getAllFilmsOfGenre(count: number, genre: string): Promise<DocumentType<FilmEntity>[] | []> {
    return await this.filmModel
      .find({genres: genre})
      .sort({createdAt: SORT_DESCENDING})
      .limit(count)
      .populate('user');
  }

  public async show(idFilm: string): Promise<DocumentType<FilmEntity>> {
    const film = await this.filmModel
      .findOne({_id: idFilm})
      .populate('user');

    if(!film) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film: ${idFilm}, dose not exist`,
        {
          where: 'film.repository.ts',
          line: '81'
        }
      );
    }

    return film;
  }

  public async showPromoFilm(): Promise<DocumentType<FilmEntity> | null> {
    const film = await this.filmModel
      .findOne({promoFilm: true})
      .populate('user');

    return film;
  }
}
