import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DeliveryStepController } from '../delivery_step_controller';
import PanelView from '../../../../../components/PanelView';
import UploadFile from '../../../../../components/UploadFile';

@inject('deliveryStepController')
@observer
export default class VehicleRequest extends React.PureComponent<{
  deliveryStepController?: DeliveryStepController;
}> {
  render() {
    const { deliveryStepController } = this.props;
    const {
      notifyToLogistic,
      vehicleRequest,
      sendDeliveryRequestReceipt,
    } = deliveryStepController!;

    let color = 'default';
    if (vehicleRequest.status === 'Solicitado') {
      color = 'gold';
    } else if (vehicleRequest.status === 'Entregado') {
      color = 'green';
    }
    return (
      <PanelView
        title="Pedido Vehículo"
        status={{
          value: vehicleRequest.status,
          color,
          popover: null,
        }}
      >
        {vehicleRequest.status === 'Pendiente' && (
          <div className="text-right">
            <Button onClick={notifyToLogistic} type="primary">
              Notificar logística
            </Button>
          </div>
        )}

        {vehicleRequest.status === 'Solicitado' && (
          <UploadFile
            id="vehicle-request"
            label="Recibo de entrega"
            uploadedFile={vehicleRequest.deliveryReceipt}
            onFileUploaded={sendDeliveryRequestReceipt}
          />
        )}
        {vehicleRequest.status === 'Entregado' && (
          <div className="text-right">
            Entregado               <Button type="primary">Ver Archivo</Button>
          </div>
        )}
      </PanelView>
    );
  }
}
