import { Command } from '../../shared/interface/index.js';
import { info } from '../../shared/util/index.js';
import { NameCommand } from '../../shared/enum/index.js';

export class HelpCommand implements Command {
  public getName(): string {
    return NameCommand.Help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(info(`
        Программа для подготовки данных для REST API сервера.

        Запуск CLI без аргументов приводит к исполнению команды --help.!!!

        Команда: --help # печатает этот текст
        Пример ввода команды:  npm run ts ./src/main.cli.ts -- --help

        Команда: --version # выводит номер версии программы "WHAT-TO-WATCH"
        Пример ввода команды:  npm run ts ./src/main.cli.ts -- --version

        Команда: --import <filepath> # импортирует данные из файла в формате TSV в базу данных. Путь к файлу из которого беруться данные указываются в filepath.
        Пример ввода команды:  npm run ts ./src/main.cli.ts -- --import .mocks/mock-data.tsv

        Команда: --generate <n> <filepath> <url> # Создаёт файл в формате tsv с тестовыми данными. Параметр n задаёт количество генерируемых карточек для фильмов. Параметр filepath указывает путь для сохранения файла с описанием карточек фильмов. Параметр <url> задаёт адрес сервера, с которого необходимо взять данные. Каждая строка в файле tsv содержит всю необходимую информацию для создания карточки фильма и пользователя. Информация о фильме включает сведения о пользователе. Список полей для карточки фильма и пользователя представлен в разделе с описанием сущностей.
        Пример ввода команды:  npm run ts ./src/main.cli.ts -- --generate 2 .mocks/mock-data.tsv http://localhost:3000/api
    `));
  }
}
