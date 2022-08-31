import Leads from './Leads';

export default class Meets {
  id?: number;

  type?: string;

  leadState?: string;

  date?: string;

  updateAt?: string;

  createdAt?: string;

  leads?: Leads | null;
}
