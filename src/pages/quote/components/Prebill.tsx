/* eslint-disable camelcase */
import {
  Badge,
  Button,
  Descriptions,
  Input,
  Tag,
  Result,
  notification,
  Spin,
} from 'antd';
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Subscription } from 'rxjs';

import Client from '../../../data/models/Client';
import {
  currenyFormat,
  calcTotalQuotesGenerated,
  calcLegals,
} from '../../../utils/extras';
import milisecondsToDate from '../../../utils/milisecondsToDate';
import {
  Prebill as PrebillInterface,
  PrebillNote,
} from '../../../data/models/PreBill';
import auth from '../../../utils/auth';
import User from '../../../data/models/User';
import { Dependencies } from '../../../dependency-injection';
import PreBillsRepository from '../../../data/repositories/prebills-repository';
import Get from '../../../utils/Get';
import { PrebillInput } from '../../../data/providers/apollo/mutations/prebills';

import SocketClient from '../../../utils/socket-client';
import { NOTIFICATION_TYPES } from '../../../utils/types-notification';
import INotification from '../../../data/models/Notification';
import { ClientLeadContext } from '../../../components/GetClientData';
import Leads from '../../../data/models/Leads';
import Quotes from '../../../data/models/Quotes';
import toPrint from './../../../utils/templates-html/toPrintTemplate';
import { templatePrefactura } from './../../../utils/templates-html/template-prefactura';

interface SummaryValues {
  totalValueVehicles: number;
  totalValueInsurance: number;
  totalValuesServices: number;
  totalValuesAccesories: number;
  totalMargen: number;
  totalValues: number;
  totalValueVehiclesWithoutLegals: number;
}

type PrebillStatus = 'NONE' | 'REQUESTED' | 'REJECTED' | 'APPROVED';

const { TextArea } = Input;

