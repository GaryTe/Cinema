import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import {FilmRepositoryInterface} from '../../shared/interface/index.js';
import {Component} from '../../shared/enum/index.js';
import {FilmEntity, CreateFilmDto} from './index.js';

@injectable()
export class FilmRepository implements FilmRepositoryInterface {
  constructor(
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    return (await this.filmModel.create(dto)).populate('user');
  }
}
