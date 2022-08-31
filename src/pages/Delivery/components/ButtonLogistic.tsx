import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { DataTable } from './TablaVehicles';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import Client from '../../../data/models/Client';
import Leads from '../../../data/models/Leads';
import UploadFile from '../../../components/UploadFile';
import auth from '../../../utils/auth';

const ButtonLogistic: FunctionComponent<{
  dataRow: DataTable;
  deliveryRepository: DeliveryRepository;
  client: Client;
  lead: Leads;
}> = ({ dataRow, deliveryRepository, client, lead }) => {
  /******************************HOOKS*****************************************/

  const [vehicleOrder, setVehicleOrder] = useState<{
    url: string | null;
    state: string | null;
  }>({ url: null, state: 'Pendiente' });
  const [loadingLogistic, setLoadingLogistic] = useState<boolean>(false);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);

  //console.log('dataRow', dataRow);
  /******************************GENERALFUNCTION*******************************/
  const notifyToLogistic = async (idQuote: number) => {
    try {
      const quote = lead.quotes?.find((quo) => quo.id === idQuote);
      if (quote) {
        //console.log('QUOTE', quote);
        const data = auth.user;
        const usuario = `${data.nombre} ${data.apellido}`;
        const correo = 'correodeusuario';
        ////Es asesor CAMBIAR
        //const usuario = `${client.name} ${client.lastName}`;
        const vin = quote.vimVehiculo!;
        //console.log('syscal✅', { usuario, correo });
        const deliveryData = quote.delivery;
        const idDeliverySet: number = deliveryData!.id!;
        const empresa = quote.vehiculo![0]!.brand === 'FORD' ? 'FORD' : 'CRM';
        //console.log({ idDeliverySet, usuario, vin, empresa, correo });
        const updateVehicleOrderForLogistic =
          await deliveryRepository.updateVehicleOrderForLogistic(
            idDeliverySet,
            usuario,
            vin,
            empresa,
            correo
          );
        //console.log('syscal✅', updateVehicleOrderForLogistic);
        if (updateVehicleOrderForLogistic) {
          setVehicleOrder((prevState) => ({
            ...prevState,
            state: 'Solicitado',
          }));
          message.success('Mail enviado al cliente');
        } else {
          message.error('Algo salió mal, vuelve a intentar.');
        }
      } else {
        message.error('Cotización no encontrada');
      }
    } catch (error) {
      //console.log('Error en NotifycToLogistic', error.message);
      message.error('No se logró modificar');
    }
  };

  const sendDeliveryRequestReceipt = async (
    fileUrl: string,
    idDelivery: number
  ) => {
    setLoadingFile(true);
    const result = await deliveryRepository.updateVehicleOrder(
      idDelivery,
      fileUrl
    );
    if (result) {
      setVehicleOrder({
        url: fileUrl,
        state: 'Entregado',
      });
      message.success('Información actualizada');
    } else {
      message.error('No se pudo actualizar la información');
    }
    setLoadingFile(false);
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      //console.log({ dataRow });
      if (dataRow.delivery && dataRow.delivery.vehicleOrder) {
        setVehicleOrder(dataRow.delivery.vehicleOrder);
      }
    };
    componentdidmount();
  }, []);

  /*******************************RETURN***************************************/

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center' }}
      key={dataRow.delivery!.id!}
    >
      {vehicleOrder.state === 'Pendiente' && (
        <div className="text-right">
          <Button
            onClick={async () => {
              setLoadingLogistic(true);
              await notifyToLogistic(dataRow.idQuote);
              setLoadingLogistic(false);
            }}
            loading={loadingLogistic}
          >
            Notificar logística
          </Button>
        </div>
      )}

      {(vehicleOrder.state === 'Solicitado' ||
        vehicleOrder.state === 'Entregado') && (
        <>
          <UploadFile
            id={`vehicle-request_${dataRow.delivery!.id!}`}
            label="Recibo de entrega"
            uploadedFile={vehicleOrder.url}
            onFileUploaded={async (file) => {
              await sendDeliveryRequestReceipt(file, dataRow.delivery!.id!);
            }}
            loading={loadingFile}
            disableUploadInput
          />
        </>
      )}
      {/* {vehicleOrder.state === 'Entregado' && (
        <div className="text-right">
          Entregado               <Button type="primary">Ver Archivo</Button>
        </div>
      )} */}
    </div>
  );
};

export default ButtonLogistic;
