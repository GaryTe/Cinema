import * as crypto from 'node:crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {DocumentType} from '@typegoose/typegoose';
import {ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

import {CommentEntity} from '../../modules/comment/comment.entity.js';
import {TAPY_FORMAT, ALL_FORMAT} from '../const/index.js';

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

@ValidatorConstraint({ name: 'avatar', async: false })
export class ValidationFormatAvatar implements ValidatorConstraintInterface {
  validate(avatar: string) {
    let isValue = false;
    const valuesList = avatar.split('.');

    isValue = TAPY_FORMAT.includes(valuesList[valuesList.length - 1]);

    return isValue;
  }
}

@ValidatorConstraint({ name: 'poster', async: false })
export class ValidationFormat implements ValidatorConstraintInterface {
  validate(value: string) {
    let isValue = false;
    const valuesList = value.split('.');

    isValue = ALL_FORMAT.includes(valuesList[valuesList.length - 1]);

    return isValue;
  }
}

@ValidatorConstraint({ name: 'actors', async: false })
export class ValidationActors implements ValidatorConstraintInterface {
  validate(actors: string[]) {
    let isValue = false;

    actors.forEach((value) => {
      if(typeof value !== 'string') {
        isValue = false;
        return;
      }
      isValue = true;
    });

    return isValue;
  }
}
