import { IsDateString, IsNumber, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsString()
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Hobbit',
    type: String,
  })
  title: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'The synopsis of the book',
    example:
      'The Hobbit is a tale of high adventure, undertaken by a company of dwarves in search of dragon-guarded gold.',
    type: String,
  })
  synopsis: string;

  @IsString()
  @ApiProperty({
    description: 'The summary of the book',
    example:
      'The Hobbit is a tale of high adventure, undertaken by a company of dwarves in search of dragon-guarded gold.',
    type: String,
  })
  summary: string;

  @IsNumber()
  @Min(20)
  @ApiProperty({
    description: 'The price of the book',
    example: 20,
    type: Number,
  })
  price: number;

  @IsNumber()
  @Min(100)
  @ApiProperty({
    description: 'The number of pages of the book',
    example: 300,
    type: Number,
  })
  pages: number;

  @IsString()
  @ApiProperty({
    description: 'The ISBN of the book',
    example: '978-3-16-148410-0',
    type: String,
  })
  isbn: string;

  @IsDateString()
  @ApiProperty({
    description: 'The release date of the book',
    example: '1937-09-21',
    type: String,
  })
  releaseDate: string;

  @IsNumber()
  @ApiProperty({
    description: 'The category ID of the book',
    example: 1,
    type: Number,
  })
  categoryId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The author ID of the book',
    example: 1,
    type: Number,
  })
  authorId: number;
}
