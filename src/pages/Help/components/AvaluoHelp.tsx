import React, { FunctionComponent } from 'react';
import { Col, Row, Divider } from 'antd';

const AvaluoHelp: FunctionComponent = () => {
  return (
    <>
      <Row>
        <Col span={24}>
          <h2 className="text-2xl c-black m-0 p-0 ml-5">
            <img
              alt="no-found"
              style={{ marginLeft: 5 }}
              className="mr-2"
              src="https://www.flaticon.es/svg/static/icons/svg/906/906794.svg"
              width="25"
            />{' '}
            Avlúo Mecánico
          </h2>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src="/img/help/static_125.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
      </Row>

      <Divider />

      <h3 className="text-xl c-black ml-5">I:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_126.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información respectiva del cliente
          </p>
        </Col>
      </Row>

      <Divider />
      <h3 className="text-xl c-black ml-5">II:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_127.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información sobre el vehículo a evaluar
          </p>
        </Col>
      </Row>

      <Divider />
      <h3 className="text-xl c-black ml-5">III:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_128.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Formulario sobre el proveedor de seminuevos
          </p>
        </Col>
      </Row>

      <Divider />
      <h3 className="text-xl c-black ml-5">IV:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_129.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite guardar la información solicitada
          </p>
        </Col>
      </Row>
    </>
  );
};

export default AvaluoHelp;
