import { Controller, Post, Body } from '@nestjs/common';
import { OrderCreateDto } from './jobs/create-order/order.create.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('order')
export class OrderController {
  constructor(@InjectQueue('orders') private orderCreateQueue: Queue) {}

  @Post('checkout')
  async create(@Body() orderCreateDto: OrderCreateDto) {
    await this.orderCreateQueue.add('create', orderCreateDto);
    return {
      message: 'Processing order',
    };
  }
}
