import { gql } from '@apollo/client';
import Financial from '../../../models/Financial';
import apolloClient from '..';

const QUERY_GET_FINANCIAL_BY_SUCURSAL = gql`
  query GetFinancialsBySucursal($idSucursal: String!, $typeFinancial: String!) {
    getFinancialsBySucursal(
      idSucursal: $idSucursal
      typeFinancial: $typeFinancial
    ) {
      id
      typeEntity
      nameEntityFinancial
      phoneEntityFinancial
      nameContact
      lastNameContact
      emailcontact
      idSucursal
    }
  }
`;

const QUERY_ALL_GET_FINANCIAL = gql`
  query GetAllFinancials($id: Int!) {
    getAllFinancials (id: $id){
      id
      typeEntity
      nameEntityFinancial
      phoneEntityFinancial
      nameContact
      lastNameContact
      emailcontact
      idSucursal
      updateAt
      createdAt
    }
  }
`;

export default class FinancialQueryProvider {
  getFinancialsBySucursal = async (
    idSucursal: string,
    typeFinancial: string
  ): Promise<Financial[] | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_FINANCIAL_BY_SUCURSAL,
        variables: {
          idSucursal,
          typeFinancial,
        },
      });

      if (error || errors) {
        return null;
      }
      return data.getFinancialsBySucursal;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };
  getAllFinancials = async (id: number): Promise<Financial[] | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_ALL_GET_FINANCIAL,
        variables: {
          id,
        },
      });

      if (error || errors) {
        return null;
      }
      return data.getAllFinancials;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };
}
