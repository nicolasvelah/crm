/* eslint-disable no-restricted-properties */
/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
import auth from './auth';
import Quotes from '../data/models/Quotes';
import Leads from '../data/models/Leads';
import { verifyStatusPrebill } from './step-extras';

export interface DataValuesQuote {
  brand: string;
  model: string;
  version: string;
  year: number;
  monthly: number;
  months: number;
  entry: number;
  rate: number;
  accesoriesValue: number;
  servicesValue: number;
  pvp: number;
  cost: number;
  financingValue: number;
  subTotal: number;
  total: number;
  valueEsKit: number;
  legal: number;
  cuoteAmount: number;
}

export enum StateLead {
  SALE_DOWN = 'Venta caída',
  REQUEST_SALE_DOWN = 'Solicitud Venta caída',
  FINALIZED = 'Finalizado',
  DELIVERY = 'Entrega',
  PREFECTURE = 'Prefactura',
  CLOSE = 'Cierre',
  QUOTATION = 'Cotización',
  DEMONSTRATION = 'Demostración',
  INQUIRY = 'Indagación',
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getQueryParameterByName = (
  name: string,
  url?: string
): string | null => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, '+'));
};

export const currenyFormat = (value: number, simbol = true): string => {
  const str = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

  if (simbol) return str;
  return str.substring(1);
};

export const subTotal = (
  total: number,
  insuranceAmountYears: number
): number => {
  const totalRen = total - (insuranceAmountYears - insuranceAmountYears / 1.12);
  return totalRen;
};

export const calcTotal = (
  total: number,
  pvp: number,
  carRegistration: number,
  insuranceAmountYears: number,
  Exonerated: boolean
): number => {
  //console.log('total calcTotal-->', total);
  const totalRen =
    (total -
      carRegistration -
      (insuranceAmountYears - insuranceAmountYears / 1.12) -
      (!Exonerated ? 0 : pvp)) *
      1.12 +
    carRegistration +
    (Exonerated ? pvp : 0);

  /*//console.log(
    '1parte',
    total -
      carRegistration -
      (insuranceAmountYears - insuranceAmountYears / 1.12)
  ); */
  //console.log('2parte', (!Exonerated ? 0 : pvp) * 1.12);
  //console.log('3parte', carRegistration + (Exonerated ? pvp : 0));

  //console.log('totalRen', totalRen);
  //console.log('pvp', pvp);

  //console.log('TOTAL calcTotal-->', totalRen);
  return totalRen;
};

export const calcLegals = (pvpInput: number, maried: boolean): number => {
  return pvpInput * 0.005 + 25 + 300 + (maried ? 95 : 78);
};

export const getDealerData = (DealerId: string, sucursalId?: number): any => {
  const { user } = auth;
  //console.log('GETUSER**********', user);
  let dealerResp = null;
  let sucursalResp = null;
  user.dealer.map((dealer: any) => {
    if (DealerId === dealer.codigo) {
      dealerResp = dealer;
      if (sucursalId) {
        dealer.sucursal.map((sucursal: any) => {
          if (sucursalId === sucursal.id_sucursal) {
            sucursalResp = sucursal;
          }
        });
      }
    }
  });
  return {
    dealer: dealerResp,
    sucursal: sucursalResp,
    name: `${user.nombre} ${user.apellido}`,
  };
};

