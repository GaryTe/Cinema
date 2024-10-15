import chalk from 'chalk';

export const info = (message: string) => chalk.green(message);

export const mistake = (message: string) => chalk.red(message);
