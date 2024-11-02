export const ErrorFilm = {
  nameFilmIsString: 'nameFilm field is not valid. Field nameFilm line.',
  nameFilmLength: 'nameFilm field is not valid. Min length 2, max length 100.',
  descriptionIsString: 'description field is not valid. Field description line.',
  descriptionLength: 'description field is not valid. Min length 20, max length 1024.',
  genres: 'The genres field can be the following of the values: omedy, crime, documentary, drama, horror, family, romance, scifi, thriller.',
  releaseIsString: 'release field is not valid. Field release line.',
  previewVideoIsString: 'previewVideo field is not valid. Field previewVideo line.',
  videoIsString: 'video field is not valid. Field video line.',
  actorsIsArray: 'actors field is not valid. Field actors array.',
  actorsIsString: 'actors field is not valid. The actors field value is strings.',
  directorIsString: 'director field is not valid. Field director line.',
  directorLength: 'director field is not valid. Min length 2, max length 50.',
  movieDurationIsString: ' movieDuration field is not valid. Field  movieDuration line.',
  userIsString: 'user field is not valid. Field user line.',
  posterIsString: 'poster field is not valid. Field poster line.',
  poster: 'poster field is not valid. The poster in jpg',
  backgroundImagIsString: 'backgroundImag field is not valid. Field backgroundImag line.',
  backgroundImag: 'backgroundImag field is not valid. The backgroundImag in jpg',
  backgroundColorIsString: 'backgroundColor field is not valid. Field backgroundColor line.',
  promoFilmIsBoolean: 'promoFilm field is not valid. Field promoFilm is boolean.'
} as const;
