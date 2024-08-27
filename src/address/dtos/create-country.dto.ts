import { IsString, Length } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @Length(1, 100)
  name: string;
}
