/* eslint-disable camelcase */
import Leads from './Leads';
import QuoteFinancial from './Quoute-Financial';
import TestDriver from './TestDriver';
import MechanicalAppraisal from './MechanicalAppraisal';
import { Prebill } from './PreBill';
import Delivery from './Delivery';
import LeadsQuoteFinancial from './LeadsQuoteFinancial';

export interface InsuranceCarrier {
  name?: string;
  cost?: number;
  monthlyPayment?: number;
  years?: number;
}

export interface MechanicalAppraisalQuote {
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number; //kilometraje
  desiredPrice?: number;
}

export interface PreOwnedSupplier {
  year: number;
  model: string;
  mileage: number;
  desiredPrice: number;
  brand: string;
  bussinessName?: string;
  identification?: string;
  phone?: string;
  email?: string;
  appraisalValue?: number;
  acceptedAppraisal?: boolean;
}
export interface urlPhotoInput {
  link: string;
}

export interface Accesories {
  code?: string;
  name?: string;
  cost?: number;
  dimension?: string;
  id?: string;
  id_Vh?: string;
  brand?: string;
  model?: string;
  urlPhoto?: urlPhotoInput[];
  quantity?: number;
  es_kit: number | null;
}
interface ItemServices {
  codigo: string;
  descripcion: string;
  exonerado: number;
  forma_pago: string;
  iva: number;
  marcas: string;
  total: number;
  valor: number;
}
export interface Services {
  nombre: string;
  items: ItemServices[];
}

export interface VehicleQuote {
  cantidad: number;
  code: string;
  brand: string;
  model: string;
  idModel: string;
  year: number;
  cost: number;
  pvp: number;
  description: string;
  cylinder: number;
  numPassengers: number;
  doors: number;
  fuel: string;
  stock: number;
  pdf: string;
  imgs: string;
  color: {
    color: string;
    id: number;
    stock: number;
    urlPhoto: { link: string }[];
  };
}
export interface Insurance {
  type?: String;
  percentage?: number;
}

export interface Exonerated {
  type?: string;
  percentage?: string;
}

export interface Device {
  cost?: number;
  years?: number;
}

export interface Pdfs {
  link?: number | null;
}

export interface ImgsColor {
  link?: string | null;
}

export interface ColorVehicle {
  color?: string;
  id?: number;
  stock?: number;
  urlPhoto?: ImgsColor[] | null;
}

export interface Vehicle {
  cantidad?: number | null;
  code?: string | null;
  brand?: string | null;
  model?: string | null;
  idModel?: string | null;
  year?: number | null;
  cost?: number | null;
  pvp?: number | null;
  description?: string | null;
  cylinder?: number | null;
  numPassengers?: number | null;
  doors?: number | null;
  fuel?: string | null;
  stock?: number | null;
  margen?: number | null;
  imgs?: string | null;
  pdf?: Pdfs[] | null;
  urlpdf?: Pdfs[] | null;
  color?: ColorVehicle[] | null;
}

export interface VimVehiculoData {
  codigo?: string | null;
  descripcion?: string | null;
  antiguedad?: number | null;
  color?: string | null;
  dealer?: string | null;
  estado?: string | null;
  id_color?: number | null;
  id_dealer?: string | null;
  id_sucursal?: number | null;
  margen?: number | null;
  sucursal?: string | null;
  vin?: string | null;
  delivery?: Delivery | null;
  createdAt?: string | null;
}

export default interface Quotes {
  id?: number;
  vehiculo?: Vehicle[];
  type?: string; //Contado o crédito
  exonerated?: Exonerated | null; //Exonerado diplomatico o discapacitado
  idAccesories?: Accesories[] | null;
  accesoriesValue?: number | null; //Valor de accesorios
  services?: Services[] | null;
  servicesValue?: number | null; //Valor de servicios
  inputAmount?: number | null; //Valor de la entrada
  rate?: number | null; //Porcentaje de tasa
  device?: any | null; //Valor Dispositivo
  registration?: number | null; //Matricula
  months?: number | null;
  monthly?: number | null; //Cuota mensual
  insuranceCarrier?: any | null; //Aseguradora
  documentCredit?: string | null;
  mechanicalAppraisalQuote?: MechanicalAppraisalQuote | null; //Avaluo mecanico
  preOwnedSupplier?: PreOwnedSupplier | null; //proveedor de seminuevos
  acceptedAppraisal?: boolean | null; //acepto oferta?
  sendEmailFinancialToClient?: boolean | null;
  discount?: number | null; //descuento
  closed?: boolean | null; // cierre?
  vimVehiculo?: string | null;
  vimVehiculoData?: VimVehiculoData | null; //Data del VIN
  updateAt?: string;
  createdAt?: string;
  leads?: Leads | null;
  testDriver?: TestDriver[];
  mechanicalAppraisal?: MechanicalAppraisal | null;
  quoteFinancial?: QuoteFinancial[];
  payThirdPerson?: boolean | null;
  reserveValue?: number | null;
  observations?: string | null;
  observationsFyI?: string;
  leadsQuoteFinancial? : LeadsQuoteFinancial | null;
  chosenEntity?: {
    type: string;
    entity: string;
  };
  sendToFyI?: boolean | null;
  delivery?: Delivery;
}
