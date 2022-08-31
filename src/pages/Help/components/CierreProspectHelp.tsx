import React, { FunctionComponent } from 'react';
import { Col, Row, Divider } from 'antd';

const CierreProspectHelp: FunctionComponent = () => {
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
            Cierre
          </h2>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src="/img/help/static_69.jpg"
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
              src="/img/help/static_70.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite mostrar información adicional sobre la cotización
            del vehículo
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
              src="/img/help/static_71.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Campo de entrada que indica el porcentaje de descuento sobre las
            cotizaciones realizadas
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
              src="/img/help/static_72.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Opción sobre la persona a realizar el pago
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
              src="/img/help/static_73.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón para proceder a la atapa de prefactura
          </p>
        </Col>
      </Row>

      <Divider />
      <h3 className="text-xl c-black ml-5">V:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_74.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Selector del consorcio o financiera
          </p>
        </Col>
      </Row>

      <Divider />
      <h3 className="text-xl c-black ml-5">VI:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_75.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que me permite asignar un Vin al vehículo
          </p>
        </Col>
      </Row>

      <Divider />
      <h3 className="text-xl c-black ml-5">VII:</h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_76.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón correspondiente para notificar a caja sobre el vehículo
            cotizado
          </p>
        </Col>
      </Row>
    </>
  );
};

export default CierreProspectHelp;
