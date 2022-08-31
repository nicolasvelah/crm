import axios from 'axios';
import auth from '../../../utils/auth';

interface ReturnGQL {
  data: any;
  message: string;
}

/* const later = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('time');
    }, timeout);
  });
}; */

const graphqlRoute = async (query: string): Promise<ReturnGQL> => {
  try {
    //console.log('query', query);
    const token = await auth.getAccessToken();
    if (!token) {
      throw new Error('Context creation failed: jwt malformed');
    }

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL_GRAPHQL}`,
      {
        query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      }
    );
    // console.log('resp.data', resp.data.data);
    if (resp.data.errors) {
      //console.log('Error graphql', resp.data.errors[0].message);
      return { data: null, message: resp.data.errors[0].message };
    }
    //console.log('Resp', resp.data.data);
    return { data: resp.data.data, message: 'ok' };
    //return resp.data.data;
    //await later(4000);
    //return { message: 'ok' };
  } catch (error) {
    //console.log('Error', error.message);
    return { data: null, message: error.message };
    //return null;
  }
};

export default graphqlRoute;
