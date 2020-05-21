const OrderIndex = ({ orders }) => {
  return (
    <section className='section'>
      <div className='box'>
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

  return { orders: data };
};

export default OrderIndex;
