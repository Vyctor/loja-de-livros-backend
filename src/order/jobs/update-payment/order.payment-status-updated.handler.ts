import { Process, Processor } from '@nestjs/bull';
import { OrderPaymentStatusUpdatedDto } from './order.payment-status-updated.dto';
import { Job } from 'bull';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Order, OrderStatus } from 'src/order/entities/order.entity';
import { EntityEventsDispatcher } from 'src/common/events/entity-events-dispatcher';

@Processor('orders')
export class OrderPaymentStatusUpdatedHandler {
  private readonly logger = new Logger(OrderPaymentStatusUpdatedHandler.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly eventDispatcher: EntityEventsDispatcher,
  ) {}

  @Process('update-payment-status')
  async execute(job: Job<OrderPaymentStatusUpdatedDto>): Promise<void> {
    this.logger.log(
      `Updating payment status to ${job.data.status} for payment ${job.data.payment_foreign_transaction_id}`,
    );
    const paymentData = job.data;

    await this.dataSource.transaction(async (db) => {
      const order = await db.findOne(Order, {
        where: {
          id: paymentData.payment_foreign_transaction_id,
        },
      });

      if (!order) {
        this.logger.error(
          `Order ${paymentData.payment_foreign_transaction_id} not found`,
        );
        throw new Error('Order not found');
      }

      order.status = this.getOrderStatus(paymentData.status);
      await db.save(order);
      await this.eventDispatcher.dispatch(order);
    });
  }

  private getOrderStatus(status: string): OrderStatus {
    switch (status) {
      case 'APPROVED':
        return OrderStatus.PAYMENT_CONFIRMED;
      case 'DECLINED':
        return OrderStatus.PAYMENT_FAILED;
      default:
        return OrderStatus.PAYMENT_PENDING;
    }
  }
}
