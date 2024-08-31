import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderClient } from './entities/order-client.entity';
import { OrderItem } from './entities/order-item.entity';
import { CardBrand } from './entities/order-payment.entity';
import {
  OrderPayment,
  OrderPaymentType,
} from './entities/order-payment.entity';
import { State } from 'src/address/entities/state.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      await this.dataSource.transaction(async (manager) => {
        // Validate state and country
        const state = await manager.findOne(State, {
          where: { id: createOrderDto.client.state_id },
        });

        if (!state) {
          console.log('State not found');
          throw new ForbiddenException('State not found');
        }

        const country = await manager.findOne(State, {
          where: { id: createOrderDto.client.country_id },
        });

        if (!country) {
          console.log('Country not found');
          throw new ForbiddenException('Country not found');
        }

        // Validate Price
        const booksFromOrderPayload = createOrderDto.items;
        const clientFromOrderPayload = createOrderDto.client;
        const paymentFromOrderPayload = createOrderDto.payment;

        const booksFromRepo = await manager.find(Book, {
          where: {
            id: In(booksFromOrderPayload.map((book) => book.book_id)),
          },
        });
        const repositoryTotalPrice = booksFromRepo
          .map((item) => {
            const book = booksFromOrderPayload.find(
              (book) => book.book_id === item.id,
            );
            return item.price * book.quantity;
          })
          .reduce((acc, curr) => acc + curr, 0);

        if (repositoryTotalPrice !== createOrderDto.total) {
          console.log('Total price is invalid');

          throw new ForbiddenException('Invalid total price');
        }

        // Create order
        const order = await manager.save(
          manager.create(Order, {
            total: createOrderDto.total,
            status: OrderStatus.CREATED,
          }),
        );
        // Create client
        await manager.save(
          manager.create(OrderClient, {
            email: clientFromOrderPayload.email,
            name: clientFromOrderPayload.name,
            surname: clientFromOrderPayload.surname,
            document: clientFromOrderPayload.document,
            order: { id: order.id },
            country: { id: clientFromOrderPayload.country_id },
            state: { id: clientFromOrderPayload.state_id },
            streetName: clientFromOrderPayload.street_name,
            streetNumber: clientFromOrderPayload.street_number,
            complement: clientFromOrderPayload.complement,
            zipCode: clientFromOrderPayload.zip_code,
            phone: clientFromOrderPayload.phone,
          }),
        );
        // Create items
        await manager.save(
          booksFromRepo.map((book) => {
            return manager.create(OrderItem, {
              book: { id: book.id },
              order: { id: order.id },
              price: book.price,
              quantity: booksFromOrderPayload.find(
                (item) => item.book_id === book.id,
              ).quantity,
            });
          }),
        );
        // Create payment
        await manager.save(
          manager.create(OrderPayment, {
            type: OrderPaymentType[paymentFromOrderPayload.type],
            value: createOrderDto.total,
            cardBrand: CardBrand[paymentFromOrderPayload.card_brand],
            cardNumber: paymentFromOrderPayload.card_number,
            cardHolder: paymentFromOrderPayload.card_holder,
            order: {
              id: order.id,
            },
          }),
        );
      });
    } catch (error) {
      throw new InternalServerErrorException('Error on create order');
    }
  }
}
