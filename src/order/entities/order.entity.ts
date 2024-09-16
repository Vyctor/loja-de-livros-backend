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
import { BaseEntity } from 'src/common/entities/base.entity';
import { Coupon } from '../../coupon/entities/coupon.entity';

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
export class Order extends BaseEntity {
  private _status: OrderStatus;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column({
    default: 0,
  })
  discount: number;

  @Column({
    enum: OrderStatus,
  })
  get status(): OrderStatus {
    return this._status;
  }
  set status(value: OrderStatus) {
    if (value && value > this._status) {
      this.addEvent({
        eventName: 'order.status-updated',
        payload: {
          orderId: this.id,
          status: value,
        },
      });
    }
    this._status = value;
  }

  @OneToOne(() => OrderClient, (orderClient) => orderClient.id)
  client: OrderClient;

  @ManyToOne(() => Coupon, (coupon) => coupon.id)
  coupon: Coupon;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.id)
  orderItems: OrderItem[];

  @OneToOne(() => OrderPayment, (orderPayment) => orderPayment.id)
  payment: OrderPayment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
