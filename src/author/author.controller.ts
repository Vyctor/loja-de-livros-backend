import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { AuthorService } from './author.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Author } from './entities/author.entity';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiResponse({
    status: 201,
    description: 'Author created successfully',
    type: Author,
  })
  @Post()
  @HttpCode(201)
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Return all authors',
    type: Author,
    isArray: true,
  })
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.authorService.findAll(query);
  }
}
