import { Button, Table, Tag, Tabs, message } from 'antd';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import Client from '../../../data/models/Client';
import '../css/wallet.css';
import WalletDocuments from './WalletDocuments';
import { NOTIFICATION_TYPES } from '../../../utils/types-notification';
import INotification from '../../../data/models/Notification';
import Prebill from '../../quote/components/Prebill';
import { calcLegals, currenyFormat } from '../../../utils/extras';
import WalletContext from './WalletContext';
import { Dependencies } from '../../../dependency-injection';
import LeadsRepository from '../../../data/repositories/leads-repository';
import Get from '../../../utils/Get';
import TableTemplate from '../../../components/TableTemplate';
import { Item } from '../MainWalletPage';

const { TabPane } = Tabs;

const WalletDetails: FunctionComponent<{
  client: Client;
  vehicle: any;
  prebill: any;
  lead: any;
  idNotificationQuote?: number;
  stateLead: boolean;
  setDataSource: React.Dispatch<React.SetStateAction<Item[]>>;
}> = ({ client, vehicle, prebill, lead, idNotificationQuote, stateLead, setDataSource }) => {
  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const [dataVehicle, setDataVehicle] = useState<any>([]);
  const [viewDocument, setviewDocument] = useState<boolean>(false);
  const [quotesData, setQuotesData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusButton, setStatusButton] = useState<boolean>(false);
  const [exonerated, setExonerated] = useState<boolean>(false);
  const [dataExonerated, setDataExonerated] = useState<string>();
  const [subtotalT, setSubtotalT] = useState<number>(0);
  const [descT, setDescT] = useState<number>(0);
  const [descU, setDescU] = useState<number>(0);
  const [ivacT, setIvaT] = useState<number>(0);
  const [totalT, setTotalT] = useState<number>(0);
  const [sendOkDocument, setSendOkDocument] = useState<boolean>(false);
  const { dataTable, updateStatusTableLead } = useContext(WalletContext);

  const updateStateLead = async () => {
    setLoading(true);

    const resp = await leadsRepository.updateStateLead(lead?.id!, 'Verificado');
    /* if (resp) {
      message.success('Se actualizo el estado correctamente');
    } */
    setStatusButton(true);
    updateStatusTableLead!(dataVehicle[0].lead.id);
    setLoading(false);
  };

  const updateStateNotifications = (idDelivery: number, status: string) => {
    const newDataVehicle: Array<any> = [];
    vehicle.map((data: any, i: number) => {
      const newD = {
        key: i,
        brand: data.vehiculo[0].brand,
        model: data.vehiculo[0].model,
        year: data.vehiculo[0].year,
        pvp: data.vehiculo[0].pvp,
        state:
          idDelivery === data.delivery.id
            ? 'Solicitado'
            : data.delivery.authorizathionStatus,
        dataQuote: data,
        dataClient: client,
        prebill,
        delivery: data.delivery.id,
        lead,
      };
      newDataVehicle.push(newD);

      return true;
    });

    setDataVehicle(newDataVehicle);
  };
  const onNotificationListener = (noti: INotification) => {
    // noti es una notificacion desde el ws
    if (noti.type === NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED) {
      //console.log('Notificación Wallet🔴', noti);
      updateStateNotifications(noti.content.idDelivery, noti.content.status);
    }
  };
  const calcOtros = (record: any) => {
    if (record) {
      return (
        (record.registration ?? 0) +
        (record.type === 'credit'
          ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
          : 0) +
        (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
      );
    }
    return 0;
  };

  useEffect(() => {
    const newDataVehicleT: Array<any> = [];
    let totalVeh = 0;
    let totalAcc = 0;
    let totalSer = 0;
    let totalOtros = 0;
    let legalValue = 0;
    let verificationSendOk = 0;
    vehicle.map((data: any, i: number) => {
      const newD = {
        key: i,
        brand: data.vehiculo[0].brand,
        model: data.vehiculo[0].model,
        year: data.vehiculo[0].year,
        pvp: data.vehiculo[0].pvp,
        state: data.delivery.authorizathionStatus,
        dataQuote: data,
        dataClient: client,
        prebill,
        delivery: data.delivery.id,
        lead,
      };
      newDataVehicleT.push(newD);

      totalVeh += data.vehiculo[0].pvp;
      totalSer += data.servicesValue;
      totalAcc += data.accesoriesValue;
      totalOtros += calcOtros(data);
      legalValue +=
        data.inputAmount !== null
          ? calcLegals(data.vehiculo![0].pvp!, true)
          : 0;
      setExonerated(data.exonerated !== null);
      setDataExonerated(
        data.exonerated !== null ? 'Exonerated' : 'noExonerate'
      );
      return true;
    });

    newDataVehicleT.map((verifi: any) => {
      if (verifi.state === 'Autorizado') {
        verificationSendOk += 1;
      }
      return true;
    });

    if (vehicle.length === verificationSendOk) {
      setSendOkDocument(true);
    }

    setStatusButton(stateLead);
    setDataVehicle(newDataVehicleT);

    setSubtotalT(totalVeh + totalSer + totalAcc + totalOtros);

    const desc = totalVeh * 0.01 * lead.discount;
    setDescU(desc);

    const valueDesc = totalVeh + totalSer + totalAcc + totalOtros - desc;
    setDescT(valueDesc);

    const iva =
      (totalVeh +
        totalSer +
        totalAcc +
        totalOtros /* + legalValue / 1.12 */ -
        desc) *
      0.12;

    const ivaExonerated = (totalSer + totalAcc + totalOtros) * 0.12;

    const ivaValidate = vehicle[0].exonerated === null ? iva : ivaExonerated;
    setIvaT(ivaValidate);
    setTotalT(valueDesc + ivaValidate);
    /* 
    SocketClient.instance.onNotificationStream.subscribe(
      onNotificationListener
    ); */
  }, []);

  const updateState = (id: any, state: any) => {
    const newDataVehicleU: Array<any> = [];
    let verificationSendOk = 0;
    dataVehicle.map((data: any, i: number) => {
      const newD = {
        key: i,
        brand: data.brand,
        model: data.model,
        year: data.year,
        pvp: data.pvp,
        state: i === id ? state : data.state,
        dataQuote: data.dataQuote,
        dataClient: data.dataClient,
        prebill: data.prebill,
        delivery: data.delivery,
        lead,
      };
      newDataVehicleU.push(newD);
      return true;
    });

    newDataVehicleU.map((verifi: any) => {
      if (verifi.state === 'Autorizado') {
        verificationSendOk += 1;
      }
      return true;
    });

    if (dataVehicle.length === verificationSendOk) {
      setSendOkDocument(true);
      updateStateLead();
    }
    setDataVehicle(newDataVehicleU);
  };

  return (
    <div>
      {!viewDocument ? (
        <div>
          <h2 className="text-2xl c-black m-0 p-0 flex mb-10 ">
            Detalles del negocio
          </h2>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Vehículos" key="1">
              {dataVehicle && (
                <div className="mt-5">
                  {exonerated && (
                    <div className="mb-5">
                      El negocio tiene vehiculos con categoria  
                      <Tag color="purple">Exonerado</Tag>
                    </div>
                  )}
                  <TableVehicle
                    data={dataVehicle}
                    viewDocument={() => {
                      setviewDocument(true);
                    }}
                    quotes={setQuotesData}
                    idNotificationQuote={idNotificationQuote}
                  />
                  <div className="mb-5">
                    {dataExonerated && totalT && (
                      <TableTemplate
                        rows={[
                          {
                            label: 'Subtotal',
                            content: currenyFormat(subtotalT),
                          },
                          {
                            label: `Descuento ${lead.discount} %`,
                            content: currenyFormat(descU),
                          },
                          {
                            label: 'Subtotal - Descuento ',
                            content: currenyFormat(descT),
                          },
                          {
                            label: 'IVA',
                            content: currenyFormat(ivacT),
                          },
                          {
                            label: 'Total',
                            content: (
                              <b className="text-lg">
                                {' '}
                                {currenyFormat(totalT)}
                              </b>
                            ),
                          },
                        ]}
                      />
                    )}
                  </div>
                  {/* {statusButton === false ? (
                    <div>
                      <Alert
                        message="Recuerde que debe verificar los documentos de todos los vehiculos del negocio para aprobar la factura."
                        type="warning"
                        showIcon
                        closable
                      />
                      <div className="mt-5">
                        <Button
                          type="primary"
                          onClick={updateStateLead}
                          loading={loading}
                          disabled={!sendOkDocument}
                        >
                          Confirmar documentos del negocio
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Result
                      status="success"
                      title="¡Excelente! La verificación fue completada"
                      subTitle="En hora buena, haz completado todo el proceso de verificación"
                    />
                  )} */}
                </div>
              )}
            </TabPane>
            <TabPane tab="Prefactura" key="2">
              <Prebill
                client={client}
                vehiclesToShow={vehicle}
                lead={lead}
                descuento={0}
                payThirdPerson={false}
              />
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <WalletDocuments
          data={quotesData}
          onClosed={() => {
            setviewDocument(false);
          }}
          updateState={(a: any, b: any) => {
            updateState(a, b);
          }}
          setDataSource={setDataSource}
        />
      )}
    </div>
  );
};

const TableVehicle: FunctionComponent<{
  data: any;
  viewDocument: Function;
  quotes: Function;
  idNotificationQuote?: number;
}> = ({ data, viewDocument, quotes, idNotificationQuote }) => {
  useEffect(() => {}, []);
  return (
    <Table
      rowClassName={(record) => {
        if (record.dataQuote.id === idNotificationQuote) {
          return 'ant-table-row-selected';
        }
        return 'cursor-pointer';
      }}
      dataSource={data}
      columns={[
        {
          title: 'Marca',
          dataIndex: 'brand',
          key: 'brand',
        },
        {
          title: 'Modelo',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: 'Año',
          dataIndex: 'year',
          key: 'year',
        },
        {
          title: 'Precio vehículo',
          dataIndex: 'pvp',
          key: 'pvp',
          render: (value) => <div>{currenyFormat(value)}</div>,
        },
        {
          title: 'Estado',
          dataIndex: 'state',
          key: 'state',
          render: (value: any) => {
            if (value === 'Solicitado' || value === 'REQUESTED' || value === 'Pendiente') {
              return (
                <div>
                  <Tag color="orange">Solicitado</Tag>
                </div>
              );
            }
            if (value === 'Autorizado' || value === 'APPROVED') {
              return (
                <div>
                  <Tag color="green">Autorizado</Tag>
                </div>
              );
            }
            if (value === 'Rechazado' || value === 'REJECTED') {
              return (
                <div>
                  <Tag color="red">Rechazado</Tag>
                </div>
              );
            }
            return true;
          },
        },
        {
          title: '',
          dataIndex: 'action',
          key: 'action',
          render: (text: any, row: any) => (
            <div className="">
              <Button
                onClick={() => {
                  viewDocument();
                  quotes(row);
                }}
                type="primary"
                shape="round"
              >
                <span className="leading-none">Ver detalle</span>
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
};
export default WalletDetails;
