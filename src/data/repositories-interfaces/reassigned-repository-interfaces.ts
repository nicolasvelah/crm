import { UserReassignedInput } from '../providers/apollo/mutations/reassigned';

export default interface ReassignedRepositoryInterface {
  createReassigned(
    previousUser: UserReassignedInput,
    reason: string,
    newUser: UserReassignedInput,
    idsLeads: number[]
  ): Promise<boolean>;
}
