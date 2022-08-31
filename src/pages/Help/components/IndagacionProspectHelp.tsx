import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row, Divider } from 'antd';
import Loading from '../../../components/Loading';

const IndagacionProspectHelp : FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const componentdidmount = async () => {
      setLoading(false);
    };
    componentdidmount();
  }, []);

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
            Indagación
          </h2>

          <Divider />

          <div
            style={{ textAlign: 'center', marginTop: 50 }}
          >
            <img
              alt="no-found"
              src="/img/help/static_23.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
      </Row>

      <Divider />

      <h3
        className="text-xl c-black ml-5"
      >
        I:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_24.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Datos de entrada requeridos para de iniciar el proceso de compra
          </p>

        </Col>
      </Row>

      <Divider />
      <h3
        className="text-xl c-black ml-5"
      >
        II:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_25.jpg"
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

      <Divider />
      <h3
        className="text-xl c-black ml-5"
      >
        III:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_26.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite imprimir la hoja de trabajo correspondiente a la
            información del cliente
          </p>
        </Col>
      </Row>

      <Divider />
      <h3
        className="text-xl c-black ml-5"
      >
        IV:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_27.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite avanzar a la siguiente etapa dentro del proceso de
            compra
          </p>
        </Col>
      </Row>

      <Divider />
      <h3
        className="text-xl c-black ml-5"
      >
        V:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_28.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón para cerrar la ventana actual
          </p>
        </Col>
      </Row>
      <Loading visible={loading} />
    </>
  );
};

export default IndagacionProspectHelp;
