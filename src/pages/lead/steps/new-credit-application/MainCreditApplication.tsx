import React, {
  FunctionComponent,
  useReducer,
  useContext,
  useEffect,
  useState,
  ComponentElement,
} from 'react';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import GetClientData, {
  ClientLeadContext,
} from '../../../../components/GetClientData';

import Client from '../../../../data/models/Client';
import NewCreditApplication from './NewCreditApplication2';
import { Vehicle } from '../../../../data/models/Vehicle';
import { SwitchQuoteCreditContext } from '../../../quote/components/SwitchQuoteCredit';
import auth from '../../../../utils/auth';
import { calcTotal, calcLegals } from '../../../../utils/extras';

const MainCreditApplication: FunctionComponent<{ nextStep: Function }> = ({
  nextStep,
}) => {
  const { client, lead } = useContext(ClientLeadContext);
  const { isCreditView, setIsCreditView, idQuote, setIdQuote } = useContext(
    SwitchQuoteCreditContext
  );
  const [myCar, setMyCar] = useState<Vehicle | null>(null);
  const [loadingCar, setLoadingCar] = useState<boolean>(false);

  const selectQuote = (idQuo: number) => {
    setLoadingCar(true);
    //console.log('Holaaa quote', idQuo, lead?.quotes);
    const myQuote = lead?.quotes?.find((qu) => qu.id === idQuo);
    //console.log('myQuote-------', myQuote);

    const insuranceCarrierAmmount = myQuote!.insuranceCarrier!
      ? myQuote!.insuranceCarrier!.cost! * myQuote!.insuranceCarrier!.years!
      : 0;
    const legalsAmount = calcLegals(myQuote!.vehiculo![0].pvp!, true);
    const total =
      myQuote!.vehiculo![0].pvp! +
      myQuote!.accesoriesValue! +
      myQuote!.servicesValue! +
      (legalsAmount - (legalsAmount - legalsAmount / 1.12)) +
      insuranceCarrierAmmount +
      (myQuote!.registration! ? myQuote!.registration! : 0);

    const financing =
      calcTotal(
        total,
        myQuote!.vehiculo![0].pvp!,
        myQuote!.registration!,
        insuranceCarrierAmmount,
        false
      ) -
      myQuote!.inputAmount! -
      myQuote!.registration!;

    if (myQuote) {
      //Valor extra de es_kit de accesorios
      const valueEsKit = myQuote.idAccesories?.reduce(
        (acumulador, valorActual) => {
          if (valorActual.es_kit === 1) {
            return (
              acumulador +
              (valorActual.cost
                ? valorActual.cost * (valorActual.quantity ?? 0)
                : 0)
            );
          }
          return acumulador;
        },
        0
      );

      setMyCar({
        brand: myQuote!.vehiculo![0]!.brand!,
        description: myQuote!.vehiculo![0]!.description!,
        model: myQuote!.vehiculo![0]!.model!,
        value: myQuote!.vehiculo![0].pvp!,
        totalServices: myQuote!.servicesValue ?? 0,
        totalAccesories: myQuote!.accesoriesValue ?? 0,
        year: myQuote!.vehiculo![0].year!,
        entrada: myQuote!.inputAmount!,
        financing,
        monthlyPayments: myQuote!.monthly!,
        plazo: myQuote!.months!,
        tasa: myQuote!.rate!,
        valueExtraEsKit: valueEsKit ?? 0,
      });
      setIdQuote(idQuo);
    }
    setTimeout(() => {
      setLoadingCar(false);
    }, 500);
  };
  useEffect(() => {
    //console.log('idQuote', idQuote);
    if (idQuote) {
      selectQuote(idQuote);
    }
  }, [lead]);
  //console.log('RENDER MainCreditApplication');

  const { user } = auth;

  if (!client || !lead || !user) {
    return <div> CLIENTE NO ENSCONTRADO</div>;
  }
  return (
    <>
      {loadingCar && (
        <div className="flex justify-center">
          <Spin />
        </div>
      )}
      {myCar && !loadingCar && idQuote && lead && (
        <>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setIsCreditView((prevState: boolean) => !prevState);
            }}
          >
            Volver a cotización
          </Button>
          <br />
          <br />
          <NewCreditApplication
            user={{
              name: user.nombre || '',
              concessionaire: user.concessionaire || '',
              place: 'Quito',
              role: user.role ?? 'ASESOR COMERCIAL',
              sucursal: '',
            }}
            vehicle={myCar}
            client={client}
            idQuoute={idQuote}
            nextStep={nextStep}
            concesionarioCode={lead?.concesionario?.code}
          />
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setIsCreditView((prevState: boolean) => !prevState);
            }}
          >
            Volver a cotización
          </Button>
        </>
      )}
      {/* <NewCreditApplication
        user={{
          name: store.user.nombre,
          concessionaire: store.user.concessionaire,
          place: 'Quito',
        }}
        /* vehicle={{
            entrada: 5000,
            financing: 10000,
            model: 'Test',
            monthlyPayments: 400,
            plazo: 30,
            tasa: 12,
            value: 15000,
            year: 2019,
          }} *
        vehicle={{
          entrada: 5000,
          financing: 10000,
          model: 'Test',
          monthlyPayments: 400,
          plazo: 30,
          tasa: 12,
          value: 22222,
          year: 2019,
        }}
        client={client}
        idQuoute={49}
        nextStep={nextStep}
      /> */}
    </>
  );
};

const SelectQuoteCredit: FunctionComponent<{ selectCar?: Function }> = () => {
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          //console.log('clikﬂ');
        }}
      >
        Ver solicitud de crèdito
      </Button>
    </div>
  );
};

export default MainCreditApplication;
