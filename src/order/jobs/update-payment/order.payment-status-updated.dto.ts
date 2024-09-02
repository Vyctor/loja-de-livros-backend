import { IsNumber, IsString } from 'class-validator';

export class OrderPaymentStatusUpdatedDto {
  @IsNumber()
  payment_id: number;
  @IsNumber()
  payment_foreign_transaction_id: number;
  @IsString()
  status: string;
}
