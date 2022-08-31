import Leads from './Leads';
import Quotes from './Quotes';
import QuoteFinancial from './Quoute-Financial';

export default interface LeadsQuoteFinancial {
  id?: number;

  observationsFyI?: string | null;

  documents?: string | null;

  sendToFyI?: boolean | null; //Envio de crédito a F&I?

  updateAt?: string;

  createdAt?: string;

  leads?: Leads | null;

  quotes?: Quotes[] | null;

  quoteFinancial?: QuoteFinancial[] | null;
}
