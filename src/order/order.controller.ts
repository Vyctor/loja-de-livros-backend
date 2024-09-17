import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderCreateDto } from './jobs/create-order/order.create.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrderService } from './order.service';
import { ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderPaymentStatusUpdatedDto } from './jobs/update-payment/order.payment-status-updated.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    @InjectQueue('orders') private orderQueue: Queue,
    private readonly orderService: OrderService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Order created',
  })
  @Post('checkout')
  async create(@Body() orderCreateDto: OrderCreateDto) {
    await this.orderQueue.add('create', orderCreateDto);
    return {
      message: 'Processing order',
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Payment webhook received',
  })
  @Post('webhook/payment-update')
  async webhook(
    @Body()
    payload: OrderPaymentStatusUpdatedDto,
  ) {
    console.log('Received payment webhook', payload);
    await this.orderQueue.add('update-payment-status', payload);
    return {
      message: 'Payment webhook received',
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Order details',
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number,
  })
  async getOrder(@Param('id') id: number) {
    return await this.orderService.getOrder(id);
  }
}
