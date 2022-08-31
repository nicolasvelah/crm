import Client from './Client';
import User from './User';
import Leads from './Leads';

export interface LinksOffice365 {
  link: string;
}

class Tracings {
  id?: number;

  type?: string;

  motive?: string;

  priority?: string;

  executionDate?: string;

  closeDate?: string;

  openingNote?: string;

  closeNote?: string;

  updateAt?: string;

  createdAt?: string;

  client?: Client;

  user?: User;

  leads?: Leads;

  linkVchat?: string | null;

  linksOffice365?: LinksOffice365[] | null;
}

export default Tracings;
