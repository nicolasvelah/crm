import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import Quotes from '../../../models/Quotes';

export interface Links {
  link: string;
}

export interface ColorVehicle {
  color: string;

  id: number;

  stock: number;

  urlPhoto: Links[];
}

export interface Vehicle {
  cantidad: number;

  code: string;

  brand: string;

  model: string;

  idModel: string;

  year: number;

  cost: number;

  pvp: number;

  description: string;

  cylinder: number;

  numPassengers: number;

  doors: number;

  fuel: string;

  stock: number;

  margen: number;

  imgs: string;

  pdf: Links[];

  color: ColorVehicle[];
}

export interface QuotesInput {
  vehiculo: Vehicle[];
  type: string;
  exonerated?: any | null;
  idAccesories?: any[] | null;
  accesoriesValue?: number | null; //Valor de accesorios
  services?: any[] | null;
  servicesValue?: number | null;
  inputAmount?: number | null; //Valor de la entrada
  rate?: number | null; //Porcentaje de tasa
  device?: any | null;
  registration: number | null; //Matricula
  observations: string | null; //Matricula
  months?: number | null;
  monthly?: number | null; //Cuota mensual con accesorios
  insuranceCarrier?: any | null; //Aseguradora
  mechanicalAppraisalQuote?: any | null;
}

export interface QuotePreOwnedUpdateInput {
  bussinessName: string | null;
  identification: string | null;
  phone: string | null;
  email: string | null;
  appraisalValue: number | null;
}

export interface QuotePreOwnedInput {
  preOwnedSupplier: QuotePreOwnedUpdateInput | null;
  acceptedAppraisal: boolean | null;
}

export interface ChosenEntityInput {
  type: string;
  entity: string;
  idEntity: number;
}
export interface QuoteUpdateInput {
  bussinessName?: string;
  identification?: string;
  phone?: string;
  email?: string;
  appraisalValue?: number | null;
  acceptedAppraisal?: boolean | null;
  discount: number;
  closed?: boolean | null;
  chosenEntity: ChosenEntityInput;
  payThirdPerson: boolean; // tercera persona
  accesories?: any[];
  services?: any[];
}

interface urlPhotoInput {
  link: string | null;
}

export interface AccesoriesInput {
  code: string | null;
  name: string | null;
  cost: number | null;
  dimension: string | null;
  id: string | null;
  id_Vh: string | null;
  brand: string | null;
  model: string | null;
  urlPhoto: urlPhotoInput[] | null;
  quantity: number | null;
}

export const MUTATION_CREATE_QUOTE = gql`
  mutation CreateQuote($quoteInsert: QuotesInput!, $idLead: Int!) {
    createQuote(quoteInsert: $quoteInsert, idLead: $idLead) {
      vimVehiculo
      id
      vehiculo {
        cantidad
        code
        brand
        model
        idModel
        year
        cost
        pvp
        description
        cylinder
        numPassengers
        doors
        fuel
        stock
        margen
        imgs
        pdf {
          link
        }
        color {
          color
          id
          stock
          urlPhoto {
            link
          }
        }
      }
      type
      idAccesories {
        code
        name
        cost
        dimension
        id
        id_Vh
        brand
        model
        urlPhoto {
          link
        }
        quantity
        es_kit
      }
      accesoriesValue
      services {
        nombre
        items {
          codigo
          descripcion
          exonerado
          forma_pago
          iva
          marcas
          total
          valor
        }
      }
      servicesValue
      inputAmount
      rate
      device {
        cost
        years
      }
      registration
      months
      monthly
      closed
      documentCredit
      mechanicalAppraisalQuote {
        brand
        model
        year
        mileage
        desiredPrice
      }
      insuranceCarrier {
        name
        cost
        years
        monthlyPayment
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }
      quoteFinancial {
        id
        responseBank
        createdAt
        financial {
          nameEntityFinancial
          phoneEntityFinancial
          nameContact
          lastNameContact
          emailcontact
          idSucursal
        }
      }
      vimVehiculo
      discount
      vimVehiculo
    }
  }
`;

export const MUTATION_SAVE_DOCUMENT = gql`
  mutation SaveDocument($document: String!, $id: Int!, $isFleet: Boolean) {
    saveDocument(id: $id, document: $document, isFleet: $isFleet)
  }
`;

export const MUTATION_SEND_TO_FYI = gql`
  mutation SendToFyI($id: Int!, $isFleet: Boolean) {
    sendToFyI(id: $id, isFleet: $isFleet)
  }
`;

