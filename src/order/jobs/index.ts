import { OrderCreateHandler } from './create-order/order.create.handler.ts';
import { OrderCreatedProcessPaymentHandler } from './order-created/order.created.process-payment.handler';
import { OrderUpdateStatusHandler } from './update-order-status/order.update-status.handler';
import { OrderPaymentStatusUpdatedHandler } from './update-payment/order.payment-status-updated.handler.js';

export const JobHandlers = [
  OrderCreateHandler,
  OrderCreatedProcessPaymentHandler,
  OrderUpdateStatusHandler,
  OrderPaymentStatusUpdatedHandler,
];
