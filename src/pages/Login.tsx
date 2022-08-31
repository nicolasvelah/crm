// eslint-disable-next-line no-unused-vars
import React, {
  FunctionComponent
} from 'react';
// eslint-disable-next-line no-unused-vars
import UserStoreProvider from '../state/user-state';
import NotFound from './NotFound';

const Login: FunctionComponent = () => {
  //console.log('render login');
  return (
    <UserStoreProvider>
      <>
        <NotFound />
      </>
    </UserStoreProvider>
  );
};

export default Login;
