import { PackageJSONConfig } from '../type/index.js';
import { number } from '../dictionary/index.js';
import { Genres } from '../enum/index.js';
import { Film } from '../type/cli.js';

export function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getElementsList = (actors: string[]) => {
  const value = getRandomIntInclusive(number.zero, actors.length - 1);
  const elementsList: string[] = [];
  let count = 0;

  while(value >= count) {
    elementsList.push(actors[count]);
    count += 1;
  }

  return elementsList;
};

export const createOffer = (line: string): Film => {

  const[
    nameFilm,
    description,
    dataPublication,
    genres,
    release,
    rating,
    previewVideo,
    video,
    actors,
    director,
    movieDuration,
    numberComments,
    name,
    email,
    avatar,
    password,
    poster,
    backgroundImag,
    backgroundColor
  ] = line.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatar,
    password
  };

  const genresList = genres as Genres;

  return{
    nameFilm,
    description,
    dataPublication: new Date(dataPublication),
    genres: genresList,
    release: new Date(release),
    rating: Number.parseInt(rating, 10),
    previewVideo,
    video,
    actors: actors.split(','),
    director,
    movieDuration,
    numberComments: Number.parseInt(numberComments, 10),
    user,
    poster,
    backgroundImag,
    backgroundColor
  };
};
