import {Expose} from 'class-transformer';

export class UserRto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar?: string | null;
}
