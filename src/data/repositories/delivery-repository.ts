import Delivery from '../models/Delivery';
import DeliveryMutationProvider, {
  DocumentsVerifyInput,
  ScheduleDeliveryInput,
  NoteWalletInput,
} from '../providers/apollo/mutations/delivery';
import DeliveryQueryProvider from '../providers/apollo/queries/delivery';
import DeliveryRepositoryInterface from '../repositories-interfaces/delivery-repository-interface';

export default class DeliveryRepository implements DeliveryRepositoryInterface {
  deliveryMutationProvider: DeliveryMutationProvider;
  deliveryQueryProvider: DeliveryQueryProvider;

  constructor(
    deliveryMutationProvider: DeliveryMutationProvider,
    deliveryQueryProvider: DeliveryQueryProvider
  ) {
    this.deliveryMutationProvider = deliveryMutationProvider;
    this.deliveryQueryProvider = deliveryQueryProvider;
  }

  updateDocumentsVerify(
    idDelivery: number,
    documents: DocumentsVerifyInput[]
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateDocumentsVerify(
      idDelivery,
      documents
    );
  }

  updateFinalDocumentsDelivery(
    idDelivery: number,
    documents: DocumentsVerifyInput[]
  ): Promise<{
    status: number;
    message: string;
    idBusinessHubspot?: string | null;
  }> {
    return this.deliveryMutationProvider.updateFinalDocumentsDelivery(
      idDelivery,
      documents
    );
  }

  updateVerifyDocuments(
    nameDocument: string,
    idDelivery: number,
    walletState: string
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateVerifyDocuments(
      nameDocument,
      idDelivery,
      walletState
    );
  }

  updateRegistration(
    idPrebill: number,
    plateNumber: string | null
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateRegistration(
      idPrebill,
      plateNumber
    );
  }

  updateRegistrationWithQuote(
    idQuote: number,
    plateNumber: string | null
  ): Promise<string | null> {
    return this.deliveryMutationProvider.updateRegistrationWithQuote(
      idQuote,
      plateNumber
    );
  }

  updateVehicleOrder(idDelivery: number, url: string | null): Promise<boolean> {
    return this.deliveryMutationProvider.updateVehicleOrder(idDelivery, url);
  }

  updateAuthorizathionStatusRequested(idPrebill: number): Promise<boolean> {
    return this.deliveryMutationProvider.updateAuthorizathionStatusRequested(
      idPrebill
    );
  }
  authorizathionStatusRequestedLead(
    idQuotes: number[]
  ): Promise<{ ok: boolean; message: string }> {
    return this.deliveryMutationProvider.authorizathionStatusRequestedLead(
      idQuotes
    );
  }

  updateAuthorizathionStatusAuthorized(
    idPrebill: number,
    authorizathionStatus: string,
    comment: NoteWalletInput,
    idLead: number,
    identificationClient: string,
    idUser: number,
    idUserVerification: number,
    codUser: string,
    nameClient: string,
    idQuote: number
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateAuthorizathionStatusAuthorized(
      idPrebill,
      authorizathionStatus,
      comment,
      idLead,
      identificationClient,
      idUser,
      idUserVerification,
      codUser,
      nameClient,
      idQuote
    );
  }

  updateDeliveryFinal(
    idDelivery: number,
    url: string | null
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateDeliveryFinal(idDelivery, url);
  }

  updatePreDelivery(idPrebill: number): Promise<boolean> {
    return this.deliveryMutationProvider.updatePreDelivery(idPrebill);
  }

  updateVehicleOrderForFile(id: number, url: string): Promise<boolean> {
    return this.deliveryMutationProvider.updateVehicleOrderForFile(id, url);
  }

  updateVehicleOrderForLogistic(
    id: number,
    usuario: string,
    vin: string,
    empresa: string,
    correo: string
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateVehicleOrderForLogistic(
      id,
      usuario,
      vin,
      empresa,
      correo
    );
  }

  updateVehicleOrderRequest(
    id: number,
    empresa: string,
    usuario: string,
    vin: string,
    fecha: string,
    destino: string,
    direccion: string,
    sala: string,
    concesionario: string
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateVehicleOrderRequest(
      id,
      empresa,
      usuario,
      vin,
      fecha,
      destino,
      direccion,
      sala,
      concesionario
    );
  }

  updateScheduleDelivery(
    idPrebill: number,
    scheduleDelivery: ScheduleDeliveryInput
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateScheduleDelivery(
      idPrebill,
      scheduleDelivery
    );
  }

  updateScheduleDeliveryWithQuote(
    idQuote: number,
    scheduleDelivery: ScheduleDeliveryInput,
    isRedExterna: boolean | null
  ): Promise<{
    status: number;
    message: string;
    idBusinessHubspot?: string | null;
  }> {
    return this.deliveryMutationProvider.updateScheduleDeliveryWithQuote(
      idQuote,
      scheduleDelivery,
      isRedExterna
    );
  }
  updateEstimatedDateDelivery(
    idDelivery: number,
    estimatedDate: string
  ): Promise<boolean> {
    return this.deliveryMutationProvider.updateEstimatedDateDelivery(
      idDelivery,
      estimatedDate
    );
  }

  finishDelivery(idDelivery: number): Promise<boolean> {
    return this.deliveryMutationProvider.finishDelivery(idDelivery);
  }

  getDeliveryByPrebill(idPrebill: number): Promise<Delivery | null> {
    return this.deliveryQueryProvider.getDeliveryByPrebill(idPrebill);
  }

  getDeliveryByQuote(idQuote: number): Promise<Delivery | null> {
    return this.deliveryQueryProvider.getDeliveryByQuote(idQuote);
  }
  sendDataToHubspot(idDelivery: number): Promise<string | null> {
    return this.deliveryMutationProvider.sendDataToHubspot(idDelivery);
  }
}
