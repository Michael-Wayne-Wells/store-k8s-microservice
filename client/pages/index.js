import buildClient from '../api/build-client';
import Link from 'next/link';
const LandingPage = ({ currentUser, products }) => {
  const productList = products.map((product) => {
    return (
      <div className='is-parent is-4' style={{ padding: '10px' }}>
        <article className='tile is-child box' key={product.id}>
          <h3 className='title is-size-3'>{product.title}</h3>
          <h3 className='subtitle is-size-3'>$ {product.price}</h3>
          <Link href='/products/[productId]' as={`/products/${product.id}`}>
            <button className='button is-primary'>View</button>
          </Link>
          <Link
            href='/products/[productId]/edit'
            as={`/products/${product.id}/edit`}
          >
            <button className='button is-warning'>Edit</button>
          </Link>
          <Link
            href='/products/[productId]/delete'
            as={`/products/${product.id}/delete`}
          >
            <button className='button is-danger'>Delete</button>
          </Link>
        </article>
      </div>
    );
  });

  return (
    <section className='section'>
      <h2 className='title is-size-2'>Products</h2>

      <div className='tile is-ancestor'>{productList}</div>
    </section>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products');

  return { products: data };
};

export default LandingPage;
