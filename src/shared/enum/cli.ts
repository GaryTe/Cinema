export enum Genres {
  Comedy = 'comedy',
  Crime = 'crime',
  Documentary = 'documentary',
  Drama = 'drama',
  Horror = 'horror',
  Family = 'family',
  Romance = 'romance',
  Scifi = 'scifi',
  Thriller = 'thriller'
}

export enum NameCommand {
  Help = '--help',
  Version = '--version',
  Import = '--import',
  Generate = '--generate'
}

export const NamesCities = {
  Paris: 'Paris',
  Cologne: 'Cologne',
  Brussels: 'Brussels',
  Amsterdam: 'Amsterdam',
  Hamburg: 'Hamburg',
  Dusseldorf: 'Dusseldorf'
} as const;

export const ComponentForCLI = {
  RestApplication: Symbol.for('RestApplication'),
  RestConfig: Symbol.for('RestConfig'),
  PinoLogger: Symbol.for('PinoLogger'),
  MongoDatabaseClient: Symbol.for('MongoDatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  UserModel: Symbol.for('UserModel')
} as const;
