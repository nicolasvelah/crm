import { gql } from '@apollo/client';
import apolloClient from '..';
import User from '../../../models/User';

export interface UserReassignedInput {
  id?: number;
  codUsuario?: string;
  nombre?: string;
  apellido?: string;
}

export const MUTATION_CREATE_REASSIGNED = gql`
  mutation CreateReassigned(
    $previousUser: UserReassignedInput!
    $reason: String!
    $newUser: UserReassignedInput!
    $idsLeads: [Int!]!
  ) {
    createReassigned(
      previousUser: $previousUser
      reason: $reason
      newUser: $newUser
      idsLeads: $idsLeads
    )
  }
`;

export default class ReassignedMutationProvider {
  createReassigned = async (
    previousUser: UserReassignedInput,
    reason: string,
    newUser: UserReassignedInput,
    idsLeads: number[]
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_REASSIGNED,
        variables: {
          previousUser,
          reason,
          newUser,
          idsLeads,
        },
      });

      if (errors) return false;
      //console.log('createReassigned', data);
      return true;
    } catch (e) {
      //console.log('Error createReassigned', e.message);
      return false;
    }
  };
}
