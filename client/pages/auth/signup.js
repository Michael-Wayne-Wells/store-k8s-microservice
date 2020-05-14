import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', {
        email,
        password,
      });
      notifySuccess('Success!');
    } catch (err) {
      setErrors(err.response.data.errors);
      errors.map((err) => notifyErr(err.message));
    }
  };

  const notifyErr = (msg) => {
    toast.error(msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const notifySuccess = (msg) => {
    toast.success(msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
      <ToastContainer />
    </div>
  );
};
