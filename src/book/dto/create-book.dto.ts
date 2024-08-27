import { IsDateString, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @Length(1, 500)
  synopsis: string;

  @IsString()
  summary: string;

  @IsNumber()
  @Min(20)
  price: number;

  @IsNumber()
  @Min(100)
  pages: number;

  @IsString()
  isbn: string;

  @IsDateString()
  releaseDate: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  authorId: number;
}
