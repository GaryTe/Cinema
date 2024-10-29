import {Genres} from '../../../shared/enum/index.js';
import {User} from '../../../shared/type/index.js';

export class CreateFilmDto {
  public nameFilm: string;
  public description: string;
  public genres: Genres;
  public release: string;
  public previewVideo: string;
  public video: string;
  public actors: string[];
  public director: string;
  public movieDuration: string;
  public user: User;
  public poster: string;
  public backgroundImag: string;
  public backgroundColor: string;
  public promoFilm?: boolean;
}
