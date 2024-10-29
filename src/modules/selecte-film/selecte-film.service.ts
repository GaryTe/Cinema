import { inject, injectable } from 'inversify';

import {
  SelecteFilmServiceInterface,
  SelecteFilmRepositoryInterface,
  FilmServiceInterface
} from '../../shared/interface/index.js';
import {ValueFavoriteFilm} from './index.js';
import {Component} from '../../shared/enum/index.js';
import {_Film} from '../../shared/type/index.js';

@injectable()
export class SelecteFilmService implements SelecteFilmServiceInterface {
  constructor(
    @inject(Component.SelecteFilmRepository) private readonly repository: SelecteFilmRepositoryInterface,
    @inject(Component.FilmService) private readonly filmService: FilmServiceInterface
  ) {}

  public async create(data: ValueFavoriteFilm): Promise<_Film> {
    const favoriteFilm = await this.repository.create(data);
    const film = await this.filmService.show(favoriteFilm.idFilm);
    return film;
  }

  public async delet(data: ValueFavoriteFilm): Promise<_Film> {
    const favoriteFilm = await this.repository.delet(data);
    const film = await this.filmService.show(favoriteFilm.idFilm);
    return film;
  }

  public async getAllFilms(data: ValueFavoriteFilm): Promise<_Film[] | []> {
    const favoriteFilmsList = await this.repository.getAllFilms(data);
    const _filmsList = [];

    if(favoriteFilmsList.length > 0) {
      for await(const film of favoriteFilmsList) {
        const _film = await this.filmService.show(film.idFilm);
        _filmsList.push(_film);
      }
    }
    return _filmsList;
  }
}
