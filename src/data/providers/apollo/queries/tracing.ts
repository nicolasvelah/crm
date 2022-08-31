import { gql } from '@apollo/client';
import apolloClient from '..';
import Tracings from '../../../models/Tracings';

export const QUERY_GET_TRACINGS_OF_DAY = gql`
  query GetTracingsOfDay($firstDate: String!, $secondDate: String!) {
    getTracingsOfDay(firstDate: $firstDate, secondDate: $secondDate) {
      id
      type
      motive
      priority
      executionDate
      closeDate
      openingNote
      closeNote
      updateAt
      createdAt
      client {
        id
        name
        lastName
        phone
        cellphone
        socialRazon
        email
        typeIdentification
        identification
        chanel
        campaign
        city
        leads {
          id
        }
      }
      user {
        id
        nombre
        apellido
        role
      }
      leads {
        id
      }
    }
  }
`;

export const QUERY_GET_TRACINGS_BY_DATES = gql`
  query GetTracingsByDates(
    $firstDate: String!
    $secondDate: String!
    $value: String
  ) {
    getTracingsByDates(
      firstDate: $firstDate
      secondDate: $secondDate
      value: $value
    ) {
      id
      type
      motive
      priority
      executionDate
      closeDate
      openingNote
      closeNote
      updateAt
      createdAt
      client {
        id
        name
        lastName
        phone
        cellphone
        socialRazon
        email
        typeIdentification
        identification
        chanel
        campaign
        city
      }
      user {
        id
        nombre
        apellido
        role
      }
      leads {
        id
      }
      linksOffice365 {
        link
      }
    }
  }
`;

export const GET_TRACINGS_BY_ID = gql`
  query GetTracingsById($id: Int!) {
    getTracingsById(id: $id) {
      id
      type
      motive
      priority
      executionDate
      closeDate
      openingNote
      closeNote
      updateAt
      createdAt
      client {
        id
        name
        lastName
        phone
        cellphone
        socialRazon
        email
        typeIdentification
        identification
        chanel
        campaign
        city
      }
      leads {
        id
      }
      user {
        id
        nombre
        apellido
        role
      }
      linkVchat
      linksOffice365 {
        link
      }
    }
  }
`;

export const QUERY_GET_TRACINGS_BY_USER_AND_CLIENT = gql`
  query GetTracingsByUserAndClient($identification: String!, $idLead: Int) {
    getTracingsByUserAndClient(
      identification: $identification
      idLead: $idLead
    ) {
      id
      type
      motive
      priority
      executionDate
      closeDate
      openingNote
      closeNote
      updateAt
      createdAt
      client {
        id
        name
        lastName
        phone
        cellphone
        socialRazon
        email
        typeIdentification
        identification
        chanel
        campaign
        city
      }
      user {
        id
        nombre
        apellido
        role
      }
    }
  }
`;

export default class TracingsProvider {
  getTracingsByUserAndClient = async (
    identification: string,
    idLead?: number
  ): Promise<Tracings[] | null> => {
    try {
      const { data, errors } = await apolloClient.query({
        query: QUERY_GET_TRACINGS_BY_USER_AND_CLIENT,
        variables: {
          identification,
          idLead: typeof idLead === 'number' ? idLead : null,
        },
      });
      if (errors) return null;
      return data.getTracingsByUserAndClient;
    } catch (error) {
      //console.log('Error getTracingsByUserAndClient', error.message);
      return null;
    }
  };

  getTracingsOfDay = async (
    firstDate: string,
    secondDate: string
  ): Promise<Tracings[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_TRACINGS_OF_DAY,
        variables: { firstDate, secondDate },
      });
      if (error || errors) return null;
      return data.getTracingsOfDay;
    } catch (error) {
      //console.log('Error getTracingsOfDay', error.message);
      return null;
    }
  };

  getTracingsByDates = async (
    firstDate: string,
    secondDate: string,
    value: string | null
  ): Promise<Tracings[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_TRACINGS_BY_DATES,
        variables: { firstDate, secondDate, value },
      });
      if (error || errors) return null;
      return data.getTracingsByDates;
    } catch (error) {
      //console.log('Error getTracingsByDate', error.message);
      return null;
    }
  };

  getTracingsById = async (id: number): Promise<Tracings | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_TRACINGS_BY_ID,
        variables: { id },
      });
      if (error) return null;
      return data.getTracingsById;
    } catch (error) {
      //console.log('Error getTracingsById', error.message);
      return null;
    }
  };
}
