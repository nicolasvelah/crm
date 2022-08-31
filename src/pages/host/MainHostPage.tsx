import React, { useEffect } from 'react';
import Menu from '../../components/Template';

import MainHost from './components/MainHost';
import auth from '../../utils/auth';

const MainFollowPage = () => {
  //const [catalogue, setCatalogue] = useState([{}]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  const data = (e: any) => {
    if (e === true) {
      //setStep(step + 1);
    }
  };

  const { user } = auth;

  return (
    <Menu page="Anfitrión">
      <>{user && <MainHost />}</>
    </Menu>
  );
};

export default MainFollowPage;
