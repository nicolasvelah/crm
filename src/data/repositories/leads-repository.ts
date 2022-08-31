import LeadsMutationProvider, {
  UserInput,
} from '../providers/apollo/mutations/leads';
import LeadsQueryProvider from '../providers/apollo/queries/leads';
import LeadsRepositoryInterface, { ResSaleDown } from '../repositories-interfaces/leads-repository-interface';
import Leads from '../models/Leads';
import User from '../models/User';
import { UserReassignedInput } from '../providers/apollo/mutations/reassigned';
import { LeadInsertInput } from '../providers/apollo/mutations/clients';

export default class LeadsRepository implements LeadsRepositoryInterface {
  leadsQueryProvider: LeadsQueryProvider;
  leadsMutationProvider: LeadsMutationProvider;

  constructor(
    leadsQueryProvider: LeadsQueryProvider,
    leadsMutationProvider: LeadsMutationProvider
  ) {
    this.leadsQueryProvider = leadsQueryProvider;
    this.leadsMutationProvider = leadsMutationProvider;
  }
  updateTemperature(id: number, temperatureInsert: string): Promise<boolean> {
    return this.leadsMutationProvider.updateTemperature(id, temperatureInsert);
  }
  updateLeadToCampaign(id: number, campaign: string): Promise<boolean> {
    return this.leadsMutationProvider.updateLeadToCampaign(id, campaign);
  }
  updateStateLead(id: number, stateLead: string): Promise<boolean> {
    return this.leadsMutationProvider.updateStateLead(id, stateLead);
  }

  updateLeadDiscount(id: number, discount: number): Promise<boolean> {
    return this.leadsMutationProvider.updateLeadDiscount(id, discount);
  }

  getLeadById(id: number): Promise<Leads | null> {
    return this.leadsQueryProvider.getLeadById(id);
  }

  getAllLeads(): Promise<Leads[] | null> {
    return this.leadsQueryProvider.getAllLeads();
  }

  getLeadsForUser(
    firstDate: string | null,
    secondDate: string | null,
    value: string
  ): Promise<Leads[] | null> {
    return this.leadsQueryProvider.getLeadsForUser(
      firstDate,
      secondDate,
      value
    );
  }
  getLabelDashboard(
    firstDate: string | null,
    secondDate: string | null
  ): Promise<Leads[] | null> {
    return this.leadsQueryProvider.getLabelDashboard(firstDate, secondDate);
  }
  getLeadByIdUser(
    idUser: number | null,
    firstDate: string | null,
    secondDate: string | null
  ): Promise<Leads[] | null> {
    return this.leadsQueryProvider.getLeadByIdUser(
      idUser,
      firstDate,
      secondDate
    );
  }
  getLeadsToWallet(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<any> {
    return this.leadsQueryProvider.getLeadsToWallet(
      values.identificationClient,
      values.firstDate,
      values.secondDate,
      values.concessionaireInput,
      values.sucursalInput
    );
  }

  getLeadsToReasign(): Promise<Leads[] | null> {
    return this.leadsQueryProvider.getLeadsToReasign();
  }

  reasignLead(idUser: number, idsLeads: number[]): Promise<boolean> {
    return this.leadsMutationProvider.reasignLead(idUser, idsLeads);
  }

  notifySaleDown(
    idUser: number,
    identification: string,
    idLead: number,
    comment: string,
    saleDownExtra: {
      idModelo: number;
      marca: string;
    } | null
  ): Promise<boolean> {
    return this.leadsMutationProvider.notifySaleDown(
      idUser,
      identification,
      idLead,
      comment,
      saleDownExtra
    );
  }

  saleDown(
    idLead: number,
    accepted: boolean,
    dataVehicle: {
      id_modelo: number;
      marca: string;
    } | null,
    comment?: string | null
  ): Promise<ResSaleDown> {
    return this.leadsMutationProvider.saleDown(idLead, accepted, dataVehicle, comment);
  }

  reasignUser(
    user: UserReassignedInput,
    userOld: UserReassignedInput,
    idsLeads: number[]
  ): Promise<boolean> {
    return this.leadsMutationProvider.reasignUser(user, userOld, idsLeads);
  }
  updateWorkPage(idLead: number): Promise<boolean> {
    return this.leadsMutationProvider.updateWorkPage(idLead);
  }

  insertLead(
    leadsInsert: LeadInsertInput,
    identificationClient: string,
    campaign: string | null,
    channel: string
  ): Promise<Leads | null> {
    return this.leadsMutationProvider.insertLead(
      leadsInsert,
      identificationClient,
      campaign,
      channel
    );
  }
}
