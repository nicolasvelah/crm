import { gql } from '@apollo/client';
import apolloClient from '..';
import { Messages } from '../../../models/Messages';

export const QUERY_MESSAGES_FOR_USER = gql`
  query GetMessagesForUser ($firstDate: String!, $secondDate: String!) {
    getMessagesForUser (firstDate: $firstDate, secondDate: $secondDate) {
      id
      sender {
        idSender
        nameSender
      }
      receiver {
        nameReceiver
      }
      message
      affair
      createdAt
    }
  }
`;

export default class MessagesQueryProvider {
  getMessagesForUser = async (
    firstDate: string,
    secondDate: string
  ): Promise<Messages[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_MESSAGES_FOR_USER,
        variables: {
          firstDate,
          secondDate
        }
      });
      if (error || errors) return null;
      return data.getMessagesForUser;
    } catch (error) {
      //console.log('Error getMessagesForUser', error.message);
      return null;
    }
  };
}
