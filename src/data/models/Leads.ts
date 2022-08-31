import User from './User';
import Client from './Client';
import Meets from './Meets';
import Quotes from './Quotes';
import { Prebill } from './PreBill';
import { DocumentsVerifyInput } from '../providers/apollo/mutations/delivery';
import LeadsQuoteFinancial from './LeadsQuoteFinancial';
import TestDriver from './TestDriver';

export interface SecondaryAdvisers {
  advisers: string[];
}

export interface Inquiry {
  question: string;

  answer: string;
}

export interface ConcesionarioSucursal {
  code: string;

  name: string;
}

export interface saleDownExtraInput {
  idModelo: number;
  marca: string;
}

class Leads {
  id?: number;

  idAgency?: string;

  chanel?: string;

  campaign?: string;

  temperature?: string;

  state?: string;

  city?: string;

  isFleet?: boolean;

  secondoryAdvisers?: SecondaryAdvisers;

  workPage?: string;

  inquiry?: Inquiry[] | null;

  saleDown?: boolean | null;

  saleDownExtra?: saleDownExtraInput;

  statusSaleDown?: string | null;

  commentSaleDown?: string | null;

  discount?: number | null; //descuento

  invoices?: DocumentsVerifyInput[];

  isNotManaged?:boolean;

  toReasign?: boolean;

  updateAt?: string;

  createdAt?: string;

  user: User;

  client: Client;

  meets?: Meets[];

  quotes?: Quotes[];

  leadsQuoteFinancial? : LeadsQuoteFinancial | null;

  sucursal?: ConcesionarioSucursal;

  concesionario?: ConcesionarioSucursal;

  prebill?: Prebill[] | null;
  delivery?: any;
  vehiculo?: any;
  vimVehiculo?: any;

  testDriver?: TestDriver[];

  constructor(user: User, client: Client) {
    this.user = user;
    this.client = client;
  }
}

export default Leads;
