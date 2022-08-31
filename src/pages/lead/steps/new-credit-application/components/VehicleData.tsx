import React, { FunctionComponent, useContext } from 'react';
import ItemForm from './ItemForm';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';
import { currenyFormat, calcTotal } from '../../../../../utils/extras';
import Quotes from '../../../../../data/models/Quotes';
import { Vehicle } from '../../../../../data/models/Vehicle';

const VehicleData: FunctionComponent<{
  vehiclesFleet?: Vehicle[];
}> = ({ vehiclesFleet }) => {
  //console.log('vehicle data', quotesFleet);
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;

  if (vehiclesFleet) {
    return <VehiclesFleets vehicles={vehiclesFleet} />;
  }

  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Datos del vehículo
      </div>
      <ItemForm title="Marca" val={store.vehicleData.brand ?? 'N/A'} />
      <ItemForm title="Modelo" val={store.vehicleData.model ?? 'N/A'} />
      <ItemForm title="Versión" val={store.vehicleData.description! ?? 'N/A'} />
      <ItemForm title="Año" val={store.vehicleData.year ?? 0} />
      <ItemForm
        title="Plazo"
        val={store.vehicleData.plazo ?? 0}
        adornoPost="Meses"
      />
      <ItemForm title="Tasa" val={store.vehicleData.tasa ?? 0} adornoPost="%" />
      <ItemForm
        title="Accesorios"
        val={
          currenyFormat(Number(store.vehicleData.totalAccesories), true) ?? 0
        }
        adorno=""
      />
      <ItemForm
        title="Servicios"
        val={currenyFormat(Number(store.vehicleData.totalServices), true) ?? 0}
        adorno=""
      />
      <ItemForm
        title="Precio vehículo"
        val={currenyFormat(Number(store.vehicleData.value), true) ?? 0}
        adorno=""
      />
      <ItemForm
        title="PVP vehículo"
        val={`${
          currenyFormat(Number(store.vehicleData.value) * 1.12, true) ?? 0
        } Inc. IVA`}
        adorno=""
      />
      <ItemForm
        title="Entrada"
        val={currenyFormat(Number(store.vehicleData.entrada), true) ?? 0}
        adorno=""
      />
      <ItemForm
        title="Monto a financiar"
        val={currenyFormat(Number(store.vehicleData.financing), true) ?? 0}
        adorno=""
      />
      <ItemForm
        title="Cuota mensual"
        val={
          currenyFormat(Number(store.vehicleData.monthlyPayments), true) ?? 0
        }
        adorno=""
      />
    </div>
  );
};

const VehiclesFleets: FunctionComponent<{ vehicles: Vehicle[] }> = ({
  vehicles,
}) => {
  const totalFlota = vehicles.reduce((acumulador, valorActual) => {
    return acumulador + (valorActual.financing ?? 0);
  }, 0);
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Datos del vehículo
      </div>
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {vehicles.map((vehicleData, index) => (
          <div
            key={index}
            style={{
              borderRadius: 10,
              backgroundColor: '#F0F2F5',
              margin: 2,
              padding: 10,
            }}
          >
            <ItemForm title="Marca" val={vehicleData.brand ?? 'N/A'} />
            <ItemForm title="Modelo" val={vehicleData.model ?? 'N/A'} />
            <ItemForm title="Versión" val={vehicleData.description! ?? 'N/A'} />
            <ItemForm title="Año" val={vehicleData.year ?? 0} />
            <ItemForm
              title="Plazo"
              val={vehicleData.plazo ?? 0}
              adornoPost="Meses"
            />
            <ItemForm title="Tasa" val={vehicleData.tasa ?? 0} adornoPost="%" />
            <ItemForm
              title="Accesorios"
              val={
                currenyFormat(Number(vehicleData.totalAccesories), true) ?? 0
              }
              adorno=""
            />
            <ItemForm
              title="Servicios"
              val={currenyFormat(Number(vehicleData.totalServices), true) ?? 0}
              adorno=""
            />
            <ItemForm
              title="Precio vehículo"
              val={currenyFormat(Number(vehicleData.value), true) ?? 0}
              adorno=""
            />
            <ItemForm
              title="PVP vehículo"
              val={`${
                currenyFormat(Number(vehicleData.value) * 1.12, true) ?? 0
              } Inc. IVA`}
              adorno=""
            />
            <ItemForm
              title="Entrada"
              val={currenyFormat(Number(vehicleData.entrada), true) ?? 0}
              adorno=""
            />
            <ItemForm
              title="Monto a financiar"
              val={currenyFormat(Number(vehicleData.financing), true) ?? 0}
              adorno=""
            />
            <ItemForm
              title="Cuota mensual"
              val={
                currenyFormat(Number(vehicleData.monthlyPayments), true) ?? 0
              }
              adorno=""
            />
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: 'center',
          color: '#000',
          fontSize: '20px',
          margin: '15px',
        }}
      >
        <b>Monto total a financiar: {currenyFormat(totalFlota, true)}</b>
      </div>
    </div>
  );
};

export default VehicleData;
