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
