import { IsDateString, IsNumber, IsString, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;
  @IsNumber()
  @Min(1)
  discountPercentage: number;
  @IsDateString()
  expireDate: Date;
}
