import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderCreateDto } from './jobs/create-order/order.create.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    @InjectQueue('orders') private orderQueue: Queue,
    private readonly orderService: OrderService,
  ) {}

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

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return await this.orderService.getOrder(id);
  }
}