export const MUTATION_SELECT_QUOTE_FOR_CLOUSURE = gql`
  mutation SelectQuoteForClousure($idLead: Int!, $idQuoute: Int!) {
    selectQuoteForClousure(idLead: $idLead, idQuoute: $idQuoute)
  }
`;

export const MUTATION_DELETE_QUOTE_FOR_CLOUSURE = gql`
  mutation DeleteQuoteForClousure($idLead: Int!, $idQuoute: Int!) {
    deleteQuoteForClousure(idLead: $idLead, idQuoute: $idQuoute)
  }
`;

export const MUTATION_UPDATE_QUOTE = gql`
  mutation UpdateQuote($id: Int!, $quoteUpdate: QuoteUpdateInput!) {
    updateQuote(id: $id, quoteUpdate: $quoteUpdate)
  }
`;

export const MUTATION_UPDATE_QUOTE_APPRAISAL = gql`
  mutation UpdateQuoteAppraisal($id: Int!, $quoteUpdate: QuotePreOwnedInput!) {
    updateQuoteAppraisal(id: $id, quoteUpdate: $quoteUpdate)
  }
`;

export const MUTATION_UPDATE_ACCESORIES_BY_IDQUOTE = gql`
  mutation UpdateAccesoriesByIdQuote(
    $idQuote: Int!
    $accesories: [AccesoriesInput!]!
  ) {
    updateAccesoriesByIdQuote(idQuote: $idQuote, accesories: $accesories)
  }
`;

export const MUTATION_UPDATE_SERVICES_BY_IDQUOTE = gql`
  mutation UpdateServicesByIdQuote(
    $idQuote: Int!
    $services: [ServicesInput!]!
  ) {
    updateServicesByIdQuote(idQuote: $idQuote, services: $services)
  }
`;

export const MUTATION_UPDATE_QUOTE_RESERVE_VALUE = gql`
  mutation updateQuoteReserveValue($id: Int!, $reservationvalue: Int!) {
    updateQuoteReserveValue(id: $id, reservationvalue: $reservationvalue)
  }
`;

export const MUTATION_UPDATE_QUOTE_REGISTER_VALUE = gql`
  mutation updateQuoteRegisterValue($id: Int!, $registrationvalue: Int!) {
    updateQuoteRegisterValue(id: $id, registrationvalue: $registrationvalue)
  }
`;

export const MUTATION_UPDATE_QUOTE_DISCOUNT = gql`
  mutation updateQuoteDiscount($id: Int!, $discount: Int!) {
    updateQuoteDiscount(id: $id, discount: $discount)
  }
`;

export const MUTATION_UPDATE_CHOSEN_ENTITY_BY_IDQUOTE = gql`
  mutation UpdateChosenEntityByIdQuote(
    $idQuote: Int!
    $chosenEntityInput: ChosenEntityInput!
  ) {
    updateChosenEntityByIdQuote(
      idQuote: $idQuote
      chosenEntityInput: $chosenEntityInput
    )
  }
`;

export const MUTATION_UPDATE_VERIFY_VINS = gql`
  mutation VerifyVINs($idsQuote: [Int!]!) {
    verifyVINs(idsQuote: $idsQuote) {
      idQuote
      changed
      message
      vin
    }
  }
`;

