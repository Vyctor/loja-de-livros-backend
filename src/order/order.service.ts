import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderClient } from './entities/order-client.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderPayment } from './entities/order-payment.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}

  async getOrder(id: number) {
    return this.datasource.transaction(async (db) => {
      const order = await db.findOne(Order, {
        where: {
          id,
        },
        relations: ['coupon'],
      });

      const [client, orderItems, payment] = await Promise.all([
        db.findOne(OrderClient, {
          where: {
            order: {
              id: order.id,
            },
          },
        }),
        db.find(OrderItem, {
          where: {
            order: {
              id: order.id,
            },
          },
        }),
        db.findOne(OrderPayment, {
          where: {
            order: {
              id: order.id,
            },
          },
        }),
      ]);

      return {
        order_id: order.id,
        full_price: order.total,
        final_price: order.total + order.discount,
        discount: order.discount,
        coupon: order.coupon?.code || false,
        client: {
          email: client.email,
          name: client.name,
          surname: client.surname,
          document: client.document,
          phone: client.phone,
          address: {
            street: client.streetName,
            number: client.streetNumber,
            complement: client.complement,
            zipCode: client.zipCode,
          },
        },
        payment: {
          method: payment.cardBrand,
          value: payment.value,
        },
        items: orderItems,
      };
    });
  }
}
