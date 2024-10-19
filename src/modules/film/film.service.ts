import { DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import {FilmServiceInterface, Logger, FilmRepositoryInterface} from '../../shared/interface/index.js';
import {CreateFilmDto, FilmEntity} from './index.js';
import {Component} from '../../shared/enum/index.js';
import {mistake} from '../../shared/util/index.js';

@injectable()
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.FilmRepository) private readonly repository: FilmRepositoryInterface,
    @inject(Component.PinoLogger) private readonly logger: Logger,
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | void> {
    try{
      const film = await this.repository.create(dto);
      this.logger.info(`New film created: ${film.nameFilm}`);
      return film;
    }catch(error: unknown){
      console.log(mistake(error as Error));
    }
  }
}
