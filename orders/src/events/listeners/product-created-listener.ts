import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ProductCreatedEvent } from '@mwproducts/common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const product = Product.build({
      id,
      title,
      price,
    });
    await product.save();
    msg.ack();
  }
}
