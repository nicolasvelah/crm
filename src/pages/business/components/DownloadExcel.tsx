import React, { FunctionComponent, useState, useEffect } from 'react';
// @ts-ignore
import ReactExport from 'react-data-export';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Leads from '../../../data/models/Leads';
import {
  allValuesOfQuote,
  currenyFormat,
  getStateOfLead,
} from '../../../utils/extras';
import milisecondsToDate from '../../../utils/milisecondsToDate';
import QuoteFinancial from '../../../data/models/Quoute-Financial';

type TypeColor =
  | 'lead'
  | 'testDrive'
  | 'quote'
  | 'credit'
  | 'cierre'
  | 'delivery'
  | 'saleDown';

interface ColumsExcel {
  title: string;
  width?: { wpx: number };
  style?: any;
}

interface DataExcelLeads {
  value?: string | number | null;
  style?: any;
}

interface Excel {
  columns: ColumsExcel[];
  data: Array<DataExcelLeads[]>;
}

// Constantes para la exportación del .xls
const { ExcelFile } = ReactExport;
const { ExcelSheet } = ReactExport.ExcelFile;

const DownloadExcel: FunctionComponent<{ dataExcel: Leads[] }> = ({
  dataExcel,
}) => {
  const [dataSet, setDataSet] = useState<Excel[]>([]);

  const colors = (category: TypeColor): string => {
    switch (category) {
      case 'lead':
        return 'DAF7A6';
      case 'quote':
        return 'FFC300';
      case 'credit':
        return 'A2D9CE';
      case 'delivery':
        return 'F9E79F';
      case 'saleDown':
        return 'AED6F1';
      default:
        return 'EC7063';
    }
  };

  const getColumExcel = (title: string, category: TypeColor): ColumsExcel => ({
    title,
    style: {
      fill: { fgColor: { rgb: colors(category) } },
      font: { bold: true },
    },
    width: { wpx: 150 },
  });

  useEffect(() => {
    const data: DataExcelLeads[][] = [];
    dataExcel.forEach((lead) => {
      const values = lead.quotes?.reduce((accum, current) => {
        const valuesTotal = allValuesOfQuote(current).pvp;
        return valuesTotal + accum;
      }, 0);

      const estado = getStateOfLead(lead, true);
      //console.log(`value idLead: ${lead.id} -->`, values);

      const datesTestDrive = lead.testDriver?.reduce(
        (accum, current, index, array) => {
          return `${accum} ${
            current.dateTestDriver
              ? milisecondsToDate(current.dateTestDriver)
              : ''
          } ${index === array.length ? '' : ';'}`;
        },
        ''
      );

      /// unique brands
      let brand: string[] = [];
      if (lead.quotes && lead.quotes.length > 0) {
        brand = lead.quotes
          .filter((q) => q.vehiculo && q.vehiculo.length > 0 && q.closed)
          .map((q) => q?.vehiculo![0]?.brand ?? '')
          .filter((b) => b !== '');
        if (brand.length === 0) {
          brand = lead.quotes
            .filter((q) => q.vehiculo && q.vehiculo.length > 0)
            .map((q) => q?.vehiculo![0]?.brand ?? '')
            .filter((b) => b !== '');
        }
      }
      const uniqueBrands: string[] = [];
      brand.forEach((element) => {
        if (!uniqueBrands.includes(element)) uniqueBrands.push(element);
      });

      const valueBrands = uniqueBrands.reduce(
        (accum, current, index, array) => {
          return `${accum} ${current}${index === array.length - 1 ? '' : ';'}`;
        },
        ''
      );

      const valuesLeads = [
        {
          value: lead.id, // id
        },
        {
          value: `${lead.user.nombre} ${lead.user.apellido}`, // nombre asesor
        },
        {
          value: lead.concesionario?.name, // concesionario
        },

        {
          value: lead.sucursal?.name, // sucursal
        },
        {
          value: valueBrands, // marca
        },
        {
          value: `${lead.client.name} ${lead.client.lastName}`, // prospecto
        },
        {
          value: lead.client?.socialRazon ?? '', // contacto
        },
        {
          value: lead.client?.identification, // identificación
        },
        {
          value: lead.client?.cellphone, // Teléfono celular
        },
        {
          value: lead.client?.email, // Correo
        },
        {
          value: lead.chanel ?? 'No posee canal', // canal
        },
        {
          value: lead.campaign ?? 'No posee campaña', // campaña
        },
        {
          value: estado, // estado del negocio
        },
        {
          value: lead.isFleet ? 'Flota' : 'Retail', // flota/retail
        },
        /* {
          value: '___', // Fecha indagación
        }, */
        {
          value: lead.temperature, // temperatura
        },
        {
          value: currenyFormat(values ?? 0, true), // monto total sin iva
        },
      ];

      const valuesTestDrive = [
        {
          value: lead.testDriver && lead.testDriver.length > 0 ? 'SI' : 'NO', // Se hizo Test Drive?
        },
        {
          value: datesTestDrive ?? '', // Fecha del Test Drive
        },
      ];

      /// SI TIENE COTIZACIONES
      if (lead.quotes && lead.quotes.length > 0) {
        lead.quotes.forEach((quo) => {
          const vehicle =
            quo.vehiculo && quo.vehiculo.length > 0 ? quo.vehiculo[0] : null;

          const allValues = allValuesOfQuote(quo);

          let financials: string | undefined;
          let financialsCreated: string | undefined;

          let selectedFinancial: QuoteFinancial | undefined;

          if (lead.isFleet) {
            financials = lead.leadsQuoteFinancial?.quoteFinancial?.reduce(
              (accum, current, index, array) => {
                if (
                  current.financial?.nameEntityFinancial?.toUpperCase() ===
                  'CRM'
                ) {
                  return '';
                }
                return `${accum} ${current.financial?.nameEntityFinancial}${
                  index === array.length - 1 ? '' : ';'
                }`;
              },
              'Flota: '
            );
            financialsCreated =
              lead.leadsQuoteFinancial?.quoteFinancial?.reduce(
                (accum, current, index, array) => {
                  if (
                    current.financial?.nameEntityFinancial?.toUpperCase() ===
                    'CRM'
                  ) {
                    return '';
                  }
                  return `${accum} ${
                    current.financial?.nameEntityFinancial
                  } - ${
                    current?.createdAt
                      ? milisecondsToDate(current.createdAt)
                      : 'Sin fecha'
                  }${index === array.length - 1 ? '' : ';'}`;
                },
                'Flota: '
              );
            selectedFinancial = lead.leadsQuoteFinancial?.quoteFinancial?.find(
              (current) => {
                return current.selected;
              }
            );
          } else {
            financials = quo.quoteFinancial?.reduce(
              (accum, current, index, array) => {
                if (
                  current.financial?.nameEntityFinancial?.toUpperCase() ===
                  'CRM'
                ) {
                  return '';
                }
                return `${accum} ${current.financial?.nameEntityFinancial}${
                  index === array.length - 1 ? '' : ';'
                }`;
              },
              ''
            );
            financialsCreated = quo.quoteFinancial?.reduce(
              (accum, current, index, array) => {
                if (
                  current.financial?.nameEntityFinancial?.toUpperCase() ===
                  'CRM'
                ) {
                  return '';
                }
                return `${accum} ${current.financial?.nameEntityFinancial} - ${
                  current?.createdAt
                    ? milisecondsToDate(current.createdAt)
                    : 'Sin fecha'
                }${index === array.length - 1 ? '' : ';'}`;
              },
              ''
            );
            selectedFinancial = quo.quoteFinancial?.find((current) => {
              return current.selected;
            });
          }

          const itemQuote: DataExcelLeads[] = [
            {
              value: quo.id, // id cotización
            },
            {
              value: quo.closed ? 'Cierre' : 'Cotización', // Estado cotización
            },
            {
              value: milisecondsToDate(
                quo.createdAt ?? new Date().getTime().toString()
              ), // fecha de cotización
            },
            {
              value: quo.type === 'credit' ? 'Crédito' : 'Contado', // Tipo
            },
            {
              value: quo.exonerated ? 'Exonerado' : 'Normal', // Normal/exonerado
            },
            {
              value: vehicle?.brand ?? '', // Marca
            },
            {
              value: vehicle?.model ?? '', // Modelo
            },
            {
              value: vehicle?.description ?? '', // version
            },
            {
              value: vehicle?.year ?? '', // año
            },
            {
              //value: currenyFormat(allValues.cost), // precio (pvp * 1.12)
              value: currenyFormat(allValues.pvp * 1.12), // precio (pvp * 1.12)
            },
            {
              value: currenyFormat(quo.servicesValue ?? 0), // servicios
            },
            {
              value: currenyFormat(quo.accesoriesValue ?? 0), // Accesorios
            },
            {
              value: currenyFormat(quo.inputAmount ?? 0), // entrada
            },
            {
              value: quo.rate ? `${quo.rate} %` : '', // tasa
            },
            {
              value: quo.months ?? 0, // Meses plazo
            },
            {
              value: quo.insuranceCarrier?.name ?? '', // Aseguradora
            },
            {
              value: quo.insuranceCarrier
                ? currenyFormat(quo.insuranceCarrier?.cost ?? 0)
                : '', // Valor seguro
            },
            {
              value: currenyFormat(allValues.legal), // Gastos legales
            },
            {
              value:
                quo.type === 'credit'
                  ? currenyFormat(allValues.cuoteAmount)
                  : '', // Cuota referencial
            },
            {
              value: currenyFormat(allValues.subTotal), // Subtotal
            },
            {
              value: currenyFormat(allValues.total), // Total
            },
            //solicitud
            {
              value: financialsCreated, // Fecha Solicitud
            },
            {
              value: financials ?? '', // IFI's enviadas
            },
            //Cierre
            {
              value: selectedFinancial?.financial?.nameEntityFinancial ?? '', // IFI Cierre
            },
            {
              value:
                typeof lead.discount === 'number'
                  ? `${lead.discount ?? 0}%`
                  : '0%', // Descuento
            },
            {
              value: quo.preOwnedSupplier
                ? currenyFormat(quo.preOwnedSupplier?.appraisalValue ?? 0)
                : '', // Valor usado
            },
            {
              value: quo.preOwnedSupplier?.bussinessName ?? '', // Razón social
            },
            /* {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha de cierre
            },*/
            {
              value:
                quo.delivery && quo.delivery.createdAt
                  ? milisecondsToDate(quo.delivery.createdAt)
                  : '', // Fecha de Aprobación
            },
            /* {
              value: '', // Aprobador
            }, */
            {
              value: quo.vimVehiculo ?? '', // VIN
            },
            {
              value: currenyFormat(quo.reserveValue ?? 0), // Valor de reserva
            },
            /*  {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha de reserva
            }, */
            // Entrega
            {
              value: quo.delivery?.registration?.plateNumber ?? '', // Placa
            },
            /* {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha Notificación Matrícula
            },
            {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha de Notificación a Cartera
            },
            {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha de Aprobación de Cartera
            }, */
            {
              value: quo.delivery?.scheduleDelivery?.date ?? '', // Fecha Entrega
            },
          ];
          /// Sale down
          const itemSaleDown: DataExcelLeads[] = [
            {
              value: lead.saleDown ? 'Si' : 'No', // Venta Perdida
            },
            {
              value: estado, // Estado final de negocio
            },
            /* {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha de solicitud
            },
            {
              value: milisecondsToDate(new Date().getTime().toString()), // Fecha de aprobación
            }, */
            {
              value: lead.commentSaleDown ?? '', // Motivo
            },
          ];

          const item: DataExcelLeads[] = [
            ...valuesLeads,
            ...valuesTestDrive,
            ...itemQuote,
            ...itemSaleDown,
          ];
          data.push(item);
        });
      } else {
        const valuesQuote: DataExcelLeads[] = [
          {
            value: '', // id cotización?
          },
          {
            value: '', // Estado cotización
          },
          {
            value: '', // fecha de cotización
          },
          {
            value: '', // Tipo
          },
          {
            value: '', // Normal/exonerado
          },
          {
            value: '', // Marca
          },
          {
            value: '', // Modelo
          },
          {
            value: '', // version
          },
          {
            value: '', // año
          },
          {
            value: '', // precio
          },
          {
            value: '', // servicios
          },
          {
            value: '', // Accesorios
          },
          {
            value: '', // entrada
          },
          {
            value: '', // tasa
          },
          {
            value: '', // Meses plazo
          },
          {
            value: '', // Aseguradora
          },
          {
            value: '', // Valor seguro
          },
          {
            value: '', // Gastos legales
          },
          {
            value: '', // Cuota referencial
          },
          {
            value: '', // Subtotal
          },
          {
            value: '', // Total
          },
          //solicitud
          {
            value: '', // Fecha Solicitud
          },
          {
            value: '', // IFI's enviadas
          },
          //Cierre
          {
            value: '', // IFI Cierre
          },
          {
            value: '', // Descuento
          },
          {
            value: '', // Valor usado
          },

          {
            value: '', // Patiero
          },
          /* {
            value: '', // Fecha de cierre
          }, */
          {
            value: '', // Fecha de Aprobación
          },
          /*  {
            value: '', // Aprobador
          }, */
          {
            value: '', // VIN
          },
          {
            value: '', // Valor de reserva
          },
          /* {
            value: '', // Fecha de reserva
          }, */
          /// Entrega
          {
            value: '', // Placa
          },
          /* {
            value: '', // Fecha Notificación Matrícula
          },
          {
            value: '', // Fecha de Notificación a Cartera
          },
          {
            value: '', // Fecha de Aprobación de Cartera
          }, */
          {
            value: '', // Fecha Entrega
          },
        ];

        /// Sale down
        const itemSaleDown: DataExcelLeads[] = [
          {
            value: lead.saleDown ? 'Si' : 'No', // Venta Perdida
          },
          {
            value: estado, // Estado final de negocio
          },
          /* {
            value: milisecondsToDate(new Date().getTime().toString()), // Fecha de solicitud
          },
          {
            value: milisecondsToDate(new Date().getTime().toString()), // Fecha de aprobación
          }, */
          {
            value: lead.commentSaleDown ?? '', // Motivo
          },
        ];

        const item: DataExcelLeads[] = [
          ...valuesLeads,
          ...valuesTestDrive,
          ...valuesQuote,
          ...itemSaleDown,
        ];
        data.push(item);
      }
    });

    ///COLUMNAS
    const columnsLeads = [
      getColumExcel('Id del negocio', 'lead'),
      getColumExcel('Nombre del Asesor', 'lead'),
      getColumExcel('Concesionario', 'lead'),
      getColumExcel('Sucursal', 'lead'),
      getColumExcel('Marca', 'lead'),
      getColumExcel('Prospecto', 'lead'),
      getColumExcel('Contacto', 'lead'),
      getColumExcel('Identificación', 'lead'),
      getColumExcel('Teléfono celular', 'lead'),
      getColumExcel('Correo', 'lead'),
      getColumExcel('Canal', 'lead'),
      getColumExcel('Campaña', 'lead'),
      getColumExcel('Estado de negocio', 'lead'),
      getColumExcel('Flota/Retail', 'lead'),
      //getColumExcel('Fecha de indagación', 'lead'),
      getColumExcel('Temperatura', 'lead'),
      getColumExcel('Monto total sin iva', 'lead'),
    ];

    const columnsTestDrive = [
      getColumExcel('Se hizo Test Drive?', 'testDrive'),
      getColumExcel('Fecha del Test Drive', 'testDrive'),
    ];

    const columnsQuotes = [
      getColumExcel('Id cotización', 'quote'),
      getColumExcel('Estado cotización', 'quote'),
      getColumExcel('Fecha de cotización', 'quote'),
      getColumExcel('Tipo', 'quote'),
      getColumExcel('Normal/Exonerado', 'quote'),
      getColumExcel('Marca', 'quote'),
      getColumExcel('Modelo', 'quote'),
      getColumExcel('Versión', 'quote'),
      getColumExcel('Año', 'quote'),
      getColumExcel('Precio(con IVA)', 'quote'),
      getColumExcel('Servicios', 'quote'),
      getColumExcel('Accesorios', 'quote'),
      getColumExcel('Entrada', 'quote'),
      getColumExcel('Tasa', 'quote'),
      getColumExcel('Meses plazo', 'quote'),
      getColumExcel('Aseguradora', 'quote'),
      getColumExcel('Valor seguro', 'quote'),
      getColumExcel('Gastos legales', 'quote'),
      getColumExcel('Cuota referencial', 'quote'),
      getColumExcel('Subtotal', 'quote'),
      getColumExcel('Total', 'quote'),
    ];

    const columnsSolicitud = [
      getColumExcel('Fecha Solicitud', 'credit'),
      // eslint-disable-next-line quotes
      getColumExcel(`IFI's enviadas`, 'credit'),
    ];

    const columnsCierre = [
      getColumExcel('IFI Cierre', 'cierre'),
      getColumExcel('Descuento', 'cierre'),
      getColumExcel('Valor Usado', 'cierre'),
      getColumExcel('Razón Social del patiero', 'cierre'),
      //getColumExcel('Fecha de cierre', 'cierre'),
      getColumExcel('Fecha de Aprobación', 'cierre'),
      //getColumExcel('Aprobador', 'cierre'),
      getColumExcel('VIN', 'cierre'),
      getColumExcel('Valor de reserva', 'cierre'),
      //getColumExcel('Fecha de reserva', 'cierre'),
    ];

    const columnsDelivery = [
      getColumExcel('Placa', 'delivery'),
      /* getColumExcel('Fecha Notificación Matrícula', 'delivery'),
      getColumExcel('Fecha de Notificación a Cartera', 'delivery'),
      getColumExcel('Fecha de Aprobación de Cartera', 'delivery'), */
      getColumExcel('Fecha Entrega', 'delivery'),
    ];

    const columnsSaleSown = [
      getColumExcel('Venta Perdida', 'saleDown'),
      getColumExcel('Estado final de negocio', 'saleDown'),
      /* getColumExcel('Fecha de solicitud', 'saleDown'),
      getColumExcel('Fecha de aprobación', 'saleDown'), */
      getColumExcel('Motivo', 'saleDown'),
    ];

    const multiDataSet: Excel[] = [
      {
        columns: [
          ...columnsLeads,
          ...columnsTestDrive,
          ...columnsQuotes,
          ...columnsSolicitud,
          ...columnsCierre,
          ...columnsDelivery,
          ...columnsSaleSown,
        ],
        data,
      },
    ];

    setDataSet(multiDataSet);
  }, [dataExcel]);

  return (
    <ExcelFile
      element={
        <Button
          style={{ marginRight: 5 }}
          type="default"
          size="large"
          icon={<DownloadOutlined />}
          disabled={dataExcel.length === 0}
          onClick={async () => {
            console.log('dataExcel -->', dataExcel);
          }}
        >
          .xlsx
        </Button>
      }
    >
      <ExcelSheet dataSet={dataSet} name="Negocios" />
    </ExcelFile>
  );
};

export default DownloadExcel;
