import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  Col,
  Empty,
  Input,
  List,
  message,
  Result,
  Row,
  Skeleton,
} from 'antd';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import Prebill from '../../quote/components/Prebill';
import {
  currenyFormat,
  calcTotalQuotesGenerated,
  calcLegals,
} from '../../../utils/extras';
import Accesories from '../../../components/Accesories';
import Services from '../../../components/Services';
import Others from '../../../components/Others';
import TableTemplate from '../../../components/TableTemplate';
import PanelView from '../../../components/PanelView';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import Get from '../../../utils/Get';

import WalletContext from './WalletContext';
import Insurance from '../../../components/Insurance';
import DocumentsVerify from '../../../components/DocumentsVerify';
import { Dependencies } from '../../../dependency-injection';
import auth from '../../../utils/auth';
import Loading from '../../../components/Loading';
import { Item } from '../MainWalletPage';

const { TextArea } = Input;
const { user } = auth;

export interface NoteWallet {
  id: number;
  type: string;
  name: string;
  text: string;
  time: string;
}
const WalletDocuments: FunctionComponent<{
  data: any;
  onClosed: Function;
  updateState: Function;
  setDataSource: React.Dispatch<React.SetStateAction<Item[]>>;
}> = ({ data, onClosed, updateState, setDataSource }) => {
  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [dataDocuments, setDatadocuments] = useState<string>('');
  const [commentState, setCommentState] = useState<string>('');
  const [status, setStatus] = useState<string>('Rechazado');
  const [verificationCompleted, setVerificationCompleted] = useState<boolean>(
    false
  );
  const [viewPrebill, setViewPrebill] = useState<boolean>(false);
  const [getComment, setGetComment] = useState<[]>([]);
  const [finalStatus, setFinalStatus] = useState<string>('');
  const [client, setClient] = useState<any>();
  const [vehicle, setVehicle] = useState<any>();
  const [accessories, setAccessories] = useState<any>();
  const [total, setTotal] = useState<any>();
  const [saldo, setSaldo] = useState<any>();
  const [iva, setIva] = useState<any>();
  const [services, setServices] = useState<any>();
  const [insurance, setInsurance] = useState<any>();
  const { dataTable, updateStatusTable } = useContext(WalletContext);

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
    const quoteId = data.dataQuote.id;
    const documents = async () => {
      const totalGeneral =
        data.pvp +
        data.dataQuote.accesoriesValue +
        data.dataQuote.servicesValue +
        calcOtros(data.dataQuote);
      const ivaGeneral = totalGeneral * 0.12;
      setLoading(true);
      const deliveryData: any = await deliveryRepository.getDeliveryByQuote(
        quoteId
      );
      const delivery: any = {
        documents: deliveryData.verifyDocuments,
        id: deliveryData.id,
      };
      setDatadocuments(delivery);
      setGetComment(deliveryData.comment);
      setVerificationCompleted(
        deliveryData.authorizathionStatus === 'Rechazado' ||
          deliveryData.authorizathionStatus === 'Autorizado'
      );
      setStatus(deliveryData.authorizathionStatus);
      setFinalStatus(deliveryData.authorizathionStatus);
      setClient(data.dataClient);
      setVehicle(data.dataQuote.vehiculo[0]);
      setAccessories(data.dataQuote.idAccesories);
      const reserveVehicle = data.dataQuote.reserveValue
        ? data.dataQuote.reserveValue
        : 0;
      setTotal(totalGeneral);
      setSaldo(
        currenyFormat(
          calcTotalQuotesGenerated(data.dataQuote) * 1.12 +
            calcLegals(data.dataQuote.vehiculo[0].pvp, true) -
            reserveVehicle
        )
      );
      setIva(ivaGeneral);

      setServices(data.dataQuote.services);

      setInsurance(data.dataQuote.insuranceCarrier);
      setLoading(false);
    };
    documents();
  }, []);

  const updateStatusComment = async (comment: string, statusInput: string) => {
    setLoading(true);
    const dataComment: NoteWallet = {
      id: user.id,
      type: user.role,
      name: `${user.nombre} ${user.apellido}`,
      text: comment,
      time: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
    };
    const nameClient = `${data.lead.client.name} ${data.lead.client.lastName}`;
    const deliveryStatus: any = await deliveryRepository.updateAuthorizathionStatusAuthorized(
      data.delivery,
      statusInput,
      dataComment,
      data.lead.id,
      data.lead.client.identification,
      data.lead.user.id,
      user.id,
      data.lead.user.codUsuario,
      nameClient,
      data.dataQuote.id
    );
    if (!deliveryStatus) {
      message.error(
        'No se pudo actualizar el estado. Vuelve a intentarlo.'
      );
      setLoading(false);
      return;
    }

    setVerificationCompleted(true);
    setFinalStatus(statusInput);
    updateState(data.key, statusInput);

    if (deliveryStatus) {
      const dataQuoteEdit = {
        accesoriesValue: data.dataQuote.accesoriesValue,
        chosenEntity: data.dataQuote.chosenEntity,
        closed: data.dataQuote.closed,
        delivery: {
          authorizathionStatus: statusInput,
          id: data.dataQuote.delivery.id,
        },
        exonerated: data.dataQuote.exonerated,
        id: data.dataQuote.id,
        idAccesories: data.dataQuote.idAccesories,
        inputAmount: data.dataQuote.inputAmount,
        insuranceCarrier: data.dataQuote.insuranceCarrier,
        months: data.dataQuote.months,
        observations: data.dataQuote.observations,
        rate: data.dataQuote.rate,
        registration: data.dataQuote.registration,
        reserveValue: data.dataQuote.reserveValue,
        sendEmailFinancialToClient: data.dataQuote.sendEmailFinancialToClient,
        services: data.dataQuote.services,
        servicesValue: data.dataQuote.servicesValue,
        vehiculo: data.dataQuote.vehiculo,
        vimVehiculo: data.dataQuote.vimVehiculo,
        vimVehiculoData: data.dataQuote.vimVehiculoData,
      };
      updateStatusTable!(dataQuoteEdit);

      setDataSource((prevState) => {
        //console.log('PREVSTATE --->', prevState);
        const newDataSource = prevState.map((dataSrc) => {
          const newItem: any = { ...dataSrc };
          if (parseInt(dataSrc.key) === data.lead.id) {
            const indice = newItem.product.findIndex(
              (quo: any) => quo.id === data.dataQuote.id
            );
            if (indice !== -1) {
              newItem.product[
                indice
              ].delivery.authorizathionStatus = statusInput;
              const notAllOk = newItem.product.find(
                (quo: any) => quo.delivery.authorizathionStatus !== 'Autorizado'
              );
              if (statusInput === 'Autorizado' && !notAllOk) {
                newItem.status = 'Verificado';
              }
            }
          }
          return newItem;
        });
        return newDataSource;
      });

      message.success('Se actualizo el estado correctamente');
    }
    setLoading(false);
  };
  const onChangeTextBox = (e: any) => {
    setCommentState(e.target.value);
  };

  const onChangeCheckBox = (e: any) => {
    if (e.target.checked === true) {
      setStatus('Autorizado');
    } else {
      setStatus('Rechazado');
    }
  };
  return (
    <div style={{ maxHeight: '75vh', overflowY: 'auto', marginTop: 30 }}>
      <Loading visible={loading} />
      {client ? (
        <div style={{ position: 'relative' }}>
          <div className="flex items-center">
            <Avatar
              className="items-center justify-center flex p-2"
              size="large"
            >
              <UserOutlined style={{ fontSize: 25 }} />
            </Avatar>
            <div className="text-lg ml-2">
              Prospecto 
              <b className="font-bold color-black">
                {client.name} {client.lastName}
              </b>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              onClosed();
            }}
            style={{ position: 'absolute', right: 10, top: 0 }}
          >
            <Button type="link"> Detalles del negocio</Button>
          </div>
          <Row className="mt-5">
            <Col md={12} className="">
              <PanelView
                customHeader={
                  <h2 className="font-bold color-black text-lg m-0">
                    Datos personales
                  </h2>
                }
              >
                <TableTemplate
                  rows={[
                    {
                      label: 'Tipo',
                      content: (
                        <div className="py-2">
                          <Input value={client.typeIdentification!} disabled />
                        </div>
                      ),
                    },
                    {
                      label: 'Nro. Identificación',
                      content: (
                        <div className="py-2">
                          <Input value={client.identification!} disabled />
                        </div>
                      ),
                    },
                    {
                      label: 'Nombre',
                      content: (
                        <div className="py-2">
                          <Input value={client.name!} disabled />
                        </div>
                      ),
                    },
                    {
                      label: 'Apellido',
                      content: (
                        <div className="py-2">
                          <Input value={client.lastName!} disabled />
                        </div>
                      ),
                    },
                    {
                      label: 'Celular',
                      content: (
                        <div className="py-2">
                          <Input value={client.cellphone!} disabled />
                        </div>
                      ),
                    },
                    {
                      label: 'Email',
                      content: (
                        <div className="py-2">
                          <Input value={client.email!} disabled />
                        </div>
                      ),
                    },
                  ]}
                />
                <br />
                <br />
                <h2 className="font-bold color-black text-lg m-0">Vehículo</h2>
                {vehicle && vehicle.imgs && (
                  <div className="p-0 flex" style={{ backgroundColor: '#fff' }}>
                    <div className="p-2">
                      <img style={{ width: 170 }} src={vehicle.imgs} alt="" />
                    </div>
                    <div className="p-2" style={{ fontSize: 14, flex: 1 }}>
                      <div>
                        <b>Marca:</b> {vehicle.brand}
                      </div>
                      <div>
                        <b>Modelo:</b> {vehicle.model}
                      </div>
                      <div>
                        <b>Versión:</b> {vehicle.description}
                      </div>
                      <div>
                        <b>Año:</b> {vehicle.year}
                      </div>
                      <div>
                        <b>{currenyFormat(vehicle.pvp)}</b>
                      </div>
                    </div>
                  </div>
                )}

                {/* {insurance && (
                  <div>
                    <h2 className="font-bold color-black text-lg mt-10">
                      Seguro
                    </h2>
                    <Insurance data={insurance} />
                  </div>
                )} */}
                {accessories && (
                  <div>
                    <h2 className="font-bold color-black text-lg mt-10">
                      Accesorios
                    </h2>
                    <Accesories accesories={accessories} />
                  </div>
                )}
                {services && (
                  <div>
                    <h2 className="font-bold color-black text-lg mt-10">
                      Servicios
                    </h2>
                    <Services services={services} />
                  </div>
                )}
                {data.dataQuote && (
                  <div>
                    <h2 className="font-bold color-black text-lg mt-10">
                      Otros
                    </h2>
                    <Others data={data.dataQuote} />
                  </div>
                )}
              </PanelView>
            </Col>
            <Col md={11} className="ml-5">
              <PanelView
                customHeader={
                  <div className="flex justify-between">
                    <h2 className="font-bold color-black text-lg m-0">
                      Confirmaciones de pago
                    </h2>
                  </div>
                }
              >
                <TableTemplate
                  rows={[
                    /* {
                      label: 'Valor de reserva',
                      content: currenyFormat(
                        data.dataQuote.reserveValue
                          ? data.dataQuote.reserveValue
                          : 0
                      ),
                    }, */
                    /*  {
                      label: 'Saldo',
                      content: <b className="text-lg">{saldo}</b>,
                    }, */
                    /* {
                      label: 'Subtotal',
                      content: currenyFormat(total),
                    },
                    {
                      label: 'IVA',
                      content: currenyFormat(iva),
                    }, */
                    {
                      label: 'Total',
                      content: (
                        <div className="flex mt-2">
                          <b className="text-lg"> {currenyFormat(total)}</b>
                          <p
                            style={{
                              marginTop: 4,
                            }}
                          >
                             Sin descuento
                          </p>
                        </div>
                      ),
                    },
                  ]}
                />
                <div className="mt-5">
                  <h2 className="font-bold color-black text-lg m-0">
                    Facturas generadas para este cliente
                  </h2>
                  <DocumentsVerify
                    documents={dataDocuments}
                    status={!verificationCompleted}
                  />
                </div>
                <div className="mt-5">
                  <br />
                  {verificationCompleted === false ? (
                    <div>
                      {getComment && (
                        <div>
                          <div className="mb-5">Comentarios anteriores:</div>
                          <List
                            itemLayout="horizontal"
                            dataSource={getComment}
                            renderItem={(item: any) => (
                              <List.Item>
                                <List.Item.Meta
                                  title={
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div>{item.name}</div>
                                      <div
                                        style={{
                                          fontSize: 10,
                                          color: '#B2BABB',
                                          marginRight: 5,
                                        }}
                                      >
                                        {moment(item.time).format(
                                          'DD/MM/YYYY hh:mm:ss'
                                        )}
                                      </div>
                                    </div>
                                  }
                                  description={
                                    <div>
                                      <div>{item.text}</div>
                                    </div>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                      <div>Comentario:</div>
                      <TextArea
                        disabled={verificationCompleted}
                        style={{ marginTop: 20 }}
                        id="wallet-detail-comment"
                        onChange={onChangeTextBox}
                      />
                      <div
                        className="flex mt-5 p-5"
                        style={{ backgroundColor: '#fffbe6c4' }}
                      >
                        <Checkbox
                          disabled={verificationCompleted}
                          defaultChecked={status === 'Autorizado'}
                          onChange={onChangeCheckBox}
                        />
                        <div className="ml-2">
                          Confirmo que los valores de pago coinciden y que se
                          puede proceder con la entrega del vehículo y sus
                          accesorios, aliados y otros.
                        </div>
                      </div>
                      <div className="text-right mt-5">
                        <Button
                          size="large"
                          danger
                          disabled={
                            verificationCompleted || status === 'Autorizado'
                          }
                          onClick={() => {
                            updateStatusComment(commentState, 'Rechazado');
                          }}
                          style={{ marginRight: 10 }}
                          loading={loading}
                        >
                          Rechazar
                        </Button>
                        <Button
                          disabled={
                            status === 'Rechazado' ||
                            verificationCompleted ||
                            status === 'Solicitado'
                          }
                          type="primary"
                          size="large"
                          onClick={() => {
                            updateStatusComment(commentState, 'Autorizado');
                          }}
                          loading={loading}
                        >
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>Comentarios:</p>
                      {getComment !== null && (
                        <List
                          itemLayout="horizontal"
                          dataSource={getComment}
                          renderItem={(item: any) => (
                            <List.Item>
                              <List.Item.Meta
                                title={
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <div>{item.name}</div>
                                    <div
                                      style={{
                                        fontSize: 10,
                                        color: '#B2BABB',
                                        marginRight: 5,
                                      }}
                                    >
                                      {moment(item.time).format(
                                        'DD/MM/YYYY hh:mm:ss'
                                      )}
                                    </div>
                                  </div>
                                }
                                description={
                                  <div>
                                    <div>{item.text}</div>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      )}
                      {finalStatus === 'Autorizado' && (
                        <Result
                          status="success"
                          title=""
                          subTitle="Los documentos han sido verificados exitosamente"
                        />
                      )}
                      {finalStatus === 'Rechazado' && (
                        <Result
                          status="warning"
                          title=""
                          subTitle="La verificación de documentos ha sido rechazada"
                        />
                      )}
                    </div>
                  )}
                </div>
              </PanelView>
            </Col>
          </Row>
        </div>
      ) : (
        <div style={{ height: '70vh' }}>
          <div className="flex row p-10">
            <Skeleton active avatar paragraph={{ rows: 10 }} />
            <Skeleton active avatar paragraph={{ rows: 10 }} />
          </div>
        </div>
      )}

      <div>
        {viewPrebill && (
          <div>
            <Prebill
              client={client}
              vehiclesToShow={[data.dataQuote]}
              lead={data.lead}
              descuento={0}
              payThirdPerson={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDocuments;
