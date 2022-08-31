import { Messages } from '../models/Messages';
import MessagesMutationProvider from '../providers/apollo/mutations/messages';
import MessagesQueryProvider from '../providers/apollo/queries/messages';
import MessagesRepositoryInterface from '../repositories-interfaces/messages-interface';

export default class MessagesRepository implements MessagesRepositoryInterface {
  messagesQueryProvider: MessagesQueryProvider;
  messagesMutationProvider: MessagesMutationProvider;

  constructor(
    messagesQueryProvider: MessagesQueryProvider,
    messagesMutationProvider: MessagesMutationProvider
  ) {
    this.messagesQueryProvider = messagesQueryProvider;
    this.messagesMutationProvider = messagesMutationProvider;
  }

  notifyToEmployee(
    users: number[],
    message: string,
    affair: string
  ): Promise<boolean> {
    return this.messagesMutationProvider.notifyToEmployee(
      users,
      message,
      affair
    );
  }

  getMessagesForUser(
    firstDate: string,
    secondDate: string
  ): Promise<Messages[] | null> {
    return this.messagesQueryProvider.getMessagesForUser(firstDate, secondDate);
  }

  updateMessages(id: number, userId: number): Promise<boolean> {
    return this.messagesMutationProvider.updateMessages(id, userId);
  }
}
