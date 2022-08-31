import { AlertOutlined, CarOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import React from 'react';
import User from '../../../data/models/User';
import ReAsignModal from './ReAsignModal';
import Leads from '../../../data/models/Leads';

export default class Worksheet extends React.PureComponent<{
  data: User[] | null;
}> {
  showReAsign = () => {
    const { data } = this.props;
    const modal = Modal.info({
      className: 'modal-without-icon modal-without-btns',
      width: 992,
      centered: true,
      maskClosable: true,
      content: (
        <ReAsignModal
          onSelected={(user) => {
            modal.destroy();
          }}
          data={data}
          lead={{ id: -1 } as Leads}
        />
      ),
    });
  };

  dropSale = () => {
    const modal = Modal.info({
      className: 'modal-without-icon modal-without-btns',
      width: 768,
      centered: true,
      maskClosable: true,
      content: (
        <div className="p-10 text-center" style={{ color: '#fff' }}>
          <AlertOutlined style={{ color: '#ff1744', fontSize: 100 }} />
          <h2 className="text-2xl font-bold mt-4">
            ¿Estás seguro de que quieres reportar esta venta como caída?
          </h2>
          <div>
            <Button
              onClick={() => {
                modal.destroy();
              }}
              size="large"
              danger
            >
              Cancelar
            </Button>
            <Button
              size="large"
              onClick={() => {
                modal.destroy();
              }}
              type="primary"
              className="ml-2"
            >
              Aceptar
            </Button>
          </div>
        </div>
      ),
    });
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <div className="flex flex-row items-center">
              <span className="font-bold">Asesor:</span>
              <Input className="ml-2" defaultValue="ANA LALA" disabled />
              <Button
                onClick={this.showReAsign}
                className="ml-2"
                type="primary"
              >
                Reasignar
              </Button>
            </div>
          </div>

          <div className="mt-4 w-full text-center">
            <Button className="mt-2" type="primary">
              Reservar vehículo <CarOutlined />
            </Button>
            <Button onClick={this.dropSale} className="ml-2" type="primary">
              Venta caída <AlertOutlined />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
