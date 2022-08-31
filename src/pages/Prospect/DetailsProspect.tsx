import React, { FunctionComponent, useEffect, useState } from 'react';
import { Divider, message } from 'antd';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import FormProspectV2 from '../../components/Prospect/FormProspectV2';

import Client from '../../data/models/Client';
import Leads from '../../data/models/Leads';

import Menu from '../../components/Template';
import MiniDetailsLead from '../../components/Lead/MiniDetailsLead';
import Loading from '../../components/Loading';
import Get from '../../utils/Get';
import ClientsRepository from '../../data/repositories/clients-repository';
import { Dependencies } from '../../dependency-injection';
import auth from '../../utils/auth';
import TimeLine from '../../components/Follow/TimeLine';

const later = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('time');
    }, timeout);
  });
};

const DetailsProspect: FunctionComponent<{ stepLead?: string }> = ({
  stepLead,
}) => {
  //console.log('RENDER DETAILSPROSPECT');
  const { user } = auth;
  return (
    <Menu page="Prospectos">
      <>{user && <MainDetailsProspect />}</>
    </Menu>
  );
};

const MainDetailsProspect: FunctionComponent<{}> = () => {
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const historyRouter = useHistory();
  const [myClient, setMyClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const componentdidmount = async () => {
      setLoading(true);

      const h: any = historyRouter;

      if (h.location && h.location.state && h.location.state.identification) {
        const { user } = auth;
        const clients = await clientsRepository.getClientsByIdentification(
          h.location.state.identification
        );
        //console.log('clients', clients);
        if (clients && clients.length > 0) {
          let leadsOfClient = clients[0].leads;
          if (user?.role !== 'JEFE DE VENTAS') {
            leadsOfClient = clients[0].leads?.filter(
              (myLead) => myLead.user.id === user!.id
            );
          }

          const myNewClient: Client = {
            ...clients[0],
            leads: leadsOfClient,
          };
          setMyClient(myNewClient);
        }
      }
      setLoading(false);
    };
    componentdidmount();
  }, []);

  const addLead = async () => {
    setLoading(true);
    const newLead: Leads = {
      id: 2,
      user: {
        nombre: 'Ana',
        apellido: 'Yerobi',
      },
      client: {
        name: 'Bryan',
        lastName: 'Juanacio',
      },
      temperature: 'Hot',
      quotes: [],
      state: 'inquiry',
    };
    await later(2000);
    setMyClient({ ...myClient, leads: [newLead] });

    setLoading(false);
  };

  //console.log('render MainDetailsProspect', myClient);
  return (
    <div>
      {myClient ? (
        <>
          {/* HEADER */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <div className="">
                <img
                  width={25}
                  src="https://www.flaticon.es/svg/static/icons/svg/748/748003.svg"
                  alt=""
                />
              </div>
              <div className="ml-2 text-2xl normal ">
                Prospecto{' '}
                <b className="c-black" style={{ textTransform: 'capitalize' }}>
                  {`${myClient.name} ${myClient.lastName}`.toLowerCase()}
                </b>
              </div>
            </div>
          </div>

          <Divider />
          {/* Datos/Seguimientos */}
          <div className="flex">
            <div className="w-1/2 m-4">
              <b className="text-xl">Datos Personales</b>
              <br />
              <br />

              <FormProspectV2
                type="edit"
                initData={myClient!}
                onUpdate={async (newClient: any) => {
                  //console.log('Actualizo', newClient);
                  const clientUpdate: Client = {
                    typeIdentification: newClient.type,
                    identification: newClient.id,
                    name: newClient.name,
                    lastName: newClient.lastName,
                    birthdate: newClient.birthdate,
                    cellphone: newClient.phone,
                    email: newClient.email,
                    chanel: newClient.canal,
                    campaign: newClient.campaign,
                    //leads: myClient.leads,
                    //tracings: myClient.tracings,
                  };
                  //console.log({ clientUpdate });

                  setLoading(true);
                  const isOk = await clientsRepository.updateClient(
                    myClient.identification!,
                    clientUpdate
                  );

                  setLoading(false);
                  if (isOk) {
                    message.success('Prospecto actualizado');
                    return true;
                  }
                  message.error(
                    'No se pudo actualizar los datos del Prospecto'
                  );
                  return false;
                }}
              />
            </div>

            <div className="flex flex-col items-center w-1/2 m-2">
              {' '}
              <h2 className="text-xl c-black m-0 p-0 flex">
                <img
                  className="mr-2"
                  src="https://www.flaticon.es/svg/static/icons/svg/892/892223.svg"
                  width="25"
                />{' '}
                Seguimientos del Prospecto
              </h2>
              <div>
                <span>
                  {moment()
                    .startOf('month')
                    .add(-3, 'month')
                    .format('YYYY/MM/DD')}
                </span>
                <span>
                  {' '}
                  -{' '}
                  {moment().endOf('month').add(3, 'month').format('YYYY/MM/DD')}
                </span>
              </div>
              <br />
              {myClient && (
                <TimeLine identification={myClient.identification!} />
              )}
            </div>
          </div>
          {/* NEGOCIOS */}
          {myClient.leads &&
            myClient.leads.length > 0 &&
            myClient.leads.map((lead: Leads, index: number) => (
              <MiniDetailsLead
                key={`miniLead_${index}`}
                lead={lead}
                identification={myClient.identification!}
              />
            ))}
        </>
      ) : (
        <div>
          <div>Prospecto No Encontrado</div>
        </div>
      )}
      <Loading visible={loading} />
    </div>
  );
};

export default DetailsProspect;
