/* eslint-disable lines-between-class-members */
import Client from '../models/Client';
import ClientsMutationProvider, {
  LeadInsertInput,
  ClientInput,
} from '../providers/apollo/mutations/clients';
import ClientsQueryProvider from '../providers/apollo/queries/clients';
import ClientsRepositoryInterface from '../repositories-interfaces/clients-repository-interface';

export default class ClientsRepository implements ClientsRepositoryInterface {
  clientsQueryProvider: ClientsQueryProvider;
  clientsMutationProvider: ClientsMutationProvider;

  constructor(
    clientsProvider: ClientsQueryProvider,
    clientsMutationProvider: ClientsMutationProvider
  ) {
    this.clientsQueryProvider = clientsProvider;
    this.clientsMutationProvider = clientsMutationProvider;
  }

  getClientsByIdentification(identification: string): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsByIdentification(identification);
  }

  getOneClientByIdentification(identification: string): Promise<Client | null> {
    return this.clientsQueryProvider.getOneClientByIdentification(identification);
  }

  getClientsByOptions(optionInput: string): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsByOptions(optionInput);
  }

  getChemicalByOptionsClients(optionInput: string): Promise<any> {
    return this.clientsQueryProvider.getChemicalByOptionsClients(optionInput);
  }

  getClientsByDates(
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsByDates(firstDate, secondDate);
  }

  insertClient(
    LeadInsert: LeadInsertInput,
    ClientInsert: ClientInput
  ): Promise<number> {
    return this.clientsMutationProvider.insertClient(LeadInsert, ClientInsert);
  }

  updateClient(identification: string, client: Client): Promise<boolean> {
    return this.clientsMutationProvider.updateClient(identification, client);
  }

  getClientsByBosses(
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsByBosses(firstDate, secondDate);
  }

  getClientsLabelDashboard(
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsLabelDashboard(firstDate, secondDate);
  }

  getClientsByBossesById(
    idUser: number,
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsByBossesById(idUser, firstDate, secondDate);
  }

  getClientsByIdentificationOrLastName(
    value: string
  ): Promise<Client[] | null> {
    return this.clientsQueryProvider.getClientsByIdentificationOrLastName(
      value
    );
  }

  getAllClients(): Promise<Client[] | null> {
    return this.clientsQueryProvider.getAllClients();
  }
}
