import TracingsRepositoryInterface, { ReturnCreateTracing } from '../repositories-interfaces/tracings-repository-interface';
import Tracings from '../models/Tracings';
import Client from '../models/Client';
import TracingMutationProvider, {
  TracingInput,
  TracingInputUpdate,
} from '../providers/apollo/mutations/tracing';
import TracingsQueryProvider from '../providers/apollo/queries/tracing';

export default class TracingsRepository implements TracingsRepositoryInterface {
  tracingsQueryProvider: TracingsQueryProvider;

  tracingsMutationProvider: TracingMutationProvider;

  constructor(
    tracingsProvider: TracingsQueryProvider,
    tracingsMutationProvider: TracingMutationProvider
  ) {
    this.tracingsQueryProvider = tracingsProvider;
    this.tracingsMutationProvider = tracingsMutationProvider;
  }

  getTracingsByUserAndClient(
    identification: string,
    idLead?:number
  ): Promise<Tracings[] | null> {
    return this.tracingsQueryProvider.getTracingsByUserAndClient(
      identification,
      idLead
    );
  }

  getTracingsOfDay(
    firstDate: string,
    secondDate: string
  ): Promise<Tracings[] | null> {
    return this.tracingsQueryProvider.getTracingsOfDay(firstDate, secondDate);
  }

  getTracingsByDates(
    firstDate: string,
    secondDate: string,
    value: string | null
  ): Promise<Tracings[] | null> {
    return this.tracingsQueryProvider.getTracingsByDates(
      firstDate,
      secondDate,
      value
    );
  }

  getTracingsById(id: number): Promise<Tracings | null> {
    return this.tracingsQueryProvider.getTracingsById(id);
  }

  //Mutation
  creatTracing(
    tracingInsert: TracingInput,
    identificationClient: string,
    idUser: number,
    idLead: number
  ): Promise<{ ok: boolean; message: string; respTracing?: ReturnCreateTracing; }> {
    return this.tracingsMutationProvider.creatTracing(
      tracingInsert,
      identificationClient,
      idUser,
      idLead
    );
  }

  closeTracing(
    idInput: number,
    tracingUpdate: TracingInputUpdate
  ): Promise<string> {
    return this.tracingsMutationProvider.closeTracing(idInput, tracingUpdate);
  }
}
