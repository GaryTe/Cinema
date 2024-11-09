import * as crypto from 'node:crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {DocumentType} from '@typegoose/typegoose';
import {ValidatorConstraint, ValidatorConstraintInterface, ValidationError} from 'class-validator';

import {ValidationErrorField} from '../type/index.js';
import {CommentEntity} from '../../modules/comment/comment.entity.js';
import {TAPY_FORMAT, ALL_FORMAT, REGULAR_DATE_VALUE} from '../const/index.js';
import {ApplicationError} from '../enum/index.js';

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

@ValidatorConstraint({ name: 'release', async: false })
export class ValidationDateRelease implements ValidatorConstraintInterface {
  validate(date: string) {
    return REGULAR_DATE_VALUE.test(date);
  }
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
