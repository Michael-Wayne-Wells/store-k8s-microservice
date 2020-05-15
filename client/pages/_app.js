import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
export default ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
};
