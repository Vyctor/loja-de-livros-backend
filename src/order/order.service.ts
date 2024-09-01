import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderClient } from './entities/order-client.entity';
import { OrderItem } from './entities/order-item.entity';
import { CardBrand } from './entities/order-payment.entity';
import {
  OrderPayment,
  OrderPaymentType,
} from './entities/order-payment.entity';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Processor('order-create-queue')
export class OrderService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findById(id: number) {
    const response = await this.dataSource.transaction(async (db) => {
      const order = await db.findOne(Order, {
        where: { id },
      });

      const client = await db.findOne(OrderClient, {
        where: { order: { id } },
        relations: ['country', 'state'],
        select: {
          country: {
            id: true,
            name: true,
          },
          state: {
            id: true,
            name: true,
          },
        },
      });
      const items = await db.find(OrderItem, {
        where: { order: { id } },
        relations: ['book'],
      });

      const payment = await db.findOne(OrderPayment, {
        where: { order: { id } },
        relations: [],
      });

      if (!order || !client || !items || !payment) {
        throw new NotFoundException('Order not found');
      }

      return {
        ...order,
        client,
        items,
        payment,
      };
    });
    return response;
  }

  @Process('create-order')
  async create(job: Job<CreateOrderDto>) {
    const createOrderDto = job.data;

    try {
      await this.dataSource.transaction(async (db) => {
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
        this.eventEmitter.emit('order.created', {
          order_id: orderCreated.id,
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Error on create order');
    }
  }

  @OnEvent('order.created', { async: true })
  handleOrderCreatedEvent(payload: any) {
    console.info('Order Created Event: ', payload);
  }
}
