import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import {StatusCodes} from 'http-status-codes';

import {SelecteFilmRepositoryInterface} from '../../shared/interface/index.js';
import {Component} from '../../shared/enum/index.js';
import {SelecteFilmEntity, ValueFavoriteFilmDto} from './index.js';
import {HttpError} from '../../shared/libs/index.js';

@injectable()
export class SelecteFilmRepository implements SelecteFilmRepositoryInterface {
  constructor(
    @inject(Component.SelecteFilmModel) private readonly selecteFilmModel: types.ModelType<SelecteFilmEntity>
  ) {}

  public async create(data: ValueFavoriteFilmDto): Promise<DocumentType<SelecteFilmEntity>> {
    return await this.selecteFilmModel.create(data);
  }

  public async delet({idFilm, idUser}: ValueFavoriteFilmDto): Promise<DocumentType<SelecteFilmEntity>> {
    const favoriteFilm = await this.selecteFilmModel.findOneAndDelete({idUser, idFilm});

    if(!favoriteFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Favorite film cannot be deleted from viewed, because it dose not exist',
        {
          where: 'selecte-film.repository.ts',
          line: '27'
        }
      );
    }

    return favoriteFilm;
  }

  public async getAllFilms({idUser}: ValueFavoriteFilmDto): Promise<DocumentType<SelecteFilmEntity>[] | []> {
    return await this.selecteFilmModel.find({idUser});
  }
}
