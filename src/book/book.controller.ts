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

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  async findByID(@Param('id', new ParseIntPipe()) id: number) {
    return this.bookService.findById(id);
  }
}
