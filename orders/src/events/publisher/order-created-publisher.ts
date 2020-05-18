import { Publisher, OrderCreatedEvent, Subjects } from '@mwproducts/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
