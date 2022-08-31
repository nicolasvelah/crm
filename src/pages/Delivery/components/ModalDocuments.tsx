import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tag, message, Row, Col, Spin } from 'antd';
import { DataTable } from './TablaVehicles';
import DeliveryStepView from '../../lead/steps/delivery/DeliveryStep';
import PanelView from '../../../components/PanelView';
import InvoiceUpload from '../../lead/steps/delivery/components/InvoiceUpload';
import UploadFile from '../../../components/UploadFile';
import {
  DeliveryDocumentsCase,
  getDocumentsByCase,
  DeliveryDocument,
  Documents,
} from '../../lead/steps/delivery/utils/delivery_documents';
import Quotes from '../../../data/models/Quotes';
import { ClientLeadContext } from '../../../components/GetClientData';
import Delivery from '../../../data/models/Delivery';
import { DocumentsVerifyInput } from '../../../data/providers/apollo/mutations/delivery';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import { Dependencies } from '../../../dependency-injection';
import CRMRepository from '../../../data/repositories/CRM-repository';
import Get from '../../../utils/Get';
import SettingsRepository from '../../../data/repositories/settings-repository';
import auth from '../../../utils/auth';

const ModalDocuments: FunctionComponent<{
  dataRow: DataTable;
  deliveryRepository: DeliveryRepository;
}> = ({ dataRow, deliveryRepository }) => {
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [fullDocuments, setFullDocuments] = useState<boolean>(false);

  const { lead, client } = useContext(ClientLeadContext);
  const [actualDocuments, setDocuments] = useState<DeliveryDocument[]>([]);

  const [documentsSettings, setDocumentsSettings] = useState<Documents[]>([]);

  const { user } = auth;

  const [deliveryDocumentsCase, setDeliveryDocumentsCase] =
    useState<DeliveryDocumentsCase>(DeliveryDocumentsCase.directoNatural);

  const getDocumentsSettings = async () => {
    let dDocumentsCase = deliveryDocumentsCase;
    if (dataRow.quote!.exonerated) {
      /*//console.log(
        `Debug_ Es exonerado ${dataRow.quote?.id}`,
        dataRow.quote!.exonerated.type
      ); */
      // exonerados natural o diplomatico
      dDocumentsCase =
        dataRow.quote!.exonerated.type === 'diplomatics'
          ? DeliveryDocumentsCase.exoneradoDiplomatico
          : DeliveryDocumentsCase.exoneradoNatural;
    } else if (dataRow.quote!.type !== 'credit') {
      // el pago es de contado y es persona natural
      /*//console.log(
        `Debug_ Es contado ${dataRow.quote?.id}`,
        dataRow.quote!.type,
        client!.isPerson
      ); */
      if (client!.typeIdentification !== 'RUC') {
        dDocumentsCase = DeliveryDocumentsCase.contadoNatural;
      } else if (client!.typeIdentification === 'RUC') {
        // si el cliente usa RUC y es perona natural o juridica
        /*//console.log(
          `Debug_ Es juridica? ${dataRow.quote?.id}`,
          client!.isPerson
        ); */
        dDocumentsCase =
          client!.isPerson !== undefined &&
          client!.isPerson !== null &&
          client!.isPerson === true
            ? DeliveryDocumentsCase.contadoJuridico
            : DeliveryDocumentsCase.contadoNaturalRUC;
      }
    } else {
      /*//console.log(
        `Debug_ Es credito ${dataRow.quote?.id}`,
        dataRow.quote!.type
      ); */
      // si es a credito
      /* const isDirectCredit = dataRow.quote!.chosenEntity
        ? dataRow.quote!.chosenEntity!.entity === 'CRM'
        : false; */

      // si es a credito
      const isDirectCredit = !!dataRow.quote!.quoteFinancial?.find((qf) => {
        return (
          qf.financial?.nameEntityFinancial?.toUpperCase() === 'CRM' &&
          qf.selected
        );
      });
      /* console.log(
        `Debug_ Es credito directo? ${dataRow.quote?.id}`,
        isDirectCredit
      ); */

      if (client!.typeIdentification !== 'RUC') {
        // si es cedula o pasaporte
        dDocumentsCase = isDirectCredit
          ? DeliveryDocumentsCase.directoNatural
          : DeliveryDocumentsCase.ifiNatural;
        //setDeliveryDocumentsCase(dDocumentsCase);
      } else if (client!.typeIdentification === 'RUC') {
        // si es con ruc y no es persona natual
        if (client!.isPerson) {
          /*//console.log(
            `Debug_ Es juridica ${dataRow.quote?.id}`,
            client!.isPerson
          ); */
          dDocumentsCase = isDirectCredit
            ? DeliveryDocumentsCase.directoJuridico
            : DeliveryDocumentsCase.ifiJuridico;
          //setDeliveryDocumentsCase(dDocumentsCase);
        } else {
          // si es persona natural con ruc
          /*//console.log(
            `Debug_ Es Natural ${dataRow.quote?.id}`,
            client!.isPerson
          ); */
          dDocumentsCase = isDirectCredit
            ? DeliveryDocumentsCase.directoNaturalRUC
            : DeliveryDocumentsCase.ifiNaturalRUC;
          //setDeliveryDocumentsCase(dDocumentsCase);
        }
      }
    }
    setDeliveryDocumentsCase(dDocumentsCase);
    //console.log('Debug_ dDocumentsCase', dDocumentsCase);

    /* ///Get documents
    const documents2: Documents[] = [
      {
        name: 'Documentos UAFE',
        when: 'all',
        optional: null,
      },
      {
        name: 'Documentos negocios a crédito',
        when: [1, 3, 5, 6, 7],
        optional: null,
      },
      {
        name: 'Documentos forma de pago usados',
        when: 'all',
        optional: 'all',
      },
      {
        name: 'Documentos negocio exonerados',
        when: [9, 10],
        optional: null,
      },
      {
        name: 'Documentos servicios de prepago Postventa',
        when: 'all',
        optional: 'all',
      },
      {
        name: 'Documentos adicionales al negocio',
        when: 'all',
        optional: 'all',
      },
      {
        name: 'Documentos previo entrega del vehículo',
        when: 'all',
        optional: null,
      },
    ];

    if (!documents2) {
     //console.log('No hay configuración');
      return;
    } */

    const respSettings: any = await settingsRepository.getAllSettings(
      user.dealer[0].sucursal[0].id_sucursal
    );
    //console.log('log documents respSettings', respSettings);
    let docuSet: any[] = [];
    if (respSettings) {
      const dataDocuments = respSettings.find(
        (rS: any) => rS.settingType === 'documents-delivery'
      );
      //console.log('log documents dataDocuments', dataDocuments);
      if (dataDocuments && dataDocuments.settingValue) {
        //console.log('log documents dataDocuments', dataDocuments);
        docuSet = JSON.parse(dataDocuments.settingValue);
      }
    } else {
      message.error('No se pudo obtener las configuraciones');
    }
    //console.log('DOCUMENTO CASO -->', dDocumentsCase);
    //console.log('docuBefore-->', docuSet);
    // obtenemos los documentos segun el caso
    const docs = getDocumentsByCase(dDocumentsCase, docuSet);
    //console.log('docuAfter-->', docs);
    //console.log('log documents docs', docs);

    if (dataRow.delivery!.verifyDocuments) {
      // comprobamos los documentos que ya fueron cargados
      dataRow.delivery!.verifyDocuments.forEach((item) => {
        const index = docs.findIndex(
          (e) => e.name === item.name && item.url !== null
        );
        if (index !== -1) {
          docs[index] = { ...docs[index], url: item.url };
        }
      });
    }
    //console.log('docs', docs);
    setDocuments(docs);
  };

  /* ----------HOOKS------------ */
  useEffect(() => {
    getDocumentsSettings();
  }, []);

  //Se verifica si todos los documentos están llenos
  const verifyDocumentsIsOk = (): boolean => {
    //console.log('actualDocuments ', actualDocuments);
    const documentsRequired = actualDocuments.filter(
      (e) => e.optional === true
    );
    //console.log('documentsRequired', documentsRequired);

    const documentsLoaded = actualDocuments.filter(
      (e) => e.url !== null && e.optional === true
    );

    //console.log('documentsLoaded', documentsLoaded);

    const verify = documentsLoaded.length >= documentsRequired.length;

    //console.log('verify', verify);

    dataRow.setDataToTable((prevState) => {
      //console.log('prevState', prevState);
      const copia = prevState;
      const index = copia.findIndex((dt) => dt.idQuote === dataRow.idQuote);
      //console.log('index', index);
      if (index > -1) {
        copia[index].okDocuments = verify;
        //console.log('copia[index]', copia[index]);
        return [...copia];
      }
      return prevState;
    });
    setFullDocuments(verify);
    return verify;
  };

  //Si existe cambios en el array de documentos
  useEffect(() => {
    verifyDocumentsIsOk();
  }, [actualDocuments]);

  /* ----------Funciones-------- */
  const handleCancel = () => setViewModal(false);
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CheckCircleOutlined
          style={{
            color: fullDocuments ? '#1890ff' : '#ccc',
            fontSize: 20,
            marginRight: 5,
          }}
        />
        <Button
          type="primary"
          shape="round"
          disabled={!!lead?.saleDown}
          onClick={() => setViewModal((prevState) => !prevState)}
        >
          Ver
        </Button>
      </div>

      <Modal
        title={dataRow.description}
        visible={viewModal}
        //onOk={this.handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {/*  <DeliveryStepView /> */}
        <MainModalDocument
          actualDocuments={actualDocuments}
          setDocuments={setDocuments}
          verifyDocumentsIsOk={fullDocuments}
          delivery={dataRow.delivery!}
          deliveryRepository={deliveryRepository}
          dataRow={dataRow}
        />
      </Modal>
    </>
  );
};

