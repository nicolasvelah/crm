import { gql } from '@apollo/client';
import apolloClient from '..';

export interface ApplicantInput {
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  civilStatus: string;
}

export interface ApplicantActivityInput {
  company: string;
  employmentRelationship: string;
  workAddress: string;
  workPhone: string;
  workPosition: string;
  yearsOfWork: number;
}

export interface CurrentAddressInput {
  cellPhone: string;
  homePhone: string;
  houseAddress: string;
  neighborhood: string;
  parish: string;
  typeOfHousing: string;
  province: string | null;
  canton: string | null;
}

export interface BankReferencesInput {
  accountNumber: string;
  accountType: string;
  bank: string;
}

export interface SpouseDataInput {
  dateOfBirth: string | null;
  identification: string | null;
  lastNames: string | null;
  names: string | null;
  placeOfBirth: string | null;
}

export interface IncomeInput {
  monthlySalary: number;
  monthlySpouseSalary: number | null;
  otherIncome: number;
  otherSpouseIncome: number | null;
}

export interface PersonalReferencesInput {
  lastNames: string;
  names: string;
  phone: string;
  relationship: string;
}

export interface CommercialReferencesInput {
  company: string | null;
  sector: string | null;
  phone: string | null;
  placeCompany: string | null;
  referenceName: string | null;
  position: string | null;
}
export interface GoodsInput {
  goodHouse: number;
  goodVehicle: number;
  goodOthers: number;
}

export interface PassivesInput {
  debtsToPay: number;
  creditCards: number;
  passivesOthers: number;
}

export interface CreditRequestInput {
  clientId: string;
  applicant: ApplicantInput;
  applicantActivity: ApplicantActivityInput;
  currentAddress: CurrentAddressInput;
  bankReferences: BankReferencesInput;
  spouseData: SpouseDataInput;
  income: IncomeInput;
  personalReferences: PersonalReferencesInput;
  commercialReferences: CommercialReferencesInput;
  goods: GoodsInput;
  passives: PassivesInput;
}

export interface QuoteData {
  id: number;
  observationsFyI: string;
}

export const MUTATION_CREATE_OR_UPDATE_CREDIT = gql`
  mutation InsertOrUpdateCredit(
    $credit: CreditRequestInput!
    $quoteData: QuoteData!
    $isFleet: Boolean
  ) {
    insertOrUpdateCredit(credit: $credit, quoteData: $quoteData, isFleet: $isFleet)
  }
`;

export default class CreditMutationProvider {
  insertOrUpdateCredit = async (
    credit: CreditRequestInput,
    quoteData: QuoteData,
    isFleet?: boolean | null
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_OR_UPDATE_CREDIT,
        variables: {
          credit,
          quoteData,
          isFleet
        },
      });

      if (errors) return false;
      //console.log('insert or update', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };
}
