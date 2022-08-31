import React, { FunctionComponent } from 'react';
import { calcLegals, currenyFormat } from '../utils/extras';

export interface OthersProps {}

const Others: FunctionComponent<{ data: any }> = ({ data }) => {
  const calcOtros = (record: any) => {
    if (record) {
      return (
        (record.registration ?? 0) +
        (record.type === 'credit'
          ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
          : 0) +
        (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
      );
    }
    return 0;
  };

  return (
    <>
      {data && (
        <table className="w-full">
          <thead style={{ backgroundColor: '#FCFCFC' }}>
            <tr className="font-bold">
              <td className="p-2" style={{ width: '80%' }}>
                Nombre
              </td>
              <td className="p-2 text-center">Valor</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="text-left p-2 font-bold"
                style={{ backgroundColor: '#fff' }}
              >
                Otros
              </td>
              <td
                className="text-center p-2"
                style={{ backgroundColor: '#fff' }}
              >
                {currenyFormat(calcOtros(data), true)}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default Others;
