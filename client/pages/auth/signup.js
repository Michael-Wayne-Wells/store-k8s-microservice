import { useState } from 'react';
import useRequest from '../../hooks/use-request';
export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div className='box'>
      <form onSubmit={onSubmit}>
        <h1 className='title'>Sign-up</h1>
        <div className='field'>
          <label className='label'>Email Address</label>
          <div className='control'>
            <input
              className='input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              placeholder='Enter Email'
            ></input>
          </div>
        </div>
        <div className='field'>
          <label className='label'>Password</label>
          <div className='control'>
            <input
              className='input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder='Enter Password'
            ></input>
          </div>
        </div>
        <button className='button is-primary'>Sign Up</button>
      </form>
    </div>
  );
};
