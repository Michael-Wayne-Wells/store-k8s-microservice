import Link from 'next/link';

const OrderIndex = ({ orders, orderCart }) => {
  const heldOrders = orderCart.map((order) => {
    return (
      <div className='is-parent is-4' key={order.product.id}>
        <article className='tile is-child box'>
          <h3 className='title is-size-3'>{order.product.title}</h3>
          <h3 className='subtitle is-size-3'>$ {order.product.price}</h3>
          <Link href='/orders/[orderId]' as={`/orders/${order.id}`}>
            <button className='button is-primary'>View</button>
          </Link>
        </article>
      </div>
    );
  });
  return (
    <section className='section'>
      {orderCart.length >= 1 ? (
        <React.Fragment>
          <div className='box'>
            <h2 className='title is-size-2'>Held Orders</h2>{' '}
            <div className='tile is-ancestor'>{heldOrders}</div>
          </div>
        </React.Fragment>
      ) : null}

      <div className='box'>
        <h3 className='title is-3'> Completed orders</h3>
        <ul className='is-medium'>
          {orders.map((order) => {
            return (
              <li key={order.id}>
                {order.product.title} - {order.status}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  const orderCart = data.filter((order) => order.status === 'created');
  const completeOrders = data.filter((order) => order.status !== 'created');
  return { orders: completeOrders, orderCart: orderCart };
};

export default OrderIndex;
