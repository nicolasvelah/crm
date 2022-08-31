/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useEffect,
  useReducer,
  useState,
  FunctionComponent,
  createContext,
  useContext,
} from 'react';
import { BackTop } from 'antd';

import { useHistory, useParams } from 'react-router-dom';

import Menu from '../../components/Template';
import Inquiry from '../../components/Inquiry/Inquiry';
import MainCatalog from '../catalog/components/MainCatalog';
import DeliveryStep from './steps/delivery/DeliveryStep';
import Loading from '../../components/Loading';
import PreInvoice from './steps/pre-invoice/PreInvoice';
import GetClientData from '../../components/GetClientData';
import MainClousure from '../Closure/MainClosure';
import SwitchQuoteCredit from '../quote/components/SwitchQuoteCredit';
import VchatContext from '../Vchat/components/VchatContext';

export interface Prospect {
  socialReason: string | null;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  canal: string | null;
  campaign: string | null;
}

export interface TotalProspect {
  type: string | null;
  id: string | null;
  socialReason: string | null;
  name: string | null;
  lastName: string | null;
  birthdate: string | null;
  phone: string | null;
  email: string | null;
  canal: string | null;
  campaign: string | null;
  isPerson?: boolean;
}

export interface MyInfo {
  step: number;
  id: string;
  idLead: number;
  dataVehicle: any;
  vchat?: string;
}

export const InquiryContext = createContext<Object>({
  stepInqury: 0,
});

const dataTest = [
  {
    marca: 'JEEP 1',
    modelo: 'Cherokee',
    version: 'Longitude',
    anio: 2011,
    costo: 36000,
    urlPhoto:
      'https://firebasestorage.googleapis.com/v0/b/command-center-test-33f2e.appspot.com/o/jeep1.jpg?alt=media&token=c54d4999-b136-422d-b5cb-208061c0332a',
  },
  {
    marca: 'JEEP 2',
    modelo: 'Cherokee',
    version: 'Longitude',
    anio: 2011,
    costo: 36000,
    urlPhoto:
      'https://firebasestorage.googleapis.com/v0/b/command-center-test-33f2e.appspot.com/o/jeep1.jpg?alt=media&token=c54d4999-b136-422d-b5cb-208061c0332a',
  },
];

const dataTestBancos = [
  {
    banco: 'Banco del Pichincha',
    status: 'Preaprobado',
  },
  {
    banco: 'Produbanco',
    status: 'Rechazado',
  },
];

const Lead: FunctionComponent = () => {
  return (
    <Menu page="">
      <MainLead />
    </Menu>
  );
};

const MainLead = React.memo(() => {
  const historyRouter = useHistory();
  const myParams = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [actualStep, setActualStep] = useState<number>(0);
  const [isCredit, setIsCredit] = useState<boolean>(false);
  const [dataVehicle, setDataVehicle] = useState<Object | null>(null);
  const [paramsHistory, setParamsHistory] = useState<{
    idClient: string;
    idLead: number;
  } | null>(null);

  const { setVchatActivated, setCode } = useContext(VchatContext);

  const setViewProspect = (identification: string) => {
    historyRouter.push('/prospect/details', {
      identification,
    });
  };

  //const [store, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const componentdidmount = async () => {
      //console.log('ENTRO LEADS', { myParams });
      const stateVal: any = historyRouter.location.state;

      const stateHistory: MyInfo | undefined | null = stateVal;
      //console.log('history', stateHistory, loading);
      if (
        stateHistory &&
        typeof stateHistory.step === 'number' &&
        stateHistory.id &&
        typeof stateHistory.idLead === 'number'
      ) {
        //console.log('entro con todos los datos');
        setParamsHistory({
          idClient: stateHistory.id,
          idLead: stateHistory.idLead,
        });
        setActualStep(stateHistory.step);
        setLoading(false);
      }
    };
    componentdidmount();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const stateVal: any = historyRouter.location.state;

    const stateHistory: MyInfo | undefined | null = stateVal;
    //console.log({ stateHistory });
    if (stateHistory && stateHistory.dataVehicle) {
      //setDataVehicle(stateHistory.dataVehicle);
      //console.log('-----------------------++++++', stateHistory.dataVehicle);
    }
  }, [actualStep]);

  const nextStep = (myStep?: number) => {
    setActualStep(myStep ?? actualStep + 1);
  };

  if (loading || paramsHistory === null) {
    return <Loading visible />;
  }

  return (
    <GetClientData
      idClient={paramsHistory.idClient}
      idLead={paramsHistory.idLead}
      isCredit={isCredit}
      //actualStep={actualStep}
    >
      <div>
        {/*actualStep === 1 && <Inquiry nextStepLead={nextStep} />*/}

        {actualStep === 0 || actualStep === 1 ? (
          <MainCatalog
            nextStepLead={nextStep}
            setDataVehicle={setDataVehicle}
          />
        ) : null}
        {/*actualStep === 2 && (
          <SwitchQuoteCredit
            dataVehicleSelect={dataVehicle}
            nextStep={nextStep}
          />
        )*/}

        {(actualStep === 3 || actualStep === 2) && (
          <MainClousure nextStep={nextStep} />
        )}

        {actualStep === 4 && paramsHistory && (
          <PreInvoice
            data={{
              onNext: () => nextStep(5),
              onViewProspect: setViewProspect,
            }}
          />
        )}

        {actualStep === 5 && <DeliveryStep />}
      </div>
    </GetClientData>
  );
});

export default Lead;
