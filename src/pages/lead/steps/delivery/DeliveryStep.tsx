/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */

import { Card, Col, Row, Tag } from 'antd';

import { inject, observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import Loading from '../../../../components/Loading';
import DeliveryAutorization from './components/DeliveryAutorization';

import PanelView from '../../../../components/PanelView';
import PreDelivery from './components/PreDelivery';
import ScheduleDelivery from './components/ScheduleDelivery';
import UploadFile from '../../../../components/UploadFile';
import VehicleDelivery from './components/VehicleDelivery';
import VehicleRegistarion from './components/VehicleRegistration';
import VehicleRequest from './components/VehicleRequest';
import { DeliveryStepController } from './delivery_step_controller';
import { currenyFormat } from '../../../../utils/extras';
import InvoiceUpload from './components/InvoiceUpload';

const Feature = ({ label, value }: { label: string; value: string }) => (
  <div className="py-1">
    <b className="font-bold">{label}: </b>
    <span>{value}</span>
  </div>
);

@inject('deliveryStepController')
@observer
class DeliveryStep extends Component<{
  deliveryStepController?: DeliveryStepController;
}> {
  render() {
    const {
      fetching,
      documents,
      prebill,
      quote,
      verifyDocumentsIsOk,
      searchAndSaveInvoice,
      updateFileinDocumentVerification,
    } = this.props.deliveryStepController!;
    if (!prebill || !quote) return <Loading visible />;
    const vehiculo = quote.vehiculo![0];
    return (
      <>
        <div className="">
          <div className="mt-2">
            <h2 className="font-bold text-3xl mb-0">
              Felicitaciones por tu venta!
            </h2>
            <p className="font-medium mt-0 text-base">
              Es hora de entregar el producto, te ayudaremos a organizar las
              cosas.
            </p>

            <div className="mt-10 flex items-center">
              <div className="flex-1">
                <h2 className="font-bold text-xl mb-0">
                  {vehiculo.brand} {vehiculo.description}
                </h2>
                <img
                  className="w-full"
                  src={
                    vehiculo.imgs || 'https://via.placeholder.com/700x350.png'
                  }
                  alt=""
                />
              </div>
              <div className="flex-1 ml-20">
                <Card className="py-8 px-2">
                  <h3 className="font-bold text-xl">Características</h3>
                  <div className="flex">
                    <div className="flex-1">
                      <Feature label="Marca" value={`${vehiculo.brand}`} />
                      <Feature label="Modelo" value={`${vehiculo.model}`} />
                      <Feature label="Año" value={`${vehiculo.year}`} />
                      <Feature
                        label="Versión"
                        value={`${vehiculo.description}`}
                      />
                      <br />
                      <b className="text-xl bold">
                        {/* {currenyFormat(prebill.valortotal || 0)} */}
                        {currenyFormat(0)}
                      </b>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-10 text-base">
            <h2 className="font-bold text-3xl mb-0">Entrega</h2>
            <p className="">
              Necesitas cambiar los estados a{' '}
              <Tag color="green">completado</Tag>
              antes de entregar el vehículo. Empieza notificando a los distintos
              actores y cargando los documentos solicitados para su
              verificación.
            </p>
            <div>
              <Row gutter={50}>
                <Col md={10}>
                  <PanelView
                    title="Verificación de documentos"
                    status={{
                      value: verifyDocumentsIsOk ? 'Completado' : 'Pendiente',
                      color: verifyDocumentsIsOk ? 'green' : 'default',
                      popover: null,
                    }}
                  >
                    {documents.map((item, index) => (
                      <div key={item.name}>
                        {item.invoice ? (
                          <InvoiceUpload
                            {...{
                              label: item.name,
                              optional: item.optional,
                              value: item.url,
                              onSave: (v) => {
                                searchAndSaveInvoice(index, v);
                              },
                            }}
                          />
                        ) : (
                          <UploadFile
                            {...{
                              label: item.name,
                              id: `document-${index}`,
                              uploadedFile: item.url,
                              optional: item.optional,
                              onFileUploaded: (url) => {
                                updateFileinDocumentVerification(index, url);
                              },
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </PanelView>
                </Col>
                <Col md={14}>
                  <VehicleRegistarion />
                  <br />
                  <VehicleRequest />
                  <br />
                  <DeliveryAutorization />
                  <br />
                  <PreDelivery />
                </Col>
              </Row>
            </div>
          </div>

          <div className="mt-10 text-base">
            <p>
              Para desbloquear estos módulos debes tener la autorización de
              entrega y la verificación de documentos completa.
            </p>

            <Row gutter={50}>
              <Col md={10}>
                <ScheduleDelivery />
              </Col>
              <Col md={14}>
                <VehicleDelivery />
              </Col>
            </Row>
          </div>
        </div>
        <Loading visible={fetching} />
      </>
    );
  }
}

export default class DeliveryStepView extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Provider deliveryStepController={new DeliveryStepController()}>
        <DeliveryStep />
      </Provider>
    );
  }
}
