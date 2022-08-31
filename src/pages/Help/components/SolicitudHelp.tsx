import React, { FunctionComponent } from 'react';
import { Col, Row, Divider } from 'antd';

const SolicitudHelp: FunctionComponent = () => {
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
            Solicitud de Crédito
          </h2>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src="/img/help/static_112.jpg"
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
              src="/img/help/static_113.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Selector del concesionario y sucursal para buscar las solicitudes de
            crédito
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
              src="/img/help/static_114.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Opción de buscar las solicitudes de crédito por apellido del asesor
            comercial o cliente
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
              src="/img/help/static_115.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Campo de entrada de apellido a buscar
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
              src="/img/help/static_116.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Campo de fechas para obtener las solicitudes de crédito entre fechas
            seleccionadas
          </p>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src="/img/help/static_64.jpg"
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
              src="/img/help/static_65.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Formulario correspondiente para llenar una solicitud de crédito
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
              src="/img/help/static_66.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite notifica a F&I sobre la solicitud de crédito
            creada
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
              src="/img/help/static_67.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que me permite imprimir la solicitud de crédito
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
              src="/img/help/static_68.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que me permite subir un archivo seleccionado
          </p>
        </Col>
      </Row>
    </>
  );
};

export default SolicitudHelp;
