import Leads from './Leads';
import Credits from './Credits';
import Tracings from './Tracings';

export interface Address {
  houseType?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  parish?: string | null;
}

export interface ClientJob {
  companyName?: string | null;
  companyPhone?: string | null;
  companyAddress?: string | null;
  timeInYears?: number | null;
  position?: string | null;
  typeRelationship?: string | null;
  email?: string | null;
  activity?: string | null;
}
export interface ClientSpouse {
  name?: string | null;
  lastName?: string | null;
  identification?: string | null;
  birthDate?: string | null;
  birthPlace?: string | null;
  nationality?: string | null;
  companyName?: string | null;
  companyPhone?: string | null;
  timeInYears?: number | null;
  position?: string | null;
  companyAddress?: string | null;
  typeRelationship?: string | null;
  email?: string | null;
  activity?: string | null;
}

export interface Salary {
  clientMonthSalary?: number | null;
  otherIncome?: number | null;
  clientMonthSpouse?: number | null;
  otherIncomeSpouse?: number | null;
}

export interface BankReference {
  namebank?: string | null;
  accountNumber?: string | null;
  accountType?: number | null;
}

export interface PersonalReference {
  name?: string | null;
  lastName?: string | null;
  relationship?: string | null;
  phone?: string | null;
}

export interface Actives {
  home?: number | null;
  vehicule?: number | null;
  ground?: number | null;
  other?: number | null;
}

export interface Passives {
  accountsPatableBank?: number | null;
  accountsPatableProviders?: number | null;
  creditCars?: number | null;
  other?: number | null;
  total?: number | null;
}

export interface Estates {
  actives?: number | null;
  passives?: number | null;
  total?: number | null;
}

/* const jsonIn = { id?: number,
    name?: string,

    lastName?: string,

    phone?: string,

    cellphone?: string,

    socialRazon?: string,

    email?: string,

    typeIdentification?: string,

    identification?: string,

    chanel?: string,

    campaign?: string,

    city?: string,

    address?: Address,

    clientJob?: ClientJob,

    clientSpouse?: ClientSpouse,

    salary?: Salary,

    bankReference?: BankReference,

    personalReference?: PersonalReference,

    actives?: Actives,

    passives?: Passives,

    estates?: Estates,

    updateAt?: string,

    createdAt?: string,

    credits?: Credits[],

    leads?: Leads[],

    tracings?: Tracings[],} */

class Client {
  id?: number | null;

  name?: string | null;

  lastName?: string | null;

  birthdate?: string | null;

  phone?: string | null;

  cellphone?: string | null;

  socialRazon?: string | null;

  email?: string | null;

  typeIdentification?: string | null;

  identification?: string | null;

  chanel?: string | null;

  campaign?: string | null;

  city?: string | null;

  address?: Address | null;

  clientJob?: ClientJob | null;

  clientSpouse?: ClientSpouse | null;

  salary?: Salary | null;

  bankReference?: BankReference | null;

  personalReference?: PersonalReference | null;

  actives?: Actives | null;

  passives?: Passives | null;

  estates?: Estates | null;

  updateAt?: string | null;

  createdAt?: string | null;

  credits?: Credits | null;

  leads?: Leads[] | null;

  tracings?: Tracings[] | null;

  motive?: any;

  isPerson?: boolean | null;
}

export default Client;
