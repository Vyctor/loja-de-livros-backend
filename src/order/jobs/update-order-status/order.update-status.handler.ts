import { OrderStatus } from '../../entities/order.entity';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Logger } from '@nestjs/common';
import { OrderUpdateStatusDto } from './order.update-status.dto';
import { EntityEventsDispatcher } from 'src/common/events/entity-events-dispatcher';

@Processor('orders')
export class OrderUpdateStatusHandler {
  private readonly logger = new Logger(OrderUpdateStatusHandler.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly eventDispatcher: EntityEventsDispatcher,
  ) {}

  @Process('update-status')
  async execute(job: Job<OrderUpdateStatusDto>): Promise<void> {
    try {
      this.logger.log(
        `Updating order ${job.data.orderId} status to ${OrderStatus[job.data.status]}`,
      );
      await this.dataSource.transaction(async (db) => {
        const order = await db.findOne(Order, {
          where: {
            id: job.data.orderId,
          },
        });

        if (!order) {
          this.logger.error(`Order ${job.data.orderId} not found`);
          throw new Error('Order not found');
        }

        order.status = job.data.status;

        await db.save(Order, order);
        await this.eventDispatcher.dispatch(order);
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new Error('Error updating order status');
    }
  }
}
