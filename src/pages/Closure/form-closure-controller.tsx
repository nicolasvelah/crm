type TypeActions = 'init-data';
interface ActionReducer {
  type: TypeActions;
  value: any;
}

export interface InitDataClosure {
  acceptedAppraisal: boolean | null;
  discount: number | null | undefined;
  pvp: string | null | undefined;
  exonerated: string | null | undefined;
  exoneratedType: string | null | undefined;
  exoneratedPercentage: string | null | undefined;
  payType: string | null | undefined;
  inputAmount: string | null | undefined;
  valueToFinance: string | null | undefined;
  creditMonths: number | null | undefined;
  quoteAmount: string | null | undefined;
  insuranceName: string | null | undefined;
  insuranceMonthlyPayment: string | null | undefined;
  insuranceYears: string | null | undefined;
  insuranceCost: string | null | undefined;
  carAsPayFrom: boolean | null;
  carAsPayFromBrand: string | null | undefined;
  carAsPayFromModel: string | null | undefined;
  carAsPayFromYear: string | null | undefined;
  carAsPayFromKm: string | null | undefined;
  carAsPayFromDesiredPrice: string | null | undefined;
  bussinessName: string | null | undefined;
  identification: string | null | undefined;
  email: string | null | undefined;
  phone: string | null | undefined;
  appraisalValue: number | null | undefined;
  registrationValue: string | null | undefined;
  totalValue: string | null | undefined;
  payThirdPerson: boolean | null | undefined;
  entity: string | null | undefined;
}

export const initState: InitDataClosure = {
  acceptedAppraisal: null,
  discount: null,
  pvp: null,
  exonerated: null,
  exoneratedType: null,
  exoneratedPercentage: null,
  payType: null,
  inputAmount: null,
  valueToFinance: null,
  creditMonths: null,
  quoteAmount: null,
  insuranceName: null,
  insuranceMonthlyPayment: null,
  insuranceYears: null,
  insuranceCost: null,
  carAsPayFrom: null,
  carAsPayFromBrand: null,
  carAsPayFromModel: null,
  carAsPayFromYear: null,
  carAsPayFromKm: null,
  carAsPayFromDesiredPrice: null,
  bussinessName: null,
  identification: null,
  email: null,
  phone: null,
  appraisalValue: null,
  registrationValue: null,
  totalValue: null,
  payThirdPerson: null,
  entity: null,
};

export const reducer = (state = initState, action: ActionReducer) => {
  switch (action.type) {
    case 'init-data':
      //console.log('REDUCER STORE', action.value);
      return action.value;

    default:
      throw new Error();
  }
};
