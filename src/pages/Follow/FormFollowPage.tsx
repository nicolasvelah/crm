import React, { useEffect } from 'react';
import FormFollow from './components/FormFollow';
import Menu from '../../components/Template';
import auth from '../../utils/auth';

const FormFollowPage = () => {
  //const [catalogue, setCatalogue] = useState([{}]);
  //const [loading, setLoading] = useState(true);

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
      <>{user.id !== -1 && <FormFollow identificationInput={null} />}</>
    </Menu>
  );
};

export default FormFollowPage;
