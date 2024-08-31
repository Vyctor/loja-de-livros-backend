import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