const MainModalDocument: FunctionComponent<{
  actualDocuments: DeliveryDocument[];
  delivery: Delivery;
  deliveryRepository: DeliveryRepository;
  verifyDocumentsIsOk: boolean;
  setDocuments: Function;
  dataRow: DataTable;
}> = ({
  actualDocuments,
  delivery,
  deliveryRepository,
  verifyDocumentsIsOk,
  setDocuments,
  dataRow,
}) => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [loading, setloading] = useState<boolean>(false);
  const { setLead } = useContext(ClientLeadContext);
  /* ------------Documents -------------- */
  /* const enableScheduleAndDeliveryModules = () => {
    if (
      this.verifyDocumentsIsOk &&
      this.scheduleDelivery.status === 'Inactivo'
    ) {
      this.scheduleDelivery = {
        ...this.scheduleDelivery,
        status: 'Pendiente',
      };
      this.delivery = {
        ...this.delivery,
        status: 'Pendiente',
      };
    }
  }; */

  const updateDocumentVerification = async (documents: DeliveryDocument[]) => {
    //console.log('DataRow', dataRow);
    // convertimos los documentos al tipo de dato que require la mutacion
    const data: DocumentsVerifyInput[] = [];
    documents.forEach((item) => {
      data.push({
        name: item.name,
        url: item.url,
        invoice: item.invoice ? 'invoice' : 'file',
        walletState: 'walletState',
      });
    });
    const isOk = await deliveryRepository.updateDocumentsVerify(
      delivery.id!,
      data
    );
    if (isOk) {
      //setDocuments(data);
      if (setLead) {
        setLead((prevState: any) => {
          const copiaLead = prevState;
          const indexQuote = copiaLead.quotes?.findIndex(
            (quo: any) => quo.id === dataRow.idQuote
          );
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            copiaLead.quotes[indexQuote].delivery.verifyDocuments = data;
            return { ...copiaLead };
          }
          return prevState;
        });
      }
      dataRow.setDataToTable((prevState) => {
        const copiaDataTable = prevState;
        const indexDT = copiaDataTable.findIndex(
          (dT) => dT.idQuote === dataRow.idQuote
        );
        if (indexDT > -1) {
          copiaDataTable[indexDT].delivery!.verifyDocuments! = data;
          return [...copiaDataTable];
        }
        return prevState;
      });
    }
    return isOk;
  };

  const searchAndSaveInvoice = async (
    documentIndex: number,
    invoiceNumber: string
  ) => {
    setloading(true);
    // buscamos si existe la factura con el nuemro dado
    const result = await CRMRepository.catalog({
      operacion: 'facturas',
      filtro: { numero: invoiceNumber },
    });
    if (!result) {
      // si no existe la factura
      //this.fetching = false;
      message.error('Factura no encontrada');
      setloading(false);
      return;
    }
    // creamos una copia de los documentos
    const tmp = [...actualDocuments];
    tmp[documentIndex].url = invoiceNumber;
    // actualizamos en base
    const isOk = await updateDocumentVerification(tmp);
    if (isOk) {
      setDocuments(tmp);
      message.success('Información actualizada');
      // si los documentos se actualizaron correctamente en base
      //this.documents = documents;
      //this.enableScheduleAndDeliveryModules(); // comprobamos si podemos habilitar los modulos de agendamiento y entrega
    } else {
      message.error('No se pudo actualizar la información');
    }
    setloading(false);
  };

  const updateFileinDocumentVerification = async (
    documentIndex: number,
    url: string
  ) => {
    setloading(true);
    // creamos una copia de los documentos
    const tmp = [...actualDocuments];
    tmp[documentIndex].url = url;

    // actualizamos en base
    const isOk = await updateDocumentVerification(tmp);
    if (isOk) {
      message.success('Información actualizada');
      setDocuments(tmp);
      // si los documentos se actualizaron correctamente en base
      //this.documents = documents;
      //this.enableScheduleAndDeliveryModules(); // comprobamos si podemos habilitar los modulos de agendamiento y entrega
    } else {
      message.error('No se pudo actualizar la información');
    }
    setloading(false);
  };

  return (
    <div className="text-base">
      <h2 className="font-bold text-3xl mb-0">Entrega</h2>
      <p className="">
        Necesitas cambiar los estados a <Tag color="green">completado</Tag>
        antes de entregar el vehículo. Empieza notificando a los distintos
        actores y cargando los documentos solicitados para su verificación.
      </p>
      <div style={{ position: 'relative' }}>
        <PanelView
          title="Verificación de documentos"
          status={{
            value: verifyDocumentsIsOk ? 'Completado' : 'Pendiente',
            color: verifyDocumentsIsOk ? 'green' : 'default',
            popover: null,
          }}
        >
          {actualDocuments.map((item, index) => (
            <div key={item.name}>
              {item.invoice ? (
                <InvoiceUpload
                  {...{
                    label: item.name,
                    optional: item.optional,
                    value: item.url,
                    onSave: async (v) => {
                      //console.log({ v });
                      await searchAndSaveInvoice(index, v);
                    },
                  }}
                />
              ) : (
                <UploadFile
                  {...{
                    label: item.name,
                    id: `delivery_${delivery.id!}_document-${index}`,
                    uploadedFile: item.url,
                    optional: item.optional,
                    onFileUploaded: async (url) => {
                      //console.log('url', url);
                      await updateFileinDocumentVerification(index, url);
                    },
                  }}
                />
              )}
            </div>
          ))}
        </PanelView>
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
    </div>
  );
};

export default ModalDocuments;
