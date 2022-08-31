import React, { FunctionComponent } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Divider, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { currenyFormat } from '../../../utils/extras';
import FormOwnedSupplier from './FormOwnedSupplier';

export interface ModalMecahnicalContentProps {}

const ModalMecahnicalContent: FunctionComponent<{
  dataClientModalMechanical: any;
  load: Function;
  viewModal: Function;
}> = ({ dataClientModalMechanical, load, viewModal }) => {
  console.log('✅DATA MODAL', dataClientModalMechanical);
  const vehicle = dataClientModalMechanical.vehiculo;
  //console.log('✅DATA MODAL', dataClientModalMechanical.prospect);
  return (
    <div>
      <Divider orientation="left" style={{ marginTop: 0, paddingTop: 0 }}>
        Datos Cliente
      </Divider>
      <div className="flex flex-row justify-start">
        {/* <div className="flex flex-col pr-4">
          <Avatar size={64} icon={<UserOutlined />} />
        </div> */}
        <div style={{ paddingLeft: 80 }}>
          <p className="leading-tight mb-0">{`Nombre: ${dataClientModalMechanical.prospect}`}</p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.identification
              ? `Identificación: ${dataClientModalMechanical?.identification}`
              : ''}
          </p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.phone
              ? `Teléfono: ${dataClientModalMechanical?.phone}`
              : ''}
          </p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.email
              ? `Email: ${dataClientModalMechanical?.email}`
              : ''}
          </p>
        </div>
      </div>
      <Divider orientation="left">Información del negocio</Divider>
      <div style={{ paddingLeft: 80, display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: 80 }}>
          <div>
            Nº Negocio: <b>{dataClientModalMechanical.idLead}</b>
          </div>
          <div>
            Nº Cotización: <b>{dataClientModalMechanical.idQuote}</b>
          </div>
          <div>
            Tipo de Cotización:{' '}
            <b>
              {dataClientModalMechanical.type.toUpperCase() === 'CREDIT'
                ? 'Crédito'
                : 'Contado'}
            </b>
          </div>
        </div>

        <div style={{ width: 250 }}>
          <div>
            Vehículo cotizado:{' '}
            <b>
              {vehicle.brand} {vehicle.model} - {vehicle.year}
            </b>
          </div>

          <LazyLoadImage
            className="w-full"
            placeholder={<Spin />}
            effect="blur"
            src={vehicle.imgs}
          />
        </div>
      </div>

      <Divider orientation="left">Avalúo Mecánico</Divider>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 80,
        }}
      >
        <div style={{ marginRight: 80 }}>
          <p className="leading-tight mb-0">{`Marca: ${dataClientModalMechanical.brand}`}</p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.model
              ? `Modelo: ${dataClientModalMechanical?.model}`
              : ''}
          </p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.year
              ? `Año: ${dataClientModalMechanical?.year}`
              : ''}
          </p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.mileage
              ? `Kilometraje: ${dataClientModalMechanical?.mileage}`
              : ''}
          </p>
          <p className="leading-tight mb-0">
            {dataClientModalMechanical?.desiredPrice
              ? `Precio deseado: ${currenyFormat(
                  dataClientModalMechanical?.desiredPrice
                )}`
              : ''}
          </p>
        </div>
      </div>

      <div>
        <Divider orientation="left">Proveedor de seminuevos</Divider>
        <FormOwnedSupplier
          dataFormOwnedSupplier={dataClientModalMechanical.dataFormOwnedSupplier}
          acceptedAppraisal={dataClientModalMechanical.providerAcceptedAppraisal}
          loadForm={() => load()}
          idLead={dataClientModalMechanical.idQuote}
          viewModal={() => viewModal()}
        />
      </div>
    </div>
  );
};

export default ModalMecahnicalContent;
