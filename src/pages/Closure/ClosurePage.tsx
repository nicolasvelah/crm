import React, { useEffect } from 'react';
import Menu from '../../components/Template';

const ClosurePage = () => {
  //const [catalogue, setCatalogue] = useState([{}]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  const data = (e: any) => {
    if (e === true) {
      //setStep(step + 1);
    }
  };

  return (
    <Menu page="Cierre">
      <>{/*  <Closure /> */}</>
    </Menu>
  );
};

export default ClosurePage;
