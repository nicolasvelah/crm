import React, { FunctionComponent, useState, useContext } from 'react';
import { Button, message } from 'antd';
import axios from 'axios';
import auth from '../../../utils/auth';
import {
  calcTotalQuotesGenerated,
  currenyFormat,
  calcTotalQuotesGeneratedExonerated,
} from '../../../utils/extras';
import Get from '../../../utils/Get';
import SettingsRepository from '../../../data/repositories/settings-repository';
import { Dependencies } from '../../../dependency-injection';
import { ClientLeadContext } from '../../../components/GetClientData';

const { user } = auth;

const Box: FunctionComponent<{
  disabledReserveButton: boolean;
  data: any;
  leadId: number;
  clientCi?: string;
  discountRate?: number;
}> = ({ disabledReserveButton, data, leadId, clientCi, discountRate }) => {
  const { lead } = useContext(ClientLeadContext);
  const [loading, setLoading] = useState<boolean>(false);

  const sendBoxMail = async () => {
    setLoading(true);
    const settingsRepository = Get.find<SettingsRepository>(
      Dependencies.settings
    );
    const token = await auth.getAccessToken();
    const id = lead?.sucursal?.code;
    if (!id) {
      message.warning('Sucursal no encontrada.');
      setLoading(false);
      return;
    }
    //const id = user.dealer[0].sucursal[0].id_sucursal;
    const respSettings = await settingsRepository.getAllSettings(parseInt(id));

    console.log('respSettings -->', respSettings);

    const emailReserve: string[] = [];
    if (respSettings) {
      respSettings.map((setting: any) => {
        if (setting.settingType === 'email-reserve') {
          emailReserve.push(setting.settingValue);
        }
        return true;
      });
    } else {
      message.warning(
        'No existe un correo registrado por favor comuniquese con el Jefe de ventas.'
      );
      setLoading(false);
      return;
      //emailReserve.push('nvela@pas-hq.com');
    }
    console.log('emailReserve -->', emailReserve);

    if (emailReserve.length === 0) {
      message.warning(
        'No existe un correo registrado por favor comuniquese con el Jefe de ventas.'
      );
      setLoading(false);
      return;
    }

    /* if (!!true) {
      console.log('test finish');
      setLoading(false);
      return;
    } */

    const calcDescount = (discountValue: number, TotalPvpsInput: number) => {
      const descuentoSobreValorSinIva = TotalPvpsInput * (discountValue * 0.01);
      // console.log(
      //   'descuento',
      //   `Monto de descuento: ${TotalPvpsInput} * ${
      //     discountValue * 0.01
      //   } = ${descuentoSobreValorSinIva}`
      // );
      return descuentoSobreValorSinIva;
    };
    const descuento = calcDescount(discountRate!, data.vehiculo[0].pvp);
    const total = calcTotalQuotesGenerated(data) - descuento!;

    const body = {
      leadId,
      clientCi,
      discountRate,
      idQuote: data.id,
      asunto: 'Solicitud de confirmación de pago de la reserva',
      template: 'templateVehicle',
      bodyData: {
        textHeader:
          'Se solicita la confirmación de pago de la reserva del siguiente vehículo',
        vehicleName: `${data.vehiculo[0].brand} ${data.vehiculo[0].model} ${data.vehiculo[0].description}`,
        vinNumber: data.vimVehiculoData ? data.vimVehiculoData.vin : null,
        vehicleImage: data.vehiculo[0].imgs
          ? data.vehiculo[0].imgs === '/img/no-image-found-360x250.png'
            ? 'https://guc.it-zam.com/img/no-image-found-360x250.png'
            : data.vehiculo[0].imgs
          : 'https://guc.it-zam.com/img/no-image-found-360x250.png',
        data: {
          id_vh: data.vimVehiculoData ? data.vimVehiculoData.vin : null,
          codigo: data.vehiculo[0].code,
          marca: data.vehiculo[0].brand,
          modelo: data.vehiculo[0].model,
          version: data.vehiculo[0].description,
          anio: data.vehiculo[0].code,
          descuento: currenyFormat(descuento!),
          precio: currenyFormat(data.vehiculo[0].pvp - descuento),
          pvp: currenyFormat((data.vehiculo[0].pvp - descuento) * 1.12),
          cilidraje: data.vehiculo[0].cylinder,
          nropasajeros: data.vehiculo[0].numPassengers,
          comercializado: null,
          nroejes: null,
          puertas: data.vehiculo[0].doors,
          combustible: data.vehiculo[0].fuel,
          color: data.vimVehiculoData ? data.vimVehiculoData.color : null,
          totalstock: data.vehiculo[0].stock,
          insuranceCarrierTotal: data.insuranceCarrier
            ? currenyFormat(data.insuranceCarrier.cost)
            : null,
          servicesValue: data.servicesValue
            ? currenyFormat(data.servicesValue)
            : null,
          accesoriesValue: data.accesoriesValue
            ? currenyFormat(data.accesoriesValue)
            : null,
          subtotal: currenyFormat(total),
          total: data.exonerated
            ? `${currenyFormat(
                calcTotalQuotesGeneratedExonerated(data)
              )} sin IVA.`
            : `${currenyFormat(total * 1.12)} inc. IVA`,
        },
        PreTextCallToActionButton: '',
        CallToActionText: 'Confirma la reseva aquí',
      },
      destinatario: `${emailReserve[0]}`,
      copia: 'vhidalgo@pas-hq.com',
      cc: '',
    };

    try {
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/CRM/sendmail`,
        method: 'POST',
        data: body,
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      });
      if (response.status === 200) {
        message.success('Se ha notificado a caja.');
      } else {
        message.error('No se pudo notificar a caja, intente nuevamente.');
      }
    } catch (error) {
      message.error('No se pudo notificar a caja, intente nuevamente.');
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        size="small"
        type="primary"
        ghost
        onClick={() => sendBoxMail()}
        disabled={disabledReserveButton || !!lead?.saleDown}
        loading={loading}
      >
        Notificar a caja
      </Button>
    </>
  );
};

export default Box;
