import { PackageJSONConfig } from '../type/index.js';
import { number } from '../dictionary/index.js';
import { Genres } from '../enum/index.js';
import { GeneralData } from '../type/cli.js';
import dayjs from 'dayjs';

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

export const createOffer = (line: string): GeneralData => {

  const[
    nameFilm,
    description,
    genres,
    release,
    rating,
    previewVideo,
    video,
    actors,
    director,
    movieDuration,
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
    dataFilm:{
      nameFilm,
      description,
      genres: genresList,
      release: dayjs(release).format(),
      rating: Number.parseInt(rating, 10),
      previewVideo,
      video,
      actors: actors.split(','),
      director,
      movieDuration,
      poster,
      backgroundImag,
      backgroundColor
    },
    dataUser: user
  };
};
