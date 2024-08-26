import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const alreadyExists = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });

    if (!alreadyExists) {
      return await this.categoryRepository.save(createCategoryDto);
    }

    this.logger.error(
      `A categoria com o nome ${createCategoryDto.name} já existe`,
    );
    throw new ForbiddenException(
      `A categoria com o nome ${createCategoryDto.name} já existe`,
    );
  }

  async findAll(query: PaginateQuery) {
    const result = await paginate(query, this.categoryRepository, {
      sortableColumns: ['name', 'createdAt'],
      defaultLimit: 10,
      maxLimit: 50,
      searchableColumns: ['name'],
    });
    if (result.data.length === 0) {
      this.logger.warn('Nenhuma categoria encontrada.');
      throw new NotFoundException('Nenhuma categoria encontrada.');
    }
    return result;
  }
}
