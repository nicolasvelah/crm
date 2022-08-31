/* eslint-disable no-plusplus */
/* eslint-disable no-lonely-if */
export enum DeliveryDocumentsCase {
  contadoNatural,
  ifiNatural,
  contadoJuridico,
  ifiJuridico,
  contadoNaturalRUC,
  ifiNaturalRUC,
  directoNatural,
  directoJuridico,
  directoNaturalRUC,
  exoneradoNatural,
  exoneradoDiplomatico,
}

export interface Documents {
  name: string;
  invoice?: boolean;
  when: DeliveryDocumentsCase[] | 'all'; // if is 'all' apply for all cases, if is 'optional' all cases are optional
  optional: DeliveryDocumentsCase[] | 'all' | null; // if is null all are required, if is 'all' cases are optionals, if is an array all cases in the array are optionals, if one case is not in the array that case will be required
}

export const getDocumentCaseString = (caseDocument: number) => {
  switch (caseDocument) {
    case 0:
      return 'Contado Natural';
    case 1:
      return 'IFI Natural';
    case 2:
      return 'Contado Jurídico';
    case 3:
      return 'IFI Jurídico';
    case 4:
      return 'Contado Natural RUC';
    case 5:
      return 'IFI Natural RUC';
    case 6:
      return 'Directo Natural';
    case 7:
      return 'Directo Jurídico';
    case 8:
      return 'Directo Natural RUC';
    case 9:
      return 'Exonerado Natural';
    case 10:
      return 'Exonerado Diplomático';

    default:
      return 'Caso no encontrado';
  }
};

const casesExcept = (
  excludes: DeliveryDocumentsCase[]
): DeliveryDocumentsCase[] => {
  const data = [
    DeliveryDocumentsCase.contadoNatural,
    DeliveryDocumentsCase.ifiNatural,
    DeliveryDocumentsCase.contadoJuridico,
    DeliveryDocumentsCase.ifiJuridico,
    DeliveryDocumentsCase.contadoNaturalRUC,
    DeliveryDocumentsCase.ifiNaturalRUC,
    DeliveryDocumentsCase.directoNatural,
    DeliveryDocumentsCase.directoJuridico,
    DeliveryDocumentsCase.directoNaturalRUC,
    DeliveryDocumentsCase.exoneradoNatural,
    DeliveryDocumentsCase.exoneradoDiplomatico,
  ];

  for (let i = data.length - 1; i >= 0; i--) {
    if (excludes.includes(data[i])) {
      data.splice(i, 1);
    }
  }

  return data;
};

