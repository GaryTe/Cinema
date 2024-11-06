import {Expose} from 'class-transformer';

export class AuthorizedUserRdo {
  @Expose()
    accessToken: string;

  @Expose()
    refreshToken: string;
}
