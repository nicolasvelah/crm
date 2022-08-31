import React from 'react';
import { currenyFormat } from '../utils/extras';

export default class Accesories extends React.PureComponent<{
  accesories: any[];
}> {
  render() {
    const { accesories } = this.props;
    return (
      <>
        {accesories && (
          <table className="w-full">
            <thead style={{ backgroundColor: '#FCFCFC' }}>
              <tr className="font-bold">
                <td className="p-2" style={{ width: '80%' }}>
                  Nombre
                </td>
                <td className="p-2 text-center">Cantidad</td>
                <td className="p-2 text-center">Valor/U</td>
              </tr>
            </thead>
            <tbody>
              {accesories.map((item, key) => (
                <tr key={`${key}`}>
                  <td
                    className="text-left p-2 font-bold"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {item.name}
                  </td>
                  <td
                    className="text-center p-2"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    className="text-center p-2"
                    style={{ backgroundColor: '#fff' }}
                  >
                    {currenyFormat(item.cost)}
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
