import User from '../models/User';

export default interface UserRepositoryInterface {
  getUsersForMessages(): Promise<User[] | null>;
  getUserByLead(idLead: number): Promise<User | null>;
  getEmployeesByIdBoss(idInput: number): Promise<User[] | null>;
  getEmployeesByBoss(): Promise<User[] | null>;
  changeAvailable(available: boolean): Promise<boolean>;
  getBossesFromUser (): Promise<User[] | null>;
}
