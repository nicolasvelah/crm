import { gql } from '@apollo/client';
import apolloClient from '..';

export const MUTATION_CHANGE_AVAILABLE_USER = gql`
  mutation ChangeAvailable($available: Boolean!) {
    changeAvailable(available: $available)
  }
`;

export default class UserMutationProvider {
  changeAvailable = async (available: boolean): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_CHANGE_AVAILABLE_USER,
        variables: {
          available,
        },
      });
      if (errors) return false;
      //console.log('available user', data);
      return true;
    } catch (error) {
      //console.log('Error en changeAvailable', error.message);
      return false;
    }
  };
}
