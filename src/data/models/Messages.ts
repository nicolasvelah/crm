export interface Receivers {
  idReceiver: number;
  nameReceiver: string;
  read: boolean;
}

export interface Sender {
  idSender: number;
  nameSender: string;
}

export interface Messages {
  id?: number;
  sender?: Sender;
  receiver?: Receivers[];
  affair?: string;
  message?: string;
  updatedAt?: Date;
  createdAt?: Date;
}
