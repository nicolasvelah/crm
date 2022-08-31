/* eslint-disable camelcase */
import { VehiclePrebillInput } from '../providers/apollo/mutations/prebills';
import Quotes from './Quotes';
import Leads from './Leads';

export interface PrebillNote {
  id: number;
  type: string;
  name: string;
  texto: string;
}

export interface Prebill {
  id?: number;
  notes?: PrebillNote[];
  status?: string;
  descuento?: number; //number
  payThirdPerson?: boolean | null; // tercera persona
  //Id De respuesta de integracion con api CRM
  idPrefacturaCRM?: string;
  accepted?: boolean;
  updateAt?: string;
  createdAt?: string;
  leads?: Leads | null;
}

export interface OtherConcept {
  code: string;
  name: string;
  cost: number;
  dimension: String;
  id: number;
  id_Vh: string;
  brand: string;
  model: string;
  urlPhoto: { link: string }[];
  quantity: number;
}
