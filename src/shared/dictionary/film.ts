export const filmKey = {
  nameFilm: 'name_film',
  description:'description',
  genres: 'genres',
  release: 'release',
  video: 'video',
  actors: 'actors',
  director: 'director',
  poster: 'poster',
  previewVideo: 'preview_video',
  movieDuration: 'movie_duration',
  backgroundImag: 'background_imag',
  datePublication: 'background_color',
  backgroundColor: 'background_color',
  promoFilm: 'promo_film',
} as const;

export type FilmKeys = 'nameFilm' | 'description' | 'genres' | 'release' | 'video' | 'actors' | 'director' | 'poster' | 'previewVideo' | 'movieDuration' | 'backgroundImag' | 'datePublication' | 'backgroundColor' | 'promoFilm'
