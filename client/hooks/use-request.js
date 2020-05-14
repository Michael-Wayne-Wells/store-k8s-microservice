import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
export default ({ url, method, body }) => {
  const [errors, setErrors] = useState(null);
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
  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      notifySuccess('success');
      return response.data;
    } catch (err) {
      err.response.data.errors.map((err) => notifyErr(err.message));
    }
  };
  return { doRequest, errors };
};
