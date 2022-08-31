import QuoteFinancial from './Quoute-Financial';

export default interface Financial {
  id: number;
  typeEntity?: string;
  nameEntityFinancial?: string;
  phoneEntityFinancial?: string;
  nameContact?: string;
  lastNameContact?: string;
  emailcontact?: string;
  idSucursal?: string;
  updateAt?: string;
  createdAt?: string;
  quoteFinancial?: QuoteFinancial[];
}
