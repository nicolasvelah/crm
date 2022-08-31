import LeadsQuoteFinancial from '../models/LeadsQuoteFinancial';

export default interface LeadQuoteFinancialRepositoryInterface {
  getLeadsQuoteFinancialById(id: number): Promise<LeadsQuoteFinancial | null>;

  getLeadsQuotesFinancialCredits(values: {
    identificationClient: string | null;
    firstDate: string | null;
    secondDate: string | null;
    concessionaireInput: string | null;
    sucursalInput: string | null;
  }): Promise<LeadsQuoteFinancial[] | null>;

  createLeadQuoteFinancial(
    idLead: number,
    quotes: number[]
  ): Promise<LeadsQuoteFinancial | null>;
}
