import LeadQuoteFinancialMutationProvider from '../providers/apollo/mutations/leads-quote-financial';
import LeadQuoteFinancialRepositoryInterface from '../repositories-interfaces/lead-quote-financial-repository-interface';
import LeadsQuoteFinancialQueryProvider from '../providers/apollo/queries/lead-quote-financial';
import LeadsQuoteFinancial from '../models/LeadsQuoteFinancial';

export default class LeadQuoteFinancialRepository
  implements LeadQuoteFinancialRepositoryInterface {
  leadQuoteFinancialMutationProvider: LeadQuoteFinancialMutationProvider;
  leadQuoteFinancialQueryProvider: LeadsQuoteFinancialQueryProvider;

  constructor(
    leadQuoteFinancialMutationProvider: LeadQuoteFinancialMutationProvider,
    leadQuoteFinancialQueryProvider: LeadsQuoteFinancialQueryProvider
  ) {
    this.leadQuoteFinancialMutationProvider = leadQuoteFinancialMutationProvider;
    this.leadQuoteFinancialQueryProvider = leadQuoteFinancialQueryProvider;
  }

  getLeadsQuoteFinancialById(id: number): Promise<LeadsQuoteFinancial | null> {
    return this.leadQuoteFinancialQueryProvider.getLeadsQuoteFinancialById(id);
  }

  getLeadsQuotesFinancialCredits(values: {
    identificationClient: string | null,
    firstDate: string | null,
    secondDate: string | null,
    concessionaireInput: string | null,
    sucursalInput: string | null
  }): Promise<LeadsQuoteFinancial[] | null> {
    return this.leadQuoteFinancialQueryProvider.getLeadsQuotesFinancialCredits(
      values.identificationClient,
      values.firstDate,
      values.secondDate,
      values.concessionaireInput,
      values.sucursalInput
    );
  }

  createLeadQuoteFinancial(
    idLead: number,
    quotes: number[]
  ): Promise<LeadsQuoteFinancial | null> {
    return this.leadQuoteFinancialMutationProvider.createLeadQuoteFinancial(
      idLead,
      quotes
    );
  }
}
