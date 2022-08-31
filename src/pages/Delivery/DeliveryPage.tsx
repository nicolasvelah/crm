import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import Menu from '../../components/Template';
import auth from '../../utils/auth';

import GetClientData from '../../components/GetClientData';
import DeliveryMain from './components/DeliveryMain';

const DeliveryMainPage: FunctionComponent = () => {
  const historyRouter = useHistory();
  const stateVal: any = historyRouter.location.state;
  if (!stateVal || !stateVal.identification || !stateVal.idLead) {
    return <div>Negocio no encontrado</div>;
  }
  return (
    <GetClientData
      idClient={stateVal.identification}
      idLead={stateVal.idLead}
      isCredit={false}
      actualStep={9}
      wallet={false}
    >
      <DeliveryMain />
    </GetClientData>
  );
};

const DeliveryPage: FunctionComponent = () => {
  const { user } = auth;
  if (!user) return <div />;
  return (
    <Menu page="Entrega">
      <>{user.id !== -1 && <DeliveryMainPage />}</>
    </Menu>
  );
};

export default DeliveryPage;
