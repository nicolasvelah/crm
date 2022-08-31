/* eslint-disable quotes */
import { IdcardFilled } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React from 'react';
import Client from '../data/models/Client';
import { Vehicle } from '../data/models/Quotes';
import {
  currenyFormat,
  calcTotalQuotesGenerated,
  calcTotalQuotesGeneratedExonerated,
} from '../utils/extras';
import TableTemplate from './TableTemplate';

export default class MailingsFormTemplate extends React.PureComponent<{
  vehicle: Vehicle;
  client: Client;
  vimVehiculo?: string | number;
  quote?: any | null;
  discount?: number | null;
}> {
  calcDescount = (discountValue: number, TotalPvpsInput: number) => {
    const descuentoSobreValorSinIva = TotalPvpsInput * (discountValue * 0.01);
    // console.log(
    //   'descuento',
    //   `Monto de descuento: ${TotalPvpsInput} * ${
    //     discountValue * 0.01
    //   } = ${descuentoSobreValorSinIva}`
    // );
    return descuentoSobreValorSinIva;
  };

  render() {
    const {
      vehicle,
      client,
      children,
      vimVehiculo,
      quote,
      discount,
    } = this.props;

    const discountValue = vehicle.pvp! * (discount ? discount * 0.01 : 0);
    return (
      <div className="container" style={{ padding: 20 }}>
        <div>
          <img
            width={200}
            src="/img/logo.png"
            alt=""
            style={{ margin: '0 auto' }}
          />
        </div>
        <br />
        <h2 className="text-2xl">
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </h2>
        <Row gutter={20}>
          <Col md={12} className="p-10">
            <img
              className="w-full"
              src={
                vehicle.imgs ? vehicle.imgs! : '/img/no-image-found-360x250.png'
              }
              alt=""
              style={{ margin: '0 auto' }}
            />
          </Col>
          <Col md={12}>
            <Card>
              <h3 className="text-lg font-bold">Caracteristicas</h3>
              <br />
              <Row>
                <Col md={12}>
                  <TableTemplate
                    rows={[
                      { label: 'Marca', content: `${vehicle.brand}` },
                      { label: 'Modelo', content: `${vehicle.model}` },
                      { label: 'Año', content: `${vehicle.year}` },
                      {
                        label: 'Cilindraje',
                        content: `${vehicle.cylinder ?? 'N/A'}`,
                      },
                      {
                        label: 'Pasajeros',
                        content: `${vehicle.numPassengers}`,
                      },
                      { label: 'Puertas', content: `${vehicle.doors}` },
                      { label: 'Combustible', content: `${vehicle.fuel}` },
                      { label: 'VIN', content: vimVehiculo ?? 'N/A' },
                      {
                        label: 'Color',
                        content: quote ? (
                          quote.vimVehiculoData ? (
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                              }}
                              className={`color${quote.vimVehiculoData.id_color}`}
                            />
                          ) : (
                            'Sin Vin'
                          )
                        ) : (
                          'Sin Vin'
                        ),
                      },
                      {
                        label: 'Descuento',
                        content: `${discount || 0}% - ${currenyFormat(
                          discountValue
                        )}`,
                      },
                      {
                        label: 'Precio',
                        content: `${currenyFormat(
                          vehicle.pvp! - discountValue
                        )}`,
                      },
                      {
                        label: 'PVP',
                        content: `${currenyFormat(
                          (vehicle.pvp! - discountValue) *
                            (quote.exonerated ? 1 : 1.12)
                        )} inc. IVA`,
                      },
                      {
                        label: 'Accesorios',
                        content: quote
                          ? `${currenyFormat(quote.accesoriesValue)}`
                          : '',
                      },
                      {
                        label: 'Servicios',
                        content: quote
                          ? `${currenyFormat(quote.servicesValue)}`
                          : '',
                      },
                      {
                        label: 'Seguro total',
                        content: quote
                          ? `${currenyFormat(
                              quote.insuranceCarrier &&
                                typeof quote.insuranceCarrier.cost &&
                                quote.insuranceCarrier.cost
                                ? quote.insuranceCarrier.cost
                                : 0
                            )} inc. IVA`
                          : '',
                      },
                      {
                        label: 'Subtotal',
                        content: quote
                          ? `${currenyFormat(
                              calcTotalQuotesGenerated(quote) - discountValue
                            )}`
                          : '',
                      },
                      {
                        label: 'Total',
                        content: quote
                          ? ` ${
                              !quote.exonerated
                                ? currenyFormat(
                                    (calcTotalQuotesGenerated(quote) -
                                      discountValue) *
                                      1.12
                                  )
                                : currenyFormat(
                                    calcTotalQuotesGeneratedExonerated(quote)
                                  )
                            } ${quote.exonerated ? 'sin IVA' : 'inc. IVA'}`
                          : '',
                      },
                    ]}
                  />
                </Col>
                <Col md={12}>
                  <h3 className="font-bold text-lg flex items-center">
                    <IdcardFilled /> <span className="ml-2">Cliente</span>
                  </h3>
                  <TableTemplate
                    rows={[
                      {
                        label: 'Nombre',
                        content: `${client.name} ${client.lastName}`,
                      },
                      {
                        label: 'Identificación',
                        content: `${client.identification}`,
                      },
                      { label: 'Email', content: `${client.email}` },
                      { label: 'Celular', content: `${client.cellphone}` },
                    ]}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <div className="mt-10 flex items-center">
          <div style={{ margin: '0 auto' }}>{children}</div>
        </div>
      </div>
    );
  }
}
