import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../author/entities/author.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Book } from './entities/book.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const author = await this.authorRepository.findOneBy({
      id: createBookDto.authorId,
    });

    if (!author) {
      throw new NotFoundException('O autor informado não existe.');
    }

    const category = await this.categoryRepository.findOneBy({
      id: createBookDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('A categoria informada não existe.');
    }

    let book = this.bookRepository.create({
      ...createBookDto,
      author,
      category,
    });

    book = await this.bookRepository.save(book);

    return book;
  }

  async findById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    return book ?? new NotFoundException('Livro não encontrado.');
  }

  async findAll(query: PaginateQuery) {
    const result = await paginate(query, this.bookRepository, {
      sortableColumns: [
        'author',
        'category',
        'title',
        'price',
        'pages',
        'releaseDate',
        'createdAt',
        'updatedAt',
      ],
      defaultLimit: 10,
      maxLimit: 50,
      searchableColumns: [
        'author',
        'category',
        'title',
        'price',
        'pages',
        'releaseDate',
      ],
    });

    if (result.data.length === 0) {
      this.logger.warn('Nenhum autor encontrado.');
      throw new NotFoundException('Nenhum autor encontrado.');
    }
    return result;
  }
}
