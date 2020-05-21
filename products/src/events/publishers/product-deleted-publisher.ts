import { Publisher, ProductDeletedEvent, Subjects } from '@mwproducts/common';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
}
