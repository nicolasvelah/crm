import React, { FunctionComponent } from 'react';
import { Col, Row, Divider } from 'antd';

const CatalogoHelp: FunctionComponent = () => {
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
            Catálogo
          </h2>

          <Divider />

          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src="/img/help/static_85.jpg"
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
              src="/img/help/static_86.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Marcas disponibles dentro del GUC
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
              src="/img/help/static_89.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Modelos disponibles de cada marca
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
              src="/img/help/static_88.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información general de cada modelo
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
              src="/img/help/static_87.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite ver las diferentes versiones del modelo
            seleccionado
          </p>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Divider />

          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <img
              alt="no-found"
              src="/img/help/static_90.jpg"
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
              src="/img/help/static_91.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Información sobre el modelo seleccionado
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
              src="/img/help/static_92.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite realizar una cotización sobre la versión
            seleccionada
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
              src="/img/help/static_93.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite realizar una prueba de conducción sobre la versión
            seleccionada
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
              src="/img/help/static_94.jpg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Col>
        <Col span={12}>
          <p style={{ textAlign: 'justify' }}>
            Botón que permite ver más información sobre el vehículo seleccionado
          </p>
        </Col>
      </Row>
    </>
  );
};

export default CatalogoHelp;
