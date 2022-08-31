import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button, Modal, Result, Alert } from 'antd';
import { DeliveryStepController } from '../delivery_step_controller';
import PanelView from '../../../../../components/PanelView';
import UploadFile from '../../../../../components/UploadFile';
import '../css/delivery.css';

@inject('deliveryStepController')
@observer
export default class VehicleDelivery extends React.PureComponent<{
  deliveryStepController?: DeliveryStepController;
}> {
  render() {
    const { deliveryStepController } = this.props;
    const {
      delivery,
      sendDeliveryReceipt,
      deliveryFinished,
    } = deliveryStepController!;

    let color = 'default';

    const { status, receipt } = delivery;

    switch (status) {
      case 'Entregado':
        color = 'green';
        break;
      default:
    }

    const showResult = () => {
      Modal.success({
        centered: true,
        width: 500,
        content: '!Felicidades! has completado todo el proceso de la venta 😄',
        okText: 'Inicio',
        okButtonProps: { href: '/dashboard' },
      });
    };

    return (
      <PanelView
        title="Entrega"
        status={{
          value: status,
          color,
          popover: null,
        }}
      >
        {status !== 'Inactivo' && (
          <UploadFile
            id="vehicle-delivery"
            label="Verificación de Pre Entrega"
            uploadedFile={receipt}
            onFileUploaded={sendDeliveryReceipt}
          />
        )}
        {status === 'Entregado' && (
          <div className="flex justify-end mt-5">
            <Button
              type="primary"
              size="large"
              style={{ background: '#52C41A' }}
              onClick={() => {
                deliveryFinished();
                showResult();
              }}
            >
              Finalizar venta
            </Button>
          </div>
        )}
      </PanelView>
    );
  }
}
