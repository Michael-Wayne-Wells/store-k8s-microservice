import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderStatus, OrderCancelledEvent } from '@mwproducts/common';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 23,
    userId: 'df',
    version: 0,
  });

  await order.save();
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    product: {
      id: 'dfsfs',
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, listener, order };
};

it('updates status of the order', async () => {
  const { msg, data, listener, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('acks the message', async () => {
  const { msg, data, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
