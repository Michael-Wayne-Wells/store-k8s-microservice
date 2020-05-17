import { Publisher, Subjects, ProductCreatedEvent } from '@mwproducts/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
