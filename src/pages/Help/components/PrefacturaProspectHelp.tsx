// @ts-ignore
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row, Divider } from 'antd';
import Loading from '../../../components/Loading';

const PrefacturaProspectHelp : FunctionComponent = () => {
  return (
    <>
      <Row>
        <Col span={24}>
          <h2
            className="text-2xl c-black m-0 p-0 ml-5"
          >
            <img
              alt="no-found"
              style={{ marginLeft: 5 }}
              className="mr-2"
              src="https://www.flaticon.es/svg/static/icons/svg/906/906794.svg"
              width="25"
            />{' '}
            Prefactura
          </h2>

          <Divider />

          <div
            style={{ textAlign: 'center', marginTop: 50 }}
          >
            <img
              alt="no-found"
              src="/img/help/static_117.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            I:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información general sobre el cliente y el vendedor
          </p>
        </Col>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            II:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información sobre el tipo de negocio
          </p>

        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            III:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Lista de vehículos a facturar
          </p>
        </Col>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            IV:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información general del vehículo
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            V:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información sobre los accesorios adquiridos
          </p>
        </Col>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            VI:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información sobre los servicios adquiridos
          </p>

        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            VII:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información sobre la forma de pago
          </p>
        </Col>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            VIII:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información sobre el avalúo mecánico
          </p>

        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <h3
            className="text-xl c-black ml-5"
          >
            IX:
          </h3>
          <p style={{ textAlign: 'justify' }}>
            Información sobre el valor total de los vehículos a facturar
          </p>
        </Col>
      </Row>
    </>
  );
};

export default PrefacturaProspectHelp;
