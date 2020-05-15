import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css';
import buildClient from '../api/build-client';
import { ToastContainer } from 'react-toastify';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <h1>{currentUser.email}</h1>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
