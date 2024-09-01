import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('order')
export class OrderController {
  constructor(
    @InjectQueue('order-create-queue') private orderCreateQueue: Queue,
  ) {}

  @Post('checkout')
  async create(@Body() createOrderDto: CreateOrderDto) {
    await this.orderCreateQueue.add('create-order', createOrderDto);
    return {
      message: 'Processing order',
    };
  }

  //@Get(':id')
  //async findAll(@Param('id', new ParseIntPipe()) id: number) {
  //  return this.orderService.findById(id);
  //}
}
