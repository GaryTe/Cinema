import { DocumentType } from '@typegoose/typegoose';
import { Response, Router, Request, NextFunction } from 'express';

import { UserEntity, CreateUserDto, LoginUserDto } from '../../modules/user/index.js';
import { FilmEntity, CreateFilmDto, RedactionFilmDto } from '../../modules/film/index.js';
import {_Film, AccessAndRefreshToken, TokenPayload} from '../type/index.js';
import {SelecteFilmEntity, ValueFavoriteFilmDto} from '../../modules/selecte-film/index.js';
import {CreateCommentDto, CommentEntity} from '../../modules/comment/index.js';
import {HttpMethod} from '../enum/index.js';
import {RefreshTokenEntity} from '../../modules/refresh-token/index.js';

export interface Logger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, error: Error, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

export interface Config<U> {
  get<T extends keyof U>(key: T): U[T];
}

export interface DatabaseClient {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
}

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}

export interface UserRepositoryInterface {
  create(user: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(user: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  exists(idUser: string): Promise<boolean>;
}

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  editing(dto: RedactionFilmDto, idFilm: string): Promise<_Film>;
  delet(idFilm: string): Promise<DocumentType<FilmEntity>>;
  getAllFilms(count: number): Promise<_Film[] | []>;
  getAllFilmsOfGenre(count: number, genre: string): Promise<_Film[] | []>;
  show(idFilm: string): Promise<_Film>;
  showPromoFilm(): Promise<_Film | null>;
}

export interface FilmRepositoryInterface {
  create(user: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  editing(dto: RedactionFilmDto, idFilm: string): Promise<DocumentType<FilmEntity>>;
  delet(idFilm: string): Promise<DocumentType<FilmEntity>>;
  getAllFilms(count: number): Promise<DocumentType<FilmEntity>[] | []>;
  getAllFilmsOfGenre(count: number, genre: string): Promise<DocumentType<FilmEntity>[] | []>;
  show(idFilm: string): Promise<DocumentType<FilmEntity>>;
  showPromoFilm(): Promise<DocumentType<FilmEntity> | null>;
  exists(idFilm: string): Promise<boolean>;
}

export interface SelecteFilmServiceInterface {
  create(data: ValueFavoriteFilmDto): Promise<_Film>;
  delet(data: ValueFavoriteFilmDto): Promise<_Film>;
  getAllFilms(data: ValueFavoriteFilmDto): Promise<_Film[] | []>;
}

export interface SelecteFilmRepositoryInterface {
  create(data: ValueFavoriteFilmDto): Promise<DocumentType<SelecteFilmEntity>>;
  delet(data: ValueFavoriteFilmDto): Promise<DocumentType<SelecteFilmEntity>>;
  getAllFilms(data: ValueFavoriteFilmDto): Promise<DocumentType<SelecteFilmEntity>[] | []>;
}

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  getAllComments(idFilm: string): Promise<DocumentType<CommentEntity>[] | []>;
}

export interface CommentRepositoryInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  getAllComments(idFilm: string, value?: number): Promise<DocumentType<CommentEntity>[] | []>;
  delet(idFilm: string): Promise<void>;
}

export interface Middleware {
  execute(req: Request, res: Response, next: NextFunction): void;
}

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}

export interface Controller {
  readonly router: Router;
  addRoute(route: Route): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  ok<T>(res: Response, data?: T): void;
  created<T>(res: Response, data: T): void;
}

export interface ExceptionFilter {
  catch(error: Error, req: Request, res: Response, next:NextFunction): void;
}

export interface DocumentExists {
  exists(documentId: string): Promise<boolean>;
}

export interface Authentication {
  authenticate(user: UserEntity): Promise<AccessAndRefreshToken>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}

export interface RefreshTokenRepositoryInterface {
  create(data: {refreshToken: string, idUser: string}): Promise<DocumentType<RefreshTokenEntity>>;
  delet(data: {refreshToken: string, idUser: string}): Promise<void>;
  find(data: {refreshToken: string, idUser: string}): Promise<DocumentType<RefreshTokenEntity>>;
}

export interface RefreshTokenServiceInterface {
  editing(data: TokenPayload): Promise<{
    accessToken: string,
    refreshToken: string
  }>
}
