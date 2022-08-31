import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';
import { Button, Divider, Avatar } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import Quotes, { Vehicle, Accesories } from '../../../data/models/Quotes';
import NewCreditApplication from '../../lead/steps/new-credit-application/NewCreditApplication2';
import Client from '../../../data/models/Client';
import { ClientLeadContext } from '../../../components/GetClientData';
import auth from '../../../utils/auth';
import VehicleData from './VehicleData';
import Box from '../../quote/components/Box';
import { ServiceWithType } from './Closure';
import AccesoriesServices from './AccesoriesServices';
import FormClosure from './FormClosure';
import { formatServices } from '../util-clousre/util-closure';
import Reservation from '../../quote/components/Reservation';

const Closure: FunctionComponent<{
  actualQuote: Quotes;
  nextStep: Function;
}> = ({ actualQuote, nextStep }) => {
  const { client, lead } = useContext(ClientLeadContext);
  const [verSolicitud, setVerSolicitud] = useState<boolean>(false);
  const [actualAccessories, setActualAccessories] = useState<Accesories[]>(
    actualQuote.idAccesories ?? []
  );
  const [actualServices, setActualServices] = useState<ServiceWithType[]>(
    actualQuote.services ? formatServices(actualQuote.services) : []
  );
  const [vin, setVin] = useState<string | null>(
    actualQuote.vimVehiculo ?? null
  );
  const [reliceVehicleView, setReliceVehicleView] = useState<boolean>(
    !!actualQuote.vimVehiculo
  );

  const vehicle = actualQuote!.vehiculo![0];
  const { user } = auth;

  return (
    <div className="max-w-screen-lg m-auto">
      {verSolicitud && (
        <div className="text-right">
          <Button
            type="primary"
            onClick={() => {
              setVerSolicitud((prevState: boolean) => !prevState);
            }}
          >
            Cerrar solicitud
          </Button>
        </div>
      )}
      {verSolicitud ? (
        <ViewCreditApplication
          vehicle={vehicle}
          actualQuote={actualQuote}
          client={client!}
          concessionaire={user!.concessionaire!}
          name={user!.nombre!}
          roleUser={user!.role ?? 'ASESOR COMERCIAL'}
          concesionarioCode={lead?.concesionario?.code}
        />
      ) : (
        <div>
          <HeaderClosure />
          <Divider orientation="left">Datos Cliente</Divider>
          <ClientData client={client!} />
          <Divider orientation="left">
            <h3>
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </h3>
          </Divider>
          <VehicleData
            vehicle={vehicle}
            actualQuote={actualQuote}
            nextStep={nextStep}
            reliceVehicleView={reliceVehicleView}
            setReliceVehicleView={setReliceVehicleView}
            vin={vin}
            setVin={setVin}
          />
          <AccesoriesServices
            vehicle={vehicle}
            actualAccessories={actualAccessories}
            setActualAccessories={setActualAccessories}
            actualServices={actualServices}
            setActualServices={setActualServices}
          />

          <FormClosure
            actualQuote={actualQuote}
            vehicle={vehicle}
            actualAccessories={actualAccessories}
            actualServices={actualServices}
          />
          <FooterClousure
            vehicle={vehicle}
            verSolicitud={verSolicitud}
            vin={vin}
            setReliceVehicleView={setReliceVehicleView}
            actualQuote={actualQuote}
            idLead={lead!.id!}
            identificationClient={client!.identification!}
            nextStep={nextStep}
            reliceVehicleView={reliceVehicleView}
            setVerSolicitud={setVerSolicitud}
            setVin={setVin}
          />
        </div>
      )}
    </div>
  );
};

const ClientData: FunctionComponent<{ client: Client }> = ({ client }) => {
  return (
    <div className="flex flex-row justify-start">
      <div className="flex flex-col pr-4">
        <Avatar size={64} icon={<UserOutlined />} />
      </div>
      <div className="">
        <p className="leading-tight mb-0">{`Nombre: ${client!.name!} ${client!
          .lastName!}`}</p>
        <p className="leading-tight mb-0">
          {client?.identification
            ? `Identificación: ${client?.identification}`
            : ''}
        </p>
        <p className="leading-tight mb-0">
          {client?.phone ? `Teléfono: ${client?.phone}` : ''}
        </p>
        <p className="leading-tight mb-0">
          {client?.cellphone ? `Celular: ${client?.cellphone}` : ''}
        </p>
        <p className="leading-tight mb-0">
          {client?.email ? `Email: ${client?.email}` : ''}
        </p>
      </div>
    </div>
  );
};

