import React from 'react';
import { currenyFormat } from '../utils/extras';

export default class Services extends React.PureComponent<{
  services: any[];
}> {
  render() {
    const { services } = this.props;
    
    return (
      <>
        {services && (
          <table className="w-full ">
            <thead style={{ backgroundColor: '#FCFCFC' }}>
              <tr className="font-bold">
                <td className="p-2" style={{ width: '80%' }}>
                  Nombre
                </td>
                <td className="p-2 text-center">Valor/U</td>
              </tr>
            </thead>
            <tbody>
              {services.map((data: any, index:number) => (
                <tr key={index}>
                  <td
                    className="text-left p-2 font-bold"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {data.items[0].descripcion}
                  </td>
                  <td
                    className="text-center p-2"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {currenyFormat(data.items[0].valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }
}
