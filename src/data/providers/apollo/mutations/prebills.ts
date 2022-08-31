import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import { OtherConcept, PrebillNote } from '../../../models/PreBill';

export interface VehiclePrebillInput {
  name: string;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  color: string;
  chassis: string;
  motor: string;
  cilindraje?: string;
  clase?: string;
  ramv?: string;
  ubicacionfisica?: string;
  origen?: string;
  tipo?: string;
  urlPhoto?: string;
  valorunidad?: number;
  descuentoporcentaje?: number;
  descuentovalor?: number;
  cantidad?: number;
  subtotal?: number;
  iva?: number;
  total?: number;
}

export interface PrebillInput {
  payThirdPerson: boolean; // tercera persona
  descuento: number;
  notes: PrebillNote[];
}

export interface RequestAgainPrebillInput {
  idPrebill: number;
  descuento: number;
  payThirdPerson: boolean | null;
  note: PrebillNote;
}

const MUTATION_CREATE_PRE_BILL = gql`
  mutation CreateePrebill($idLead: Int!, $prebillInput: PrebillInput!) {
    createPrebill(idLead: $idLead, prebillInsert: $prebillInput)
  }
`;

const MUTATION_ACCEPT_OR_DECLINE = gql`
  mutation AcceptOrDeclinePrebill(
    $id: Int!
    $accepted: Boolean!
    $note: NoteInput!
    $idsQuotes: [Int!]
  ) {
    acceptOrDeclinePrebill(id: $id, accepted: $accepted, note: $note, idsQuotes: $idsQuotes)
  }
`;

const MUTATION_UPDATE_PREBILL_CREATED = gql`
  mutation UpdatePrebillCreated(
    $idPrebill: Int!
    $descuento: Float
    $note: NoteInput
    $payThirdPerson: Boolean
  ) {
    updatePrebillCreated(
      idPrebill: $idPrebill,
      descuento: $descuento,
      note: $note,
      payThirdPerson: $payThirdPerson
    )
  }
`;
export default class PreBillsMutationProvider {
  create = async (
    idLead: number,
    prebillInput: PrebillInput
  ): Promise<boolean> => {
    try {
      //console.log('prebillInput', JSON.stringify(prebillInput, null, 2));
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_PRE_BILL,
        variables: {
          idLead,
          prebillInput,
        },
      });

      if (errors) {
        return false;
      }
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  acceptOrDeclinePrebill = async (variables: {
    id: number;
    accepted: boolean;
    note: any;
    idsQuotes: number[] | null;
  }): Promise<boolean> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_ACCEPT_OR_DECLINE,
        variables,
      });
      if (errors) {
        return false;
      }
      //console.log(data);
      return true;
    } catch (e) {
      return false;
    }
  };

  updatePrebillCreated = async (
    variables: RequestAgainPrebillInput
  ): Promise<boolean> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_PREBILL_CREATED,
        variables,
      });
      if (errors) {
        return false;
      }
      //console.log(data);
      return true;
    } catch (e) {
      //console.log(e);
      return false;
    }
  };
}
