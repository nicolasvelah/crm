import React from 'react';
import { Button } from 'antd';

import { FilterTable } from '../../pages/Prospect/MainProspect';

interface DataProspect {
  key: string;
  names: string;
  type: string;
  id: string;
  phone: string;
  mail: string;
  canal: string;
  campaign: string;
  status: string;
  date: string;
  nextFollow: {
    type: string;
    date: string;
  } | null;
}

const switchNextFollow = (status: string): string => {
  switch (status) {
    case 'Cotización':
      return 'bg-blue-800';
    case 'Test Drive':
      return 'bg-pink-500';
    case 'Indagación':
      return 'bg-yellow-500';
    case 'Demostración':
      return 'bg-green-400';
    default:
      return 'bg-gray-400';
  }
};

/* const switchTypeIdentification = (type: string): string => {
  switch (type) {
    case 'C':
      return 'Cédula';
    case 'R':
      return 'RUC';
    default:
      return 'Pasaporte';
  }
}; */

const columsProspect = (
  sortedInfo: any,
  filteredInfo: any,
  setViewProspect: Function,
  myChanelFilters: FilterTable[],
  myCampaingFilters: FilterTable[]
) => {
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      sorter: (a: DataProspect, b: DataProspect) => {
        return a.date.length - b.date.length;
      },
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'date' && sortedInfo.order,
    },
    {
      title: 'Nombres',
      dataIndex: 'names',
      key: 'names',
      /* sorter: (a: DataProspect, b: DataProspect) => {
        return a.names.length - b.names.length;
      },
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'names' && sortedInfo.order, */
      render: (text: string, row: DataProspect, index: number) => {
        return (
          <span
            className="regular c-black cursor-pointer"
            onClick={() => {
              setViewProspect('/prospect/details', {
                identification: row.id,
              });
            }}
            style={{ textTransform: 'capitalize' }}
          >
            {text.toLowerCase()}
          </span>
        );
      },
    },
    {
      title: 'Tipos',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: [
        { text: 'Cédula', value: 'CEDULA' },
        { text: 'RUC', value: 'RUC' },
        { text: 'Pasaporte', value: 'PASAPORTE' },
      ],
      filteredValue: filteredInfo ? filteredInfo.type : null,
      onFilter: (val: any, record: any) => {
        //console.log({ val, record });
        //console.log('RECORD', record.type.includes(val));
        return record.type.includes(val);
      },
      sorter: (a: DataProspect, b: DataProspect) => {
        //console.log('a:', a, 'b:', b);
        return a.type.length - b.type.length;
      },
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'type' && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: 'Identificación',
      dataIndex: 'id',
      key: 'id',
      width: 160,
      sorter: (a: DataProspect, b: DataProspect) => a.id.length - b.id.length,
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'id' && sortedInfo.order,
    },
    {
      title: 'Celular',
      width: 120,
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a: DataProspect, b: DataProspect) =>
        a.phone.length - b.phone.length,
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'phone' && sortedInfo.order,
    },
    {
      title: 'Correo',
      dataIndex: 'mail',
      key: 'mail',
      sorter: (a: DataProspect, b: DataProspect) =>
        a.mail.length - b.mail.length,
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'mail' && sortedInfo.order,
    },
    {
      title: 'Canal',
      dataIndex: 'canal',
      key: 'canal',
      /* filters: [
        { text: 'Gestión Externa', value: 'Gestión Externa' },
        { text: 'Hubspot', value: 'Hubspot' },
        { text: 'Showroom', value: 'Showroom' },
        { text: 'Referidos', value: 'Referidos' },
        { text: 'Base de datos', value: 'Base de datos' },
      ], */
      filters: myChanelFilters,
      filteredValue: filteredInfo ? filteredInfo.canal : null,
      onFilter: (val: any, record: any) => {
        //console.log({ val, record });
        //console.log('RECORD', record.type.includes(val));
        return record.canal.includes(val);
      },
      sorter: (a: DataProspect, b: DataProspect) => {
        //console.log('a:', a, 'b:', b);
        return a.canal.length - b.canal.length;
      },
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'canal' && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: 'Campaña',
      dataIndex: 'campaign',
      key: 'campaign',
      /* filters: [
        { text: 'No', value: 'No' },
        { text: 'Día de la madre', value: 'Día de la madre' },
        { text: 'Día de la padre', value: 'Día de la padre' },
      ], */
      filters: myCampaingFilters,
      filteredValue: filteredInfo ? filteredInfo.campaign : null,
      onFilter: (val: any, record: any) => {
        //console.log({ value, record });
        return record.campaign.includes(val);
      },
      sorter: (a: DataProspect, b: DataProspect) => {
        //console.log('a:', a, 'b:', b);
        return a.campaign.length - b.campaign.length;
      },
      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'campaign' && sortedInfo.order,
      ellipsis: true,
    },
    /* {
            title: 'Temperatura',
            dataIndex: 'temperature',
            key: 'temperature',
            filters: [
              { text: 'Caliente', value: 'Caliente' },
              { text: 'Frío', value: 'Frío' },
              { text: 'Tibio', value: 'Tibio' },
            ],
            filteredValue: filteredInfo ? filteredInfo.temperature : null,
            onFilter: (val: any, record: any) => {
              //console.log({ value, record });
              return record.temperature.includes(val);
            },
            sorter: (a: DataProspect, b: DataProspect) =>
              a.temperature.length - b.temperature.length,
            sortOrder:
              sortedInfo &&
              sortedInfo.columnKey === 'temperature' &&
              sortedInfo.order,
            ellipsis: true,
            render: (text: string, row: DataProspect, index: number) => {
              return (
                <div className="flex items-center">
                  <div>
                    <div
                    className={`w-3 h-3 border-l-2 border-r-2 border-t-2 rounded-t border-red-600 ${
                        text === 'Caliente' ? 'bg-red-500' : ''
                      }`}
                    />
                    <div
                      className={`w-3 h-3 border-l-2 border-r-2 border-red-600 ${
                        text === 'Tibio' || text === 'Caliente' ? 'bg-red-500' : ''
                      }`}
                    />
    <div className="w-3 h-3 bg-red-500 border-l-2 border-r-2 border-red-600 border-b-2 rounded-b" />
                  </div>
                  <div
                    className={`mx-5 px-2 py-1 rounded  text-white ${
                      text === 'Caliente'
                        ? 'bg-red-500'
                        : text === 'Tibio'
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            },
          }, */
    /* {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            filters: [
              { text: 'Presentación', value: 'Presentación' },
              { text: 'Tráfico', value: 'Tráfico' },
              { text: 'Solicitudes', value: 'Solicitudes' },
              { text: 'Cierre', value: 'Cierre' },
              { text: 'Entrega', value: 'Entrega' },
              { text: 'Aprobaciones', value: 'Aprobaciones' },
            ],
            filteredValue: filteredInfo ? filteredInfo.status : null,
            onFilter: (val: any, record: any) => {
              //console.log({ value, record });
              return record.status.includes(val);
            },
            sorter: (a: DataProspect, b: DataProspect) => {
              //console.log('a:', a, 'b:', b);
              return a.status.length - b.status.length;
            },
            sortOrder:
              sortedInfo && sortedInfo.columnKey === 'status' && sortedInfo.order,
            ellipsis: true,
            render: (text: string, row: DataProspect, index: number) => {
              return (
                <div
                  className={`${switchStatus(
                    text
                  )} px-3 py-1 flex justify-center text-white rounded`}
                >
                  <span>{text}</span>
                </div>
              );
            },
          }, */

    /* {
      title: 'Próximo Seguimiento',
      dataIndex: 'nextFollow',
      key: 'nextFollow',
      sorter: (a: DataProspect, b: DataProspect) => {
        if (a.nextFollow && b.nextFollow) {
          return a.nextFollow.type.length - b.nextFollow.type.length;
        }
        return undefined;
      },

      sortOrder:
        sortedInfo && sortedInfo.columnKey === 'nextFollow' && sortedInfo.order,
      render: (
        text: {
          type: string;
          date: string;
        },
        row: DataProspect,
        index: number
      ) => {
        if (row.nextFollow) {
          return (
            <div className="flex flex-col justify-center text-center">
              <span className="my-2 text-green-600" style={{ margin: 0 }}>
                {text.date}
              </span>
              <div
                className={`${switchNextFollow(
                  text.type
                )} px-3 py-1 rounded flex justify-center`}
              >
                <span className="text-white">{text.type}</span>
              </div>
            </div>
          );
        }
        return (
          <div>
            <span className="my-2 text-red-600">Sin próximos seguimientos</span>
          </div>
        );
      },
    }, */
    {
      title: '',
      dataIndex: 'view',
      key: 'view',
      fixed: 'right',
      render: (text: any, row: any) => (
        <div className="text-right">
          <Button
            onClick={() => {
              setViewProspect('/prospect/details', {
                identification: row.id,
              });
            }}
            type="primary"
            shape="round"
          >
            <span className="leading-none">Ver</span>
          </Button>
        </div>
      ),
    },
  ];
  return columns;
};

export default columsProspect;
