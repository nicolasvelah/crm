/* eslint-disable react/state-in-constructor */
import { Button, Input } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DeliveryStepController } from '../delivery_step_controller';
import PanelView from '../../../../../components/PanelView';

@inject('deliveryStepController')
@observer
export default class VehicleRegistarion extends React.PureComponent<
  {
    deliveryStepController?: DeliveryStepController;
  },
  { plate: string }
> {
  state = {
    plate: '',
  };

  componentDidMount() {
    const { deliveryStepController } = this.props;
    const { vehicleRegistration } = deliveryStepController!;
    const { plate } = vehicleRegistration;
    this.setState({ plate: plate || '' });
  }

  render() {
    const { deliveryStepController } = this.props;
    const { plate } = this.state;
    const {
      notifyVehicleRegistration,
      vehicleRegistration,
      saveVehiclePlate,
    } = deliveryStepController!;

    let color = 'default';
    const { status } = vehicleRegistration;

    switch (status) {
      case 'Matriculado':
        color = 'green';
        break;
      case 'Solicitado':
        color = 'gold';
        break;
      default:
    }
    
    return (
      <PanelView
        title="Matriculación"
        status={{
          value: status,
          color,
          popover: null,
        }}
      >
        <div className="flex justify-between">
          <div className="flex">
            <Input
              onChange={(e) => {
                this.setState({ plate: e.target.value });
              }}
              disabled={status === 'Matriculado'}
              value={plate}
              placeholder="Ingrese la placa"
            />
            {status !== 'Matriculado' && (
              <Button
                onClick={() => {
                  saveVehiclePlate(plate);
                }}
                type="primary"
              >
                Guardar
              </Button>
            )}
          </div>
          {status !== 'Solicitado' && status !== 'Matriculado' && (
            <Button onClick={notifyVehicleRegistration} type="primary">
              Notificar a matriculación
            </Button>
          )}
        </div>
      </PanelView>
    );
  }
}
