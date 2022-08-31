import { Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DeliveryStepController } from '../delivery_step_controller';
import PanelView from '../../../../../components/PanelView';

@inject('deliveryStepController')
@observer
export default class DeliveryAutorization extends React.PureComponent<{
  deliveryStepController?: DeliveryStepController;
}> {
  render() {
    const { deliveryStepController } = this.props;
    const {
      autorizationDelivery,
      notifyToWallet,
      verifyDocumentsIsOk,
    } = deliveryStepController!;

    let color = 'default';
    const { status } = autorizationDelivery;

    switch (status) {
      case 'Solicitado':
        color = 'gold';
        break;
      case 'Autorizado':
        color = 'green';
        break;
      default:
    }

    return (
      <PanelView
        title="Autorización de Entrega"
        status={{
          value: status,
          color,
          popover:
            status === 'Autorizado'
              ? 'If the Ant Design grid layout component does not meet your needs, you can use the excellent layout components of the community:'
              : null,
        }}
      >
        {status === 'Pendiente' && (
          <div className="flex justify-end">
            <Button
              disabled={!verifyDocumentsIsOk}
              onClick={notifyToWallet}
              type="primary"
            >
              Notificar Cartera
            </Button>
          </div>
        )}
      </PanelView>
    );
  }
}
