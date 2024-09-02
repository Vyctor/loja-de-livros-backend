import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OrderStatus } from 'src/order/entities/order.entity';
import { OrderCreatedDto } from './order.created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { EnvironmentService } from 'src/config/environment.service';
import { catchError, firstValueFrom, map } from 'rxjs';

@Processor('orders')
export class OrderCreatedProcessPaymentHandler {
  private readonly logger = new Logger(OrderCreatedProcessPaymentHandler.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly http: HttpService,
    private readonly environment: EnvironmentService,
  ) {}

  @Process('ç')
  async execute(job: Job<OrderCreatedDto>): Promise<void> {
    const payload = job.data;
    this.logger.log(`Processing payment for order ${payload.id}`);

    await firstValueFrom(
      this.http
        .post(
          this.environment.PAYMENT_GATEWAY_URL,
          {
            total: payload.total,
            card_brand: payload.payment.card_brand,
            card_number: payload.payment.card_number,
            card_holder: payload.payment.card_holder,
            card_expiration: payload.payment.card_expiration,
            card_cvv: payload.payment.card_cvv,
            foreign_transaction_id: String(payload.id),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((error) => {
            this.logger.error(
              `Error processing payment for order ${payload.id}`,
            );
            this.logger.error('Error: ', error);
            throw error;
          }),
        ),
    );

    this.eventEmitter.emit('order.update-status', {
      orderId: payload.id,
      status: OrderStatus.PAYMENT_PENDING,
    });
  }
}
