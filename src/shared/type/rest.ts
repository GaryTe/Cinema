import {Ref} from '@typegoose/typegoose';
import { ParamsDictionary } from 'express-serve-static-core';

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
  id: number;
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
  id_user: string;
}

export type ParamsFilmId ={
  idFilm: string;
} | ParamsDictionary

export type RequestQuery = {
  limit?: string;
  genre?: string;
}

export type AccessAndRefreshToken = {
  accessToken: string;
  refreshToken: string;
}

export type TokenPayload = {
  avatar: string;
  email: string;
  name: string;
  id: string;
  refreshToken?: string
};

export type ValidationErrorField = {
  property: string;
  value: string;
  messages: string[];
};

export type Settings = {
  exchange?: string;
  type?: string;
  queue?: string;
  confirm?: boolean;
  maxAttempts?: number;
  timeout?: number;
  consumerTag?: string;
  durable?: boolean;
  routingKey?: string;
}

export type MSG = {
  idFilm: string;
  limit: number;
  delet: boolean;
}

export type DataComment = {
  id_user: string;
  text: string;
  rating: string;
  id_film: string;
}
