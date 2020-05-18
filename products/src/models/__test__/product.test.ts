import { Product } from '../product';

it('implements optimistic concurrenct control', async () => {
  const product = Product.build({
    title: 'book',
    price: 20,
    userId: '123',
  });
  await product.save();
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  await expect(secondInstance!.save()).rejects.toThrow();
});
it('increment version number on multiple saves', async () => {
  const product = Product.build({
    title: 'book',
    price: 20,
    userId: '123',
  });

  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);
  await product.save();
  expect(product.version).toEqual(2);
});
