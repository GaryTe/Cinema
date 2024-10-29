export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  RestConfig: Symbol.for('RestConfig'),
  PinoLogger: Symbol.for('PinoLogger'),
  MongoDatabaseClient: Symbol.for('MongoDatabaseClient'),
  UserController: Symbol.for('UserController'),
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  UserModel: Symbol.for('UserModel'),
  FilmController: Symbol.for('FilmController'),
  FilmService: Symbol.for('FilmService'),
  FilmRepository: Symbol.for('FilmRepository'),
  FilmModel: Symbol.for('FilmModel'),
  SelecteFilmController: Symbol.for('SelecteFilmController'),
  SelecteFilmService: Symbol.for('SelecteFilmService'),
  SelecteFilmRepository: Symbol.for('SelecteFilmRepository'),
  SelecteFilmModel: Symbol.for('SelecteFilmModel'),
  CommentController: Symbol.for('CommentController'),
  CommentService: Symbol.for('CommentService'),
  CommentRepository: Symbol.for('CommentRepository'),
  CommentModel: Symbol.for('CommentModel'),
  ExceptionFilter: Symbol.for('ExceptionFilter')
} as const;

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
  Patch = 'patch',
  Put = 'put',
}
