import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderClient } from './entities/order-client.entity';
import { OrderPayment } from './entities/order-payment.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JobHandlers } from './jobs';
import { EventsHandler } from './events';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from 'src/config/config.module';
import { OrderService } from './order.service';

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    ConfigModule,
    EventEmitterModule.forRoot(),
    BullModule.registerQueue({ name: 'orders' }),
    TypeOrmModule.forFeature([Order, OrderItem, OrderClient, OrderPayment]),
    CommonModule,
  ],
  controllers: [OrderController],
  providers: [...JobHandlers, ...EventsHandler, OrderService],
})
export class OrderModule {}
