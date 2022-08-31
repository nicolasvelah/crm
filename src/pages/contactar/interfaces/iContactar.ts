export interface IContactar {
  name: string;
  lastName: string;
  cellphone: string;
  email: string;
  typeIdentification: string;
  identification: string;
  isPerson: number;
}
export interface IValidations {
  message: string;
  param: string;
  value: string;
}
export interface IProductInterest {
  brand: string;
  model: string;
  version: string;
  year: string;
}
export interface IDataConcessionaire {
  codigo: string;
  descripcion: string;
  id_sucursal: number;
  sucursal: string;
  ciudad?: string;
}

export interface IConcessionaire {
  code: string | number;
  name: string;
  city?: string;
}

export interface IDataAtension {
  motive: string;
  executionDate: any;
  openingNote: string;
  idClient: number;
  idUser: number;
  idAgency: string;
  concessionaire: IConcessionaire;
  sucursal: IConcessionaire;
  tracingType?: string;
  idLead?: number;
}

export interface IDataListConcessionaire {
  concessionaire: IConcessionaire;
  branchOffices: [IConcessionaire];
}

export interface IDataConcessionaire_BranchOfficess {
  concessionaire: IConcessionaire;
  branchOffices: IConcessionaire;
}

export interface ISelectConcesionario {
  setIsEnableAdvisers: Function;
  setDataAdvisers: Function;
  setIsEnableConectNow: Function;
  listConcessionaire: any;
  setDataConcessionaire: Function;
  dataConcessionaire: IDataConcessionaire_BranchOfficess;
  allUsers?: boolean;
}
