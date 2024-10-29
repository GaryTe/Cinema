import {Expose, Type} from 'class-transformer';

import {UserRto} from '../../user/index.js';

export class CommentRto {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({name: 'createdAt'})
  public dataPublication: Date;

  @Expose({name: 'idUser'})
  @Type(() => UserRto)
  public user: UserRto;
}
