/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */

/* eslint-disable react/static-property-placement */
import React from 'react';

interface Props {
  rows: {
    title?: string;
    label?: string;
    content?: React.ReactNode | string;
  }[];
  mode: 'vertical' | 'horizontal';
}

export default class TableTemplate extends React.PureComponent<Props> {
  static defaultProps = {
    mode: 'vertical',
  };

  render() {
    const { rows, mode } = this.props;
    return (
      <table>
        <tbody>
          {mode === 'vertical' &&
            rows.map((item, index) =>
              item.title ? (
                <tr key={`${index}`}>
                  <td
                    colSpan={item.content ? 1 : 2}
                    className="text-lg  pt-4"
                    style={{
                      color: 'black',
                      whiteSpace: 'nowrap',
                      fontSize: 14,
                    }}
                  >
                    {item.title}
                  </td>
                  {item.content && (
                    <td className="pt-4 pl-2">{item.content}</td>
                  )}
                </tr>
              ) : (
                <tr className="py-1" key={`${index}`}>
                  <td
                    className="font-bold text-right"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {item.label !== '' ? `${item.label}:` : ''}
                  </td>
                  <td className="pl-2 w-full">{item.content}</td>
                </tr>
              )
            )}
          {mode === 'horizontal' && (
            <tr>
              {rows.map((item, index) => (
                <td className="py-5 px-3 text-left" key={`${index}`}>
                  <div className="font-bold">{item.label}</div>
                  <div>{item.content}</div>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
