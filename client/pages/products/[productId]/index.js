import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const ProductShow = ({ product }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      productId: product.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <section className='section'>
      <div>
        <h3 className='title is-3'>{product.title}</h3>
        <h4 className='subtitle is-4'>Price: $ {product.price}</h4>
        <div className='content'>
          <p>Description: {product.description}</p>
        </div>
        {errors}
        <button onClick={() => doRequest()} className='button is-primary'>
          Purchase
        </button>
      </div>
    </section>
  );
};

ProductShow.getInitialProps = async (context, client) => {
  const { productId } = context.query;
  const { data } = await client.get(`/api/products/${productId}`);

  return { product: data };
};

export default ProductShow;
