import { OfferGenerator } from '../../shared/interface/index.js';
import { MockServerData } from '../../shared/type/index.js';
import { getRandomIntInclusive, getElementsList } from '../util/index.js';
import { number } from '../dictionary/index.js';


export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const nameFilm = this.mockData.nameFilm[getRandomIntInclusive(number.zero, this.mockData.nameFilm.length - 1)];
    const description = this.mockData.description[getRandomIntInclusive(number.zero, this.mockData.description.length - 1)];
    const dataPublication = new Date(number.year, getRandomIntInclusive(number.one, number.twelf), getRandomIntInclusive(number.one, number.thirty)).toISOString();
    const genres = this.mockData.genres[getRandomIntInclusive(number.zero, this.mockData.genres.length - 1)];
    const release = new Date(number.year, getRandomIntInclusive(number.one, number.twelf), getRandomIntInclusive(number.one, number.thirty)).toISOString();
    const rating = getRandomIntInclusive(number.zero, number.five);
    const previewVideo = this.mockData.previewVideo[getRandomIntInclusive(number.zero, this.mockData.previewVideo.length - 1)];
    const video = this.mockData.video[getRandomIntInclusive(number.zero, this.mockData.video.length - 1)];
    const actors = getElementsList(this.mockData.actors);
    const director = this.mockData.actors[getRandomIntInclusive(number.zero, this.mockData.actors.length - 1)];
    const movieDuration = `${getRandomIntInclusive(number.twelf, number.thirty)}мин`;
    const numberComments = getRandomIntInclusive(number.one, number.thirty);
    const name = this.mockData.actors[getRandomIntInclusive(number.zero, this.mockData.actors.length - 1)];
    const email = this.mockData.emails[getRandomIntInclusive(number.one, this.mockData.emails.length - 1)];
    const avatar = this.mockData.avatars[getRandomIntInclusive(number.zero, this.mockData.avatars.length - 1)];
    const password = getRandomIntInclusive(number.thirty, number.year);
    const poster = this.mockData.poster[getRandomIntInclusive(number.zero, this.mockData.poster.length - 1)];
    const backgroundImag = this.mockData.poster[getRandomIntInclusive(number.zero, this.mockData.poster.length - 1)];
    const backgroundColor = this.mockData.backgroundColor[getRandomIntInclusive(number.zero, this.mockData.backgroundColor.length - 1)];

    const string = [
      nameFilm, description, dataPublication, genres, release,
      rating, previewVideo, video, actors, director,
      movieDuration, numberComments, name, email, avatar,
      password, poster, backgroundImag, backgroundColor
    ].join('\t');

    return `${string}\n`;
  }
}
