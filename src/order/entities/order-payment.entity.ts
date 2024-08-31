import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum OrderPaymentType {
  'CREDIT_CARD',
}

export enum CardBrand {
  'VISA',
  'MASTERCARD',
}

@Entity()
export class OrderPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: OrderPaymentType,
  })
  type: OrderPaymentType;

  @OneToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  value: number;

  @Column({
    enum: CardBrand,
  })
  cardBrand: CardBrand;

  @Column()
  cardNumber: string;

  @Column()
  cardHolder: string;
}
