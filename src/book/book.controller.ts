import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The list of all books',
  })
  async findAll(@Paginate() query: PaginateQuery) {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully found.',
  })
  async findByID(@Param('id', new ParseIntPipe()) id: number) {
    return this.bookService.findById(id);
  }
}