export const calcTotalQuotesGenerated = (record: any) => {
  if (record) {
    return (
      (record.vehiculo ? record.vehiculo[0].pvp : 0) +
      (record.servicesValue ?? 0) +
      (record.accesoriesValue ?? 0) +
      (record.registration ?? 0) +
      (record.type === 'credit'
        ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
        : 0) +
      (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
    );
  }
  return 0;
};

export const calcTotalQuotesGeneratedExonerated = (record: any) => {
  if (record) {
    return (
      (record.vehiculo ? record.vehiculo[0].pvp : 0) +
      (record.servicesValue ?? 0) +
      (record.servicesValue * 0.12 ?? 0) +
      (record.accesoriesValue ?? 0) +
      (record.accesoriesValue * 0.12 ?? 0) +
      (record.registration ?? 0) +
      (record.insuranceCarrier ? record.insuranceCarrier.cost : 0)
    );
  }
  return 0;
};

export const netType = (codeConcesionario: string) => {
  try {
    const { user } = auth;
    //console.log('user', user);
    const typeConcesionario = user.typeConcessionaire.find(
      (data: { code: string | undefined }) => data.code === codeConcesionario
    );
    //console.log('typeConcesionario', typeConcesionario);
    return typeConcesionario.type || '';
  } catch (error) {
    return '';
  }
};

export const stringToJson = (value: string): Object | null => {
  try {
    const objeto = JSON.parse(value);
    return objeto;
  } catch (error) {
    //console.log('Error en isJson', error.message);
    return null;
  }
};

/* 
  This method get the subtotal of the Quote 
 */
export const calcSubTotalValue = (quote: Quotes) => {
  /// Obtenemos en vehículo de la cotización
  const vehicle =
    quote?.vehiculo && quote.vehiculo?.length > 0 ? quote.vehiculo[0] : null;
  /// Si existe el vehículo
  if (vehicle) {
    const total =
      (vehicle.pvp ?? 0) +
      (quote.servicesValue ?? 0) +
      (quote.accesoriesValue ?? 0) +
      (quote.registration ?? 0) +
      (quote.type === 'credit'
        ? calcLegals(vehicle.pvp ?? 0, true) / 1.12
        : 0) +
      (quote.insuranceCarrier?.cost ?? 0) / 1.12;
    return total;
  }
  return 0;
};

export const calcAllValues = (quote: Quotes) => {
  const vehicle =
    quote?.vehiculo && quote.vehiculo?.length > 0 ? quote.vehiculo[0] : null;

  const isCredit = quote.type === 'credit';

  const legal = isCredit ? (vehicle?.pvp ?? 0) * 0.005 + 25 + 300 + 95 : 0;
  const registration = quote.registration ?? 0;
  const isExonerated = !!quote.exonerated;
  const entry = quote.inputAmount ?? 0;

  const totalFinancingValue =
    (((vehicle?.pvp ?? 0) +
      legal +
      (quote.accesoriesValue ?? 0) +
      (quote.servicesValue ?? 0) +
      registration +
      (quote.insuranceCarrier?.cost ?? 0)) as number) -
    (legal - legal / 1.12);

  //console.log('total calcAllValues-->', totalFinancingValue);

  const insuranceAmountYears = (quote.insuranceCarrier?.cost ?? 0) as number;

  const totalRen =
    (totalFinancingValue -
      registration -
      (insuranceAmountYears - insuranceAmountYears / 1.12) -
      (!isExonerated ? 0 : vehicle?.pvp ?? 0)) *
      1.12 +
    registration +
    (isExonerated ? vehicle?.pvp ?? 0 : 0);

  const value = totalRen - entry - registration;
  /* console.log('TOTAL calcAllValues-->', {
    value,
    calcTotal: totalRen,
    data: {
      Exonerated: isExonerated,
      carRegistration: registration,
      insuranceAmountYears,
      pvp: vehicle?.pvp ?? 0,
      total: totalFinancingValue,
    },
  }); */

  //return value;
  return {
    legal,
    financingValue: value,
    subTotal: calcSubTotalValue(quote),
    total: totalRen,
  };
};

export const allValuesOfQuote = (quote: Quotes): DataValuesQuote => {
  const vehicle =
    quote?.vehiculo && quote.vehiculo?.length > 0 ? quote.vehiculo[0] : null;

  const isExonerated = !!quote.exonerated;

  const valueEsKit = quote.idAccesories?.reduce((acumulador, valorActual) => {
    if (valorActual.es_kit === 1) {
      return acumulador + (valorActual.cost ?? 0) * (valorActual.quantity ?? 0);
    }
    return acumulador;
  }, 0);

  const allValues = calcAllValues(quote);

  const months = quote.months ?? 0;

  const tasaDeci = (quote.rate ?? 0) / 100;
  const totalPay =
    (vehicle?.pvp ?? 0) +
    (quote.accesoriesValue ?? 0) +
    (quote.servicesValue ?? 0);
  const totalPayRen = (totalPay * 1.12 +
    allValues.legal +
    (quote.insuranceCarrier?.cost ?? 0)) as number;

  const cuoteAmount =
    ((tasaDeci / 12) *
      (Number(totalPayRen.toFixed(2)) - (quote.inputAmount ?? 0))) /
    (1 - Math.pow(1 + tasaDeci / 12, -months));

  return {
    brand: vehicle?.brand ?? '',
    model: vehicle?.model ?? '',
    version: vehicle?.description ?? '',
    year: vehicle?.year ?? 0,
    monthly: quote.monthly ?? 0,
    months,
    entry: quote.inputAmount ?? 0,
    rate: quote.rate ?? 0,
    accesoriesValue: quote.accesoriesValue ?? 0,
    servicesValue: quote.servicesValue ?? 0,
    //pvp: (vehicle?.pvp ?? 0) * (!isExonerated ? 1.12 : 1),
    pvp: vehicle?.pvp ?? 0,
    cost: (vehicle?.pvp ?? 0) * (!isExonerated ? 1.12 : 1),
    financingValue: allValues.financingValue,
    legal: allValues.legal,
    cuoteAmount,
    subTotal: allValues.subTotal,
    total: allValues.total,
    valueEsKit: valueEsKit ?? 0,
  };
};
export const verifyAllDeliveries = (lead: Leads): boolean => {
  const allDeliverys = lead.quotes
    ?.filter((quo) => !!quo.delivery)
    .map((quo) => quo.delivery!);

  if (allDeliverys && allDeliverys.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < allDeliverys.length; index++) {
      const element = allDeliverys[index];
      //console.log(`element lead ${lead.id} -->`, element);
      if (!element.deliveryFinal || !element.idBusinessHubspot) {
        //if (!element.deliveryFinal) {
        return false;
      }
    }
    return true;
  }
  return false;
};