const HeaderClosure = () => {
  return (
    <div className="">
      <div className="w-1/2 inline-block">
        <h2 className="text-black text-2xl">Cierre del Negocio</h2>
      </div>
      <div className="w-1/2 inline-block">
        <p className="mb-0 text-right">
          <b>Fecha:</b>
          <span>{moment().format('DD-MM-YYYY HH:mm')}</span>
        </p>
      </div>
    </div>
  );
};

const ViewCreditApplication: FunctionComponent<{
  vehicle: Vehicle;
  actualQuote: Quotes;
  client: Client;
  concessionaire: string;
  name: string;
  roleUser: string;
  concesionarioCode?: string;
}> = ({
  vehicle,
  actualQuote,
  client,
  concessionaire,
  name,
  roleUser = 'ASESOR COMERCIAL',
  concesionarioCode,
}) => {
  //Valor extra de es_kit de accesorios
  const valueEsKit = actualQuote.idAccesories?.reduce(
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
  return (
    <NewCreditApplication
      client={client}
      vehicle={{
        brand: vehicle.brand!,
        description: vehicle.description!,
        model: vehicle.model!,
        value: vehicle.pvp!,
        totalServices: null,
        totalAccesories: null,
        year: vehicle.year!,
        entrada: actualQuote.inputAmount!,
        financing: vehicle.pvp! - actualQuote.inputAmount!,
        monthlyPayments: actualQuote.monthly!,
        plazo: actualQuote.months!,
        tasa: actualQuote.rate!,
        valueExtraEsKit: valueEsKit ?? 0,
      }}
      user={{
        concessionaire,
        name,
        place: 'ejemplo',
        role: roleUser,
        sucursal: '',
      }}
      idQuoute={actualQuote.id!}
      nextStep={() => {}}
      concesionarioCode={concesionarioCode}
    />
  );
};

const FooterClousure: FunctionComponent<{
  setVerSolicitud: Function;
  verSolicitud: boolean;
  actualQuote: Quotes;
  vehicle: Vehicle;
  idLead: number;
  identificationClient: string;
  vin: string | null;
  setVin: Function;
  nextStep: Function;
  reliceVehicleView: boolean;
  setReliceVehicleView: Function;
}> = ({
  setVerSolicitud,
  verSolicitud,
  actualQuote,
  vehicle,
  idLead,
  identificationClient,
  vin,
  setVin,
  nextStep,
  reliceVehicleView,
  setReliceVehicleView,
}) => {
  useEffect(() => {
    //console.log({ vin, quote: actualQuote.discount });
  }, []);
  return (
    <>
      {actualQuote.type === 'credit' && (
        <Button
          type="primary"
          ghost
          onClick={() => {
            setVerSolicitud((prevState: boolean) => !prevState);
          }}
          icon={<CreditCardOutlined />}
          className="mr-2"
        >
          {verSolicitud ? 'Cerrar solicitud' : 'Solicitud de crédito'}
        </Button>
      )}

      <Box
        disabledReserveButton={!!actualQuote.reserveValue}
        data={vehicle}
        leadId={idLead}
        clientCi={identificationClient}
      />

      <Reservation
        codigo={vehicle.code!}
        quoteId={actualQuote.id!}
        disabledReserveButton={false}
        reliceVehicleView={reliceVehicleView}
        setReliceVehicleView={setReliceVehicleView}
        setVin={setVin}
        vin={[]}
      />

      {vin ? (
        <Button
          className="ml-2"
          type="primary"
          danger
          style={{
            backgroundColor: '#fff',
            borderColor: '#2e7d32',
            color: '#2e7d32',
          }}
          onClick={() => nextStep()}
          icon={<ArrowRightOutlined />}
        >
          Prefacturar
        </Button>
      ) : null}
    </>
  );
};
export default Closure;
