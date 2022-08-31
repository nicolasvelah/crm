import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  Row,
  Col,
  Button,
  Tooltip,
  Modal,
  Result,
  Alert,
  message,
  Spin,
} from 'antd';
import moment from 'moment';
import {
  CheckOutlined,
  CloseOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import UploadFile from '../../../components/UploadFile';
import { DataTable } from './TablaVehicles';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import { DocumentsVerifyInput } from '../../../data/providers/apollo/mutations/delivery';
import {
  templateCheckList,
  templateExit,
} from '../../../utils/templates-html/template-delivery';
import toPrint from '../../../utils/templates-html/toPrintTemplate';
import { ClientLeadContext } from '../../../components/GetClientData';
import DateStates from './DateStates';
import { netType } from '../../../utils/extras';
import milisecondsToDate from '../../../utils/milisecondsToDate';
import CRMRepository from '../../../data/repositories/CRM-repository';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import Loading from '../../../components/Loading';

const ModalDelivery: FunctionComponent<{
  dataRow: DataTable;
  deliveryRepository: DeliveryRepository;
}> = ({ dataRow, deliveryRepository }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const { lead } = useContext(ClientLeadContext);
  const [okVins, setOkVins] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataVim, setDataVim] = useState<any>([]);

  const handleOpenOrCancel = () => {
    //console.log(dataRow.okDocuments);
    setOpenModal((prevState: boolean) => !prevState);
  };

  const existFinal =
    !!dataRow.delivery?.finalDocuments && !!dataRow.delivery?.idBusinessHubspot;
  const disabledFinal =
    !!dataRow.delivery?.finalDocuments?.find((last) => last.url === null) ||
    !dataRow.delivery?.scheduleDelivery;
  const isRedExterna =
    netType(lead?.concesionario?.code!).toLowerCase() === 'red externa';

  const verifyAllVins = async () => {
    setLoading(true);
    ///Verificaremos si todos los VIN tienen el estado FACTURADO
    const VINs = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => ({ vin: quo.vimVehiculo!, idQuote: quo.id! }));
    if (VINs) {
      const resp = await CRMRepository.verifyVINs(VINs);
      //console.log('resp', resp);
      if (resp) {
        const noFactura = resp.find((fn: any) => {
          if (fn.vin === dataRow.quote?.vimVehiculo && fn.ok === true) {
            setOkVins(true);

            return true;
          }
          setOkVins(false);

          return false;
        });
      }
      setDataVim(resp);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyAllVins();
  }, [lead]);

  const deliverystatus = (idQuote: number) => {
    const status = lead?.quotes?.find((data) => data.id === idQuote);
    return status?.delivery?.authorizathionStatus;
  };

  //console.log('test', {
  //   red: isRedExterna ? false : !dataRow.okDocuments,
  //   state: lead?.state !== 'Autorizado',
  //   saleDown: !!lead?.saleDown,
  //   leadsState: lead?.state,
  // });

  const text = (
    <span>{okVins ? 'Esperando registro de factura en SAV' : ''}</span>
  );

  return (
    <>
      <div style={{ display: 'fixed', justifyItems: 'center' }}>
        <Tooltip
          color={
            okVins &&
            dataRow.delivery?.registration?.plateNumber &&
            deliverystatus(dataRow.idQuote) === 'Autorizado' &&
            (isRedExterna ? true : dataRow.okDocuments) &&
            !lead?.saleDown
              ? 'green'
              : 'red'
          }
          placement="topLeft"
          title={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <span>
                {okVins ? (
                  <div>
                    <CheckOutlined />
                       Registro de factura en SAV
                  </div>
                ) : (
                  <div>
                    <CloseOutlined />
                       Sin registro de factura en SAV
                  </div>
                )}
              </span>
              <span>
                {dataRow.delivery?.registration?.plateNumber ? (
                  <div>
                    <CheckOutlined />
                       Placa de vehículo registrada
                  </div>
                ) : (
                  <div>
                    <CloseOutlined />
                       Sin registro de placa de vehículo 
                  </div>
                )}
              </span>
              {isRedExterna ? null : (
                <span>
                  {dataRow.okDocuments ? (
                    <div>
                      <CheckOutlined />
                         Documentos de verificación
                    </div>
                  ) : (
                    <div>
                      <CloseOutlined />
                         Faltan ingresar documentos
                    </div>
                  )}
                </span>
              )}
              <span>
                {deliverystatus(dataRow.idQuote) === 'Autorizado' ? (
                  <div>
                    <CheckOutlined />
                       Autorización de cartera
                  </div>
                ) : (
                  <div>
                    <CloseOutlined />
                       Sin autorización de cartera
                  </div>
                )}
              </span>
              {!!lead?.saleDown && (
                <div>
                  <CloseOutlined />
                     Se registro como venta caída
                </div>
              )}
            </div>
          }
        >
          <Button
            loading={loading}
            type="primary"
            shape="round"
            onClick={handleOpenOrCancel}
            disabled={
              (isRedExterna ? false : !dataRow.okDocuments) ||
              deliverystatus(dataRow.idQuote) !== 'Autorizado' ||
              !!lead?.saleDown ||
              !dataRow.delivery?.registration?.plateNumber ||
              !okVins
            }
          >
            Ver
          </Button>
        </Tooltip>

        {existFinal && !disabledFinal && (
          <span
            style={{ marginLeft: 10, fontSize: 25 }}
            role="img"
            aria-label="congratulation"
          >
            🎉
          </span>
        )}
      </div>

      <Modal
        title="Entrega"
        visible={openModal}
        width={600}
        //onOk={this.handleOk}
        onCancel={handleOpenOrCancel}
        footer={null}
      >
        <MainDelivery
          dataRow={dataRow}
          deliveryRepository={deliveryRepository}
        />
      </Modal>
    </>
  );
};

