/* eslint-disable semi */
import Client from '../models/Client';
import {
  ClientInput,
  LeadInsertInput,
} from '../providers/apollo/mutations/clients';

export default interface ClientsRepositoryInterface {
  getClientsByIdentification(identification: string): Promise<Client[] | null>;

  getOneClientByIdentification(identification: string): Promise<Client | null>

  getClientsByOptions(optionInput: string): Promise<Client[] | null>;

  getChemicalByOptionsClients(optionInput: string): Promise<Client[] | null>;

  getClientsByDates(
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null>;

  insertClient(
    LeadInsert: LeadInsertInput,
    ClientInsert: ClientInput
  ): Promise<number>;

  updateClient(identification: string, client: Client): Promise<boolean>;

  getClientsByBosses(
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null>;

  getClientsLabelDashboard(
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null>;

  getClientsByBossesById(
    idUser:number,
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null>;

  getClientsByIdentificationOrLastName(value: string): Promise<Client[] | null>;

  getAllClients(): Promise<Client[] | null>;
}
