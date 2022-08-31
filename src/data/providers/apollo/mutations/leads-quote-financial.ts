import { gql } from '@apollo/client';
import apolloClient from '..';
import LeadsQuoteFinancial from '../../../models/LeadsQuoteFinancial';

export const MUTATION_CREATE_LEAD_QUOTEFINANCIAL = gql`
  mutation CreateLeadQuoteFinancial($idLead: Int!, $quotes: [Int!]!) {
    createLeadQuoteFinancial(idLead: $idLead, quotes: $quotes){
      id
      observationsFyI
      documents
      sendToFyI
      updateAt
      createdAt
      quotes {
        id
      }
      quoteFinancial {
        id
        responseBank
        selected
        opinion
        withFile
        updateAt
        createdAt
        financial{
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
    }
  }
`;

export default class LeadQuoteFinancialMutationProvider {
  createLeadQuoteFinancial = async (
    idLead: number,
    quotes: number[]
  ): Promise<LeadsQuoteFinancial | null> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_LEAD_QUOTEFINANCIAL,
        variables: { idLead, quotes },
      });
      if (errors) return null;
      return data.createLeadQuoteFinancial;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };
}
