import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The list of all categories.',
    type: Category,
    isArray: true,
  })
  async findAll(@Paginate() query: PaginateQuery) {
    return this.categoryService.findAll(query);
  }
}
