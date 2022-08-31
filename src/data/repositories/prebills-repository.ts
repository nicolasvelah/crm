import { Prebill } from '../models/PreBill';
import PreBillsMutationProvider, {
  PrebillInput,
  RequestAgainPrebillInput,
} from '../providers/apollo/mutations/prebills';
import PreBillQueryProvider from '../providers/apollo/queries/prebills';
import PreBillRepositoryInterface from '../repositories-interfaces/prebills-repository-interface';

export default class PreBillsRepository implements PreBillRepositoryInterface {
  preBillsQueryProvider: PreBillQueryProvider;
  preBillsMutationProvider: PreBillsMutationProvider;

  constructor(
    preBillsQueryProvider: PreBillQueryProvider,
    preBillsMutationProvider: PreBillsMutationProvider
  ) {
    this.preBillsQueryProvider = preBillsQueryProvider;
    this.preBillsMutationProvider = preBillsMutationProvider;
  }
  updatePrebillCreated(variables: RequestAgainPrebillInput): Promise<boolean> {
    return this.preBillsMutationProvider.updatePrebillCreated(variables);
  }

  getPrebillByLead(idLead: number): Promise<Prebill | null> {
    return this.preBillsQueryProvider.getPrebillByLead(idLead);
  }

  createPrebill(idLead: number, prebillInput: PrebillInput): Promise<boolean> {
    return this.preBillsMutationProvider.create(idLead, prebillInput);
  }

  getAllPrebills(): Promise<Prebill[] | null> {
    return this.preBillsQueryProvider.getAllPrebills();
  }

  getPrebillByIdCRM(idPrefacturaCRM: string): Promise<Prebill | null> {
    return this.preBillsQueryProvider.getPrebillByIdCRM(idPrefacturaCRM);
  }

  acceptOrDecline(variables: {
    id: number;
    accepted: boolean;
    note: any;
    idsQuotes: number[] | null;
  }): Promise<boolean> {
    return this.preBillsMutationProvider.acceptOrDeclinePrebill(variables);
  }
}
