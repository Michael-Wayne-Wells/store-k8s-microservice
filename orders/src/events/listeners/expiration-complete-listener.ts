import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from '@mwproducts/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';
export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('product');
    if (!order) {
      throw new Error('Order Not Found!');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      product: {
        id: order.product.id,
      },
    });
    msg.ack();
  }
}
