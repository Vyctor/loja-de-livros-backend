import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderClient } from './entities/order-client.entity';
import { OrderPayment } from './entities/order-payment.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot(),
    BullModule.registerQueue(
      { name: 'order-create-queue' },
      { name: 'order-update-queue' },
    ),
    TypeOrmModule.forFeature([Order, OrderItem, OrderClient, OrderPayment]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
