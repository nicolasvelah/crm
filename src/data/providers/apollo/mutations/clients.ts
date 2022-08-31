import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import Client from '../../../models/Client';
import { ConsesionarioSucursal } from '../../../../components/Prospect/FormProspectV2';

export interface ConsesionarioSucursalInput {
  name: string;
  code: string;
}

export interface LeadInsertInput {
  idAgency: string;
  city: string;
  codeUser: string;
  roleUser: string | null,
  sucursal: ConsesionarioSucursalInput;
  concesionario: ConsesionarioSucursalInput;
}

export interface ClientInput {
  id?: number | null;
  name?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  cellphone?: string | null;
  typeIdentification?: string | null;
  chanel?: string | null;
  campaign?: string | null;
  socialRazon?: string | null;
  email?: string | null;
  identification?: string | null;
  isPerson?: boolean | null;
  city?: string | null;
}

export const MUTATION_UPDATE_CLIENT = gql`
  mutation UpdateClient(
    $identification: String!
    $ClientUpdate: ClientUpdateInput!
  ) {
    updateClient(identification: $identification, ClientUpdate: $ClientUpdate)
  }
`;

export const MUTATION_CREATE_CLIENT = gql`
  mutation InsertClient(
    $LeadInsert: LeadInsertInput!
    $ClientInsert: ClientInput!
  ) {
    insertClient(LeadInsert: $LeadInsert, ClientInsert: $ClientInsert)
  }
`;

export default class ClientsMutationProvider {
  insertClient = async (
    LeadInsert: LeadInsertInput,
    ClientInsert: ClientInput
  ): Promise<number> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_CLIENT,
        variables: {
          LeadInsert,
          ClientInsert,
        },
        
      });

      if (errors) return -1;
      return data.insertClient;
    } catch (e) {
      //console.error(e);
      return -1;
    }
  };

  updateClient = async (
    identification: string,
    client: Client
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_CLIENT,
        variables: {
          identification,
          ClientUpdate: client,
        },
  
      });

      if (errors) return false;
      //console.log('updateClient', data);
      return true;
    } catch (e) {
      //console.log(e);
      return false;
    }
  };
}
