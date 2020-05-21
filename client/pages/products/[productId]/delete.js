import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const DeleteProduct = ({ product, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/products/${product.id}`,
    method: 'delete',
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Something went wrong...</div>;
};

DeleteProduct.getInitialProps = async (context, client) => {
  const { productId } = context.query;
  const { data } = await client.get(`/api/products/${productId}`);

  return { product: data };
};

export default DeleteProduct;
