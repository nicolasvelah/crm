import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row, Divider } from 'antd';
import Loading from '../../../components/Loading';

const DemostracionProspectHelp : FunctionComponent = () => {
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
            Negocio
          </h2>

          <Divider />

          <div
            style={{ textAlign: 'center', marginTop: 50 }}
          >
            <img
              alt="no-found"
              src="/img/help/static_29.jpg"
              style={{ width: '100%', height: 'auto' }}
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
              src="/img/help/static_30.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Lugar donde se encuentran las cotizaciones después de realizarlas
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
              src="/img/help/static_31.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botones de vehículos clasificados por marcas
          </p>
        </Col>
      </Row>
      <h3
        className="text-x c-black ml-5"
      >
        II-I:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_39.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información general de una marca y su botón correspondiente para
            ver las posibles versiones
          </p>
        </Col>
      </Row>
      <h3
        className="text-x c-black ml-5"
      >
        II-II:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_46.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información específica del vehículo, dispone de tres botones:
            el primero permite la realización de una cotización, el segundo
            corresponde a la asignación de la prueba de manejo y un botón
            extra para ver más información del vehículo
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
              src="/img/help/static_32.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite visualizar la indagación realizada a en el
            paso anterior
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
              src="/img/help/static_33.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que me permite visualizar la información del cliente
          </p>
        </Col>
      </Row>
      <h3
        className="text-x c-black ml-5"
      >
        IV-I:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_37.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Formulario correspondiente para editar los datos del cliente
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
              src="/img/help/static_34.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite la visualización de los seguimientos
            correspondientes al cliente
          </p>
        </Col>
      </Row>
      <h3
        className="text-x c-black ml-5"
      >
        V-I:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_38.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información de los seguimientos, cuenta con un botón en donde se
            puede ver el seguimiento el mismo que permite dar por terminado y
            un botón correspondiente para crear un nuevo seguimiento al cliente
          </p>
        </Col>
      </Row>

      <Divider />
      <h3
        className="text-xl c-black ml-5"
      >
        VI:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_35.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información general del cliente
          </p>
        </Col>
      </Row>

      <Divider />
      <h3
        className="text-xl c-black ml-5"
      >
        VII:
      </h3>
      <Row>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <img
              alt="no-found"
              src="/img/help/static_36.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Gráfico para poder identificar la etapa actual en la que se
            encuentra el cliente dentro del GUC
          </p>
        </Col>
      </Row>
      <Loading visible={loading} />
    </>
  );
};

export default DemostracionProspectHelp;
