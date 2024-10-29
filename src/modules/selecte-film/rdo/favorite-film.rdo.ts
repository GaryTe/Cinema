import {Expose, Type} from 'class-transformer';

import {Genres} from '../../../shared/enum/index.js';
import {UserRto} from '../../user/index.js';

export class FavoriteFilmRdo {
  @Expose()
  public id: string;

  @Expose()
  public nameFilm: string;

  @Expose({name: 'createdAt'})
  public datePublication: string;

  @Expose()
  public genres: Genres;

  @Expose()
  public previewVideo: string;

  @Expose()
  public numberComments: number;

  @Expose()
  @Type(() => UserRto)
  public user: UserRto;

  @Expose()
  public poster: string;

  @Expose()
  public promoFilm: boolean;
}
