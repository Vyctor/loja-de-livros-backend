import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class AuthorService {
  private readonly logger = new Logger(AuthorService.name);

  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const alreadyExists = await this.authorRepository.findOneBy({
      email: createAuthorDto.email,
    });
    if (alreadyExists) {
      this.logger.error(
        `Já existe um autor com o e-mail ${createAuthorDto.email} cadastrado no sistema.`,
      );
      throw new ForbiddenException('Não foi possível cadastrar o autor');
    }
    const author = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(author);
  }

  async findAll(query: PaginateQuery) {
    const result = await paginate(query, this.authorRepository, {
      sortableColumns: ['name', 'email', 'createdAt'],
      defaultLimit: 10,
      maxLimit: 50,
      searchableColumns: ['name', 'email'],
    });

    if (result.data.length === 0) {
      this.logger.warn('Nenhum autor encontrado.');
      throw new NotFoundException('Nenhum autor encontrado.');
    }
    return result;
  }
}
