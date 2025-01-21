import {Expose, Type} from 'class-transformer';

import {UserRto} from '../../user/index.js';

export class CommentRto {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({name: 'created_at'})
  public dataPublication: Date;

  @Expose()
  @Type(() => UserRto)
  public user: UserRto;
}
