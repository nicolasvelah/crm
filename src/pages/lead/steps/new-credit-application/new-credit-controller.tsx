import { createContext } from 'react';
import { EntitiesInput } from '../../../../data/providers/apollo/mutations/quote-financial';

type TypeActions =
  | 'set-initState'
  /* type applicant reducer*/
  | 'set-applicant-names'
  | 'set-applicant-lastNames'
  | 'set-applicant-identification'
  | 'set-applicant-dateOfBirth'
  | 'set-applicant-placeOfBirth'
  | 'set-applicant-nationality'
  | 'set-applicant-civilStatus'
  | 'set-applicant-concessionaire'
  | 'set-applicant-businessAdvisor'
  | 'set-applicant-placeAndDate'
  | 'set-applicant'
  /* type applicantActivity reducer*/
  | 'set-applicantActivity-company'
  | 'set-applicantActivity-workPhone'
  | 'set-applicantActivity-yearsOfWork'
  | 'set-applicantActivity-workPosition'
  | 'set-applicantActivity-workAddress'
  | 'set-applicantActivity-employmentRelationship'
  /* type currentAddress reducer*/
  | 'set-currentAddress-typeOfHousing'
  | 'set-currentAddress-houseAddress'
  | 'set-currentAddress-neighborhood'
  | 'set-currentAddress-parish'
  | 'set-currentAddress-homePhone'
  | 'set-currentAddress-cellPhone'
  /* type bankReferences reducer*/
  | 'set-bankReferences-bank'
  | 'set-bankReferences-accountNumber'
  | 'set-bankReferences-accountType'
  /* type property reducer */
  | 'set-property'
  | 'set-property-house'
  | 'set-property-vehicle'
  | 'set-property-others'
  /* type spouseData reducer */
  | 'set-spouseData-names'
  | 'set-spouseData-lastNames'
  | 'set-spouseData-identification'
  | 'set-spouseData-dateOfBirth'
  | 'set-spouseData-placeOfBirth'
  /* type income reducer */
  | 'set-income-monthlySalary'
  | 'set-income-otherIncome'
  | 'set-income-monthlySpouseSalary'
  | 'set-income-otherSpouseIncome'
  /* type Personal References reducer */
  | 'set-personalReferences-names'
  | 'set-personalReferences-lastNames'
  | 'set-personalReferences-relationship'
  | 'set-personalReferences-phone'
  /* type Passives reducer */
  | 'set-passives'
  | 'set-passives-debtsToPay'
  | 'set-passives-creditCards'
  | 'set-passives-others'
  /* Vehicle Data */
  | 'set-vehicleData-model'
  | 'set-vehicleData-year'
  | 'set-vehicleData-value'
  | 'set-vehicleData-plazo'
  | 'set-vehicleData-entrada'
  | 'set-vehicleData-tasa'
  | 'set-vehicleData-financing'
  | 'set-vehicleData-monthlyPayments'
  | 'set-vehicleData';

export type DispatchNewCredit = (action: ActionReducer) => void;

interface NewCreditContext {
  store: NewCreditGlobalState;
  dispatch: Function;
  documentFile: string | null;
  setDocumentFile: (file: string) => void;
  financialEntities: EntitiesInput[];
  setFinancialEntities: (financialEntities: EntitiesInput[]) => void;
  edit: boolean;
  setEdit: (value: boolean) => void;
}

export interface ActionReducer {
  type: TypeActions;
  payload: any;
}

