import React, { FunctionComponent } from 'react';
import 'antd/dist/antd.css';
import { Row, Col, Select } from 'antd';
import { UsergroupAddOutlined, UserOutlined, DownSquareTwoTone, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

function handleChange(value: string) {
}

const InfoProspect: FunctionComponent = () => {
  return (
    <div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="procedencia" span={4}>
          <div style={{ width: '100%', border: 'solid black' }}>
            <span style={{ backgroundColor: 'grey', width: '100%' }}><UsergroupAddOutlined />Procedencia</span>
            <br />
            <span>Canal:</span>
            <br />
            <span>Fecha:</span>
            <br />
            <span>🌡 Temperatura</span>
            <Select defaultValue="caliente" style={{ width: 120 }} onChange={handleChange}>
              <Option value="caliente">Caliente</Option>
              <Option value="tibio">Tibio</Option>
              <Option value="frio">Frio</Option>
            </Select>
          </div>
        </Col>
        <Col className="cliente" span={5}>
          <div style={{ borderColor: 'grey' }}>
            <span><UserOutlined />Cliente</span>
            <br />
            <span>Nombre:</span>
            <br />
            <span>Cédula:</span>
            <br />
            <span>Email:</span>
            <br />
            <span>Celular:</span>
          </div>
          <div>
            <span><ClockCircleOutlined /> Próximo seguimiento</span>
            <br />
            <span>Fecha:</span>
            <br />
            <span>Prioridad:</span>
            <br />
            <span>Tipo:</span>
            <br />
            <span>Motivo:</span>
          </div>
        </Col>
        <Col className="parametrospago" span={5}>
          <div style={{ borderColor: 'grey' }}>
            <span>$ Parámetros de pago</span>
          </div>
        </Col>
        <Col className="gutter-row" span={3}>
          <div style={{ borderColor: 'grey' }}>
            <DownSquareTwoTone />
          </div>
        </Col>
        <Col className="gutter-row" span={7}>
          <div style={{ borderColor: 'grey' }}>col-6</div>
        </Col>
      </Row>
    </div>
  );
};

export default InfoProspect;
