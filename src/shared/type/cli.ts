import { Genres } from '../enum/index.js';
import { Command } from '../interface/index.js';

export type User = {
  name: string;
  email: string;
  avatar: string;
  password: string;
};

export type Film = {
  nameFilm: string;
  description: string;
  dataPublication: Date;
  genres: Genres;
  release: Date;
  rating: number;
  previewVideo: string;
  video: string;
  actors: string[];
  director: string;
  movieDuration: string;
  numberComments: number;
  user: User;
  poster: string;
  backgroundImag: string;
  backgroundColor: string;
};

export type Comment = {
  commentText: string;
  rating: number;
  dataPublication: string;
  authorComment: User;
};

export type MockServerData = {
  nameFilm: string[];
  description: string[];
  genres: string[];
  previewVideo: string[];
  video: string[];
  actors: string[];
  poster: string[];
  backgroundColor: string[];
  emails: string[];
  avatars: string[];
};

export type PackageJSONConfig = {
  version: string;
};

export type CommandCollection = Record<string, Command>;

export type ParsedCommand = Record<string, string[]>;
