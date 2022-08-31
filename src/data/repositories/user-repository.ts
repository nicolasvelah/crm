import User from '../models/User';
import UserQueryProvider from '../providers/apollo/queries/user';
import UserRepositoryInterface from '../repositories-interfaces/user-repository-interface';
import UserMutationProvider from '../providers/apollo/mutations/user';

export default class UserRepository implements UserRepositoryInterface {
  userQueryProvider: UserQueryProvider;
  userMutationProvider: UserMutationProvider;

  constructor(
    userQueryProvider: UserQueryProvider,
    userMutationProvider: UserMutationProvider
  ) {
    this.userQueryProvider = userQueryProvider;
    this.userMutationProvider = userMutationProvider;
  }
  getUserByLead(idLead: number): Promise<User | null> {
    return this.userQueryProvider.getUserByLead(idLead);
  }

  getUsersForMessages(): Promise<User[] | null> {
    return this.userQueryProvider.getUsersForMessages();
  }

  getEmployeesByIdBoss(idInput: number): Promise<User[] | null> {
    return this.userQueryProvider.getEmployeesByIdBoss(idInput);
  }

  getEmployeesByBoss(): Promise<User[] | null> {
    return this.userQueryProvider.getEmployeesByBoss();
  }
  getEmployeesByConcesionaire(): Promise<User[] | null> {
    return this.userQueryProvider.getEmployeesByConcesionaire();
  }

  changeAvailable(available: boolean): Promise<boolean> {
    return this.userMutationProvider.changeAvailable(available);
  }

  getBossesFromUser(): Promise<User[] | null> {
    return this.userQueryProvider.getBossesFromUser();
  }
}
