/* eslint-disable semi */
import Credits from '../models/Credits';
import {
  CreditRequestInput,
  QuoteData,
} from '../providers/apollo/mutations/credit';

export interface CreditWithBirthdate {
  credit: Credits;
  birthdate: string;
}

export default interface CreditRepositoryInterface {
  getCreditByClientId(clientId: string): Promise<CreditWithBirthdate | null>;
  insertOrUpdateCredit(
    credit: CreditRequestInput,
    quoteData: QuoteData,
    isFleet?: boolean | null
  ): Promise<boolean>;
}
