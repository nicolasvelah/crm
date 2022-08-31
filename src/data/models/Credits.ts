export interface Applicant {
  placeOfBirth: string;
  nationality: string;
  civilStatus: string;
}

export interface ApplicantActivity {
  company: string;

  employmentRelationship: string;

  workAddress: string;

  workPhone: string;

  workPosition: string;

  yearsOfWork: number;
}

export interface CurrentAddress {
  cellPhone: string;
  homePhone: string;
  houseAddress: string;
  neighborhood: string;
  parish: string;
  typeOfHousing: string;
  province: string;
  canton: string;
}

export interface BankReferences {
  accountNumber: string;

  accountType: string;

  bank: string;
}

export interface SpouseData {
  dateOfBirth: string;

  identification: string;

  lastNames: string;

  names: string;

  placeOfBirth: string;
}

export interface Income {
  monthlySalary: number;

  monthlySpouseSalary: number;

  otherIncome: number;

  otherSpouseIncome: number;
}

export interface PersonalReferences {
  lastNames: string;

  names: string;

  phone: string;

  relationship: string;
}

export interface CommercialReferences {
  company: string | null;
  sector: string | null;
  phone: string | null;
  placeCompany: string | null;
  referenceName: string | null;
  position: string | null;
}

export interface Goods {
  goodHouse: number;

  goodVehicle: number;

  goodOthers: number;
}

export interface Passives {
  debtsToPay: number;

  creditCards: number;

  passivesOthers: number;
}

class Credits {
  id?: number;

  applicant?: Applicant;

  applicantActivity?: ApplicantActivity;

  currentAddress?: CurrentAddress;

  bankReferences?: BankReferences;

  spouseData?: SpouseData;

  income?: Income;

  goods?: Goods;

  passives?: Passives;

  personalReferences?: PersonalReferences;

  commercialReferences?: CommercialReferences;
}

export default Credits;
