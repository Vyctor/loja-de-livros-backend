import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    example: 'Brasil',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  name: string;
}
