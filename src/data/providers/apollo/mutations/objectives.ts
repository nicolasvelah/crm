import { gql } from '@apollo/client';
import apolloClient from '..';
import { Messages } from '../../../models/Messages';
import { GetObjectives, Objectives } from '../../../models/Objectives';

const MUTATION_UPDATE_OBJECTIVE = gql`
  mutation UpdateObjective($idObjective: Int!, $amount: Float!, $units: Int!) {
    updateObjective(idObjective: $idObjective, amount: $amount, units: $units)
  }
`;

export const MUTATION_DELETE_OBJECTIVE = gql`
  mutation DeleteObjective($idObjective: Int!) {
    deleteObjective(idObjective: $idObjective)
  }
`;

export default class ObjectivesMutationProvider {
  updateObjective = async (
    idObjective: number,
    amount: number,
    units: number
  ): Promise<boolean> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_OBJECTIVE,
        variables: {
          idObjective,
          amount,
          units,
        },
      });

      if (errors) {
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error updateObjective', e);
      return false;
    }
  };

  deleteObjective = async (idObjective: number): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_DELETE_OBJECTIVE,
        variables: {
          idObjective,
        },
      });

      if (errors) return false;
      console.log('Delete', data);
      return true;
    } catch (e) {
      console.error('Error deleteObjective', e);
      return false;
    }
  };
}