export interface NewCreditGlobalState {
  applicant: {
    names: string | null;
    lastNames: string | null;
    identification: string | null;
    dateOfBirth: string | null;
    placeOfBirth: string | null;
    nationality: string | null;
    civilStatus: string | null;
    concessionaire: string | null;
    sucursal?: string | null;
    businessAdvisor: string | null;
    placeAndDate: string | null;
  };
  applicantActivity: {
    company: string | null;
    workPhone: string | null;
    yearsOfWork: number;
    workPosition: string | null;
    workAddress: string | null;
    employmentRelationship: string | null;
  };
  currentAddress: {
    typeOfHousing: string | null;
    houseAddress: string | null;
    neighborhood: string | null;
    parish: string | null;
    homePhone: string | null;
    cellPhone: string | null;
    province: string | null;
    canton: string | null;
  };
  bankReferences: {
    bank: string | null;
    accountNumber: string | null;
    accountType: string | null;
  };
  property: {
    house: number;
    vehicle: number;
    others: number;
  };
  spouseData: {
    names: string | null;
    lastNames: string | null;
    identification: string | null;
    dateOfBirth: string | null;
    placeOfBirth: string | null;
  };
  income: {
    monthlySalary: number;
    otherIncome: number;
    monthlySpouseSalary: number | null;
    otherSpouseIncome: number | null;
  };
  personalReferences: {
    names: string | null;
    lastNames: string | null;
    relationship: string | null;
    phone: string | null;
  };
  commercialReferences: {
    company: string | null;
    sector: string | null;
    phone: string | null;
    placeCompany: string | null;
    referenceName: string | null;
    position: string | null;
  };
  passives: {
    debtsToPay: number;
    creditCards: number;
    others: number;
  };
  vehicleData: {
    brand: string | null;
    model: string | null;
    year: number | null;
    value: number | null;
    totalServices: number | null;
    totalAccesories: number | null;
    valueExtraEsKit: number | null;
    description?: string | null;
    plazo: string | number | null;
    entrada: string | number | null;
    tasa: string | number | null;
    financing: string | number | null;
    monthlyPayments: string | number | null;
  };
}

export const initState: NewCreditGlobalState = {
  applicant: {
    names: null,
    lastNames: null,
    identification: null,
    dateOfBirth: null,
    placeOfBirth: null,
    nationality: null,
    civilStatus: null,
    concessionaire: null,
    businessAdvisor: null,
    placeAndDate: null,
  },
  applicantActivity: {
    company: null,
    workPhone: null,
    yearsOfWork: 0,
    workPosition: null,
    workAddress: null,
    employmentRelationship: null,
  },
  currentAddress: {
    typeOfHousing: null,
    houseAddress: null,
    neighborhood: null,
    parish: null,
    homePhone: null,
    cellPhone: null,
    province: null,
    canton: null,
  },
  bankReferences: {
    bank: null,
    accountNumber: null,
    accountType: null,
  },
  property: {
    house: 0,
    vehicle: 0,
    others: 0,
  },
  spouseData: {
    names: null,
    lastNames: null,
    identification: null,
    dateOfBirth: null,
    placeOfBirth: null,
  },
  income: {
    monthlySalary: 0,
    otherIncome: 0,
    monthlySpouseSalary: 0,
    otherSpouseIncome: 0,
  },
  personalReferences: {
    names: null,
    lastNames: null,
    relationship: null,
    phone: null,
  },
  passives: {
    debtsToPay: 0,
    creditCards: 0,
    others: 0,
  },
  commercialReferences: {
    company: null,
    sector: null,
    phone: null,
    placeCompany: null,
    referenceName: null,
    position: null,
  },
  vehicleData: {
    brand: null,
    model: null,
    year: null,
    value: null,
    totalServices: null,
    totalAccesories: null,
    plazo: null,
    entrada: null,
    tasa: null,
    financing: null,
    monthlyPayments: null,
    valueExtraEsKit: null,
  },
};

