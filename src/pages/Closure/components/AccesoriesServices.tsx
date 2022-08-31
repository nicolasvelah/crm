import React, { FunctionComponent } from 'react';
import { Alert } from 'antd';
import TableAccesories from './TableAccesories';
import TableServices from './TableServices';
import Quotes, { Accesories, Vehicle } from '../../../data/models/Quotes';
import { ServiceWithType } from './Closure';

const AccesoriesServices: FunctionComponent<{
  vehicle: Vehicle;
  actualAccessories: Accesories[];
  setActualAccessories: Function;
  actualServices: ServiceWithType[];
  setActualServices: Function;
}> = ({
  vehicle,
  actualAccessories,
  setActualAccessories,
  actualServices,
  setActualServices,
}) => {
  return (
    <>
      <Alert
        message="Si agregas o eliminas un accesorio o servicio debes guardar el cierre con el botón al final de esta página."
        type="info"
        showIcon
        className="my-4"
      />
      <div className="my-6">
        <TableAccesories
          paramsToFind={{
            code: vehicle.code ?? '',
            brand: vehicle.brand ?? '',
            model: vehicle.model ?? '',
          }}
          actualAccessories={actualAccessories}
          setActualAccessories={setActualAccessories}
        />
        <br />
        {/* <TableServices
          brand={vehicle.brand ?? ''}
          actualServices={actualServices}
          setActualServices={setActualServices}
        /> */}
      </div>
    </>
  );
};

export default AccesoriesServices;
