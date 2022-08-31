import React, { FunctionComponent } from 'react';
import { currenyFormat } from '../utils/extras';

export interface InsuranceProps {
  cost: number;
  monthlyPayment: number;
  name: string;
  years: number;
}

const Insurance: FunctionComponent<{ data: InsuranceProps }> = ({ data }) => {

  return (
    <>
      {data && (
        <table className="w-full">
          <thead style={{ backgroundColor: '#FCFCFC' }}>
            <tr className="font-bold">
              <td className="p-2" style={{ width: '60%' }}>
                Nombre
              </td>
              <td className="p-2 text-center">Costo/mes</td>
              <td className="p-2 text-center">Años</td>
              <td className="p-2 text-center">Valor/U</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="text-left p-2 font-bold"
                style={{ backgroundColor: '#fff' }}
              >
                ASEGURADORA {data.name}
              </td>
              <td
                className="text-center p-2"
                style={{ backgroundColor: '#fff' }}
              >
                {currenyFormat(data.monthlyPayment)}
              </td>
              <td
                className="text-center p-2"
                style={{ backgroundColor: '#fff' }}
              >
                {data.years}
              </td>
              <td
                className="text-center p-2"
                style={{ backgroundColor: '#fff' }}
              >
                {currenyFormat(data.cost)}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default Insurance;