export const reducer = (state = initState, action: ActionReducer) => {
  if (typeof action.payload === 'string' && action.payload === '') {
    // eslint-disable-next-line no-param-reassign
    action.payload = null;
  } else if (action.payload === null) {
    // eslint-disable-next-line no-param-reassign
    action.payload = 0;
  }
  switch (action.type) {
    /* Object applicant */
    case 'set-applicant-names': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          names: action.payload,
        },
      };
      /* const newState = { ...state };
      newState.applicant.names = action.payload;
      return newState; */
    }
    case 'set-applicant-lastNames': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          lastNames: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.lastNames = action.payload;
      return newState; */
    }
    case 'set-applicant-identification': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          identification: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.identification = action.payload;
      return newState; */
    }
    case 'set-applicant-dateOfBirth': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          dateOfBirth: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.dateOfBirth = action.payload;
      return newState; */
    }
    case 'set-applicant-placeOfBirth': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          placeOfBirth: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.placeOfBirth = action.payload;
      return newState; */
    }
    case 'set-applicant-nationality': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          nationality: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.nationality = action.payload;
      return newState; */
    }
    case 'set-applicant-civilStatus': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          civilStatus: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.civilStatus = action.payload;
      return newState; */
    }
    case 'set-applicant-concessionaire': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          concessionaire: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.concessionaire = action.payload;
      return newState; */
    }
    case 'set-applicant-businessAdvisor': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          businessAdvisor: action.payload,
        },
      };
      /* const newState = state;
      newState.applicant.businessAdvisor = action.payload;
      return newState; */
    }
    case 'set-applicant': {
      return {
        ...state,
        applicant: {
          ...state.applicant,
          names: action.payload.names,
          lastNames: action.payload.lastNames,
          identification: action.payload.identification,
          concessionaire: action.payload.concessionaire,
          sucursal: action.payload.sucursal,
          businessAdvisor: action.payload.businessAdvisor,
          placeAndDate: action.payload.placeAndDate,
        },
        currentAddress: {
          ...state.currentAddress,
          cellPhone: action.payload.cellPhone
        }
      };
      /* const newState = state;
      newState.applicant.names = action.payload.names;
      newState.applicant.lastNames = action.payload.lastNames;
      newState.applicant.identification = action.payload.identification;
      newState.applicant.concessionaire = action.payload.concessionaire;
      newState.applicant.businessAdvisor = action.payload.businessAdvisor;
      newState.applicant.placeAndDate = action.payload.placeAndDate;
      return newState; */
    }
    case 'set-applicant-placeAndDate': {
      //console.log('Ebtro place date');
      return {
        ...state,
        applicant: {
          ...state.applicant,
          placeAndDate: action.payload,
        },
      };

      /* const newState = state;
      newState.applicant.placeAndDate = action.payload;
      return newState; */
    }
    /* Applicant Activity */
    case 'set-applicantActivity-company': {
      return {
        ...state,
        applicantActivity: {
          ...state.applicantActivity,
          company: action.payload,
        },
      };
      /* const newState = state;
      newState.applicantActivity.company = action.payload;
      return newState; */
    }
    case 'set-applicantActivity-workPhone': {
      return {
        ...state,
        applicantActivity: {
          ...state.applicantActivity,
          workPhone: action.payload,
        },
      };
      /* const newState = state;
      newState.applicantActivity.workPhone = action.payload;
      return newState; */
    }
    case 'set-applicantActivity-yearsOfWork': {
      return {
        ...state,
        applicantActivity: {
          ...state.applicantActivity,
          yearsOfWork: action.payload,
        },
      };
      /* const newState = { ...state };
      newState.applicantActivity.yearsOfWork = action.payload;
      return newState; */
    }
    case 'set-applicantActivity-workPosition': {
      return {
        ...state,
        applicantActivity: {
          ...state.applicantActivity,
          workPosition: action.payload,
        },
      };
      /* const newState = state;
      newState.applicantActivity.workPosition = action.payload;
      return newState; */
    }
    case 'set-applicantActivity-workAddress': {
      return {
        ...state,
        applicantActivity: {
          ...state.applicantActivity,
          workAddress: action.payload,
        },
      };
      /* const newState = state;
      newState.applicantActivity.workAddress = action.payload;
      return newState; */
    }
    case 'set-applicantActivity-employmentRelationship': {
      return {
        ...state,
        applicantActivity: {
          ...state.applicantActivity,
          employmentRelationship: action.payload,
        },
      };
      /* const newState = state;
      newState.applicantActivity.employmentRelationship = action.payload;
      return newState; */
    }
    /* Current Address */
    case 'set-currentAddress-typeOfHousing': {
      return {
        ...state,
        currentAddress: {
          ...state.currentAddress,
          typeOfHousing: action.payload,
        },
      };
      /* const newState = state;
      newState.currentAddress.typeOfHousing = action.payload;
      return newState; */
    }

    case 'set-currentAddress-houseAddress': {
      return {
        ...state,
        currentAddress: {
          ...state.currentAddress,
          houseAddress: action.payload,
        },
      };
      /* const newState = state;
      newState.currentAddress.houseAddress = action.payload;
      return newState; */
    }
    case 'set-currentAddress-neighborhood': {
      return {
        ...state,
        currentAddress: {
          ...state.currentAddress,
          neighborhood: action.payload,
        },
      };
      /* const newState = state;
      newState.currentAddress.neighborhood = action.payload;
      return newState; */
    }
    case 'set-currentAddress-parish': {
      return {
        ...state,
        currentAddress: {
          ...state.currentAddress,
          parish: action.payload,
        },
      };
      /* const newState = state;
      newState.currentAddress.parish = action.payload;
      return newState; */
    }
    case 'set-currentAddress-homePhone': {
      return {
        ...state,
        currentAddress: {
          ...state.currentAddress,
          homePhone: action.payload,
        },
      };
      /* const newState = state;
      newState.currentAddress.homePhone = action.payload;
      return newState; */
    }
    case 'set-currentAddress-cellPhone': {
      return {
        ...state,
        currentAddress: {
          ...state.currentAddress,
          cellPhone: action.payload,
        },
      };
      /* const newState = state;
      newState.currentAddress.cellPhone = action.payload;
      return newState; */
    }
    /* Bank References */
    case 'set-bankReferences-bank': {
      return {
        ...state,
        bankReferences: {
          ...state.bankReferences,
          bank: action.payload,
        },
      };
      /* const newState = state;
      newState.bankReferences.bank = action.payload;
      return newState; */
    }
    case 'set-bankReferences-accountNumber': {
      return {
        ...state,
        bankReferences: {
          ...state.bankReferences,
          accountNumber: action.payload,
        },
      };
      /* const newState = state;
      newState.bankReferences.accountNumber = action.payload;
      return newState; */
    }
    case 'set-bankReferences-accountType': {
      return {
        ...state,
        bankReferences: {
          ...state.bankReferences,
          accountType: action.payload,
        },
      };
      /* const newState = state;
      newState.bankReferences.accountType = action.payload;
      return newState; */
    }
    /* Property */
    case 'set-property': {
      /* const newState = state;
      newState.property.house = action.payload; */
      const newState = {
        ...state,
        property: action.payload,
      };
      //newState.property.house = action.payload;
      return newState;
    }
    case 'set-property-house': {
      /* const newState = state;
      newState.property.house = action.payload; */
      const newState = {
        ...state,
        property: {
          ...state.property,
          house: action.payload,
        },
      };
      //newState.property.house = action.payload;
      return newState;
    }
    case 'set-property-vehicle': {
      /* const newState = state;
      newState.property.vehicle = action.payload; */
      const newState = {
        ...state,
        property: {
          ...state.property,
          vehicle: action.payload,
        },
      };
      return newState;
    }
    case 'set-property-others': {
      const newState = {
        ...state,
        property: {
          ...state.property,
          others: action.payload,
        },
      };
      return newState;
    }
    /* Spouse Data */
    case 'set-spouseData-names': {
      return {
        ...state,
        spouseData: {
          ...state.spouseData,
          names: action.payload,
        },
      };
      /* const newState = state;
      newState.spouseData.names = action.payload;
      return newState; */
    }
    case 'set-spouseData-lastNames': {
      return {
        ...state,
        spouseData: {
          ...state.spouseData,
          lastNames: action.payload,
        },
      };
      /* const newState = state;
      newState.spouseData.lastNames = action.payload;
      return newState; */
    }
    case 'set-spouseData-identification': {
      return {
        ...state,
        spouseData: {
          ...state.spouseData,
          identification: action.payload,
        },
      };
      /* const newState = state;
      newState.spouseData.identification = action.payload;
      return newState; */
    }
    case 'set-spouseData-dateOfBirth': {
      return {
        ...state,
        spouseData: {
          ...state.spouseData,
          dateOfBirth: action.payload,
        },
      };
      /* const newState = state;
      newState.spouseData.dateOfBirth = action.payload;
      return newState; */
    }
    case 'set-spouseData-placeOfBirth': {
      return {
        ...state,
        spouseData: {
          ...state.spouseData,
          placeOfBirth: action.payload,
        },
      };
      /* const newState = state;
      newState.spouseData.placeOfBirth = action.payload;
      return newState; */
    }
    /* Income */
    case 'set-income-monthlySalary': {
      const newState = {
        ...state,
        income: {
          ...state.income,
          monthlySalary: action.payload,
        },
      };
      return newState;
    }
    case 'set-income-otherIncome': {
      const newState = {
        ...state,
        income: {
          ...state.income,
          otherIncome: action.payload,
        },
      };
      return newState;
    }
    case 'set-income-monthlySpouseSalary': {
      const newState = {
        ...state,
        income: {
          ...state.income,
          monthlySpouseSalary: action.payload,
        },
      };
      return newState;
    }
    case 'set-income-otherSpouseIncome': {
      const newState = {
        ...state,
        income: {
          ...state.income,
          otherSpouseIncome: action.payload,
        },
      };
      return newState;
    }
    /* Personal References */
    case 'set-personalReferences-names': {
      return {
        ...state,
        personalReferences: {
          ...state.personalReferences,
          names: action.payload,
        },
      };
      /* const newState = state;
      newState.personalReferences.names = action.payload;
      return newState; */
    }
    case 'set-personalReferences-lastNames': {
      return {
        ...state,
        personalReferences: {
          ...state.personalReferences,
          lastNames: action.payload,
        },
      };

      /* const newState = state;
      newState.personalReferences.lastNames = action.payload;
      return newState; */
    }
    case 'set-personalReferences-relationship': {
      return {
        ...state,
        personalReferences: {
          ...state.personalReferences,
          relationship: action.payload,
        },
      };
      /* const newState = state;
      newState.personalReferences.relationship = action.payload;
      return newState; */
    }
    case 'set-personalReferences-phone': {
      return {
        ...state,
        personalReferences: {
          ...state.personalReferences,
          phone: action.payload,
        },
      };
      /* const newState = state;
      newState.personalReferences.phone = action.payload;
      return newState; */
    }
    /* Passives */
    case 'set-passives': {
      const newState = {
        ...state,
        passives: action.payload,
      };

      return newState;
    }
    case 'set-passives-debtsToPay': {
      const newState = {
        ...state,
        passives: {
          ...state.passives,
          debtsToPay: action.payload,
        },
      };

      return newState;
    }
    case 'set-passives-creditCards': {
      const newState = {
        ...state,
        passives: {
          ...state.passives,
          creditCards: action.payload,
        },
      };

      return newState;
    }
    case 'set-passives-others': {
      const newState = {
        ...state,
        passives: {
          ...state.passives,
          others: action.payload,
        },
      };

      return newState;
    }

    /* Vehicle Data */
    case 'set-vehicleData-model': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          model: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.model = action.payload;
      return newState; */
    }
    case 'set-vehicleData-year': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          year: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.year = action.payload;
      return newState; */
    }
    case 'set-vehicleData-value': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          value: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.value = action.payload;
      return newState; */
    }
    case 'set-vehicleData-plazo': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          plazo: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.plazo = action.payload;
      return newState; */
    }
    case 'set-vehicleData-entrada': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          entrada: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.entrada = action.payload;
      return newState; */
    }
    case 'set-vehicleData-tasa': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          tasa: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.tasa = action.payload;
      return newState; */
    }
    case 'set-vehicleData-financing': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          financing: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.financing = action.payload;
      return newState; */
    }
    case 'set-vehicleData-monthlyPayments': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          monthlyPayments: action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData.monthlyPayments = action.payload;
      return newState; */
    }
    case 'set-vehicleData': {
      return {
        ...state,
        vehicleData: {
          ...state.vehicleData,
          ...action.payload,
        },
      };
      /* const newState = state;
      newState.vehicleData = action.payload;
      return newState; */
    }
    case 'set-initState': {
      const newState = action.payload;
      return newState;
    }

    default:
      throw new Error('Unexpected action');
  }
};

export const GlobalNewCreditContext = createContext<NewCreditContext>({
  store: initState,
  dispatch: (action: string, payload: any) => {
    //console.log('Store');
  },
  documentFile: null,
  setDocumentFile: (file: string) => {},
  financialEntities: [],
  setFinancialEntities: (financialEntities: EntitiesInput[]) => {},
  edit: false,
  setEdit: (value: boolean) => {},
});
