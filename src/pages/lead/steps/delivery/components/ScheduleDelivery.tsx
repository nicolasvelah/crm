import { Button, DatePicker, Radio } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DeliveryStepController } from '../delivery_step_controller';
import PanelView from '../../../../../components/PanelView';

@inject('deliveryStepController')
@observer
export default class ScheduleDelivery extends React.PureComponent<{
  deliveryStepController?: DeliveryStepController;
}> {
  disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().day('day');
  };

  render() {
    const { deliveryStepController } = this.props;
    const {
      scheduleDelivery,
      updateScheduleDate,
      updateScheduleLocation,
      saveSchedule,
    } = deliveryStepController!;

    let color = 'default';
    const { status, date, location } = scheduleDelivery;

    switch (status) {
      case 'Completado':
        color = 'green';
        break;
      default:
    }

    return (
      <PanelView
        title="Agendar Entrega"
        status={{
          value: status,
          color,
          popover: null,
        }}
      >
        {status !== 'Inactivo' && (
          <div>
            <div>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={this.disabledDate}
                showTime
                disabled={status === 'Completado'}
                value={moment(date)}
                onChange={(e) => {
                  if (e) {
                    updateScheduleDate(e.toDate());
                  }
                }}
              />
              <Button
                disabled={status === 'Completado'}
                onClick={saveSchedule}
                className="ml-2"
                type="primary"
              >
                Guardar
              </Button>
            </div>
            <div className="mt-2">
              <Radio.Group
                disabled={status === 'Completado'}
                onChange={(e) => {
                  updateScheduleLocation(e.target.value);
                }}
                value={location || 'En Showroom'}
              >
                <Radio value="En Showroom">En Showroom</Radio>
                <Radio value="A domicilio">A domicilio</Radio>
              </Radio.Group>
            </div>
          </div>
        )}
      </PanelView>
    );
  }
}
