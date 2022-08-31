import ReassignedMutationProvider, {
  UserReassignedInput,
} from '../providers/apollo/mutations/reassigned';
import ReassignedRepositoryInterface from '../repositories-interfaces/reassigned-repository-interfaces';

export default class ReassignedRepository
  implements ReassignedRepositoryInterface {
  reassignedMutationProvider: ReassignedMutationProvider;

  constructor(reassignedMutationProvider: ReassignedMutationProvider) {
    this.reassignedMutationProvider = reassignedMutationProvider;
  }
  createReassigned(
    previousUser: UserReassignedInput,
    reason: string,
    newUser: UserReassignedInput,
    idsLeads: number[]
  ): Promise<boolean> {
    return this.reassignedMutationProvider.createReassigned(
      previousUser,
      reason,
      newUser,
      idsLeads
    );
  }
}
