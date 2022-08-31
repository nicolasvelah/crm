import { Prebill } from '../models/PreBill';
import {
  PrebillInput,
  RequestAgainPrebillInput,
} from '../providers/apollo/mutations/prebills';

export default interface PreBillRepositoryInterface {
  getAllPrebills(): Promise<Prebill[] | null>;
  createPrebill(idQuote: number, prebillInput: PrebillInput): Promise<boolean>;
  getPrebillByIdCRM(idPrefacturaCRM: string): Promise<Prebill | null>;
  getPrebillByLead(idLead: number): Promise<Prebill | null>;
  acceptOrDecline(variables: {
    id: number;
    accepted: boolean;
    note: any;
    idsQuotes: number[] | null;
  }): Promise<boolean>;

  updatePrebillCreated(variables: RequestAgainPrebillInput): Promise<boolean>;
}
