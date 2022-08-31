/* eslint-disable camelcase */
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import {
  Table,
  Button,
  message,
  DatePicker,
  Form,
  Input,
  notification,
} from 'antd';
import Search from 'antd/es/input/Search';
import { UserOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { disableExperimentalFragmentVariables } from '@apollo/client';
import Leads from '../../../data/models/Leads';
import ModalDetail from '../../../components/Follow/ModalDetail';
import { ClientLeadContext } from '../../../components/GetClientData';
import Client from '../../../data/models/Client';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import Loading from '../../../components/Loading';
import Delivery, { ScheduleDelivery } from '../../../data/models/Delivery';
import ButtonLogistic from './ButtonLogistic';
import { ScheduleDeliveryInput } from '../../../data/providers/apollo/mutations/delivery';
import auth from '../../../utils/auth';
import ModalWalletDelivery from './ModalWalletDelivery';
import CRMRepository from '../../../data/repositories/CRM-repository';
import ModalDocuments from './ModalDocuments';
import Quotes from '../../../data/models/Quotes';
import ModalDelivery from './ModalDelivery';
import DateStates from './DateStates';
import SettingsRepository from '../../../data/repositories/settings-repository';
import {
  currenyFormat,
  netType,
  calcTotalQuotesGenerated,
  calcTotalQuotesGeneratedExonerated,
} from '../../../utils/extras';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { useHistory } from 'react-router-dom';

export interface DataTable {
  idQuote: number;
  key: string;
  brand: string;
  description: string;
  year: number;
  color: string | null | undefined;
  id_color: number | null | undefined;
  loadingVehicleRegistration: boolean;
  plate: null | string | undefined;
  delivery: Delivery | null | undefined;
  vin: string | null | undefined;
  codigo: string | null | undefined;
  modelo: string | null | undefined;
  costo: number | null | undefined;
  pvp: number | null | undefined;
  cilindraje: number | null | undefined;
  nropasajeros: number | null | undefined;
  nroejes: number | null | undefined;
  puertas: number | null | undefined;
  combustible: string | null | undefined;
  imgs: string | null | undefined;
  quote: Quotes | null | undefined;
  setDataToTable: React.Dispatch<React.SetStateAction<DataTable[]>>;
  okDocuments: boolean;
}

const dataSource = [
  {
    key: '1',
    brand: 'Kia',
    description: 'Kia 1',
    year: 2020,
    color: 'Azul',
  },
  {
    key: '2',
    brand: 'Mazda',
    description: 'Mazda 1',
    year: 2020,
    color: 'Rojo',
  },
];

const letters = /^[A-Za-z]+$/;
const numbers = /^[0-9]+$/;

const okPlate1 = /^[A-Za-z]{3}[-][0-9]{4}/;
const okPlate2 = /^[A-Za-z]{3}[0-9]{4}/;
const okPlate3 = /^[A-Za-z]{2}[-][0-9]{4}/;
const okPlate4 = /^[A-Za-z]{2}[0-9]{4}/;

const key = 'updatable';

const TableVehicles: FunctionComponent<{
  lead: Leads;
  client: Client;
  documentsCompleted: Function;
  changeDeliveryStatus: boolean;
  loadingVim: Function;
}> = ({
  lead,
  client,
  documentsCompleted,
  changeDeliveryStatus,
  loadingVim,
}) => {
  /******************************HOOKS*****************************************/
  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );
  const historyRouter = useHistory();
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);

  const [dataToTable, setDataToTable] = useState<DataTable[]>([]);

  const verifyVins = async (): Promise<{
    allOk: boolean;
    message: string;
    goTo?: 'lead' | 'bussines';
  }> => {
    /* if (
      lead &&
      lead.prebill &&
      lead.prebill.length > 0 &&
      lead.prebill[0].accepted
    ) {
    } */
    const ids = lead?.quotes
      ?.filter((vh) => vh.closed && vh.vimVehiculo && vh.vimVehiculoData)
      ?.map((vh) => vh.id);
    //console.log('log verifyVINs IDS', ids);

    if (ids && ids.length > 0) {
      const resp = await quouteRepository.verifyVINs(ids as number[]);
      //console.log('log verifyVINs', resp);
      if (resp && resp.length > 0) {
        const badVins = (
          resp as {
            idQuote: number;
            changed: boolean;
            message: string;
            vin: string;
          }[]
        ).filter((item) => item.changed);
        if (badVins.length > 0) {
          const text = badVins.reduce((accum, current) => {
            return `${accum} "${current.vin}"`;
          }, '');
          return {
            allOk: false,
            message: `Los siguientes VINs han sido eliminados por no tener su estado RESERVADO o FACTURADO: ${text}`,
            goTo: 'lead',
          };
        }
        return {
          allOk: true,
          message: 'Los estados de los VINs se encuentran correctos',
        };
      }
      return {
        allOk: false,
        message: 'Error al verificar el estado de los VINs.',
        goTo: 'bussines',
      };
    }
    return {
      allOk: false,
      message: 'No se encontraron VINs',
      goTo: 'bussines',
    };
  };

  const openVerifyVins = async () => {
    message.loading({ content: 'Verificando VINs ...', key });
    loadingVim(true);
    const resp = await verifyVins();
    if (!resp.allOk && resp.goTo) {
      if (resp.goTo === 'bussines') {
        message.error({ content: resp.message, key, duration: 5 });

        historyRouter.push('/business');
        loadingVim(false);
        return false;
      }
      if (resp.goTo === 'lead') {
        message.warning({ content: resp.message, key, duration: 10 });
        notification.warning({
          message:
            'Cuando se elimina un VIN, automáticamente se elimina la prefactura del negocio y las entregas de las cotizaciones respectivas, ya que los VINs son necesarios en la entrega del negocio.',
          duration: 0,
          placement: 'bottomRight',
        });
        historyRouter.push(
          `/lead/id-lead=${lead.id}/identification=${lead.client.identification}`,
          {
            step: 0,
            id: lead.client.identification,
            idLead: lead.id,
            fromDelivery: false,
          }
        );
        loadingVim(false);
        return false;
      }
    }
    message.success({ content: resp.message, key, duration: 3 });
    loadingVim(false);
    return true;
  };

  const comoponentdidmount = async () => {
    const resp = await openVerifyVins();
    if (!resp) return;

    const vehiclesToTable = lead.quotes
      ?.filter((vh: any) => vh.closed === true && vh.delivery)
      .map((ld, index) => ({
        idQuote: ld!.id!,
        key: index.toString(),
        brand: ld!.vehiculo![0]!.brand!,
        description: ld!.vehiculo![0]!.description!,
        year: ld!.vehiculo![0]!.year!,
        color: ld.vimVehiculoData?.color,
        id_color: ld.vimVehiculoData?.id_color,
        loadingVehicleRegistration: false,
        plate: null,
        delivery:
          changeDeliveryStatus === true
            ? {
                authorizathionStatus: 'Solicitado',
                comment: ld.delivery?.comment,
                createdAt: ld.delivery?.createdAt,
                delivery: ld.delivery?.delivery,
                deliveryFinal: ld.delivery?.deliveryFinal,
                estimatedDeliveryDate: ld.delivery?.estimatedDeliveryDate,
                finalDocuments: ld.delivery?.finalDocuments,
                id: ld.delivery?.id,
                printCheckPreDelivery: ld.delivery?.printCheckPreDelivery,
                quotes: ld.delivery?.quotes,
                registration: ld.delivery?.registration,
                scheduleDelivery: ld.delivery?.scheduleDelivery,
                updateAt: ld.delivery?.updateAt,
                vehicleOrder: ld.delivery?.vehicleOrder,
                verifyDocuments: ld.delivery?.verifyDocuments,
              }
            : ld.delivery,
        //delivery: ld.delivery,
        vin: ld.vimVehiculoData?.vin,
        codigo: ld!.vehiculo![0]!.code,
        modelo: ld!.vehiculo![0]!.model,
        costo: ld!.vehiculo![0]!.cost,
        pvp: ld!.vehiculo![0]!.pvp,
        cilindraje: ld!.vehiculo![0]!.cylinder,
        nropasajeros: ld!.vehiculo![0]!.numPassengers,
        puertas: ld!.vehiculo![0]!.doors,
        combustible: ld!.vehiculo![0]!.fuel,
        imgs: ld!.vehiculo![0]!.imgs,
        quote: ld,
        setDataToTable,
        okDocuments: changeDeliveryStatus === true,
      }));
    if (vehiclesToTable) {
      //await setRegistration(vehiclesToTable.);
      //console.log('VEHICLES TABLE', vehiclesToTable);
      //await setRegistration(vehiclesToTable.);
      // @ts-ignore
      setDataToTable(vehiclesToTable);
    }
    //console.log('usuario', user);
  };

  useEffect(() => {
    comoponentdidmount();
  }, [changeDeliveryStatus]);

  useEffect(() => {
    //console.log('dataToTable -->', dataToTable);
    const tableOk = dataToTable.filter((table) => table.okDocuments === true);
    if (dataToTable.length === tableOk.length) {
      documentsCompleted(false);
    } else {
      documentsCompleted(true);
    }
  }, [dataToTable]);

  /*   useEffect(() => {
    /// VERIFICAMOS SI EL DELIVERY HA CAMBIADO CUANDO SE SOLICITO LA VENTA CAIDA
    const allDeliveriesTable = dataToTable.map((dT) => dT.delivery!.id!);
    const allDeliveries = lead.quotes
      ?.filter((vh) => vh.closed === true && vh.delivery)
      .map((quo) => quo.delivery!.id!);
    if (allDeliveries && allDeliveriesTable) {
      let allOk = true;
      allDeliveriesTable.forEach((idDT) => {
        const isThere = allDeliveries.includes(idDT);
        if (!isThere) {
          allOk = false;
        }
      });
      if (!allOk) {
        comoponentdidmount();
      }
    }
  }, [lead]); */

  /******************************GENERALFUNCTION*******************************/

  /*******************************RETURN***************************************/

  if (dataToTable.length === 0) {
    return <div>Cargando ...</div>;
  }
  return (
    <Table
      dataSource={dataToTable}
      pagination={false}
      size="small"
      scroll={{ x: 1200 }}
      columns={[
        {
          title: 'Cotización',
          dataIndex: 'idQuote',
          key: 'idQuote',
        },
        {
          title: 'Marca',
          dataIndex: 'brand',
          key: 'brand',
        },
        {
          title: 'Descripción',
          dataIndex: 'description',
          key: 'description',
          width: 200,
        },
        {
          title: 'Color',
          dataIndex: 'color',
          key: 'color',
          render: (text: any, row: any) => {
            //console.log({ row });
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span>{row.color}</span>
                <div
                  className={`color${row.id_color}`}
                  style={{ borderRadius: '50%', width: 15, height: 15 }}
                />
              </div>
            );
          },
        },
        {
          title: 'Año',
          dataIndex: 'year',
          key: 'year',
          width: 80,
        },

        {
          title: 'Matrícula',
          dataIndex: 'matricula',
          key: 'matricula',
          width: 200,
          render: (text: any, row: any) => (
            <div>
              <CicleBtn
                dataRow={row}
                lead={lead}
                client={client}
                setDataRow={setDataToTable}
              />
            </div>
          ),
        },
        /* {
          title: 'Solicitar impronta',
          dataIndex: 'button2',
          key: 'button2',
          width: 200,
          render: (text, row) => {
            //console.log({ row });
            return (
              <ButtonLogistic
                client={client}
                lead={lead}
                dataRow={row}
                deliveryRepository={deliveryRepository}
              />
            );
          },
        }, */
        /*  {
          title: 'Movilizar vehículo',
          dataIndex: 'button3',
          key: 'button3',
          width: 300,
          render: (text, row) => {
            //console.log({ row });
            return (
              <div>
                <Button>Solicitar Movilización</Button>
              </div>
            );
          },
        }, */
        {
          title: 'Fecha estimada de entrega',
          dataIndex: 'entrega',
          key: 'entrega',
          width: 200,
          render: (text: any, row: any) => {
            //console.log('row', row);
            return (
              <div>
                <DateStates dataRow={row} isEstimated />
              </div>
            );
          },
        },
        {
          title: 'Documentos',
          dataIndex: 'documents',
          width: 100,
          key: 'documents',
          render: (text: any, row: any) => {
            //console.log({ row });
            return (
              <ModalDocuments
                dataRow={row}
                deliveryRepository={deliveryRepository}
              />
            );
          },
        },
        {
          title: 'Cartera',
          dataIndex: 'documents',
          key: 'documents',
          width: 100,
          render: (text: any, row: any) => {
            return <ModalWalletDelivery data={row} />;
          },
        },
        {
          title: 'Entrega',
          dataIndex: 'delivery',
          key: 'delivery',
          width: 120,
          render: (text: any, row: any) => {
            //console.log({ row });
            return (
              <ModalDelivery
                dataRow={row}
                deliveryRepository={deliveryRepository}
              />
            );
          },
        },
      ].filter((file) => {
        if (
          netType(lead?.concesionario?.code!).toLowerCase() === 'red externa' &&
          file.title === 'Documentos'
        ) {
          //console.log('Red Externa');
          return false;
        }
        return true;
      })}
    />
  );
};

