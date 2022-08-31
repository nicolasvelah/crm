import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';

export interface FinancialEntityInput {
  typeEntity: string;
  nameEntityFinancial: string;
  phoneEntityFinancial: string;
  nameContact: string;
  lastNameContact: string;
  emailcontact: string;
  idSucursal: string;
}

export interface UpdateFinancialEntityInput {
  typeEntity: string;
  nameEntityFinancial: string;
  phoneEntityFinancial: string;
  nameContact: string;
  lastNameContact: string;
  emailcontact: string;
}

export const MUTATION_CREATE_FINANCIAL_ENTITY = gql`
  mutation CreateFinancialEntity(
    $financialEntityInsert: FinancialEntityInput!
  ) {
    createFinancialEntity(financialEntityInsert: $financialEntityInsert)
  }
`;

export const MUTATION_UPDATE_FINANCIAL_ENTITY = gql`
  mutation UpdateFinancialEntity(
    $idFinancial: Int!
    $updatefinancialEntityInsert: UpdateFinancialEntityInput!
  ) {
    updateFinancialEntity(
      idFinancial: $idFinancial
      updatefinancialEntityInsert: $updatefinancialEntityInsert
    )
  }
`;

export const MUTATION_DELETE_FINANCIAL_ENTITY = gql`
  mutation DeleteFinancialEntity($idFinancial: Int!) {
    deleteFinancialEntity(idFinancial: $idFinancial)
  }
`;

export default class FinancialMutationProvider {
  createFinancialEntity = async (
    financialEntityInsert: FinancialEntityInput
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_FINANCIAL_ENTITY,
        variables: {
          financialEntityInsert,
        },
      });

      if (errors) return false;
      //console.log('create', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  updateFinancialEntity = async (
    idFinancial: number,
    updatefinancialEntityInsert: UpdateFinancialEntityInput
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_FINANCIAL_ENTITY,
        variables: {
          idFinancial,
          updatefinancialEntityInsert,
        },
      });

      if (errors) return false;
      //console.log('Update', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  deleteFinancialEntity = async (idFinancial: number): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_DELETE_FINANCIAL_ENTITY,
        variables: {
          idFinancial,
        },
      });

      if (errors) return false;
      //console.log('Delete', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };
}
