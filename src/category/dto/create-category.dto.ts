import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Books',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  name: string;
}
