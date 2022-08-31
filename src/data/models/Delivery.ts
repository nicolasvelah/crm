import { DocumentsVerifyInput } from '../providers/apollo/mutations/delivery';
import Quotes from './Quotes';

export interface Documents {
  url: string | null;
  state: string;
}

export interface ScheduleDelivery {
  state: string;
  date: string;
  location: string;
}

export interface Registration {
  state: string;
  plateNumber: string | null;
}
export interface NoteWallet {
  id: number;
  type: string;
  name: string;
  text: string;
  time:string;
}
class Delivery {
  id?: number;
  comment?: NoteWallet[] | null;
  deliveryFinal?: boolean | null;
  authorizathionStatus?: string | null;
  registration?: Registration | null;
  verifyDocuments?: DocumentsVerifyInput[] | null;
  finalDocuments?: DocumentsVerifyInput[] | null;
  delivery?: Documents | null;
  scheduleDelivery?: ScheduleDelivery | null;
  vehicleOrder?: Documents | null;
  printCheckPreDelivery?: string | null;
  estimatedDeliveryDate?: string | null;
  updateAt?: string | null;
  createdAt?: string | null;
  quotes?: Quotes | null;
  approvedBy?: string | null;
  idBusinessHubspot?: string | null;
}

export default Delivery;
