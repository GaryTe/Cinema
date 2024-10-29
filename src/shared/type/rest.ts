import {Ref} from '@typegoose/typegoose';

import {Genres} from '../enum/index.js';
import {UserEntity} from '../../modules/user/index.js';

export type Comment = {
  text: string;
  rating: number;
};

export type RequestBody = Record<string, unknown>;

export type RequestParams = Record<string, unknown>;

export type Detail ={
  where: string;
  line: string;
}

export type _Film = {
  nameFilm: string;
  description: string;
  genres: Genres;
  release: string;
  rating: number;
  previewVideo: string;
  video: string;
  actors: string[];
  director: string;
  movieDuration: string;
  numberComments: number;
  user: Ref<UserEntity>;
  poster: string;
  backgroundImag: string;
  backgroundColor: string;
}
