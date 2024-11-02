import { DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import {FilmServiceInterface, FilmRepositoryInterface, CommentRepositoryInterface} from '../../shared/interface/index.js';
import {CreateFilmDto, FilmEntity, RedactionFilmDto} from './index.js';
import {Component} from '../../shared/enum/index.js';
import {countRating} from '../../shared/util/index.js';
import {_Film} from '../../shared/type/index.js';

@injectable()
export class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.FilmRepository) private readonly repository: FilmRepositoryInterface,
    @inject(Component.CommentRepository) private readonly commentRepository: CommentRepositoryInterface
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const film = await this.repository.create(dto);
    return film;
  }

  public async editing(dto:RedactionFilmDto, idFilm: string): Promise<_Film> {
    const commentsList = await this.commentRepository.getAllComments(idFilm, 0);
    const film = await this.repository.editing(dto, idFilm);

    const _film = {
      ...film.toObject(),
      id: film.id,
      rating: countRating(commentsList),
      numberComments: commentsList.length
    };

    return _film;
  }

  public async delet(idFilm: string): Promise<DocumentType<FilmEntity>> {
    await this.commentRepository.delet(idFilm);
    const film = await this.repository.delet(idFilm);
    return film;
  }

  public async getAllFilms(limit: number): Promise<_Film[] | []> {
    const _filmsList = [];

    const filmsList = await this.repository.getAllFilms(limit);
    if(filmsList.length > 0) {
      for await (const film of filmsList) {
        const commentsList = await this.commentRepository.getAllComments(film.id, 0);
        if(commentsList.length > 0) {
          _filmsList.push({
            ...film.toObject(),
            id: film.id,
            numberComments: commentsList.length
          });
        }else{
          _filmsList.push({...film.toObject(), id: film.id});
        }
      }
    }

    return _filmsList;
  }

  public async getAllFilmsOfGenre(limit: number, genre: string): Promise<_Film[] | []> {
    const _filmsList = [];

    const filmsList = await this.repository.getAllFilmsOfGenre(limit, genre);
    if(filmsList.length > 0) {
      for await (const film of filmsList) {
        const commentsList = await this.commentRepository.getAllComments(film.id, 0);
        if(commentsList.length > 0) {
          _filmsList.push({
            ...film.toObject(),
            id: film.id,
            numberComments: commentsList.length
          });
        }else{
          _filmsList.push({...film.toObject(), id: film.id});
        }
      }
    }

    return _filmsList;
  }

  public async show(idFilm: string): Promise<_Film> {
    const commentsList = await this.commentRepository.getAllComments(idFilm, 0);
    const film = await this.repository.show(idFilm);

    const _film = {
      ...film.toObject(),
      id: film.id,
      rating: countRating(commentsList),
      numberComments: commentsList.length
    };

    return _film;
  }

  public async showPromoFilm(): Promise<_Film | null> {
    const film = await this.repository.showPromoFilm();

    if(!film) {
      return film;
    }

    const commentsList = await this.commentRepository.getAllComments(film.id, 0);

    const _film = {
      ...film.toObject(),
      id: film.id,
      numberComments: commentsList.length
    };

    return _film;
  }
}
