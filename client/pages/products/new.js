import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'post',
    body: {
      title,
      price,
      description,
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
        <h1 className='title is-size-2'>Create a Product</h1>
        <form onSubmit={onSubmit}>
          <div className='field'>
            <label className='label'>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='control input'
            />
          </div>
          <div className='field'>
            <label className='label'>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='control input'
            />
          </div>
          <div className='field'>
            <label className='label'>Price</label>
            <input
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

export default NewProduct;
