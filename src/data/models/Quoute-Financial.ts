import Quotes from './Quotes';
import Financial from './Financial';
import LeadsQuoteFinancial from './LeadsQuoteFinancial';

export default interface QuoteFinancial {
  id?: number;
  responseBank?: string | null;
  selected?: boolean | null;
  opinion?: string | null;
  withFile?: boolean | null;
  updateAt?: string;
  createdAt?: string;
  financial?: Financial;
  quoutes?: Quotes;
  leadsQuoteFinancial? : LeadsQuoteFinancial | null;
}

export interface financialSelected {
  id: number;
  selected: boolean;
}