/******************************COMPONENTS**************************************/

// Setea individualmente el estado de los botones
const CicleBtn: FunctionComponent<{
  dataRow: DataTable;
  lead: Leads;
  client: Client;
  setDataRow?: React.Dispatch<React.SetStateAction<DataTable[]>>;
}> = ({ dataRow, lead, client, setDataRow }) => {
  /******************************HOOKS*****************************************/

  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );
  const { setLead } = useContext(ClientLeadContext);

  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  // Estado para ver el btn de SOLICITAR MATRÍCULA
  const [viewRegistrationBtn, setViewRegistrationBtn] = useState<boolean>(true);
  // Estado para visualizar el campo de matrícula
  const [sendRegistration, setSendRegistration] = useState<boolean>(false);
  // Estado para ver visualizar la matrícula
  const [viewRegistrationText, setViewRegistrationText] =
    useState<boolean>(false);
  // ESTADO PARA ACTIVAR EL LOADING SCREEN MIENTRAS OPERA
  const [loading, setLoading] = useState<boolean>(false);
  // Setea el valor de la matricula si existe o si se guarda correctamente en db
  const [registrationValue, setRegistrationValue] = useState<string>('');

  const [errorInput, setErrorInput] = useState<boolean>(true);

  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );
  /******************************GENERALFUNCTION*******************************/

  // Notifica la matrícula al correo
  const notifyVehicleRegistration = async (): Promise<boolean> => {
    //const id = user.dealer[0].sucursal[0].id_sucursal;
    const idSucursal = lead.sucursal?.code;
    if (!idSucursal) {
      return false;
    }
    const respSettings: any = await settingsRepository.getAllSettings(
      parseInt(idSucursal)
    );
    //console.log('log notifyVehicleRegistration respSettings', respSettings);

    let emailReserve = '';
    if (respSettings) {
      const row = respSettings.find(
        (setting: any) => setting.settingType === 'email-registration'
      );
      //console.log('row -->', row);
      if (row && row.settingValue) {
        emailReserve = row.settingValue;
      } else {
        message.error('Email de Matriculación no configurado');
        return false;
      }
    }

    /* const emailReserve: any = [];
    if (respSettings !== undefined) {
      respSettings.map((setting: any) => {
        if (setting.settingType === 'email-registration') {
          emailReserve.push(setting.settingValue);
        }
        return true;
      });
    } else {
      emailReserve.push('nvela@pas-hq.com');
    } */
    try {
      setLoading(true);
      const vehicleQuote = dataRow;

      const calcDescount = (discountValue: number, TotalPvpsInput: number) => {
        const descuentoSobreValorSinIva =
          TotalPvpsInput * (discountValue * 0.01);
        return descuentoSobreValorSinIva;
      };

      const descuento = calcDescount(
        lead.discount ?? 0,
        vehicleQuote.quote?.vehiculo![0].pvp!
      );
      //console.log('log notifyVehicleRegistration Descuento', {
      //   discount: lead.discount,
      //   descuento,
      // });
      const total = calcTotalQuotesGenerated(vehicleQuote.quote) - descuento!;

      const dataToSend = {
        asunto: 'Solicitud de matrícula de vehículo',
        template: 'templateVehicle',
        bodyData: {
          //
          leadId: lead.id,
          clientCi: client.identification,
          quoteId: dataRow.idQuote,
          //
          textHeader: 'Se solicita la matriculación del vehículo',
          vehicleName: `${vehicleQuote.brand}`,
          vinNumber: vehicleQuote.vin,
          vehicleImage:
            vehicleQuote.imgs ||
            'https://guc.it-zam.com/img/no-image-found-360x250.png',
          data: {
            id_vh: vehicleQuote.vin,
            codigo: vehicleQuote.codigo,
            marca: vehicleQuote.brand,
            modelo: vehicleQuote.modelo,
            version: vehicleQuote.description,
            anio: vehicleQuote.year,
            costo: vehicleQuote.costo,
            descuento: currenyFormat(descuento, true),
            precio: currenyFormat(
              vehicleQuote.quote?.vehiculo![0].pvp! - descuento
            ),
            pvp: `${currenyFormat(
              (vehicleQuote.quote?.vehiculo![0].pvp! - descuento) * 1.12
            )}`,
            cilidraje: vehicleQuote.cilindraje,
            nropasajeros: vehicleQuote.nropasajeros,
            comercializado: null,
            nroejes: null,
            puertas: vehicleQuote.puertas,
            combustible: vehicleQuote.combustible,
            color: vehicleQuote.color,
            totalstock: vehicleQuote.quote?.vehiculo![0].stock,
            insuranceCarrierTotal: vehicleQuote.quote?.insuranceCarrier
              ? currenyFormat(vehicleQuote.quote?.insuranceCarrier.cost)
              : null,
            servicesValue: vehicleQuote.quote?.servicesValue
              ? currenyFormat(vehicleQuote.quote?.servicesValue)
              : null,
            accesoriesValue: vehicleQuote.quote?.accesoriesValue
              ? currenyFormat(vehicleQuote.quote?.accesoriesValue)
              : null,
            subtotal: currenyFormat(total),
            total: vehicleQuote.quote?.exonerated
              ? `${currenyFormat(
                  calcTotalQuotesGeneratedExonerated(vehicleQuote.quote)
                )} sin IVA.`
              : `${currenyFormat(total * 1.12)} inc. IVA`,
          },

          PreTextCallToActionButton:
            'Confirma la matriculación del vehículo ingresando ' +
            'la placa en el siguiente link.',
          CallToActionText: 'Ingresar el número de placa',
        },
        destinatario: emailReserve,
        copia: '',
        cc: '',
      };

      //console.log('log notifyVehicleRegistration Data to send', {
      //   dataToSend,
      // });
      console.log('Email to send -->', emailReserve);
      const isOK = await CRMRepository.sendMail(dataToSend);
      setLoading(false);
      if (isOK) {
        message.success('Mail enviado para solicitud de matrícula');
        setViewRegistrationBtn(false);
        setSendRegistration(true);
        return true;
      }
      message.error('Error al enviar el Mail, vuelve a intentar');
      return false;
    } catch (e) {
      setLoading(false);
      message.error('Error al enviar el Mail, vuelve a intentar');
      return false;
      //console.log(e.message);
    }
  };

  //  Ingresa la matrícula
  const insertVehicleRegistration = async (
    idQuote: number,
    plateNumber: string | null
  ) => {
    try {
      setLoading(true);
      const respApi = await deliveryRepository.updateRegistrationWithQuote(
        idQuote,
        plateNumber
      );
      // resApi = Solicitado o Matriculado
      //console.log('insertVehicleRegistration', respApi);
      setLoading(false);
      if (respApi === 'Matriculado') {
        message.success('El número de Placa se guardó correctamente');
        return respApi;
      }
      if (respApi === 'Solicitado') {
        //message.success('El número de Placa se solicitó correctamente');
        return respApi;
      }
      message.error('Error al guardar el número de Placa');
      return respApi;
    } catch (e) {
      setLoading(false);
      message.error('Error al guardar el número de Placa');
      //console.log(e.message);
      return null;
    }
  };

  // Setea la matrícula si identifica que ya esta registrada.
  const setRegistration = async () => {
    try {
      //console.log('setRegistration', dataRow.delivery);
      if (
        dataRow.delivery &&
        dataRow.delivery?.registration?.state === 'Matriculado'
      ) {
        setRegistrationValue(dataRow.delivery?.registration?.plateNumber!);
        setViewRegistrationBtn(false);
        setViewRegistrationText(true);
      } else if (
        dataRow.delivery &&
        dataRow.delivery?.registration?.state === 'Solicitado'
      ) {
        setViewRegistrationBtn(false);
        setSendRegistration(true);
      }
      if (dataRow.delivery && !dataRow.delivery?.registration) {
        setViewRegistrationBtn(true);
      }
    } catch (e) {
      //console.log(e.message);
      message.error('Error al obtener Delivery');
    }
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await setRegistration();
    };
    componentdidmount();
  }, []);

  return (
    <>
      {viewRegistrationBtn && (
        <Button
          type="primary"
          shape="round"
          disabled={!!lead?.saleDown}
          onClick={async () => {
            const respNotify = await notifyVehicleRegistration();

            if (respNotify) {
              await insertVehicleRegistration(dataRow.idQuote, null);
            }
            /* const resp = await insertVehicleRegistration(dataRow.idQuote, null);
            if (resp === 'Solicitado') {
              await notifyVehicleRegistration();
            } */
          }}
        >
          Solicitar Matrícula
        </Button>
      )}
      {sendRegistration && (
        <>
          <Form
            name="plateNumberForm"
            layout="inline"
            onFinish={async (values) => {
              const resp = await insertVehicleRegistration(
                dataRow.idQuote,
                values.plateNumber
              );
              if (resp === 'Matriculado') {
                setRegistrationValue(values.plateNumber);
                setViewRegistrationText(true);
                setSendRegistration(false);
                if (setLead) {
                  setLead((prevState: Leads) => {
                    const copia = prevState;
                    const newQuotes = copia.quotes?.map((quo) => {
                      const copiaQuo = quo;
                      if (quo.id === dataRow.idQuote) {
                        if (copiaQuo.delivery) {
                          copiaQuo.delivery.registration = {
                            plateNumber: values.plateNumber,
                            state: 'Matriculado',
                          };
                        }
                      }
                      return copiaQuo;
                    });

                    copia.quotes = newQuotes;
                    //console.log('copia', copia);
                    return copia;
                  });
                }
                if (setDataRow) {
                  setDataRow((prevState) => {
                    const newData = prevState.map((pre) => {
                      const copiaData = pre;
                      if (
                        pre.idQuote === dataRow.idQuote &&
                        copiaData.delivery
                      ) {
                        copiaData.delivery.registration = {
                          plateNumber: values.plateNumber,
                          state: 'Matriculado',
                        };
                      }
                      return copiaData;
                    });
                    return newData;
                  });
                }
              } else {
                message.error('No se pudo guardar.');
              }
            }}
          >
            <Form.Item
              name="plateNumber"
              rules={[
                {
                  pattern: /\b[A-Z]{2,3}-[0-9]{4}\b/,
                  message: 'Formato: ABC-0409 / AB-0409',
                },
              ]}
              style={{ marginRight: 0 }}
            >
              <Input
                placeholder="N° de Placa"
                style={{ width: 100, margin: 0 }}
              />
            </Form.Item>
            <Form.Item style={{ margin: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: 80, margin: 0, padding: 3, borderRadius: 0 }}
              >
                Guardar
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {viewRegistrationText && (
        <p style={{ color: 'black', margin: 0 }}>
          <strong>{registrationValue}</strong>
        </p>
      )}
      <Loading visible={loading} />
    </>
  );
};

export default TableVehicles;
