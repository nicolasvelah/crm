import React, { FunctionComponent, useState, useEffect } from 'react';
import { Select } from 'antd';
import { ConsesionarioInterface } from '../../../../../data/models/User';

const SelectSucursal: FunctionComponent<{
  dealer: ConsesionarioInterface[];
  setSucursal: Function;
  setViewConfig: Function;
}> = ({ dealer, setSucursal, setViewConfig }) => {
  const [actualConcesionario, setActualConcesionario] = useState<{
    cod: string;
    name: string;
    index: number;
  } | null>(null);

  const [actualSucursal, setActualSucursal] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (dealer.length === 1) {
      setActualConcesionario({
        cod: dealer[0].codigo,
        name: dealer[0].descripcion,
        index: 1,
      });
      // if (dealer[0].sucursal.length === 1) {
      //   setActualSucursal({
      //     id: dealer[0].sucursal[0].id_sucursal,
      //     name: dealer[0].sucursal[0].sucursal,
      //   });
      //   //setSucursal(dealer[0].sucursal[0].id_sucursal.toString());
      // }
    }
  }, [dealer]);

  return (
    <>
      {dealer.length > 0 && (
        <div className="flex items-center w-full my-1">
          <div className=" flex justify-end mx-2">
            <b className="select-dealer_sucursal">Concesionario:</b>
          </div>
          <div style={{ width: '400px' }}>
            <Select
              style={{ width: '100%', color: 'black' }}
              value={actualConcesionario?.name}
              defaultValue={dealer[0].descripcion}
              onChange={(value: string) => {
                const actualConseIndex = dealer.findIndex(
                  (cons) => cons.codigo === value
                );
                if (actualConseIndex !== -1) {
                  console.log('actual concesionario', dealer[actualConseIndex].codigo)
                  setActualConcesionario({
                    name: dealer[actualConseIndex].descripcion,
                    cod: dealer[actualConseIndex].codigo,
                    index: actualConseIndex,
                  });
                  setActualSucursal(null);
                }
                setViewConfig(false);
              }}
            >
              {dealer.map((cons, index) => (
                <Select.Option key={index} value={cons.codigo}>
                  {cons.descripcion}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* Sucursal */}
      {dealer.length > 0 &&
        actualConcesionario &&
        dealer[actualConcesionario.index] && (
          <div className="flex items-center w-full my-1">
            <div className=" flex justify-end select-sucursal">
              <b className="select-dealer_sucursal">Sucursal:</b>
            </div>
            <div style={{ width: '400px' }}>
              <Select
                style={{ width: '100%', color: 'black' }}
                value={actualSucursal?.name}
                onChange={(value: string) => {
                  const actualSucu = dealer[
                    actualConcesionario.index
                  ].sucursal.find((sucu) => {
                    return sucu.id_sucursal.toString() === value.toString();
                  });
                  console.log('actualSucu sucu', actualSucu);
                  if (actualSucu) {
                    setActualSucursal({
                      id: actualSucu.id_sucursal,
                      name: actualSucu.sucursal,
                    });
                    setSucursal(actualSucu.id_sucursal.toString());
                  }
                  setViewConfig(true);
                }}
              >
                {dealer[actualConcesionario.index].sucursal.map(
                  (sucu, index) => (
                    <Select.Option key={index} value={sucu.id_sucursal}>
                      {sucu.sucursal}
                    </Select.Option>
                  )
                )}
              </Select>
            </div>
          </div>
        )}
    </>
  );
};

export default SelectSucursal;
