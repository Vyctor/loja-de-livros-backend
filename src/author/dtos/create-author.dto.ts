import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'example@mail.com',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'E-mail inválido',
    },
  )
  email: string;

  @ApiProperty({
    example: "Author's name",
    type: String,
  })
  @IsString({
    message: 'Nome inválido, deve ser uma string',
  })
  @MaxLength(100, {
    message: 'Nome inválido, deve ter no máximo 100 caracteres',
  })
  @MinLength(1, {
    message: 'Nome inválido, deve ter no mínimo 1 caractere',
  })
  name: string;

  @ApiProperty({
    example: "Author's description",
    type: String,
  })
  @IsString({
    message: 'Descrição inválida, deve ser uma string',
  })
  @Length(1, 400, {
    message: 'Descrição inválida, deve ter entre 1 e 400 caracteres',
  })
  description: string;
}
