import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPaymentStatusUpdatedDto {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  payment_id: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  payment_foreign_transaction_id: number;

  @ApiProperty({
    example: 'approved',
    type: String,
  })
  @IsString()
  status: string;
}
