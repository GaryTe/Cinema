import {
  Command,
  Logger,
  Config,
  DatabaseClient,
  UserServiceInterface,
  UserRepositoryInterface,
  FilmServiceInterface,
  FilmRepositoryInterface,
  CommentRepositoryInterface
} from '../../shared/interface/index.js';
import { NameCommand } from '../../shared/enum/index.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import { mistake, info, createOffer, getMongoURI } from '../../shared/util/index.js';
import {UserService, UserRepository, UserModel} from '../../modules/user/index.js';
import {RestSchema, PinoLogger, RestConfig, MongoDatabaseClient} from '../../shared/libs/index.js';
import {GeneralData} from '../../shared/type/index.js';
import {FilmService, FilmRepository, FilmModel} from '../../modules/film/index.js';
import {CommentRepository, CommentModel} from '../../modules/comment/index.js';

export class ImportCommand implements Command {
  private userService: UserServiceInterface;
  private userRepository: UserRepositoryInterface;
  private logger: Logger;
  private config: Config<RestSchema>;
  private databaseClient: DatabaseClient;
  private filmService: FilmServiceInterface;
  private filmRepository: FilmRepositoryInterface;
  private commentRepository: CommentRepositoryInterface;

  constructor(){
    this.logger = new PinoLogger();
    this. config = new RestConfig(this.logger);
    this.userRepository = new UserRepository(UserModel, this.config);
    this.userService = new UserService(this.userRepository);
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.commentRepository = new CommentRepository(CommentModel);
    this.filmRepository = new FilmRepository(FilmModel);
    this.filmService = new FilmService(this.filmRepository, this.commentRepository);
  }

  public getName(): string {
    return NameCommand.Import;
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const data = createOffer(line);
    try{
      await this.saveOffer(data);
      resolve();
    }catch(error: unknown){
      console.log(mistake(error as Error));
    }
  }

  private onCompleteImport(count: number) {
    console.info(info(`${count} rows imported and converted to film object`));
  }

  private async saveOffer(data: GeneralData) {
    const {dataFilm, dataUser} = data;
    const _user = await this.userService.create({
      ...dataUser
    },
    this.config.get('SALT')
    );

    const _film = {
      ...dataFilm,
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
