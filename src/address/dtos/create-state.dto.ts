import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStateDto {
  @ApiProperty({
    example: 'São Paulo',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  countryId: number;
}
