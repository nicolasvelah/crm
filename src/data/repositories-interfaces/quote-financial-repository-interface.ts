import { CreditRequestInput, EntitiesInput, BankResponse, ResQuoteFinancialOk } from '../providers/apollo/mutations/quote-financial';
import QuoteFinancial, { financialSelected } from '../models/Quoute-Financial';
import { Vehicle } from '../models/Vehicle';

/* eslint-disable semi */
export default interface QuoteFinancialRepositoryInterface {
  sendCreditToEntities(
    entities: EntitiesInput[],
    id: number,
    creditRequest: CreditRequestInput,
    isFleets: boolean | null,
    vehicleFleets: Vehicle[] | null
  ): Promise<ResQuoteFinancialOk[] | null>;

  getCreditsApplications(): Promise<QuoteFinancial[] | null>;

  updateQuoteFinancialById(
    id: number,
    responseBank: string,
    opinion: string | null,
    idUserFyI: number
  ): Promise<boolean>;

  getCreditsApplicationsById(
    id: number
  ): Promise<QuoteFinancial | null>;

  updateSelectedQuoteFinancialById(
    arrayInput: financialSelected[]
  ): Promise<boolean> ;

  sendQuoteFinalcials(
    idsFinalcials: number[],
    creditRequest: CreditRequestInput
  ): Promise<BankResponse[] | null>;
}
