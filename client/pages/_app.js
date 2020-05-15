import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-toastify/dist/ReactToastify.css';
import buildClient from '../api/build-client';
import { ToastContainer } from 'react-toastify';
import Header from '../components/Header';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log(currentUser);
  return (
    <>
      <Header currentUser={currentUser} />
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
