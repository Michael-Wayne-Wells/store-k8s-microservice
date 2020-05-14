import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1 className='title'>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    //window only on clientside.
    //Serverside
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return data;
  } else {
    //clientside
    const { data } = await axios.get('/api/users/currentuser');
    return data;
  }
  return {};
};

export default LandingPage;
