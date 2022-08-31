import { gql } from '@apollo/client';
import apolloClient from '..';
import { ClientInput } from './clients';
import { DocumentsVerifyInput } from './delivery';
import { PrebillInput, VehiclePrebillInput } from './prebills';

export interface ClientWalletInput {
  name?: string | null;
  lastName?: string | null;
  phone?: string | null;
  cellphone?: string | null;
  typeIdentification?: string | null;
  chanel?: string | null;
  campaign?: string | null;
  socialRazon?: string | null;
  email?: string | null;
  identification?: string | null;
}

export interface ValuesWalletInput {
  valortotalvehiculos?: number; //number
  valortotalseguro?: number; //number
  valortotaldeposito: number;
  valortotalaccesorios?: number;
  valortotalmantenimientos?: number;
  valortotalotros?: number;
  valortotal: number;
  margen?: number; //ganancia - number
  descuento?: number; //number
  margenfinalvalor?: number; //porcenaje valor
  margenfinalporcentaje?: number;
}

export interface IdsWalletInput {
  idLead: number; //number
  idPrebill: number; //number
}

export const MUTATION_CREATE_WALLET = gql`
  mutation CreateWallet(
    $client: ClientWalletInput!
    $values: ValuesWalletInput!
    $vehicles: [VehiculosInput!]!
    $invoices: [DocumentsVerifyInput!]!
    $ids: IdsWalletInput!
  ) {
    createWallet(
      client: $client
      values: $values
      vehicles: $vehicles
      invoices: $invoices
      ids: $ids
    )
  }
`;

export const MUTATION_AUTHORIZE_OR_DENY = gql`
  mutation AuthorizeOrDeny($id: Int!, $answer: Boolean!) {
    authorizeOrDeny(id: $id, answer: $answer)
  }
`;

export default class WalletMutationProvider {
  createWallet = async (
    client: ClientWalletInput,
    values: ValuesWalletInput,
    vehicles: VehiclePrebillInput[],
    invoices: DocumentsVerifyInput[],
    ids: IdsWalletInput
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_WALLET,
        variables: {
          client,
          values,
          vehicles,
          invoices,
          ids,
        },
      });

      if (errors) return false;
      //console.log('createWallet', data);
      return true;
    } catch (e) {
      //console.log('createWallet', e.message);
      return false;
    }
  };

  authorizeOrDeny = async (id: number, answer: boolean): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_AUTHORIZE_OR_DENY,
        variables: {
          id,
          answer,
        },
      });

      if (errors) return false;
      //console.log('authorizeOrDeny', data);
      return true;
    } catch (e) {
      //console.log('authorizeOrDeny', e.message);
      return false;
    }
  };
}
