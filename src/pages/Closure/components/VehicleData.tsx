import React, { FunctionComponent } from 'react';
import { Button, Alert, Tag, Tooltip, Badge } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Quotes, { Vehicle } from '../../../data/models/Quotes';
import AspectRatio from '../../../components/AspectRatio';
import { currenyFormat } from '../../../utils/extras';
import Reservation from '../../quote/components/Reservation';

const VehicleData: FunctionComponent<{
  vehicle: Vehicle;
  actualQuote: Quotes;
  nextStep: Function;
  reliceVehicleView: boolean;
  setReliceVehicleView: Function;
  vin: string | null;
  setVin: Function;
}> = ({
  vehicle,
  actualQuote,
  nextStep,
  reliceVehicleView,
  setReliceVehicleView,
  vin,
  setVin,
}) => {
  return (
    <div>
      <div className="flex justify-between ">
        <div className="flex flex-col w-6/12 ">
          <div className="p-3">
            <AspectRatio ratio={9 / 16}>
              <img
                src={vehicle.imgs! || '/img/no-image-found-360x250.png'}
                alt=""
                className="w-full"
                style={{ objectFit: 'cover' }}
              />
            </AspectRatio>
          </div>
        </div>
        <div className="w-6/12 ml-3">
          <div className=" flex flex-col border-1 rounded-lg p-5 ">
            <span>
              <strong>Caracteristicas</strong>
            </span>
            <div className="mt-5">
              {vin ? (
                <Alert
                  className="mb-2"
                  message={
                    <div>
                      VIN: {vin}
                      <Button
                        className="ml-2"
                        type="primary"
                        danger
                        style={{
                          backgroundColor: '#fff',
                          borderColor: '#2e7d32',
                          color: '#2e7d32',
                        }}
                        onClick={() => nextStep()}
                        icon={<ArrowRightOutlined />}
                      >
                        Prefacturar
                      </Button>
                    </div>
                  }
                  type="success"
                />
              ) : null}
              <div className="flex flex-row justify-start">
                <div className="flex flex-col mr-1">
                  <p className="font-bold mb-0 text-right">Marca:</p>
                  <p className="font-bold mb-0 text-right">Modelo:</p>
                  <p className="font-bold mb-0 text-right">Versión:</p>
                  <p className="font-bold mb-0 text-right">Año:</p>
                  <p className="font-bold mb-0 text-right">
                    {vehicle.cylinder! ? 'Cilindraje:' : ''}
                  </p>
                  <p className="font-bold mb-0 text-right">Pasajeros:</p>
                  <p className="font-bold mb-0 text-right">Puertas:</p>
                  <p className="font-bold mb-0 text-right">Combustible:</p>
                  <p className="font-bold mb-0 text-right">Subtotal:</p>
                  <p className="font-bold mb-0 text-right text-xl">PVP:</p>
                </div>
                <div className="flex flex-col ">
                  <p className=" mb-0">{vehicle.brand! ?? 'N/A'}</p>
                  <p className=" mb-0">{vehicle.model! ?? 'N/A'}</p>
                  <p className=" mb-0">{vehicle.description! ?? 'N/A'}</p>
                  <p className=" mb-0">{vehicle.year! ?? 'N/A'}</p>
                  <p className=" mb-0">{vehicle.cylinder! ?? ''}</p>
                  <p className=" mb-0">{vehicle.numPassengers! ?? 'N/A'}</p>
                  <p className=" mb-0">{vehicle.doors! ?? 'N/A'}</p>
                  <p className=" mb-0">{vehicle.fuel! ?? 'N/A'}</p>
                  <p className=" mb-0">
                    {currenyFormat(vehicle.pvp!, true) ?? 'N/A'}{' '}
                  </p>
                  <p className=" mb-0 text-xl">
                    {currenyFormat(vehicle.pvp! * 1.12, true) ?? 'N/A'}{' '}
                    {actualQuote.exonerated ? (
                      <Tag color="purple">Exonerado</Tag>
                    ) : (
                      <span className="text-sm">Inc. IVA</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex mt-2 items-center">
                <div className="text-xs">
                  Stock: <b>{vehicle.stock}</b>
                  <br />
                  <p className="mb-0">Colores disponibles:</p>
                  <Tooltip
                    placement="left"
                    title="El color del vehículo se seleccionará al asignar un VIN"
                  >
                    <div>
                      {vehicle.color &&
                        vehicle.color.map((col, index) => (
                          <div key={index}>
                            <Badge
                              color="#666"
                              text={`${col.stock} ${col.color}`}
                            />
                          </div>
                        ))}
                    </div>
                  </Tooltip>
                </div>
              </div>
              {actualQuote.reserveValue && (
                <div className="font-bold text-base">
                  Valor de la reserva: {actualQuote.reserveValue}{' '}
                  <Tag color="#87d068">Pagado</Tag>
                  <Reservation
                    codigo={vehicle.code!}
                    quoteId={actualQuote.id!}
                    disabledReserveButton={false}
                    reliceVehicleView={reliceVehicleView}
                    setReliceVehicleView={setReliceVehicleView}
                    setVin={setVin}
                    vin={[]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleData;
