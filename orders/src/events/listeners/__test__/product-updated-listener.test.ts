import { ProductUpdatedListener } from '../product-updated-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { ProductCreatedEvent, ProductUpdatedEvent } from '@mwproducts/common';

import mongoose from 'mongoose';
import { Product } from '../../../models/product';
const setup = async () => {
  const listener = new ProductUpdatedListener(natsWrapper.client);

  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'book',
    price: 434,
  });
  await product.save();

  const data: ProductUpdatedEvent['data'] = {
    id: product.id,
    title: 'book12',
    version: product.version + 1,
    price: 4,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, product, msg };
};
it('finds, updates, and saves', async () => {
  const { listener, product, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.version).toEqual(data.version);
});
it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
it('does not call ack if out of synch', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
