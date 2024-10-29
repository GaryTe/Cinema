import * as crypto from 'node:crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {DocumentType} from '@typegoose/typegoose';

import {CommentEntity} from '../../modules/comment/comment.entity.js';

export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string
): string {
  return `mongodb://${username}:${password}@${host}:${port}/`;
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export const countRating = (commentsList: DocumentType<CommentEntity>[] | []) => {
  let count = 0;

  if(commentsList.length > 0) {
    commentsList.forEach((comment: DocumentType<CommentEntity>) => {
      count += comment.rating;
    });
  }
  return count;
};
