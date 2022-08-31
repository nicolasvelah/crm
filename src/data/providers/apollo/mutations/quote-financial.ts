import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import QuoteFinancial, {
  financialSelected,
} from '../../../models/Quoute-Financial';
import { Vehicle } from '../../../models/Vehicle';

export interface ApplicantInput {
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  nationality: string | null;
  civilStatus: string | null;
  concessionaire: string | null;
  sucursal: string | null;
  placeAndDate: string | null;
}

export interface ApplicantActivityInput {
  company: string | null;
  employmentRelationship: string | null;
  workAddress: string | null;
  workPhone: string | null;
  workPosition: string | null;
  yearsOfWork: number;
}

export interface CurrentAddressInput {
  cellPhone: string | null;
  homePhone: string | null;
  houseAddress: string | null;
  neighborhood: string | null;
  parish: string | null;
  typeOfHousing: string | null;
  province: string | null;
  canton: string | null;
}

export interface BankReferencesInput {
  accountNumber: string | null;
  accountType: string | null;
  bank: string | null;
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
  monthlySpouseSalary: number;
  otherIncome: number;
  otherSpouseIncome: number;
}

export interface PersonalReferencesInput {
  lastNames: string | null;
  names: string | null;
  phone: string | null;
  relationship: string | null;
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

export interface VehicleDataInput {
  entrada: number;
  financing: number;
  brand: string;
  description: string;
  model: string;
  monthlyPayments: number;
  plazo: number;
  tasa: number;
  totalServices: number;
  totalAccesories: number;
  valueExtraEsKit: number;
  value: number;
  year: number;
}

interface CommercialReferencesInput {
  company: string | null;
  sector: string | null;
  phone: string | null;
  placeCompany: string | null;
  referenceName: string | null;
  position: string | null;
}

export interface CreditRequestInput {
  clientId: string | null;
  applicant: ApplicantInput;
  applicantActivity: ApplicantActivityInput;
  currentAddress: CurrentAddressInput;
  bankReferences: BankReferencesInput;
  spouseData: SpouseDataInput;
  income: IncomeInput;
  personalReferences: PersonalReferencesInput;
  goods: GoodsInput;
  passives: PassivesInput;
  vehicleData: VehicleDataInput;
  commercialReferences: CommercialReferencesInput;
}

export interface EntitiesInput {
  nameEntityFinancial: string;
  idSucursal: string;
  email: string;
}

export interface BankResponse {
  idQuoteFinancial: number;
  ok: boolean;
}

export interface ResQuoteFinancialOk {
  quoteFinancial: QuoteFinancial | null;
  sendOk: boolean;
  message: string;
}

export const MUTATION_SEND_CREDIT_TO_FINANCIALS = gql`
  mutation SendCreditToEntities(
    $entities: [EntitiesInput!]!
    $id: Int!
    $creditRequest: CreditInput!
    $isFleets: Boolean
    $vehiclesFleets: [VehicleDataInput!]
  ) {
    sendCreditToEntities(
      entities: $entities
      id: $id
      creditRequest: $creditRequest
      isFleets: $isFleets
      vehiclesFleets: $vehiclesFleets
    ) {
      quoteFinancial {
        id
        responseBank
        selected
        createdAt
        withFile
        financial {
          nameEntityFinancial
          phoneEntityFinancial
          nameContact
          lastNameContact
          emailcontact
          idSucursal
        }
      }
      sendOk
      message
    }
  }
`;

export const MUTATION_UPDATE_QUOTE_FINANCIAL_BY_ID = gql`
  mutation updateQuoteFinancialById(
    $id: Int!
    $responseBank: String!
    $opinion: String
    $idUserFyI: Int!
  ) {
    updateQuoteFinancialById(
      id: $id
      responseBank: $responseBank
      opinion: $opinion
      idUserFyI: $idUserFyI
    )
  }
`;

export const MUTATION_SEND_QUOTE_FINANCIALS = gql`
  mutation sendQuoteFinalcials(
    $idsFinalcials: [Int!]!
    $creditRequest: CreditInput!
  ) {
    sendQuoteFinalcials(
      idsFinalcials: $idsFinalcials
      creditRequest: $creditRequest
    ) {
      idQuoteFinancial
      ok
    }
  }
`;

export const MUTATION_UPDATE_SELECTED_QUOTE_FINANCIAL_BY_ID = gql`
  mutation UpdateSelectedQuoteFinancialById(
    $arrayInput: [financialSelected!]!
  ) {
    updateSelectedQuoteFinancialById(arrayInput: $arrayInput)
  }
`;

export default class QuoteFinancialMutationProvider {
  updateSelectedQuoteFinancialById = async (
    arrayInput: financialSelected[]
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_SELECTED_QUOTE_FINANCIAL_BY_ID,
        variables: {
          arrayInput,
        },
      });
      //console.log('updateSelectedQuoteFinancialById', data);
      return !errors;
    } catch (e) {
      //console.error('Error updateSelectedQuoteFinancialById', e.message);
      return false;
    }
  };
  sendCreditToEntities = async (
    entities: EntitiesInput[],
    id: number,
    creditRequest: CreditRequestInput,
    isFleets: boolean | null,
    vehiclesFleets: Vehicle[] | null
  ): Promise<ResQuoteFinancialOk[] | null> => {
    console.log('data to send -->', {
      entities,
      id,
      creditRequest,
      isFleets,
      vehiclesFleets,
    });
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_SEND_CREDIT_TO_FINANCIALS,
        variables: {
          entities,
          id,
          creditRequest,
          isFleets,
          vehiclesFleets,
        },
      });

      if (errors) return null;
      //console.log('Send credit', data);
      return data.sendCreditToEntities;
    } catch (e) {
      //console.log(e);
      return null;
    }
  };

  updateQuoteFinancialById = async (
    id: number,
    responseBank: string,
    opinion: string | null,
    idUserFyI: number
  ): Promise<boolean> => {
    try {
      //console.log('-------++++++++++++++++++++++++++');
      /*
      if (!context) return {}; */
      //console.log('context');
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_QUOTE_FINANCIAL_BY_ID,
        variables: {
          id,
          responseBank,
          opinion,
          idUserFyI
        },
        //
      });
      //console.log('createQuote', data);
      if (errors) return false;
      return true;
    } catch (e) {
      //console.error('Error updateQuoteFinancialById', e.message);
      return false;
    }
  };

  sendQuoteFinalcials = async (
    idsFinalcials: number[],
    creditRequest: CreditRequestInput
  ): Promise<BankResponse[] | null> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_SEND_QUOTE_FINANCIALS,
        variables: {
          idsFinalcials,
          creditRequest,
        },
        //
      });
      if (errors) return null;
      return data.sendQuoteFinalcials;
    } catch (e) {
      //console.error('Error sendQuoteFinalcials', e.message);
      return null;
    }
  };
}
