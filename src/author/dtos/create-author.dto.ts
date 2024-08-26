import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthorDto {
  @IsEmail(
    {},
    {
      message: 'E-mail inválido',
    },
  )
  email: string;

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

  @IsString({
    message: 'Descrição inválida, deve ser uma string',
  })
  @Length(1, 400, {
    message: 'Descrição inválida, deve ter entre 1 e 400 caracteres',
  })
  description: string;
}
