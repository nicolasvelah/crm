import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DeliveryStepController } from '../delivery_step_controller';
import PanelView from '../../../../../components/PanelView';

@inject('deliveryStepController')
@observer
export default class PreDelivery extends React.PureComponent<{
  deliveryStepController?: DeliveryStepController;
}> {
  render() {
    const { deliveryStepController } = this.props;
    const { preDelivery } = deliveryStepController!;

    let color = 'default';
    const { status } = preDelivery;

    switch (status) {
      case 'Completado':
        color = 'green';
        break;
      default:
    }

    return (
      <PanelView
        title="Imprimir Verificación de Pre Entrega"
        status={{
          value: status,
          color,
          popover: null,
        }}
      >
        <div className="text-right">
          <Button type="primary">Imprimir</Button>
        </div>
      </PanelView>
    );
  }
}
