import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpCode,
  Get,
} from '@nestjs/common';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { AuthorService } from './author.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const newAuthor = await this.authorService.create(createAuthorDto);

    if (newAuthor) {
      return newAuthor;
    }

    throw new InternalServerErrorException('Não foi possível gravar o autor');
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.authorService.findAll(query);
  }
}
