import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderClient } from './order-client.entity';
import { OrderItem } from './order-item.entity';
import { OrderPayment } from './order-payment.entity';

export enum OrderStatus {
  'CREATED',
  'PAYMENT_PENDING',
  'PAYMENT_CONFIRMED',
  'PAYMENT_FAILED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUND_REQUESTED',
  'REFUNDED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column({
    enum: OrderStatus,
  })
  status: OrderStatus;

  @OneToOne(() => OrderClient, (orderClient) => orderClient.id)
  client: OrderClient;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.id)
  orderItems: OrderItem[];

  @OneToOne(() => OrderPayment, (orderPayment) => orderPayment.id)
  payment: OrderPayment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
