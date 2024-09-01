import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OrderStatus } from 'src/order/entities/order.entity';
import { OrderCreatedDto } from './order.created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('orders')
export class OrderCreatedProcessPaymentHandler {
  private readonly logger = new Logger(OrderCreatedProcessPaymentHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Process('created')
  async execute(job: Job<OrderCreatedDto>): Promise<void> {
    const payload = job.data;
    this.logger.log(`Processing payment for order ${payload.id}`);

    this.eventEmitter.emit('order.update-status', {
      orderId: payload.id,
      status: OrderStatus.PAYMENT_PENDING,
    });
  }
}
