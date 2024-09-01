import { OrderStatus } from 'src/order/entities/order.entity';

export class OrderUpdateStatusDto {
  orderId: number;
  status: OrderStatus;
}
