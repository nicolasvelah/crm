import Leads from '../models/Leads';
import User from '../models/User';
import { UserInput } from '../providers/apollo/mutations/leads';
import { UserReassignedInput } from '../providers/apollo/mutations/reassigned';
import { LeadInsertInput } from '../providers/apollo/mutations/clients';

export interface ResSaleDown {
  ok: boolean;
  message: string;
  data?: {
    idsQuotesNOLiberatedVIN: number[];
    idsQuotesLiberatedVIN: number[];
  };
}
export default interface LeadsRepositoryInterface {
  getLeadById(id: number): Promise<Leads | null>;

  getAllLeads(): Promise<Leads[] | null>;
  getLeadsForUser(
    firstDate: string | null,
    secondDate: string | null,
    value: string
  ): Promise<Leads[] | null>;
  getLabelDashboard(
    firstDate: string | null,
    secondDate: string | null
  ): Promise<Leads[] | null>;
  getLeadByIdUser(
    idUser: number | null,
    firstDate: string | null,
    secondDate: string | null
  ): Promise<Leads[] | null>;
  getLeadsToWallet(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<any>;
  notifySaleDown(
    idUser: number,
    identification: string,
    idLead: number,
    comment: string,
    saleDownExtra: {
      idModelo: number;
      marca: string;
    } | null
  ): Promise<boolean>;
  saleDown(
    idLead: number,
    accepted: boolean,
    dataVehicle: {
      id_modelo: number;
      marca: string;
    } | null,
    comment?: string | null
  ): Promise<ResSaleDown>;
  updateTemperature(id: number, temperatureInsert: string): Promise<boolean>;
  updateLeadToCampaign(id: number, campaign: string): Promise<boolean>;
  updateStateLead(id: number, stateLead: string): Promise<boolean>;
  updateLeadDiscount(id: number, discount: number): Promise<boolean>;
  reasignUser(
    user: UserReassignedInput,
    userOld: UserReassignedInput,
    idsLeads: number[]
  ): Promise<boolean>;
  updateWorkPage(idLead: number): Promise<boolean>;
  insertLead(
    leadsInsert: LeadInsertInput,
    identificationClient: string,
    campaign: string | null,
    channel: string
  ): Promise<Leads | null>;
  getLeadsToReasign(): Promise<Leads[] | null>;
  reasignLead(idUser: number, idsLeads: number[]): Promise<boolean>;
}
