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

export class OrderPaymentDto {
  @IsEnum(OrderPaymentType)
  type: string;
  @IsEnum(CardBrand)
  card_brand: string;
  @IsCreditCard()
  card_number: string;
  @IsString()
  card_holder: string;
  @IsString()
  card_expiration: string;
  @IsString()
  card_cvv: string;
}

export class OrderItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsNumber()
  @Min(1)
  book_id: number;
  @IsNumber()
  @Min(1)
  price: number;
}

export class OrderClientDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsString()
  document: string;
  @IsNumber()
  country_id: number;
  @IsNumber()
  state_id: number;
  @IsString()
  street_name: string;
  @IsString()
  street_number: string;
  @IsString()
  complement: string;
  @IsString()
  zip_code: string;
  @IsPhoneNumber()
  phone: string;
}

export class OrderCreateDto {
  @IsNumber({
    allowNaN: false,
    maxDecimalPlaces: 10,
  })
  @Min(1)
  total: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  couponCode?: string;

  @ValidateNested()
  @Type(() => OrderClientDto)
  client: OrderClientDto;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: Array<OrderItemDto>;

  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;
}