export const getStateOfLead = (
  myLead: Leads,
  countSaleDown?: boolean
): string => {
  if (countSaleDown) {
    if (myLead.saleDown) {
      return StateLead.SALE_DOWN;
      // return 'Venta caída';
    }
    if (myLead.statusSaleDown === 'solicitada') {
      return StateLead.REQUEST_SALE_DOWN;
      //return 'Solicitud Venta caída';
    }
  }
  const okDeliveries = verifyAllDeliveries(myLead);
  //console.log('okDeliveries -->', okDeliveries);
  if (okDeliveries) {
    return StateLead.FINALIZED;
    // return 'Finalizado';
  }
  if (myLead.prebill?.find((p) => p.accepted)) {
    return StateLead.DELIVERY;
    // return 'Entrega';
  }
  /* const noVim = myLead.quotes?.filter((quo) => {
    if (quo.type === 'credit') {
      const selectedBank = quo.quoteFinancial?.find((qf) => qf.selected);
      if (selectedBank && quo.vimVehiculo) {
        return true;
      }
    } else if (quo.type === 'counted' && quo.vimVehiculo) {
      return true;
    }
    return false;
  }).length;
  const noClosed = myLead.quotes?.filter((quo) => quo.closed === true).length;
  //console.log({ noVim, noClosed });
  if (
    typeof noVim === 'number' &&
    typeof noClosed === 'number' &&
    noVim !== 0 &&
    noVim === noClosed
  ) {
    return StateLead.PREFECTURE;
    // return 'Prefactura';
  } */

  if (
    myLead.quotes &&
    myLead.quotes.length > 0 &&
    myLead.quotes.find((q) => q.closed === true)
  ) {
    const okPrebill = verifyStatusPrebill(myLead);
    if (okPrebill) return StateLead.PREFECTURE;
    return StateLead.CLOSE;
    // return 'Cierre';
  }
  if (myLead.quotes && myLead.quotes.length > 0) {
    return StateLead.QUOTATION;
    // return 'Cotización';
  }

  if (myLead.inquiry && myLead.inquiry.length > 0 && myLead.workPage) {
    return StateLead.DEMONSTRATION;
    // return 'Demostración';
  }
  return StateLead.INQUIRY;
  // return 'Indagación';
};