const Prebill: FunctionComponent<{
  client: Client;
  vehiclesToShow: any[];
  lead: Leads;
  descuento: number;
  payThirdPerson: boolean;
  delivery?: boolean;
}> = ({
  client,
  vehiclesToShow,
  lead,
  descuento,
  payThirdPerson,
  delivery,
}) => {
  const prebillsRepository = Get.find<PreBillsRepository>(
    Dependencies.prebills
  );

  const { setLead } = useContext(ClientLeadContext);

  const [allAccesoriesServices, setAllAccesoriesServices] = useState<any[]>([]);
  const [totalSummaryValues, setTotalSummaryValues] = useState<SummaryValues>({
    totalValueVehicles: 0,
    totalValueInsurance: 0,
    totalValuesServices: 0,
    totalValuesAccesories: 0,
    totalMargen: 0,
    totalValues: 0,
    totalValueVehiclesWithoutLegals: 0,
  });
  const [prebillStatus, setPrebillStatus] = useState<PrebillStatus>('NONE');
  const [textAreaUser, setTextAreaUser] = useState<string | null>(null);
  const [prebill, setPrebill] = useState<PrebillInterface | null>(null);
  const [notes, setNotes] = useState<PrebillNote[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [discountMount, setDiscountMount] = useState<number>(0);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const historyRouter = useHistory();

  const { user } = auth;
  const asesor = lead.user;

  const getAllAccesoriesServices = () => {
    let all: any[] = [];
    vehiclesToShow.forEach((vh: any) => {
      if (vh.idAccesories) {
        all = [...all, ...vh.idAccesories];
      }
    });
    //console.log('all', all);
    setAllAccesoriesServices(all);
  };

  const getTotalValues = () => {
    //console.log('vehiclesToShow', vehiclesToShow);
    let totalVh = 0;
    let totalInsurance = 0;
    let totalServices = 0;
    let totalAccesories = 0;
    let totalMargen = 0;
    let totalVhWithoutLegals = 0;

    vehiclesToShow.forEach((vh) => {
      let valorVehiculo = 0;
      if (
        vh.vehiculo &&
        vh.vehiculo.length > 0 &&
        typeof vh.vehiculo[0].pvp === 'number'
      ) {
        if (lead.discount) {
          valorVehiculo =
            vh.vehiculo[0].pvp - vh.vehiculo[0].pvp * (lead.discount * 0.01);

          setDiscountMount((prevState) => {
            return (
              prevState + vh.vehiculo[0].pvp * ((lead.discount ?? 0) * 0.01)
            );
          });
        } else {
          valorVehiculo = vh.vehiculo[0].pvp;
        }
      }
      //console.log('valorVehiculo', valorVehiculo);
      totalVh += valorVehiculo;
      totalVhWithoutLegals += valorVehiculo;
      totalInsurance += vh.insuranceCarrier ? vh.insuranceCarrier.cost : 0;
      totalAccesories += vh.accesoriesValue ?? 0;
      //totalMargen += vh.vehiculo[0].margen ?? 0;
      totalMargen += vh.vimVehiculoData?.margen ?? 0;
      totalServices += vh.servicesValue ?? 0;

      ///Calcula legales
      if (
        vh.type === 'credit' &&
        vh.vehiculo &&
        vh.vehiculo.length > 0 &&
        typeof vh.vehiculo[0].pvp === 'number'
      ) {
        const legales = calcLegals(vh.vehiculo[0].pvp, true) / 1.12;
        //console.log('LEGALES', legales);
        //console.log('Sin legales', totalVh);
        totalVh += legales;
      }
    });

    //console.log('totalVh', totalVh);
    setTotalSummaryValues({
      totalValueVehicles: totalVh,
      totalValueInsurance: totalInsurance,
      totalValuesServices: totalServices,
      totalValuesAccesories: totalAccesories,
      totalMargen,
      totalValues:
        //totalVh + totalInsurance / 1.12 + totalServices + totalAccesories,
        (vehiclesToShow[0].exonerated ? totalVh : totalVh * 1.12) +
        totalInsurance +
        totalServices * 1.12 +
        totalAccesories * 1.12,
      totalValueVehiclesWithoutLegals: totalVhWithoutLegals,
    });
    //console.log({
    //   totalVh,
    //   totalInsurance,
    //   totalServices,
    //   totalAccesories,
    //   totalMargen,
    // });
  };

  const setActualPrebill = () => {
    //console.log({ lead });

    if (lead && lead.prebill && lead.prebill.length > 0) {
      // const prebillActual = lead.prebill[0];
      const prebillActual = lead.prebill[lead.prebill.length - 1];
      // console.log('prebillActual -->', prebillActual);

      setPrebill(prebillActual ?? null);
      if (prebillActual?.status) {
        const state: any = prebillActual.status;
        setPrebillStatus(state);
      }
      if (prebillActual?.notes) {
        setNotes(prebillActual.notes);
      }
    }
  };

  /// Metodo realTime, aqui traeremos la notificación
  const onNotificationListener = (noti: INotification) => {
    //console.log('noti', noti);
    // noti es una notificacion desde el ws
    if (noti.type === NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED) {
      // console.log('noti', noti);
      if (noti.content && noti.content.idLead === lead.id) {
        //vconsole.log('lead prebill -->', lead?.prebill);
        // console.log('prebill -->', prebill);
        setPrebillStatus(noti.content.status);
        const newPrebill =
          noti.content.prebill ?? (prebill ? { ...prebill } : null);
        // console.log('newPrebill -->', newPrebill);
        if (newPrebill && newPrebill.leads) {
          delete newPrebill.leads;
        }
        if (newPrebill) {
          newPrebill.status = noti.content.status;
          newPrebill.notes = noti.content?.notes ?? [];
        }
        setPrebill(newPrebill);
        setNotes(newPrebill?.notes ?? []);
        if (setLead) {
          setLead((prevState: Leads) => ({
            ...prevState,
            prebill: [newPrebill],
          }));
        }
        //}
      }
    }
  };

  useEffect(() => {
    /// Nos suscribimos a las notificaciones
    setSubscription(
      SocketClient.instance.onNotificationStream.subscribe(
        onNotificationListener
      )
    );
    getAllAccesoriesServices();
    getTotalValues();
    setActualPrebill();
    //console.log('debug_0', { client, vehiclesToShow, lead });
  }, []);

  const onCommentChange = (value: string) => {
    setTextAreaUser(value);
  };

  const acceptOrDeclinePrebill = async (accepted: boolean) => {
    //console.log('acceptOrDeclinePrebill', prebill);
    if (!prebill || !prebill?.id) return;
    setFetching(true);
    // const note = this.comment.trim().length > 0 ? {} : undefined;
    const userToSend = auth.user!;
    const note = {
      id: userToSend.id!,
      type: userToSend.role!,
      name: `${userToSend.nombre} ${userToSend.apellido}`,
      texto: textAreaUser!,
    };

    let idsQuotes: number[] | null = null;

    if (accepted) {
      idsQuotes = vehiclesToShow.map((vh) => vh.id);
    }

    const dataToSend = {
      id: prebill.id,
      accepted,
      note,
      idsQuotes,
    };
    console.log('acceptOrDecline -->', dataToSend);
    const result = await prebillsRepository.acceptOrDecline(dataToSend);

    if (result) {
      setNotes((prevState) => [...prevState, note]);
      setPrebillStatus(accepted ? 'APPROVED' : 'REJECTED');
      if (setLead) {
        setLead((prevState: Leads) => {
          const copiaLead = { ...prevState };
          if (accepted) {
            const newQuotes = prevState.quotes?.map((quo) => {
              const copiaQuo = quo;
              if (copiaQuo.closed === true) {
                copiaQuo.delivery = {
                  authorizathionStatus: 'Pendiente',
                  deliveryFinal: false,
                };
              }
              return copiaQuo;
            });
            copiaLead.quotes = newQuotes;
          }

          copiaLead.prebill = [
            {
              id:
                prevState?.prebill && prevState.prebill.length > 0
                  ? prevState?.prebill![0].id
                  : undefined,
              notes: [...notes, note],
              accepted,
              descuento,
              payThirdPerson,
              status: accepted ? 'APPROVED' : 'REJECTED',
            },
          ];
          return copiaLead;
        });
      }
    } else {
      notification.error({
        placement: 'bottomLeft',
        message: 'Error',
        description: 'No se pudo procesar tu solicitud',
      });
    }
    setFetching(false);
  };

  const sendPreInvoce = async () => {
    setFetching(true);
    const userToSend = auth.user!;
    const notesToSend =
      textAreaUser && textAreaUser.trim().length === 0
        ? []
        : [
            {
              id: userToSend.id!,
              type: userToSend.role!,
              name: `${userToSend.nombre} ${userToSend.apellido}`,
              texto: textAreaUser!,
            },
          ];
    const prebillInput: PrebillInput = {
      descuento,
      payThirdPerson,
      notes: notesToSend,
    };

    //console.log('🔴 notesToSend', notesToSend);
    console.log('dataToSendPrebill createPrebill -->', {
      id: lead!.id!,
      prebillInput,
    });
    const result = await prebillsRepository.createPrebill(
      lead!.id!,
      prebillInput
    );
    //console.log('🔴 notes', notes);
    //const result = true;
    setFetching(false);

    if (result) {
      if (notes.length > 0) {
        // si se envia un comentario al moento de solicitar la aprobacion
        setNotes((prevState) => [...prevState, notesToSend[0]]);
      }
      notification.success({
        placement: 'bottomRight',
        duration: 4,
        message: 'Se ha enviado la prefactura a aprobación',
      });
      setPrebillStatus('REQUESTED');

      /* const prebill = await prebillsRepository.getPrebillByLead(
        this.lead!.id!
      );
      if (prebill) {
        this.prebill = prebill;
      } */

      // this.onNext();
    } else {
      notification.error({
        placement: 'bottomLeft',
        message: 'Error',
        description: 'No se pudo crear la prefactura',
      });
    }
  };

  const requestAgain = async () => {
    setFetching(true);
    const userToSend = auth.user!;
    //console.log('AUTH✅✅', userToSend);
    const note = {
      id: userToSend.id!,
      type: userToSend.role!,
      name: `${userToSend.nombre} ${userToSend.apellido}`,
      texto: textAreaUser!,
    };

    const dataToSendPrebill = {
      idPrebill: prebill!.id!,
      descuento,
      note,
      payThirdPerson,
    };
    console.log('dataToSendPrebill requestAgain -->', dataToSendPrebill);
    const sent = await prebillsRepository.updatePrebillCreated(
      dataToSendPrebill
    );

    if (sent) {
      notification.success({
        placement: 'bottomRight',
        duration: 4,
        message: 'Se ha enviado la prefactura a aprobación',
      });
      setNotes((prevState) => [...prevState, note]);
      setPrebillStatus('REQUESTED');
    } else {
      notification.error({
        placement: 'bottomLeft',
        message: 'Error',
        description: 'No se pudo crear la prefactura',
      });
    }
    setFetching(false);
  };

  const notesRender = () => {
    if (notes.length === 0) return <div />;
    return (
      <div>
        <h3 className="bold">Comentarios</h3>
        {notes.map((item, index) => (
          <div className="mb-3" key={`${index}`}>
            <small className="regular" style={{ textTransform: 'capitalize' }}>
              {(item.name || '').toLowerCase()}{' '}
              <b className="bold">({item.type.toLowerCase()})</b>
            </small>
            <p className="normal">{item.texto}</p>
          </div>
        ))}
      </div>
    );
  };

 /*  useEffect(() => {
    console.log('prebillStatus -->', prebillStatus);
  }, [prebillStatus]);

  useEffect(() => {
    console.log('lead change -->', lead);
  }, [lead]); */

  let tagColor = 'default';
  let spanishStatus = '';
  switch (prebillStatus) {
    case 'NONE':
      tagColor = 'default';
      break;
    case 'REQUESTED':
      tagColor = 'gold';
      spanishStatus = 'Solicitado';
      break;
    case 'APPROVED':
      tagColor = 'green';
      spanishStatus = 'Aprobado';
      break;
    default:
      tagColor = 'red';
      spanishStatus = 'Rechazado';
  }

  return (
    <>
      <table className="PreBillCatalog">
        <thead>
          <tr>
            <th colSpan={2}>Datos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
                <b>Nombre:</b>
                <span style={{ marginLeft: 4 }}>
                  {client.name} {client.lastName}
                </span>
              </div>
              <div>
                <b>
                  {client.typeIdentification === 'CEDULA'
                    ? 'Cédula'
                    : client.typeIdentification === 'RUC'
                    ? 'Ruc'
                    : 'Pasaporte'}
                  :
                </b>
                <span style={{ marginLeft: 4 }}>{client.identification}</span>
              </div>
              <div>
                <b>Email:</b>
                <span style={{ marginLeft: 4 }}>{client.email}</span>
              </div>
              <div>
                <b>Teléfono:</b>
                <span style={{ marginLeft: 4 }}>{client.cellphone}</span>
              </div>
              {/*<div>
                <b>Fecha Nacimiento:</b>
                <span style={{ marginLeft: 4 }}>
                  {milisecondsToDate(client.birthdate!, 'DD/MM/YYYY')}
                </span>
              </div>*/}
            </td>
            <td>
              <div>
                <b>Concesionario:</b>
                <span style={{ marginLeft: 4 }}>
                  {lead.concesionario?.name}
                </span>
              </div>
              <div>
                <b>Ciudad:</b>
                <span style={{ marginLeft: 4 }}>{lead.city}</span>
              </div>
              <div>
                <b>Agencia:</b>
                <span style={{ marginLeft: 4 }}>{lead.sucursal?.name}</span>
              </div>
              <div>
                <b>Vendedor:</b>
                <span style={{ marginLeft: 4 }}>
                  {lead.user?.nombre} {lead.user?.apellido}
                </span>
              </div>
              <div>
                <b>Fecha:</b>
                <span style={{ marginLeft: 4 }}>
                  {`${moment().format('DD/MM/YYYY')}`}
                </span>
              </div>
            </td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th colSpan={2}>Datos del negocio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>
              <div>
                <b>Id Negocio:</b>
                <span style={{ marginLeft: 4 }}>{lead.id}</span>
              </div>
              <div>
                <b>Tipo de Cliente:</b>
                <span style={{ marginLeft: 4 }}>
                  {lead.inquiry?.find((inq) => inq!.question === 'clientType')
                    ?.answer === 'retail'
                    ? 'RETAIL'
                    : 'FLOTA'}
                </span>
              </div>
            </td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th colSpan={2}>Vehículos a facturar</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan={2} style={{ padding: 0, border: 'none' }}>
              {vehiclesToShow.map((vhToShow: any, index) => {
                let gradeRender = null;
                if (vhToShow.exonerated?.percentage) {
                  switch (vhToShow.exonerated.percentage) {
                    case 'a': {
                      gradeRender = '30% - 49%';
                      break;
                    }
                    case 'b': {
                      gradeRender = '50% - 74%';
                      break;
                    }
                    case 'c': {
                      gradeRender = '75% - 84%';
                      break;
                    }
                    case 'd': {
                      gradeRender = '85% - 100%';
                      break;
                    }
                    default:
                  }
                }
                if (vhToShow.exonerated?.type !== 'disabled') {
                  gradeRender = null;
                }

                const isFloat = !!lead.leadsQuoteFinancial?.quotes?.find(
                  (q) => q.id === vhToShow.id
                );

                return (
                  <table
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #9d9d9d',
                    }}
                    key={index}
                  >
                    <tbody>
                      <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td colSpan={2} style={{ textAlign: 'center' }}>
                          <b>
                            {vhToShow.vehiculo[0].brand}{' '}
                            {vhToShow.vehiculo[0].description}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: 'none' }}>
                          <div>
                            <b>VIN:</b>
                            <span style={{ marginLeft: 4 }}>
                              {vhToShow.vimVehiculo}
                            </span>
                          </div>
                          <div>
                            <b>Marca:</b>
                            <span style={{ marginLeft: 4 }}>
                              {vhToShow.vehiculo[0].brand}
                            </span>
                          </div>
                          <div>
                            <b>Descripción:</b>
                            <span style={{ marginLeft: 4 }}>
                              {vhToShow.vehiculo[0].description}
                            </span>
                          </div>
                          <div>
                            <b>Año:</b>
                            <span style={{ marginLeft: 4 }}>
                              {vhToShow.vehiculo[0].year}
                            </span>
                          </div>
                          <div>
                            <b>Color:</b>
                            <span style={{ marginLeft: 4 }}>
                              {vhToShow.vimVehiculoData
                                ? vhToShow.vimVehiculoData.color
                                : 'No se encontró color'}
                            </span>
                          </div>
                          {/* <div>
                          <b>Nombre del Concesionario:</b>
                          <span style={{ marginLeft: 4 }}>
                            {vhToShow.vimVehiculoData
                              ? vhToShow.vimVehiculoData.dealer
                              : 'No se encontró concesionario'}
                          </span>
                        </div> */}
                          <div>
                            <b>Exonerado:</b>

                            <span style={{ marginLeft: 4 }}>
                              {vhToShow.exonerated
                                ? `${
                                    vhToShow.exonerated.type === 'diplomatics'
                                      ? 'Diplomático'
                                      : 'Discapacidad'
                                  } ${gradeRender ?? ''}`
                                : 'Sin exoneración'}
                            </span>
                          </div>
                        </td>
                        <td
                          rowSpan={2}
                          style={{
                            borderLeft: '1px solid #9d9d9d',
                            borderTop: 'none',
                            width: 300,
                            position: 'relative',
                          }}
                        >
                          <div>
                            <img
                              src={vhToShow.vehiculo[0].imgs}
                              alt={vhToShow.vehiculo[0].description}
                              style={{ width: '100%' }}
                            />
                            {isFloat && (
                              <Tag
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  left: 10,
                                }}
                                color="magenta"
                              >
                                Flota
                              </Tag>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: 'none', padding: 0 }}>
                          <table>
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderLeft: 'none',
                                  }}
                                  valign="top"
                                >
                                  <b>Vehículo</b>
                                  <br />
                                  {vhToShow.vehiculo[0].description}
                                </td>
                                <td
                                  style={{ borderBottom: 'none' }}
                                  valign="top"
                                >
                                  <div>
                                    <b>Valor Unitario</b>
                                  </div>
                                  <div>
                                    {currenyFormat(
                                      vhToShow.vehiculo[0].pvp -
                                        (lead && lead.discount
                                          ? vhToShow.vehiculo[0].pvp *
                                            (lead.discount * 0.01)
                                          : 0)
                                    )}
                                  </div>
                                </td>
                                <td
                                  style={{ borderBottom: 'none' }}
                                  valign="top"
                                >
                                  <div>
                                    <b>IVA</b>
                                  </div>
                                  {vhToShow.exonerated === null ? (
                                    <div>
                                      {currenyFormat(
                                        (vhToShow.vehiculo[0].pvp -
                                          (lead && lead.discount
                                            ? vhToShow.vehiculo[0].pvp *
                                              (lead.discount * 0.01)
                                            : 0)) *
                                          0.12
                                      )}
                                    </div>
                                  ) : (
                                    <div> {currenyFormat(0)} </div>
                                  )}
                                </td>
                                <td
                                  style={{
                                    borderBottom: 'none',
                                    borderRight: 'none',
                                    width: 100,
                                  }}
                                  valign="top"
                                >
                                  <div>
                                    <b>Total</b>
                                  </div>
                                  <div>
                                    {vhToShow.exonerated === null ? (
                                      <div>
                                        {currenyFormat(
                                          (vhToShow.vehiculo[0].pvp -
                                            (lead && lead.discount
                                              ? vhToShow.vehiculo[0].pvp *
                                                (lead.discount * 0.01)
                                              : 0)) *
                                            1.12
                                        )}
                                        <span className="text-sm">
                                          Inc. IVA
                                        </span>
                                      </div>
                                    ) : (
                                      <div>
                                        {currenyFormat(
                                          (vhToShow.vehiculo[0].pvp -
                                            (lead && lead.discount
                                              ? vhToShow.vehiculo[0].pvp *
                                                (lead.discount * 0.01)
                                              : 0)) *
                                            1
                                        )}
                                        <span className="text-sm">
                                          {' '}
                                          Sin. IVA
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                    <AccesoriesAndServices
                      accesories={vhToShow.idAccesories ?? []}
                      services={vhToShow.services ?? []}
                      vhToShow={vhToShow}
                    />
                    <WayToPay
                      index={index}
                      vhToShow={vhToShow}
                      client={client}
                    />
                  </table>
                );
              })}
            </td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th colSpan={2} style={{ borderTop: 'none', borderBottom: 'none' }}>
              Resumen del Negocio
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ border: 'none', padding: 0 }} valign="top">
              <table>
                <tbody>
                  <tr>
                    <th> </th>
                    <th>Total</th>
                  </tr>
                  <tr>
                    <td>Valor vehículos</td>
                    <td>
                      {currenyFormat(
                        vehiclesToShow[0].exonerated
                          ? totalSummaryValues.totalValueVehiclesWithoutLegals
                          : totalSummaryValues.totalValueVehiclesWithoutLegals *
                              1.12
                      )}{' '}
                      {vehiclesToShow[0].exonerated ? 'sin IVA' : ' inc. IVA'}
                    </td>
                  </tr>
                  <tr>
                    <td>Valor seguro</td>
                    <td>
                      {currenyFormat(totalSummaryValues.totalValueInsurance)}{' '}
                      Inc. IVA
                    </td>
                  </tr>
                  <tr>
                    <td>Servicios</td>
                    <td>
                      {currenyFormat(
                        totalSummaryValues.totalValuesServices * 1.12
                      )}{' '}
                      Inc. IVA
                    </td>
                  </tr>
                  <tr>
                    <td>Accesorios</td>
                    <td>
                      {currenyFormat(
                        totalSummaryValues.totalValuesAccesories * 1.12
                      )}{' '}
                      Inc. IVA
                    </td>
                  </tr>
                  {/* <tr>
                    <td>Total</td>
                    <td>
                      {currenyFormat(totalSummaryValues.totalValues)} Inc. IVA
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </td>
            <td style={{ borderTop: 'none', padding: 0 }} valign="top">
              <table>
                <tbody>
                  {/* <tr>
                    <td>Margen</td>
                    <td>{currenyFormat(totalSummaryValues.totalMargen)}</td>
                  </tr> */}
                  <tr>
                    <td>Descuento</td>
                    <td>
                      {lead.discount ?? 0}% - {currenyFormat(discountMount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <td style={{ borderTop: 'none' }}>
              <div
                style={{
                  textAlign: 'center',
                  borderTop: '1px solid',
                  width: '100%',
                  padding: 10,
                }}
              >
                Asesor Comercial
              </div>
            </td>
            <td style={{ position: 'relative' }}>
              {(user!.role === 'ASESOR COMERCIAL' ||
                user!.role === 'JEFE DE VENTAS' ||
                user.role === 'GERENTE DE MARCA') && (
                <>
                  {notesRender()}
                  {(prebillStatus === 'NONE' ||
                    prebillStatus === 'REJECTED') && (
                    <div className="p-2" style={{ backgroundColor: '#FCFCFC' }}>
                      <div>
                        <h2 className="text-3xl font-bold m-0">
                          Buen trabajo, falta poco
                        </h2>
                        <div>Envía la prefactura para aprobación.</div>

                        <TextArea
                          style={{ maxWidth: 500 }}
                          className="mt-2"
                          placeholder="Comentario"
                          onChange={(e) => {
                            onCommentChange(e.target.value);
                            //console.log('onChenge', e.target.value);
                          }}
                        />
                      </div>
                      <br />
                      <Button
                        disabled={!!lead?.saleDown}
                        onClick={() => {
                          if (prebillStatus === 'NONE') {
                            //console.log('PREBILL NONE');
                            sendPreInvoce();
                          } else {
                            //console.log('PREBILL DIFFERENT NONE');
                            requestAgain();
                          }
                        }}
                        type="primary"
                        size="large"
                      >
                        Solicitar aprobación
                      </Button>
                    </div>
                  )}

                  {prebillStatus === 'REQUESTED' &&
                    (user.role === 'JEFE DE VENTAS' ||
                      user.role === 'GERENTE DE MARCA') && (
                      <div
                        className="p-2"
                        style={{ backgroundColor: '#FCFCFC' }}
                      >
                        <div>
                          <h2 className="font-bold m-0">
                            El asesor {`${asesor?.nombre} ${asesor?.apellido}`}{' '}
                            solicita aprobación para prefactura
                          </h2>

                          <TextArea
                            style={{ maxWidth: 500 }}
                            className="mt-2"
                            placeholder="Comentario"
                            onChange={(e) => {
                              //console.log(
                              //   'COMMENT OF JEFE DE VENTAS:',
                              //   e.target.value
                              // );
                              onCommentChange(e.target.value);
                            }}
                          />
                        </div>
                        <br />
                        <div>
                          <Button
                            disabled={!!lead?.saleDown}
                            onClick={() => {
                              //console.log('RECHAZAR OF JEFE DE VENTAS:');
                              acceptOrDeclinePrebill(false);
                            }}
                            danger
                            size="large"
                          >
                            Rechazar
                          </Button>
                          <Button
                            className="ml-2"
                            disabled={!!lead?.saleDown}
                            onClick={() => {
                              //console.log('ACCEPTED OF JEFE DE VENTAS:');
                              acceptOrDeclinePrebill(true);
                            }}
                            type="primary"
                            size="large"
                          >
                            Aprobar
                          </Button>
                        </div>
                      </div>
                    )}
                  {prebillStatus !== 'NONE' &&
                    prebillStatus !== 'REJECTED' &&
                    !(
                      user.role === 'JEFE DE VENTAS' ||
                      user.role === 'GERENTE DE MARCA'
                    ) && (
                      <div>
                        <Tag color={tagColor}>{spanishStatus}</Tag>
                      </div>
                    )}
                  {prebillStatus === 'APPROVED' &&
                    (user.role === 'JEFE DE VENTAS' ||
                      user.role === 'GERENTE DE MARCA') && (
                      <Result title="Prefactura Aprobada" status="success" />
                    )}

                  {prebillStatus === 'REJECTED' &&
                    (user.role === 'JEFE DE VENTAS' ||
                      user.role === 'GERENTE DE MARCA') && (
                      <Result status="error" title="Prefactura Rechazada" />
                    )}
                  {prebillStatus === 'APPROVED' && !delivery && (
                    <>
                      <Button
                        type="primary"
                        style={{ marginTop: 10 }}
                        onClick={() => {
                          historyRouter.push('/delivery', {
                            identification: client.identification,
                            idLead: lead.id,
                          });
                        }}
                      >
                        Ir a Entrega
                      </Button>
                    </>
                  )}
                  {/* BORRAR ESTE BOTON. SOLO NOS SIRVE POR TEMA DE PRUEBAS EN ENTREGA */}
                  {/* <Button
                    type="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      historyRouter.push('/delivery', {
                        identification: client.identification,
                        idLead: lead.id,
                      });
                    }}
                  >
                    Ir a Entrega
                  </Button> */}
                  {/* -------------------------------------- */}
                </>
              )}
              {fetching && (
                <div
                  style={{
                    position: 'absolute',
                    backgroundColor: 'rgb(255,255,255,0.6)',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spin />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const AccesoriesAndServices: FunctionComponent<{
  accesories: any[];
  services: any[];
  vhToShow: any;
}> = ({ accesories, services, vhToShow }) => {
  return (
    <tbody>
      <tr>
        <td colSpan={2} style={{ border: 'none', padding: 0 }}>
          <table>
            <tbody>
              <tr>
                <td
                  colSpan={7}
                  style={{
                    border: 'none',
                    borderTop: '1px solid',
                    padding: 0,
                    textAlign: 'center',
                    backgroundColor: '#fdfdfd',
                  }}
                >
                  <b>Accesorios</b>
                </td>
              </tr>
              {accesories.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <span>No posee accesorios</span>
                      <InboxOutlined
                        style={{ fontSize: 40, color: '#e6e6e6' }}
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Código</th>
                    <th style={{ textAlign: 'center' }}>Descripción</th>
                    <th style={{ textAlign: 'center' }}>Cantidad</th>
                    <th style={{ textAlign: 'center' }}>Valor unitario</th>
                    <th style={{ textAlign: 'center' }}>Subtotal</th>
                    <th style={{ textAlign: 'center' }}>IVA</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                  </tr>
                  <>
                    {accesories.map((acc: any, index: number) => (
                      <tr key={`acc_${index}`}>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {acc.code}
                        </td>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {acc.name}
                        </td>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {acc.quantity}
                        </td>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {currenyFormat(acc.cost, true)}
                        </td>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {currenyFormat(acc.cost * acc.quantity, true)}
                        </td>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {currenyFormat(acc.cost * acc.quantity * 0.12, true)}
                        </td>
                        <td
                          style={{
                            border: 'none',
                            padding: 0,
                            textAlign: 'center',
                          }}
                        >
                          {currenyFormat(acc.cost * acc.quantity * 1.12, true)}
                          <span className="text-sm">Inc. IVA</span>
                        </td>
                      </tr>
                    ))}
                    {typeof vhToShow.accesoriesValue === 'number' && (
                      <>
                        <tr style={{ borderBottom: 'none' }}>
                          <td
                            colSpan={7}
                            style={{ borderBottom: 'none', textAlign: 'right' }}
                          >
                            <b>Subtotal: </b>
                            {currenyFormat(vhToShow.accesoriesValue)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: 'none' }}>
                          <td
                            colSpan={7}
                            style={{ borderBottom: 'none', textAlign: 'right' }}
                          >
                            <b>Total: </b>
                            {currenyFormat(vhToShow.accesoriesValue * 1.12)}
                            <span className="text-sm"> Inc. IVA</span>
                          </td>
                        </tr>
                      </>
                    )}
                  </>
                </>
              )}
            </tbody>
          </table>

          <table cellPadding={2}>
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  style={{
                    border: 'none',
                    borderTop: '1px solid',

                    padding: 0,
                    textAlign: 'center',
                    backgroundColor: '#fdfdfd',
                  }}
                >
                  <b>Servicios</b>
                </td>
              </tr>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <span>No posee servicios</span>
                      <InboxOutlined
                        style={{ fontSize: 40, color: '#e6e6e6' }}
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Categoría</th>
                    <th style={{ textAlign: 'center' }}>Descripción</th>
                    <th style={{ textAlign: 'center' }}>Subtotal</th>
                    <th style={{ textAlign: 'center' }}>IVA</th>
                    <th style={{ textAlign: 'center', minWidth: 200 }}>
                      Total
                    </th>
                  </tr>
                  <>
                    {services.map((serList: any, index: number) => (
                      <React.Fragment key={`cat_${index}`}>
                        {serList.items.map((itms: any, indexItem: number) => (
                          <tr key={`ser_${indexItem}`}>
                            <td
                              style={{
                                border: 'none',
                                padding: 0,
                                textAlign: 'center',
                              }}
                            >
                              {serList.nombre}
                            </td>
                            <td
                              style={{
                                border: 'none',
                                padding: 0,
                                textAlign: 'center',
                              }}
                            >
                              {itms.descripcion}
                            </td>
                            <td
                              style={{
                                border: 'none',
                                padding: 0,
                                textAlign: 'center',
                              }}
                            >
                              {currenyFormat(itms.valor, true)}
                            </td>
                            <td
                              style={{
                                border: 'none',
                                padding: 0,
                                textAlign: 'center',
                              }}
                            >
                              {currenyFormat(itms.iva, true)}
                            </td>
                            <td
                              style={{
                                border: 'none',
                                padding: 0,
                                textAlign: 'center',
                              }}
                            >
                              {currenyFormat(itms.total, true)}{' '}
                              <span className="text-sm">Inc. IVA</span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                    {typeof vhToShow.servicesValue === 'number' && (
                      <>
                        <tr>
                          <td
                            colSpan={5}
                            style={{ borderBottom: 'none', textAlign: 'right' }}
                          >
                            <b>Subtotal: </b>
                            {currenyFormat(vhToShow.servicesValue)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={5}
                            style={{ borderBottom: 'none', textAlign: 'right' }}
                          >
                            <b>Total: </b>
                            {currenyFormat(vhToShow.servicesValue * 1.12)}
                            <span className="text-sm"> Inc. IVA</span>
                          </td>
                        </tr>
                      </>
                    )}
                  </>
                </>
              )}
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  );
};

const WayToPay: FunctionComponent<{
  index: number;
  vhToShow: any;
  client: any;
}> = ({ index, vhToShow, client }) => {
  return (
    <tbody style={{ borderTop: '1px solid', padding: 0 }} key={index}>
      <tr>
        <td style={{ borderRight: '1px solid', padding: 0 }}>
          <table>
            <tbody>
              <tr>
                <td style={{ borderTop: 'none' }}>
                  <b>Forma de Pago</b>
                </td>
                <td style={{ borderTop: 'none' }} colSpan={2}>
                  {vhToShow.type === 'counted' ? 'Contado' : 'Crédito'}
                </td>
              </tr>
              <tr>
                <th>DESCRIPCIÓN</th>
                <th>VALOR</th>
                <th>RESPONSABLE</th>
              </tr>
              {vhToShow.reserveValue ? (
                <tr>
                  <td>Reserva</td>
                  <td>{currenyFormat(vhToShow.reserveValue, true)}</td>
                  <td>{`${client.name} ${client.lastName}`}</td>
                </tr>
              ) : null}
              {vhToShow.type !== 'counted' && (
                <tr>
                  <td>Entrada</td>
                  <td>{currenyFormat(vhToShow.inputAmount ?? 0, true)}</td>
                  <td>{`${client.name} ${client.lastName}`}</td>
                </tr>
              )}

              {vhToShow.chosenEntity && (
                <tr>
                  <td>Finaciamiento</td>
                  <td>
                    {currenyFormat(
                      calcTotalQuotesGenerated(vhToShow) * 1.12 -
                        vhToShow.inputAmount ?? 0,
                      true
                    )}
                  </td>
                  <td>
                    {vhToShow.chosenEntity === 'CONSORTIUM' ? 'Consorcio' : ''}
                    {` ${vhToShow.chosenEntity.entity}`}
                  </td>
                </tr>
              )}
              {vhToShow.preOwnedSupplier && (
                <tr>
                  <td>Vehículo como forma de pago</td>
                  <td>
                    {currenyFormat(
                      vhToShow.preOwnedSupplier.appraisalValue,
                      true
                    )}
                  </td>
                  <td>{vhToShow.preOwnedSupplier.bussinessName}</td>
                </tr>
              )}

              {/* <tr>
                <td>Saldo contra entrega</td>
                <td>$</td>
                <td>NO TENGO ENTENDIDO </td>
              </tr> */}

              {vhToShow.chosenEntity && (
                <tr>
                  <td style={{ border: 'none' }}>
                    {vhToShow.chosenEntity.type === 'FINANCIAL'
                      ? 'Financiera'
                      : 'Consorcio'}
                  </td>
                  <td style={{ border: 'none', padding: 0 }}>
                    {vhToShow.chosenEntity.entity}
                  </td>
                  <td style={{ border: 'none', padding: 0 }}> </td>
                </tr>
              )}
              {vhToShow.type !== 'counted' && (
                <tr>
                  <td>PLAZO</td>
                  <td>{vhToShow.months} meses</td>
                  <td />
                </tr>
              )}

              {vhToShow.insuranceCarrier && (
                <>
                  <tr>
                    <td style={{ borderBottom: 'none' }}>SEGURO</td>
                    <td style={{ borderBottom: 'none' }}>
                      {vhToShow.insuranceCarrier.name}{' '}
                      {vhToShow.insuranceCarrier.years} año
                      {vhToShow.insuranceCarrier.years > 1 ? 's' : ''} por{' '}
                      {currenyFormat(vhToShow.insuranceCarrier.cost)} Inc. IVA
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td style={{ borderBottom: 'none' }}>MATRÍCULA</td>
                    <td style={{ borderBottom: 'none' }}>
                      {currenyFormat(vhToShow.registration)}
                    </td>
                    <td style={{ borderBottom: 'none' }} />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </td>

        <td style={{ border: 'none', padding: 0 }} valign="top">
          {vhToShow.mechanicalAppraisalQuote ? (
            <table>
              <tbody>
                <tr>
                  <th style={{ borderTop: 'none' }} colSpan={2}>
                    Vehículo parte de pago
                  </th>
                </tr>
                <tr>
                  <td>Marca</td>
                  <td>{vhToShow.mechanicalAppraisalQuote.brand}</td>
                </tr>
                <tr>
                  <td>Modelo</td>
                  <td>{vhToShow.mechanicalAppraisalQuote.model}</td>
                </tr>
                <tr>
                  <td>Año</td>
                  <td>{vhToShow.mechanicalAppraisalQuote.year}</td>
                </tr>
                <tr>
                  <td>Kilometraje (km)</td>
                  <td>{vhToShow.mechanicalAppraisalQuote.mileage}</td>
                </tr>
                {vhToShow.preOwnedSupplier && (
                  <>
                    <tr>
                      <th style={{ borderTop: 'none' }} colSpan={2}>
                        Proveedor de seminuevos
                      </th>
                    </tr>
                    <tr>
                      <td>Razón Social</td>
                      <td>{vhToShow.preOwnedSupplier.bussinessName}</td>
                    </tr>
                    <tr>
                      <td>Identificación</td>
                      <td>{vhToShow.preOwnedSupplier.identification}</td>
                    </tr>
                    <tr>
                      <td>Celular</td>
                      <td>{vhToShow.preOwnedSupplier.email}</td>
                    </tr>
                    <tr>
                      <td>Valor avalúo</td>
                      <td>
                        {currenyFormat(
                          vhToShow.preOwnedSupplier?.appraisalValue ?? 0,
                          true
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>¿Aceptó la oferta?</td>
                      <td>
                        {vhToShow.preOwnedSupplier.acceptedAppraisal
                          ? 'SI'
                          : 'NO'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center' }}>No posee avalúo mecánico</div>
          )}
        </td>
      </tr>
    </tbody>
  );
};

export default Prebill;
