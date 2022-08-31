import React, {
  FunctionComponent,
  useReducer,
  useContext,
  useEffect,
  useState,
  ComponentElement,
  ReactChild,
} from 'react';
import moment from 'moment';
import { message, Result } from 'antd';
import { useHistory } from 'react-router-dom';
import { Subscription } from 'rxjs';
import Leads from '../data/models/Leads';
import Quotes from '../data/models/Quotes';
import Client from '../data/models/Client';
import BusinessLine from './Business/BusinessLine';
import BusinessDetail from './Business/BusinessDetail';
import Loading from './Loading';
import Get from '../utils/Get';
import ClientsRepository from '../data/repositories/clients-repository';
import { Dependencies } from '../dependency-injection';
import LeadsRepository from '../data/repositories/leads-repository';
import { NOTIFICATION_TYPES } from '../utils/types-notification';
import INotification from '../data/models/Notification';
import SocketClient from '../utils/socket-client';
import VchatContext from '../pages/Vchat/components/VchatContext';

export interface ClientLead {
  client: Client | null;
  lead: Leads | null;
  setLead: Function | null;
}

export const ClientLeadContext = React.createContext<ClientLead>({
  client: null,
  lead: null,
  setLead: null,
});

const GetClientData: FunctionComponent<{
  idLead: number;
  idClient: string;
  isCredit: boolean;
  actualStep?: number;
  children: any;
  wallet?: boolean;
}> = ({ idLead, idClient, isCredit, actualStep, children, wallet = false }) => {
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const leadRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const historyRouter = useHistory();

  const [loading, isLoading] = useState<boolean>(true);
  const [client, setClient] = useState<Client | null>(null);
  const [lead, setLead] = useState<Leads | null>(null);
  const [temperature, setTemperature] = useState<any>();

  /// Suscripcion a WS
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const { setVchatActivated, setCode } = useContext(VchatContext);

  const getActualStep = (myLead: Leads): number => {
    //console.log('lead getActualStep', myLead);
    /* const okPrebill = myLead.prebill?.reduce((accumulator, currentValue) => {
      if (currentValue.status === 'APRPROVED') {
        return accumulator + 1;
      }
      return accumulator;
    }, 0); */
    if (
      myLead.prebill &&
      myLead.prebill[myLead.prebill.length - 1]?.status === 'APPROVED'
    ) {
      return 5;
    }
    const noVim = myLead.quotes?.filter((quo) => {
      return (
        quo.vimVehiculo && quo.registration !== null && quo.registration !== 0
      );
    }).length;
    const noClosed = myLead.quotes?.filter((quo) => quo.closed === true).length;
    //console.log({ noVim, noClosed });
    if (
      typeof noVim === 'number' &&
      typeof noClosed === 'number' &&
      noVim !== 0 &&
      noVim === noClosed
    ) {
      return 4;
    }

    if (
      myLead.quotes &&
      myLead.quotes.length > 0 &&
      myLead.quotes.find((q) => q.closed === true)
    ) {
      return 3;
    }
    if (myLead.quotes && myLead.quotes.length > 0) {
      return 2;
    }

    if (myLead.inquiry && myLead.inquiry.length > 0) {
      return 1;
    }

    /* const okAllQuotes = myLead.quotes.reduce((accumulator, currentValue) => {
      if (currentValue.vimVehiculo && currentValue.reserveValue) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
    //console.log({okAllQuotes});

    if (myLead.quotes.length !== okAllQuotes) {
      return 2;
    } */

    return 0;
  };

  const quoteStatusUpdate = (
    idQuote: number,
    authorizathionStatus: 'Autorizado' | 'Rechazado',
    approvedBy?: string
  ) => {
    const quotes: any = lead?.quotes;
    const routesUser = lead?.quotes?.map((data) => {
      return data.id;
    });
    const index = routesUser?.indexOf(idQuote);

    if (quotes?.length > 0) {
      quotes[index!] = {
        ...quotes[index!],
        delivery: {
          ...quotes[index!].delivery,
          authorizathionStatus,
          approvedBy: approvedBy ?? null,
        },
      };
    }
    return quotes;
  };

  ///Metodo para la notificacion WALLET_CONFIRM_DOCUMENTS
  const notificationOfConfirmDocument = (noti: INotification) => {
    try {
      if (lead && noti.content && noti.content.idLead === lead.id) {
        const { content } = noti;
        //console.log('cahnge wallet', noti.content);
        setLead((prevState) => ({
          ...prevState!,
          quotes: quoteStatusUpdate(
            content.idQuote,
            content.status === 'APPROVED' ? 'Autorizado' : 'Rechazado',
            content.approvedBy ?? null
          ),
        }));
      }
    } catch (error) {
      //console.log('Error en notificationOfConfirmDocument', error.message);
    }
  };

  ///Metodo para la notificacion SALE_DOWN
  const notificationOfSaleDown = (noti: INotification) => {
    try {
      if (lead && noti.content && noti.content.idLead === lead.id) {
        setLead((prevState) => ({
          ...prevState!,
          statusSaleDown: 'solicitada',
          commentSaleDown: noti.content.comment,
        }));
      }
    } catch (error) {
      //console.log('Error en notificationOfConfirmDocument', error.message);
    }
  };

  /// Metodo para la notificacion SALE_DOWN_APROVED
  const notificationOfSaleDownAproved = (noti: INotification) => {
    try {
      if (lead && noti.content && noti.content.idLead === lead.id) {
        setLead((prevState) => {
          const copia = prevState;
          if (copia) {
            copia.saleDown = noti.content.accepted;
            copia.statusSaleDown = noti.content.accepted
              ? 'aceptada'
              : 'rechazada';
            if (noti.content.accepted) {
              const newQuotes = copia.quotes?.map((quo) => {
                const copiaQuo = quo;
                if (quo.vimVehiculo) {
                  copiaQuo.vimVehiculo = null;
                  copiaQuo.vimVehiculoData = null;
                }
                return copiaQuo;
              });
              copia.quotes = newQuotes;
            }
            return {
              ...copia,
            };
          }
          return prevState;
        });
      }
    } catch (error) {
      //console.log('Error en notificationOfConfirmDocument', error.message);
    }
  };

  /// Metodo para la notificacion QUOTERESERVEVALUE
  const notificationOfReserve = (noti: INotification) => {
    try {
      if (lead && noti.content && noti.content.idLead === lead.id) {
        setLead((prevState) => {
          try {
            const newData: Leads = prevState!;
            if (newData) {
              return {
                ...newData,
                quotes: newData.quotes!.map((data: Quotes) => {
                  const dataUpdate = {
                    ...data,
                    reserveValue:
                      data.id === noti.content.idQuote
                        ? noti.content.reserveValue
                        : data.reserveValue,
                  };
                  return dataUpdate;
                }),
              };
            }
            return prevState;
          } catch (error) {
            //console.log('Error setState notification:', error.message);
            return prevState;
          }
        });
      }
    } catch (error) {
      //console.log('Error notificationOfReserve', error.message);
    }
  };

  /// Metodo realTime, aqui traeremos la notificación
  const onNotificationListener = (noti: INotification) => {
    //console.log('noti', noti);
    // noti es una notificacion desde el ws
    if (noti.type === NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED) {
      try {
        //console.log('noti', noti);
        //console.log('lead', lead);
        if (lead && noti.content && noti.content.idLead === lead.id) {
          //console.log('Entro');
          setLead((prevState) => {
            try {
              const copia = prevState;
              if (copia) {
                copia.prebill = [
                  {
                    accepted: noti.content.prebill.accepted,
                    createdAt: moment().valueOf().toString(),
                    descuento: noti.content.prebill.descuento,
                    id: noti.content.prebill.id,
                    idPrefacturaCRM: noti.content.prebill.idPrefacturaCRM,
                    notes: noti.content.notes,
                    payThirdPerson: noti.content.prebill.payThirdPerson,
                    status: noti.content.status,
                    updateAt: moment().valueOf().toString(),
                  },
                ];
                //console.log('{ ...copia }', { ...copia });
                return { ...copia };
              }
              return prevState;
            } catch (error) {
              //console.log('Error setState notification:', error.message);
              return prevState;
            }
          });
        }
      } catch (error) {
        //console.log('Error notificacion', error.message);
      }
    } else if (noti.type === NOTIFICATION_TYPES.WALLET_STATUS_CHANGED) {
      notificationOfConfirmDocument(noti);
    } else if (noti.type === NOTIFICATION_TYPES.SALE_DOWN) {
      notificationOfSaleDown(noti);
    } else if (noti.type === NOTIFICATION_TYPES.SALE_DOWN_APROVED) {
      notificationOfSaleDownAproved(noti);
    } else if (noti.type === NOTIFICATION_TYPES.QUOTERESERVEVALUE) {
      notificationOfReserve(noti);
    } else if (noti.type === NOTIFICATION_TYPES.PUBLIC_CATALOG) {
      notificationOfReserve(noti);
    }
  };

  useEffect(() => {
    const componentdidimount = async () => {
      const leadById = await leadRepository.getLeadById(idLead);

      console.log('NEGOCIO ACTUAL 👉👉👉', { leadById });

      if (leadById) {
        /// pagina actual
        const actualPath = historyRouter.location.pathname;
        //console.log('Actual page', actualPath);
        /// verificacion de la pagina principal del negocio
        const isPageLead = actualPath.includes('/lead/id-lead=');
        /// parametro que sirve para saber si voy de Delivery al Negocio
        const stateVal: any = historyRouter.location.state;
        const { fromDelivery, vchat } = stateVal;
        /// Prefactura actual
        /* const actualPrebill = leadById.prebill
          ? leadById.prebill.length > 0
            ? leadById.prebill[0]
            : null
          : null; */
        const actualPrebill = leadById.prebill
          ? leadById.prebill[leadById.prebill.length - 1]
          : null;
        //console.log({
        //   isPageLead,
        //   actualPrebill,
        //   status: actualPrebill?.status === 'APPROVED',
        //   fromDelivery,
        // });

        if (
          isPageLead &&
          actualPrebill?.status === 'APPROVED' &&
          !fromDelivery
        ) {
          //console.log('ENTROOOOOOO!!!!!');
          historyRouter.push('/delivery', {
            identification: leadById.client.identification,
            idLead: leadById.id,
            vchat,
          });
          return;
        }

        /// Abrir Vchat
        if (vchat && setVchatActivated && setCode) {
          setCode(vchat);
          setVchatActivated(true);
        }

        Get.put(leadById.client, { name: 'lead-client', override: true });
        setClient(leadById.client);
        setTemperature(leadById.temperature);
        Get.put(leadById, { name: 'lead', override: true }); // save the client to be accessed from all Lead steps
        setLead(leadById);
      } else {
        message.error('Algo salió mal, vuelve a intentarlo.');
      }

      isLoading(false);
    };
    componentdidimount();
    return () => {
      if (setVchatActivated) setVchatActivated(false);
      if (setCode) setCode(null);
    };
  }, []);

  useEffect(() => {
    ///Verifico si lead existe y no hay una suscripcion
    if (lead && !subscription) {
      setSubscription(
        SocketClient.instance.onNotificationStream.subscribe(
          onNotificationListener
        )
      );
    }
  }, [lead]);

  if (loading) return <Loading visible />;
  if (!loading && !lead) {
    return (
      <div>
        <Result
          status="warning"
          title="Ocurrió algún problema con la operación. Vuelve a intentarlo."
        />
      </div>
    );
  }
  return (
    <ClientLeadContext.Provider value={{ client, lead, setLead }}>
      {wallet === true ? (
        <div>{children}</div>
      ) : (
        <BusinessLine
          //stepLead={actualStep}
          stepLead={lead ? actualStep ?? getActualStep(lead) : 0}
          progressDot={false}
          vertical
          idLead={lead?.id!}
          identification={client?.identification!}
          isCredit={isCredit}
          rightChild={<BusinessDetail prospect={client!} />}
          prospectData={client!}
          temperatureDefect={temperature}
        >
          {children}
        </BusinessLine>
      )}
    </ClientLeadContext.Provider>
  );
};

export default GetClientData;
