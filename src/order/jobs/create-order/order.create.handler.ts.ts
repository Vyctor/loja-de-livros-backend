import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { Order, OrderStatus } from 'src/order/entities/order.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { OrderClient } from 'src/order/entities/order-client.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import {
  OrderPayment,
  OrderPaymentType,
  CardBrand,
} from 'src/order/entities/order-payment.entity';
import { OrderCreateDto } from './order.create.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Coupon } from '../../../coupon/entities/coupon.entity';

@Processor('orders')
export class OrderCreateHandler {
  private readonly logger = new Logger(OrderCreateHandler.name);

  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process('create')
  async execute(job: Job<OrderCreateDto>): Promise<void> {
    try {
      const createOrderDto = job.data;
      this.logger.log(`Processing a new order`);

      await this.datasource.transaction(async (db) => {
        const clientFromOrderPayload = createOrderDto.client;
        const booksFromOrderPayload = createOrderDto.items;
        const paymentFromOrderPayload = createOrderDto.payment;
        const couponCode = createOrderDto.couponCode;

        if (couponCode) {
          const coupon = await db.findOne(Coupon, {
            where: {
              code: couponCode,
            },
          });

          if (!coupon) {
            this.logger.error(`Coupon ${couponCode} not found`);
          }

          if (coupon?.isValid()) {
            const total = createOrderDto.total + createOrderDto.discount;
            const discount = total * (coupon.discountPercentage / 100);
            if (discount !== createOrderDto.discount) {
              this.logger.error(`Discount value is invalid`);
              throw new InternalServerErrorException(
                'Discount value is invalid',
              );
            }
          }
        }

        const orderValueSum = createOrderDto.items.reduce((acc, next) => {
          const total = next.price * next.quantity;
          return acc + total;
        }, 0);

        if (createOrderDto.total + createOrderDto.discount !== orderValueSum) {
          this.logger.error("Total Value doesn't match with items value sum");
          throw new InternalServerErrorException('Total value is invalid');
        }

        const order = db.create(Order, {
          total: createOrderDto.total,
          status: OrderStatus.CREATED,
          discount: createOrderDto.discount,
        });

        const orderCreated = await db.save(Order, order);

        const orderClient = db.create(OrderClient, {
          order: {
            id: order.id,
          },
          email: clientFromOrderPayload.email,
          name: clientFromOrderPayload.name,
          surname: clientFromOrderPayload.surname,
          document: clientFromOrderPayload.document,
          country: { id: clientFromOrderPayload.country_id },
          state: { id: clientFromOrderPayload.state_id },
          streetName: clientFromOrderPayload.street_name,
          streetNumber: clientFromOrderPayload.street_number,
          complement: clientFromOrderPayload.complement,
          zipCode: clientFromOrderPayload.zip_code,
          phone: clientFromOrderPayload.phone,
        });

        const orderPayments = db.create(OrderPayment, {
          order: {
            id: order.id,
          },
          type: OrderPaymentType[paymentFromOrderPayload.type],
          value: createOrderDto.total,
          cardBrand: CardBrand[paymentFromOrderPayload.card_brand],
          cardNumber: paymentFromOrderPayload.card_number,
          cardHolder: paymentFromOrderPayload.card_holder,
        });

        const orderItems = booksFromOrderPayload.map((book) => {
          return db.create(OrderItem, {
            order: {
              id: order.id,
            },
            book: { id: book.book_id },
            price: book.price,
            quantity: book.quantity,
          });
        });

        await Promise.all([
          await db.save(OrderClient, orderClient),
          await db.save(OrderPayment, orderPayments),
          await db.save(OrderItem, orderItems),
        ]);

        this.logger.log(`Order ${orderCreated.id} created`);

        this.eventEmitter.emit('order.created', {
          id: orderCreated.id,
          total: orderCreated.total,
          payment: {
            ...paymentFromOrderPayload,
          },
        });
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error on create order');
    }
  }
}
