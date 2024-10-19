import {
  Command,
  Logger,
  Config,
  DatabaseClient,
  UserServiceInterface,
  UserRepositoryInterface,
  FilmServiceInterface,
  FilmRepositoryInterface
} from '../../shared/interface/index.js';
import { NameCommand } from '../../shared/enum/index.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import { mistake, info, createOffer, getMongoURI } from '../../shared/util/index.js';
import {UserService, UserRepository, UserModel} from '../../modules/user/index.js';
import {RestSchema, PinoLogger, RestConfig, MongoDatabaseClient} from '../../shared/libs/index.js';
import {Film} from '../../shared/type/index.js';
import {FilmService, FilmRepository, FilmModel} from '../../modules/film/index.js';


export class ImportCommand implements Command {
  private userService: UserServiceInterface;
  private userRepository: UserRepositoryInterface;
  private logger: Logger;
  private config: Config<RestSchema>;
  private databaseClient: DatabaseClient;
  private filmService: FilmServiceInterface;
  private filmRepository: FilmRepositoryInterface;

  constructor(){
    this.logger = new PinoLogger();
    this.userRepository = new UserRepository(UserModel);
    this.userService = new UserService(this.userRepository, this.logger);
    this. config = new RestConfig(this.logger);
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.filmRepository = new FilmRepository(FilmModel);
    this.filmService = new FilmService(this.filmRepository, this.logger);
  }

  public getName(): string {
    return NameCommand.Import;
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const film = createOffer(line);
    try{
      await this.saveOffer(film);
      resolve();
    }catch(error: unknown){
      console.log(mistake(error as Error));
    }
  }

  private onCompleteImport(count: number) {
    console.info(info(`${count} rows imported and converted to film object`));
  }

  private async saveOffer(film: Film) {
    const {user} = film;
    const _user = await this.userService.create({
      ...user
    },
    this.config.get('SALT')
    );

    const _film = {
      ...film,
      user: _user.id
    };

    await this.filmService.create(_film);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const uri = getMongoURI(
      this.config.get('MONGO_USER'),
      this.config.get('MONGO_PASSWORD'),
      this.config.get('MONGO_DB_HOST'),
      this.config.get('MONGO_PORT')
    );

    await this.databaseClient.connect(uri);

    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename);

    fileReader.on('line', this.onImportedLine.bind(this));
    fileReader.on('end', this.onCompleteImport);

    try{
      await fileReader.read();
    }catch(error){
      console.error(mistake(`
        where: src/cli/commands/tsv-file-reader.ts
        mistake: Could not read the full contents of the file in memory.
        line: 73
      `));
    }
  }
}
