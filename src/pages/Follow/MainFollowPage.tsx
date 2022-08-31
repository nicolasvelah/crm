import React, { useEffect } from 'react';
import Menu from '../../components/Template';
import MainFollow from './components/MainFollow';
import auth from '../../utils/auth';

const MainFollowPage = () => {
  useEffect(() => {}, []);

  const data = (e: any) => {
    if (e === true) {
      //setStep(step + 1);
    }
  };

  const { user } = auth;
  if (!user) return <div />;

  return (
    <Menu page="Seguimiento">
      <>{user.id !== -1 && <MainFollow />}</>
    </Menu>
  );
};

export default MainFollowPage;
