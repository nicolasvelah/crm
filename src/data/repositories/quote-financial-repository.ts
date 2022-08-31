import QuoteFinancialMutationProvider, {
  CreditRequestInput,
  EntitiesInput,
  BankResponse,
  ResQuoteFinancialOk,
} from '../providers/apollo/mutations/quote-financial';
import QuoteFinancialRepositoryInterface from '../repositories-interfaces/quote-financial-repository-interface';
import QuoteFinancial, { financialSelected } from '../models/Quoute-Financial';
import QuotesFinancialQueryProvider from '../providers/apollo/queries/quote-financial';
import { Vehicle } from '../models/Vehicle';

export default class QuoteFinancialRepository
  implements QuoteFinancialRepositoryInterface {
  quoteFinancialMutationProvider: QuoteFinancialMutationProvider;

  quoteFinancialQueryProvider: QuotesFinancialQueryProvider;

  constructor(
    quoteFinancialMutationProvider: QuoteFinancialMutationProvider,
    quoteFinancialQueryProvider: QuotesFinancialQueryProvider
  ) {
    this.quoteFinancialMutationProvider = quoteFinancialMutationProvider;
    this.quoteFinancialQueryProvider = quoteFinancialQueryProvider;
  }

  sendCreditToEntities(
    entities: EntitiesInput[],
    id: number,
    creditRequest: CreditRequestInput,
    isFleets: boolean | null,
    vehicleFleets: Vehicle[] | null
  ): Promise<ResQuoteFinancialOk[] | null> {
    return this.quoteFinancialMutationProvider.sendCreditToEntities(
      entities,
      id,
      creditRequest,
      isFleets,
      vehicleFleets
    );
  }

  getCreditsApplications(): Promise<QuoteFinancial[] | null> {
    return this.quoteFinancialQueryProvider.getCreditsApplications();
  }

  updateQuoteFinancialById(
    id: number,
    responseBank: string,
    opinion: string | null,
    idUserFyI: number
  ): Promise<boolean> {
    return this.quoteFinancialMutationProvider.updateQuoteFinancialById(
      id,
      responseBank,
      opinion,
      idUserFyI
    );
  }

  updateSelectedQuoteFinancialById(
    arrayInput: financialSelected[]
  ): Promise<boolean> {
    return this.quoteFinancialMutationProvider.updateSelectedQuoteFinancialById(
      arrayInput
    );
  }

  getCreditsApplicationsById(id: number): Promise<QuoteFinancial | null> {
    return this.quoteFinancialQueryProvider.getCreditsApplicationsById(id);
  }

  sendQuoteFinalcials(
    idsFinalcials: number[],
    creditRequest: CreditRequestInput
  ): Promise<BankResponse[] | null> {
    return this.quoteFinancialMutationProvider.sendQuoteFinalcials(
      idsFinalcials,
      creditRequest
    );
  }
}
