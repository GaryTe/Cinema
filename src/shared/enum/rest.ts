export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  RestConfig: Symbol.for('RestConfig'),
  PinoLogger: Symbol.for('PinoLogger'),
  MongoDatabaseClient: Symbol.for('MongoDatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  UserModel: Symbol.for('UserModel'),
  FilmService: Symbol.for('FilmService'),
  FilmRepository: Symbol.for('FilmRepository'),
  FilmModel: Symbol.for('FilmModel')
} as const;
