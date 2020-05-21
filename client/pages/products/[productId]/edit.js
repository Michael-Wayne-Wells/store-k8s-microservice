import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const EditProduct = ({ product, currentUser }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const { doRequest, errors } = useRequest({
    url: `/api/products/${product.id}`,
    method: 'put',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <section className='section'>
      <div className='box'>
        <h1 className='title is-size-2'>Edit a Product</h1>
        <form onSubmit={onSubmit}>
          <div className='field'>
            <label className='label'>Title</label>
            <input
              placeholder={product.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='control input'
            />
          </div>
          <div className='field'>
            <label className='label'>Description</label>
            <textarea
              value={description}
              placeholder={product.description}
              onChange={(e) => setDescription(e.target.value)}
              className='control input'
            />
          </div>
          <div className='field'>
            <label className='label'>Price</label>
            <input
              placeholder={product.price}
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              className='control input'
            />
          </div>
          {errors}
          <button className='button is-primary'>Submit</button>
        </form>
      </div>
    </section>
  );
};

EditProduct.getInitialProps = async (context, client) => {
  const { productId } = context.query;
  const { data } = await client.get(`/api/products/${productId}`);

  return { product: data };
};

export default EditProduct;