const MainDelivery: FunctionComponent<{
  dataRow: DataTable;
  deliveryRepository: DeliveryRepository;
}> = ({ dataRow, deliveryRepository }) => {
  const { client, lead, setLead } = useContext(ClientLeadContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSendDataToHubspot, setLoadingSendDataToHubspot] =
    useState<boolean>(false);
  const [delivery, setDelivery] = useState<{
    status: string;
    receipt: string | null;
  } | null>(null);
  const [lastDocuments, setLastDocuments] = useState<DocumentsVerifyInput[]>([
    {
      invoice: 'file',
      name: 'Check List Entrega Perfecta',
      walletState: 'walletState',
      url: null,
    },
    {
      invoice: 'file',
      name: 'Hoja de Salida Entrega Perfecta',
      walletState: 'walletState',
      url: null,
    },
    {
      invoice: 'file',
      name: 'Garantía de Vehículo',
      walletState: 'walletState',
      url: null,
    },
  ]);

  const [deliveryFinal, setDeliveryFinal] = useState<boolean>(false);
  //const delivery = dataRow.delivery?.delivery;

  useEffect(() => {
    if (dataRow && dataRow.delivery && dataRow.delivery.finalDocuments) {
      const copyLast = lastDocuments;
      lastDocuments.forEach((last, index) => {
        const indexDoc = dataRow?.delivery?.finalDocuments?.findIndex(
          (doc) => doc.name === last.name
        );
        if (typeof indexDoc === 'number' && indexDoc > -1) {
          //console.log('ok doc', indexDoc, dataRow!.delivery!.verifyDocuments);
          copyLast[index].url =
            dataRow!.delivery!.finalDocuments![indexDoc]!.url;
        }
      });
      setDeliveryFinal(!!dataRow.delivery?.deliveryFinal);
      //console.log('lastDocuments useEffect1', copyLast);
      setLastDocuments([...copyLast]);
    }
    //console.log('lastDocuments useEffect2', lastDocuments);
    setDelivery(
      dataRow.delivery?.delivery
        ? {
            status: dataRow.delivery.delivery.state,
            receipt: dataRow.delivery.delivery.url,
          }
        : null
    );
  }, []);

  const deliveryFinished = async () => {
    setLoading(true);
    const added: boolean = await deliveryRepository.finishDelivery(
      dataRow!.delivery!.id!
    );
    if (added) {
      setDeliveryFinal(true);
      setLoading(false);
      dataRow.setDataToTable((prevState) => {
        //console.log('prevState', prevState);
        const copia = prevState;
        const index = copia.findIndex((dt) => dt.idQuote === dataRow.idQuote);
        //console.log('index', index);
        if (index > -1) {
          copia[index].delivery!.deliveryFinal = true;
          //console.log('copia[index]', copia[index]);
          return [...copia];
        }
        return prevState;
      });
    } else {
      setLoading(false);
      message.error('No se pudo actualizar la información');
    }
  };

  const sendDeliveryReceipt = async (fileUrl: string) => {
    setLoading(true);
    const added: boolean = await deliveryRepository.updateDeliveryFinal(
      dataRow!.delivery!.id!,
      fileUrl
    );
    if (added) {
      message.success('Información actualizada');
      setDelivery({
        status: 'Entregado',
        receipt: fileUrl,
      });
      if (setLead) {
        setLead((prevState: any) => {
          const copiaLead = prevState;
          const indexQuote = copiaLead.quotes?.findIndex(
            (quo: any) => quo.id === dataRow.idQuote
          );
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            copiaLead.quotes[indexQuote].delivery.delivery = {
              status: 'Entregado',
              receipt: fileUrl,
            };
            return { ...copiaLead };
          }
          return prevState;
        });
      }
    } else {
      message.error('No se pudo actualizar la información');
    }
    setLoading(false);
  };

  const updateFileinDocumentVerification = async (
    url: string,
    nameDocument: string
  ) => {
    try {
      setLoading(true);
      console.log('updateFinalDocumentsDelivery lastDocuments1', lastDocuments);
      const index = lastDocuments.findIndex(
        (last) => last.name === nameDocument
      );
      if (index > -1) {
        const copyLast = [...lastDocuments];
        copyLast[index].url = url;

        //console.log('nameDocument', nameDocument);

        //console.log('lastDocuments2', copyLast, lastDocuments);
        // actualizamos en base
        const isOk = await deliveryRepository.updateFinalDocumentsDelivery(
          dataRow!.delivery!.id!,
          copyLast
        );
        console.log('isOk updateFinalDocumentsDelivery', isOk);
        if (isOk.status !== 400) {
          message.success('Información actualizada');
        } else {
          //console.log('lastDocuments3', lastDocuments);
          //setLastDocuments((prevState) => [...prevState]);
          copyLast[index].url = null;
          message.error(
            `No se pudo actualizar la información. ${isOk.message}`
          );
        }

        setLastDocuments((prevState) => {
          return isOk.status === 200 ? [...copyLast] : [...prevState];
        });
        console.log('updateFinalDocumentsDelivery docs', copyLast);
        let finalDocument = false;
        dataRow.setDataToTable((prevState) => {
          const copiaDataTable = prevState;
          const indexDT = copiaDataTable.findIndex(
            (dT) => dT.idQuote === dataRow.idQuote
          );
          if (indexDT > -1) {
            const actualDel = copiaDataTable[indexDT].delivery!;
            if (isOk.status !== 400) {
              actualDel.finalDocuments = copyLast;
            }

            const faltanDoc = !!actualDel.finalDocuments?.find(
              (doc) => doc.url === null
            );
            if (
              actualDel.finalDocuments &&
              !faltanDoc &&
              actualDel.scheduleDelivery &&
              actualDel.scheduleDelivery.date
            ) {
              if (isOk.status !== 400) {
                actualDel.deliveryFinal = true;
                finalDocument = true;
              }
              actualDel.idBusinessHubspot = isOk.idBusinessHubspot ?? null;
            }
            copiaDataTable[indexDT].delivery = actualDel;

            return [...copiaDataTable];
          }
          return prevState;
        });
        if (!isOk.idBusinessHubspot && finalDocument) {
          message.warning('No se pudo enviar datos a Hubspot', 10);
        }
        if (setLead) {
          setLead((prevState: any) => {
            const copiaLead = prevState;
            const indexQuote = copiaLead.quotes?.findIndex(
              (quo: any) => quo.id === dataRow.idQuote
            );
            if (typeof indexQuote === 'number' && indexQuote > -1) {
              const actualDel = copiaLead.quotes[indexQuote].delivery;
              if (isOk.status !== 400) {
                actualDel.finalDocuments = copyLast;
              }

              const faltanDoc = !!copyLast.find((doc) => doc.url === null);
              if (
                actualDel.finalDocuments &&
                !faltanDoc &&
                actualDel.scheduleDelivery &&
                actualDel.scheduleDelivery.date
              ) {
                if (isOk.status !== 400) {
                  actualDel.deliveryFinal = true;
                }

                actualDel.idBusinessHubspot = isOk.idBusinessHubspot ?? null;
              }
              copiaLead.quotes[indexQuote].delivery = actualDel;
              return { ...copiaLead };
            }
            return prevState;
          });
        }
        setLoading(false);
      }
    } catch (error) {
      //console.log('ERROR en updateFileinDocumentVerification', error.message);
      message.error(`No se pudo actualizar la información. ${error.message}`);
    }
  };

  const sendDataToHubspot = async (idDelivery: number) => {
    setLoadingSendDataToHubspot(true);
    const idVid = await deliveryRepository.sendDataToHubspot(idDelivery);
    console.log('idVid', idVid);
    if (!idVid) {
      message.error(
        'No se pudo enviar el negocio a Hubspot. Intente nuevemante'
      );
    } else {
      message.success('El negocio ha sido enviado a Hubspot');
      dataRow.setDataToTable((prevState) => {
        const copiaDataTable = prevState;
        const indexDT = copiaDataTable.findIndex(
          (dT) => dT.idQuote === dataRow.idQuote
        );
        if (indexDT > -1) {
          const actualDel = copiaDataTable[indexDT].delivery!;
          actualDel.idBusinessHubspot = idVid;
          copiaDataTable[indexDT].delivery = actualDel;
          return [...copiaDataTable];
        }
        return prevState;
      });
      if (setLead) {
        setLead((prevState: any) => {
          const copiaLead = prevState;
          const indexQuote = copiaLead.quotes?.findIndex(
            (quo: any) => quo.id === dataRow.idQuote
          );
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            const actualDel = copiaLead.quotes[indexQuote].delivery;
            actualDel.idBusinessHubspot = idVid;
            copiaLead.quotes[indexQuote].delivery = actualDel;
            return { ...copiaLead };
          }
          return prevState;
        });
      }
    }
    setLoadingSendDataToHubspot(false);
  };

  const disabledFinal =
    !!lastDocuments.find((last) => last.url === null) ||
    !dataRow.delivery?.scheduleDelivery;
  //console.log('disabledFinal', disabledFinal);

  const isRedExterna =
    netType(lead?.concesionario?.code!).toLowerCase() === 'red externa';

  return (
    <div className="text-base" style={{ position: 'relative' }}>
      {/* <Button
        onClick={() => {
         //console.log({
            dataRow,
            lead,
            lastDocuments,
            deliveryFinal,
            delivery,
          });
        }}
      >
        Data
      </Button> */}
      {!isRedExterna && (
        <div style={{ margin: '10px 0px' }}>
          <Button
            //type="primary"
            icon={<PrinterOutlined />}
            onClick={() => {
              toPrint(
                templateCheckList({
                  dataGeneral: {
                    concesionario: lead!.concesionario!.name!,
                    asesorComercial: `${lead!.user.nombre} ${
                      lead!.user.apellido
                    }`,
                    date: dataRow.delivery?.scheduleDelivery?.date
                      ? moment(dataRow.delivery!.scheduleDelivery!.date).format(
                          'YYYY-MM-DD'
                        )
                      : moment().format('YYYY-MM-DD'),
                    hours: dataRow.delivery?.scheduleDelivery?.date
                      ? moment(dataRow.delivery!.scheduleDelivery!.date).format(
                          'HH:mm'
                        )
                      : moment().format('HH:mm'),
                    concesionarioCode: lead!.concesionario!.code!,
                  },
                  clientData: {
                    identification: client!.identification!,
                    name: `${client!.name!} ${client!.lastName!}`,
                    phone: client!.cellphone!,
                  },
                  vehicleData: {
                    VIN: dataRow.quote!.vimVehiculo!,
                    brand: dataRow.brand,
                    color: dataRow.color!,
                    model: dataRow.modelo!,
                  },
                })
              );
            }}
          >
            Check List
          </Button>
        </div>
      )}
      {!isRedExterna && (
        <div style={{ margin: '10px 0px' }}>
          <Button
            //type="primary"
            icon={<PrinterOutlined />}
            onClick={() => {
              //console.log('row -->', dataRow);
              const vehicleInvoiceDoc = dataRow.delivery?.verifyDocuments?.find(
                (doc) => {
                  return (
                    doc.name === 'Factura de vehículo' &&
                    doc.invoice === 'invoice'
                  );
                }
              );
              const approvedBy = lead?.quotes?.find(
                (q) => q.delivery?.id && q.delivery?.id === dataRow.delivery?.id
              )?.delivery?.approvedBy;

              toPrint(
                templateExit({
                  approvedBy: approvedBy ?? 'N/A',
                  dateApproved: dataRow.delivery!.updateAt
                    ? milisecondsToDate(
                        dataRow.delivery!.updateAt!,
                        'YYYY-MM-DD'
                      )
                    : 'N/A',
                  dataGeneral: {
                    concesionario: lead!.concesionario!.name!,
                    asesorComercial: `${lead!.user.nombre} ${
                      lead!.user.apellido
                    }`,
                    date: dataRow.delivery?.scheduleDelivery?.date
                      ? moment(dataRow.delivery!.scheduleDelivery!.date).format(
                          'YYYY-MM-DD'
                        )
                      : moment().format('YYYY-MM-DD'),
                    hours: dataRow.delivery?.scheduleDelivery?.date
                      ? moment(dataRow.delivery!.scheduleDelivery!.date).format(
                          'HH:mm'
                        )
                      : moment().format('HH:mm'),
                    concesionarioCode: lead!.concesionario!.code!,
                  },
                  clientData: {
                    identification: client!.identification!,
                    name: `${client!.name!} ${client!.lastName!}`,
                    phone: client!.cellphone!,
                  },
                  vehicleData: {
                    VIN: dataRow.quote!.vimVehiculo!,
                    brand: dataRow.brand,
                    color: dataRow.color!,
                    model: dataRow.modelo!,
                  },
                  vehicleInvoice: vehicleInvoiceDoc?.url ?? undefined,
                })
              );
            }}
          >
            Hoja de salida
          </Button>
        </div>
      )}
      {(!delivery || !delivery.status || delivery.status === 'Inactivo') &&
        !isRedExterna && (
          <>
            <Alert
              message="Para poder finalizar la entrega debes subir la verificación de Pre Entrega"
              type="info"
              showIcon
            />
          </>
        )}
      {!isRedExterna && (
        <div style={{ marginBottom: 5 }}>
          <UploadFile
            id={`vehicle-delivery-preentrega-${dataRow.idQuote}`}
            label="Verificación de Pre Entrega"
            uploadedFile={delivery?.receipt ?? null}
            onFileUploaded={sendDeliveryReceipt}
          />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 25,
          marginLeft: 30,
        }}
      >
        <span>Fecha de entrega</span>
        <DateStates dataRow={dataRow} />
      </div>

      {delivery && delivery.status === 'Entregado' && !isRedExterna && (
        <>
          {deliveryFinal && (
            <Alert
              message="Debes subir estos últimos documentos para poder finalizar venta del vehículo."
              type="info"
              showIcon
            />
          )}

          <div>
            {lastDocuments.map((last, index) => {
              const documento = { ...last };
              //console.log('Documento', documento);
              return (
                <UploadFile
                  key={index}
                  label={last.name!}
                  id={`delivery_${dataRow!.delivery!.id!}_document-${index}-${
                    dataRow.idQuote
                  }`}
                  uploadedFile={documento.url}
                  onFileUploaded={async (url) => {
                    //console.log('url', url);
                    await updateFileinDocumentVerification(url, last.name!);
                    //console.log('last.url', last.url);
                  }}
                />
              );
            })}
          </div>
        </>
      )}
      {!disabledFinal && !dataRow.delivery?.idBusinessHubspot && (
        <div>
          <Result
            status="warning"
            title="Para completar la venta debes enviarla a Hubspot"
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              loading={loadingSendDataToHubspot}
              onClick={async () => {
                await sendDataToHubspot(dataRow.delivery!.id!);
              }}
            >
              Enviar a Hubspot
            </Button>
          </div>
        </div>
      )}
      {!disabledFinal && dataRow.delivery?.idBusinessHubspot && (
        <Result
          status="success"
          title="!Felicidades! has completado todo el proceso de venta para este vehículo."
        />
      )}

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(255, 255, 255, 0.6)',
          }}
        >
          <Spin />
        </div>
      )}
    </div>
  );
};

export default ModalDelivery;
