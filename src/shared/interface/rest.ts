import { DocumentType } from '@typegoose/typegoose';
import { UserEntity, CreateUserDto } from '../../modules/user/index.js';
import { FilmEntity, CreateFilmDto } from '../../modules/film/index.js';

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
}

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | void>;
}

export interface FilmRepositoryInterface {
  create(user: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
}
