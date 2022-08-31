import React, { useEffect } from 'react';
import Menu from '../../components/Template';
import DetailFollow from './components/DetailFollow';

const DetailFollowPage = () => {
  //const [catalogue, setCatalogue] = useState([{}]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  const data = (e: any) => {
    if (e === true) {
      //setStep(step + 1);
    }
  };
  return (
    <Menu page="Seguimiento">
      <DetailFollow idInputModal={null} />
    </Menu>
  );
};

export default DetailFollowPage;
