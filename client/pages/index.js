import buildClient from '../api/build-client';
import Link from 'next/link';
const LandingPage = ({ currentUser, products }) => {
  const productList = products.map((product) => {
    return (
      <div className='is-parent tile' key={product.id}>
        <article className='is-child tile message'>
          <div className='message-header'>
            <h3 className='is-size-2' style={{ whiteSpace: 'nowrap' }}>
              {product.title}
            </h3>
            {currentUser && product.userId === currentUser.id ? (
              <React.Fragment>
                <Link
                  href='/products/[productId]/delete'
                  as={`/products/${product.id}/delete`}
                >
                  <button className='delete is-large'>Delete</button>
                </Link>
              </React.Fragment>
            ) : null}
          </div>
          <p className='is-size-3'>{product.description}</p>
          <h3 className='subtitle is-size-3'>$ {product.price}</h3>
          <Link href='/products/[productId]' as={`/products/${product.id}`}>
            <button className='button is-primary'>View</button>
          </Link>
          {currentUser && product.userId === currentUser.id ? (
            <React.Fragment>
              <Link
                href='/products/[productId]/edit'
                as={`/products/${product.id}/edit`}
              >
                <button className='button is-warning'>Edit</button>
              </Link>
            </React.Fragment>
          ) : null}
        </article>
      </div>
    );
  });

  return (
    <section className='section'>
      <h2 className='title is-size-2'>Products</h2>
      <div className='is-ancestor tile'>{productList}</div>
    </section>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/products');
  return { products: data, currentUser: currentUser };
};

export default LandingPage;
