import * as crypto from 'node:crypto';

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
