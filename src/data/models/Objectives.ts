import Quotes from './Quotes';

export interface Objectives {
  id: number,
  idConcessionaire: string,
  concessionaire: string,
  idSucursal: string,
  sucursal: string,
  idAdviser: number,
  adviser: string,
  idVersion: string,
  exonerated: number,
  month: number,
  quantity: number,
  margin: number,
  type: string,
  createdAt: string
}

export interface ObjectivesAccessories {
  id: number,
  idConcessionaire: string,
  concessionaire: string,
  idSucursal: string,
  sucursal: string,
  idAdviser: number,
  adviser: string,
  idVersion: string,
  exonerated: number,
  month: number,
  budgetYear: number,
  amountAccessories: number,
  counted:number,
  type: string,
  createdAt: string
}

export interface ObjectivesAllies {
  id: number,
  idConcessionaire: string,
  concessionaire: string,
  idSucursal: string,
  sucursal: string,
  idAdviser: number,
  adviser: string,
  idVersion: string,
  exonerated: number,
  month: number,
  budgetYear: number,
  amountAccessories: number,
  counted:number,
  type: string,
  insurance: number,
  insuranceAmount: number,
  device: number,
  amountDevice: number,
  prepaid: number,
  amountPrepaid: number,
  used: number,
  amountUsed: number,
  createdAt: string
}

export interface GetObjectives {
  objectives: Objectives[];
  quotes: Quotes[];
}
