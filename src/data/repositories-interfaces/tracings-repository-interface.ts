import Tracings, { LinksOffice365 } from '../models/Tracings';
import Client from '../models/Client';
import {
  TracingInput,
  TracingInputUpdate,
} from '../providers/apollo/mutations/tracing';


export interface ReturnCreateTracing {
  idTracing: number;
  linksOffice365: LinksOffice365[] | null;
}

export default interface TracingsRepositoryInterface {
  getTracingsByUserAndClient(
    identification: string,
    idLead?: number
  ): Promise<Tracings[] | null>;

  getTracingsOfDay(
    firstDate: string,
    secondDate: string
  ): Promise<Tracings[] | null>;

  getTracingsByDates(
    firstDate: string,
    secondDate: string,
    value: string | null
  ): Promise<Tracings[] | null>;

  getTracingsById(id: number): Promise<Tracings | null>;

  creatTracing(
    tracingInsert: TracingInput,
    identificationClient: string,
    idUser: number,
    idLead: number
  ): Promise<{ ok: boolean; message: string; respTracing?: ReturnCreateTracing; }>;

  closeTracing(
    idInput: number,
    tracingUpdate: TracingInputUpdate
  ): Promise<string>;
}
