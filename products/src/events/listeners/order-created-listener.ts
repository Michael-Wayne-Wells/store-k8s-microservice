import { Listener, OrderCreatedEvent, Subjects } from '@mwproducts/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find product that the order is reserving
    const product = await Product.findById(data.product.id);
    // if none,, throw error
    if (!product) {
      throw new Error('Product not Found!');
    }
    // mark ticket reserved
    product.set({ orderId: data.id });
    // save
    await product.save();
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      price: product.price,
      title: product.title,
      userId: product.userId,
      orderId: product.orderId,
      version: product.version,
    });
    //ack
    msg.ack();
  }
}
