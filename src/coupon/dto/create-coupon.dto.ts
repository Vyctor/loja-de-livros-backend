import { IsDateString, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({
    example: 'COUPON_123',
    type: String,
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 10,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  discountPercentage: number;

  @ApiProperty({
    example: '2022-09-01T00:00:00.000Z',
    type: Date,
  })
  @IsDateString()
  expireDate: Date;
}
