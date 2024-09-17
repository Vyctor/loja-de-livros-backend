import {
  IsCreditCard,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  CardBrand,
  OrderPaymentType,
} from '../../entities/order-payment.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPaymentDto {
  @ApiProperty({
    example: 'credit_card',
    type: String,
    enum: OrderPaymentType,
  })
  @IsEnum(OrderPaymentType)
  type: string;

  @ApiProperty({
    example: 'visa',
    type: String,
    enum: CardBrand,
  })
  @IsEnum(CardBrand)
  card_brand: string;

  @ApiProperty({
    example: '1234567890123456',
    type: String,
  })
  @IsCreditCard()
  card_number: string;

  @ApiProperty({
    example: 'John Doe',
    type: String,
  })
  @IsString()
  card_holder: string;

  @ApiProperty({
    example: '12/2023',
    type: String,
  })
  @IsString()
  card_expiration: string;

  @ApiProperty({
    example: '123',
    type: String,
  })
  @IsString()
  card_cvv: string;
}

export class OrderItemDto {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  book_id: number;

  @ApiProperty({
    example: 100,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  price: number;
}

export class OrderClientDto {
  @ApiProperty({
    example: 'email@email.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Doe',
    type: String,
  })
  @IsString()
  surname: string;

  @ApiProperty({
    example: '12345678',
    type: String,
  })
  @IsString()
  document: string;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  country_id: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  state_id: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsString()
  street_name: string;

  @ApiProperty({
    example: '123',
    type: String,
  })
  @IsString()
  street_number: string;

  @ApiProperty({
    example: 'Apt 123',
    type: String,
  })
  @IsString()
  complement: string;

  @ApiProperty({
    example: '12345-678',
    type: String,
  })
  @IsString()
  zip_code: string;

  @ApiProperty({
    example: '1234567890',
    type: String,
  })
  @IsPhoneNumber()
  phone: string;
}

export class OrderCreateDto {
  @ApiProperty({
    example: 100,
    type: Number,
  })
  @IsNumber({
    allowNaN: false,
    maxDecimalPlaces: 10,
  })
  @Min(1)
  total: number;

  @ApiProperty({
    example: 10,
    type: Number,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty({
    example: 'COUPONCODE',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiProperty({
    type: OrderClientDto,
  })
  @ValidateNested()
  @Type(() => OrderClientDto)
  client: OrderClientDto;

  @ApiProperty({
    type: [OrderItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: Array<OrderItemDto>;

  @ApiProperty({
    type: OrderPaymentDto,
  })
  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;
}