export default class QuotesMutationProvider {
  createQuote = async (
    quoteInsert: QuotesInput,
    idLead: number
  ): Promise<Quotes | null> => {
    try {
      //console.log('-------++++++++++++++++++++++++++');
      /*
      if (!context) return {}; */
      //console.log('context');
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_QUOTE,
        variables: {
          quoteInsert,
          idLead,
        },
        //
      });
      //console.log('createQuote', data);
      if (errors) return null;
      return data.createQuote;
    } catch (e) {
      //console.error('Error', e.message);
      return null;
    }
  };

  saveDocument = async (
    document: string,
    id: number,
    isFleet?: boolean
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_SAVE_DOCUMENT,
        variables: {
          id,
          document,
          isFleet
        },
      });

      if (errors) return false;
      //console.log('save document', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  sendToFyI = async (
    id: number,
    isFleet?: boolean
  ): Promise<{ ok: boolean; message: string }> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_SEND_TO_FYI,
        variables: {
          id,
          isFleet
        },
      });

      if (errors) return { ok: false, message: errors[0].message };
      //console.log('sendoToFyI document', data);
      return { ok: true, message: 'ok' };
    } catch (e) {
      //console.error('Error en sendToFyI', e.message);
      return { ok: false, message: e.message };
    }
  };

  selectQuoteForClousure = async (
    idLead: number,
    idQuoute: number
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_SELECT_QUOTE_FOR_CLOUSURE,
        variables: {
          idQuoute,
          idLead,
        },
      });

      if (errors) return false;
      //console.log('Select Clousure', data);
      return true;
    } catch (e) {
      //console.error('Error en selectQuoteForClousure', e.message);
      return false;
    }
  };

  deleteQuoteForClousure = async (
    idLead: number,
    idQuoute: number
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_DELETE_QUOTE_FOR_CLOUSURE,
        variables: {
          idQuoute,
          idLead,
        },
      });

      if (errors) return false;
      //console.log('Select Clousure', data);
      return true;
    } catch (e) {
      //console.error('Error en selectQuoteForClousure', e.message);
      return false;
    }
  };

  updateQuote = async (
    id: number,
    quoteUpdate: QuoteUpdateInput
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_QUOTE,
        variables: {
          id,
          quoteUpdate,
        },
      });

      if (errors) return false;
      //console.log('updateQuote Clousure', data);
      return true;
    } catch (e) {
      //console.error('Error en updateQuote', e.message);
      return false;
    }
  };

  updateQuoteAppraisal = async (
    id: number,
    quoteUpdate: QuotePreOwnedInput
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_QUOTE_APPRAISAL,
        variables: {
          id,
          quoteUpdate,
        },
      });

      if (errors) return false;
      //console.log('updateQuoteAppraisal', data);
      return true;
    } catch (e) {
      //console.error('Error en updateQuoteAppraisal', e.message);
      return false;
    }
  };

  updateAccesoriesByIdQuote = async (
    idQuote: number,
    accesories: AccesoriesInput[]
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_ACCESORIES_BY_IDQUOTE,
        variables: {
          idQuote,
          accesories,
        },
      });

      if (errors) return false;

      //console.log('updateAccesoriesByIdQuote', data);
      return true;
    } catch (e) {
      //console.error('Error en updateAccesoriesByIdQuote', e.message);

      return false;
    }
  };

  updateServicesByIdQuote = async (
    idQuote: number,
    services: any[]
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_SERVICES_BY_IDQUOTE,
        variables: {
          idQuote,
          services,
        },
      });

      if (errors) return false;

      //console.log('updateServicesByIdQuote', data);
      return true;
    } catch (e) {
      //console.error('Error en updateServicesByIdQuote', e.message);

      return false;
    }
  };

  updateQuoteReserveValue = async (
    id: number,
    reservationvalue: number
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_QUOTE_RESERVE_VALUE,
        variables: {
          id,
          reservationvalue,
        },
      });
      if (errors) return false;
      //console.log('updateQuoteReserveValue', data);
      return true;
    } catch (e) {
      //console.error('updateQuoteReserveValue', e.message);
      return false;
    }
  };

  updateQuoteRegisterValue = async (
    id: number,
    registrationvalue: number
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_QUOTE_REGISTER_VALUE,
        variables: {
          id,
          registrationvalue,
        },
      });
      if (errors) return false;
      //console.log('updateQuoteRegisterValue', data);
      return true;
    } catch (e) {
      //console.error('updateQuoteRegisterValue', e.message);
      return false;
    }
  };

  updateQuoteDiscount = async (
    id: number,
    discount: number
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_QUOTE_DISCOUNT,
        variables: {
          id,
          discount,
        },
      });
      if (errors) return false;
      //console.log('updateQuoteDiscount', data);
      return true;
    } catch (e) {
      //console.error('updateQuoteDiscount', e.message);
      return false;
    }
  };

  updateChosenEntityByIdQuote = async (
    idQuote: number,
    chosenEntityInput: ChosenEntityInput
  ) => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_CHOSEN_ENTITY_BY_IDQUOTE,
        variables: {
          idQuote,
          chosenEntityInput,
        },
      });
      if (errors) return false;
      //console.log('updateChosenEntityByIdQuote', data);
      return true;
    } catch (error) {
      //console.log('Error en updateChosenEntityByIdQuote:', error.message);
      return false;
    }
  };

  verifyVINs = async (idsQuote: number[]) => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_VERIFY_VINS,
        variables: {
          idsQuote,
        },
      });
      if (errors) return null;
      //console.log('verifyVINs', data.verifyVINs);
      return data.verifyVINs;
    } catch (error) {
      //console.log('Error en verifyVINs:', error.message);
      return null;
    }
  };
}
