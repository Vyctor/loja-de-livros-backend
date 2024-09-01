import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

@Injectable()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(@InjectQueue('orders') private ordersQueue: Queue) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(payload: any) {
    await this.ordersQueue.add('created', payload);
  }

  @OnEvent('order.update-status')
  async handleUpdateStatusEvent(payload: any) {
    await this.ordersQueue.add('update-status', payload);
  }

  @OnEvent('order.status-updated')
  async handleStatusUpdatedEvent(payload: any) {
    this.logger.log(
      `Order ${payload.orderId} status updated to ${payload.status}`,
    );
    await this.ordersQueue.add('status-updated', payload);
  }
}
