import { gql } from '@apollo/client';
import apolloClient from '..';

const MUTATION_NOTIFY_EMPLOYEES = gql`
  mutation notifyToEmployee(
    $users: [Int!]!
    $message: String!
    $affair: String!
  ) {
    notifyToEmployee(users: $users, message: $message, affair: $affair)
  }
`;

const MUTATION_UPDATE_MESSAGES = gql`
  mutation UpdateMessages($id: Int!, $userId: Int!) {
    updateMessages(id: $id, userId: $userId)
  }
`;

export default class MessagesMutationProvider {
  notifyToEmployee = async (
    users: number[],
    message: string,
    affair: string
  ): Promise<boolean> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_NOTIFY_EMPLOYEES,
        variables: {
          users,
          message,
          affair,
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

  updateMessages = async (id: number, userId: number): Promise<boolean> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_MESSAGES,
        variables: {
          id,
          userId,
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
}
