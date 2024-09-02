import { Controller, Post, Body } from '@nestjs/common';
import { OrderCreateDto } from './jobs/create-order/order.create.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('order')
export class OrderController {
  constructor(@InjectQueue('orders') private orderQueue: Queue) {}

  @Post('checkout')
  async create(@Body() orderCreateDto: OrderCreateDto) {
    await this.orderQueue.add('create', orderCreateDto);
    return {
      message: 'Processing order',
    };
  }

  @Post('webhook/payment-update')
  async webhook(
    @Body()
    payload: {
      payment_id: number;
      payment_foreign_transaction_id: string;
      status: string;
    },
  ) {
    console.log('Received payment webhook', payload);
    await this.orderQueue.add('update-payment-status', payload);
    return {
      message: 'Payment webhook received',
    };
  }
}
