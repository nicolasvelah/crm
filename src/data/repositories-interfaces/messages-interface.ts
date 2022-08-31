import { Messages } from '../models/Messages';

export default interface MessagesRepositoryInterface {
  notifyToEmployee(
    users: number[],
    message: string,
    affair: string
  ): Promise<boolean>;
  getMessagesForUser(firstDate: string, secondDate: string): Promise<Messages[] | null>;
  updateMessages(id: number, userId: number): Promise<boolean>;
}