export const documents: Documents[] = [
  {
    name: 'Hoja de Negocio',
    when: 'all',
    optional: null,
  },
  {
    name: 'Form. Relación Comercial',
    when: 'all',
    optional: null,
  },
  {
    name: 'Form. Fondos de Terceros',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Form. Debida Diligencia',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Recepción de Pagos',
    when: 'all',
    optional: null,
  },
  {
    name: 'Factura Vehículo',
    when: casesExcept([
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ]),
    optional: null,
    invoice: true,
  },
  {
    name: 'Aprobación de Crédito',
    when: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
    ],
    optional: null,
  },
  {
    name: 'Autorización Salida IFI',
    when: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
    ],
    optional: null,
  },
  {
    name: 'Registros de Caja Firmados',
    when: 'all',
    optional: null,
  },
  {
    name: 'Autorización de Retiro por Tercero',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Identificación Pago de Tercero',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Docs. Vehículo Como Forma de Pago',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Carta Responsiva y Form. Tasación',
    when: 'all',
    optional: 'all',
  },
  /* {
    name: 'Garantía de Vehículo',
    when: 'all',
    optional: null,
  }, */
  {
    name: 'Carta de Presentación',
    when: 'all',
    optional: null,
  },
  /* {
    name: 'Check List Entrega Perfecta',
    when: 'all',
    optional: null,
  }, */
  /* {
    name: 'Hoja de Salida Entrega Perfecta',
    when: 'all',
    optional: null,
  }, */
  {
    name: 'Certificado IESS, Trabajo, RUC o RISSE',
    when: 'all',
    optional: null,
  },
  {
    name: 'Identificación Apoderado',
    when: 'all',
    optional: [
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
  },
  {
    name: 'Nombramiento Rep. Legal',
    when: [
      DeliveryDocumentsCase.contadoJuridico,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
    optional: [
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
  },
  {
    name: 'RUC',
    when: casesExcept([
      DeliveryDocumentsCase.contadoJuridico,
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ]),
    optional: [
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
  },
  {
    name: 'Registro Mercantil',
    when: [
      DeliveryDocumentsCase.contadoJuridico,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
    optional: [
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
  },
  {
    name: 'Cédula Rep. Legal / Apoderado',
    when: [
      DeliveryDocumentsCase.contadoJuridico,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
    optional: [
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
  },
  {
    name: 'Poder - Apoderado',
    when: casesExcept([
      DeliveryDocumentsCase.contadoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ]),
    optional: 'all',
  },
  {
    name: 'Aprobación de Crédito Directo',
    when: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
    optional: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
    ],
  },
  {
    name: 'Pagaré',
    when: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
    optional: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
    ],
  },
  {
    name: 'Contrato de Prenda',
    when: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNaturalRUC,
    ],
    optional: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
    ],
  },
  {
    name: 'Endoso / Contrato de Seguro',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Certificado Instalación de Dispositivo',
    when: 'all',
    optional: casesExcept([
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoJuridico,
      DeliveryDocumentsCase.directoNaturalRUC,
    ]),
  },
  {
    name: 'Doc. Resolución Liberación Tributos',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Docs. Nacionalización Vehículo',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Contrato compraventa exonerados',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Carta de Cesión de Derechos',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Carta de Aceptación de Derechos',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Validación de Páginas Públicas (UAFE)',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Naciones Unidas',
    when: 'all',
    optional: null,
  },
  {
    name: 'Función Judicial',
    when: 'all',
    optional: null,
  },
  {
    name: 'Registro Civil',
    when: 'all',
    optional: null,
  },
  {
    name: 'SRI',
    when: 'all',
    optional: null,
  },
  {
    name: 'OFAC - Diplomáticos',
    when: [DeliveryDocumentsCase.exoneradoDiplomatico],
    optional: null,
  },
  {
    name: 'INTERPOL - Diplomáticos',
    when: [DeliveryDocumentsCase.exoneradoDiplomatico],
    optional: null,
  },
  {
    name: 'Factura Gastos de Ingreso Importación',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
    invoice: true,
  },
  {
    name: 'Pago de Matrícula',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
    invoice: true,
  },
  {
    name: 'Carnet de Discapacidad',
    when: [DeliveryDocumentsCase.exoneradoNatural],
    optional: null,
  },
  {
    name: 'Certificado Facultad Importación MSP',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Pasaporte Diplomático',
    when: [DeliveryDocumentsCase.exoneradoDiplomatico],
    optional: null,
  },
  {
    name: 'Form. Conoce a Tu Cliente',
    when: 'all',
    optional: null,
  },
  {
    name: 'Contrato de Contact Service',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Contrato de Prepago Plus',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Copia Matrícula',
    when: 'all',
    optional: null,
  },
];

export const documents2: Documents[] = [
  {
    name: 'Documentos UAFE',
    when: 'all',
    optional: null,
  },
  {
    name: 'Documentos negocios a crédito',
    when: [
      DeliveryDocumentsCase.ifiNatural,
      DeliveryDocumentsCase.ifiJuridico,
      DeliveryDocumentsCase.ifiNaturalRUC,
      DeliveryDocumentsCase.directoNatural,
      DeliveryDocumentsCase.directoJuridico,
    ],
    optional: null,
  },
  {
    name: 'Documentos forma de pago usados',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Documentos negocio exonerados',
    when: [
      DeliveryDocumentsCase.exoneradoNatural,
      DeliveryDocumentsCase.exoneradoDiplomatico,
    ],
    optional: null,
  },
  {
    name: 'Documentos servicios de prepago Postventa',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Documentos adicionales al negocio',
    when: 'all',
    optional: 'all',
  },
  {
    name: 'Documentos previo entrega del vehículo',
    when: 'all',
    optional: null,
  },
];

export interface DeliveryDocument {
  name: string;
  url: string | null;
  optional: boolean;
  invoice: boolean;
}

export const getDocumentsByCase = (
  _case: DeliveryDocumentsCase,
  newDocuments?: Documents[]
): DeliveryDocument[] => {
  let docs = documents;
  if (newDocuments) {
    docs = newDocuments;
  }
  const data: DeliveryDocument[] = [];

  const isIn = (arr: any, _: DeliveryDocumentsCase): boolean => {
    return (arr as DeliveryDocumentsCase[]).includes(_);
  };
  docs.forEach((item) => {
    // si aplica para todos los casos y en todos los casos el documento es obligatorio
    if (item.when === 'all' && item.optional === null) {
      // ✅ ✅ ✅
      data.push({
        name: item.name,
        url: null,
        optional: false,
        invoice: item.invoice || false,
      });
    } else if (item.when === 'all' && item.optional === 'all') {
      // 👀 👀 👀
      // si aplica para todos los casos y en todos los casos el documento es opcional
      data.push({
        name: item.name,
        url: null,
        optional: true,
        invoice: item.invoice || false,
      });
    } else {
      if (item.when !== 'all' && item.optional === null) {
        // ✅ ❌ ✅
        // si solo aplica para ciertos casos pero es obligatorio en cada uno de ellos
        if (isIn(item.when, _case)) {
          data.push({
            name: item.name,
            url: null,
            optional: false,
            invoice: item.invoice || false,
          });
        }
      } else if (item.when !== 'all' && item.optional === 'all') {
        // 👀 ❌ 👀
        // si solo aplica para ciertos casos pero es opcional en cada uno de ellos
        if (isIn(item.when, _case)) {
          data.push({
            name: item.name,
            url: null,
            optional: true,
            invoice: item.invoice || false,
          });
        }
      } else if (
        item.when !== 'all' &&
        item.optional !== null &&
        item.optional !== 'all'
      ) {
        //console.log('Entro 👀 ❌ ✅ -->', item.name);
        // 👀 ❌ ✅
        // otional is an array
        // si solo aplica para ciertos casos pero es opcional en unos y en otros es obligatorio
        if (isIn(item.when, _case)) {
          //console.log('entro 2');
          data.push({
            name: item.name,
            url: null,
            optional: isIn(item.optional, _case),
            invoice: item.invoice || false,
          });
        }
      }
    }
  });
  return data;
};
