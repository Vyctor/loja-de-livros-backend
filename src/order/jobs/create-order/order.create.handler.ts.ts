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
    const createOrderDto = job.data;
    this.logger.log(`Processing a new order`);

    try {
      await this.datasource.transaction(async (db) => {
        const clientFromOrderPayload = createOrderDto.client;
        const booksFromOrderPayload = createOrderDto.items;
        const paymentFromOrderPayload = createOrderDto.payment;

        const order = db.create(Order, {
          total: createOrderDto.total,
          status: OrderStatus.CREATED,
          client: db.create(OrderClient, {
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
          }),
          orderItems: booksFromOrderPayload.map((book) => {
            return db.create(OrderItem, {
              book: { id: book.book_id },
              price: book.price,
              quantity: book.quantity,
            });
          }),
          payment: db.create(OrderPayment, {
            type: OrderPaymentType[paymentFromOrderPayload.type],
            value: createOrderDto.total,
            cardBrand: CardBrand[paymentFromOrderPayload.card_brand],
            cardNumber: paymentFromOrderPayload.card_number,
            cardHolder: paymentFromOrderPayload.card_holder,
          }),
        });

        const orderCreated = await db.save(Order, order);
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
