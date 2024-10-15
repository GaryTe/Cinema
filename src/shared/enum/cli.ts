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
