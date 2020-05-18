import { Publisher, OrderCancelledEvent, Subjects } from '@mwproducts/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
