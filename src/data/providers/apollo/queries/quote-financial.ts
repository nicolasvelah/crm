import { gql } from '@apollo/client';
import apolloClient from '..';
import QuoteFinancial from '../../../models/Quoute-Financial';
import Financial from '../../../models/Financial';

export const QUERY_GET_CREDITS_APPLICATIONS = gql`
  {
    getCreditsApplications {
      id
      selected
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
      quoutes {
        id
        leads {
          id
          client {
            name
            lastName
          }
          user {
            nombre
            apellido
            typeConcessionaire {
              code
              type
            }
          }
        }
      }
    }
  }
`;

const GET_CREDIT_APPLICATION_BY_ID = gql`
  query GetCreditsApplicationsById($id: Int!) {
    getCreditsApplicationsById(id: $id) {
      id
      selected
      responseBank
      financial {
        nameEntityFinancial
        phoneEntityFinancial
        nameContact
        lastNameContact
        emailcontact
        idSucursal
      }
    }
  }
`;

export default class QuotesFinancialQueryProvider {
  getCreditsApplications = async (): Promise<QuoteFinancial[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CREDITS_APPLICATIONS,
      });
      if (error || errors) return null;
      return data.getCreditsApplications;
    } catch (error) {
      //console.log('Error getCreditsApplications', error.message);
      return null;
    }
  };

  getCreditsApplicationsById = async (
    id: number
  ): Promise<QuoteFinancial | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: GET_CREDIT_APPLICATION_BY_ID,
        variables: {
          id,
        },
      });
      if (error || errors) return null;
      return data.getCreditsApplicationsById;
    } catch (error) {
      //console.log('Error getCreditsApplicationsById', error.message);
      return null;
    }
  };
}
