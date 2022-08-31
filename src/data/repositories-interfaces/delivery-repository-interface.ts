// eslint-disable-next-line no-unused-vars
import Delivery from '../models/Delivery';
import {
  DocumentsVerifyInput,
  ScheduleDeliveryInput,
  NoteWalletInput,
} from '../providers/apollo/mutations/delivery';

export default interface DeliveryRepositoryInterface {
  updateRegistration(
    idPrebill: number,
    plateNumber: string | null
  ): Promise<boolean>;

  updateRegistrationWithQuote(
    idQuote: number,
    plateNumber: string | null
  ): Promise<string | null>;

  updateVehicleOrder(idPrebill: number, url: string | null): Promise<boolean>;

  updateDocumentsVerify(
    idDelivery: number,
    document: DocumentsVerifyInput[]
  ): Promise<boolean>;

  updateFinalDocumentsDelivery(
    idDelivery: number,
    document: DocumentsVerifyInput[]
  ): Promise<{
    status: number;
    message: string;
    idBusinessHubspot?: string | null;
  }>;

  updateVerifyDocuments(
    nameDocument: string,
    idDelivery: number,
    walletState: string
  ): Promise<boolean>;

  updateAuthorizathionStatusRequested(idPrebill: number): Promise<boolean>;
  authorizathionStatusRequestedLead(
    idQuotes: number[]
  ): Promise<{ ok: boolean; message: string }>;
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
  ): Promise<boolean>;

  updateDeliveryFinal(idDelivery: number, url: string | null): Promise<boolean>;

  updatePreDelivery(idPrebill: number): Promise<boolean>;

  updateScheduleDelivery(
    idPrebill: number,
    scheduleDelivery: ScheduleDeliveryInput
  ): Promise<boolean>;

  updateScheduleDeliveryWithQuote(
    idQuote: number,
    scheduleDelivery: ScheduleDeliveryInput,
    isRedExterna: boolean | null
  ): Promise<{
    status: number;
    message: string;
    idBusinessHubspot?: string | null;
  }>;

  updateEstimatedDateDelivery(
    idDelivery: number,
    estimatedDate: string
  ): Promise<boolean>;

  updateVehicleOrderForFile(id: number, url: string): Promise<boolean>;

  updateVehicleOrderForLogistic(
    id: number,
    usuario: string,
    vin: string,
    empresa: string,
    correo: string
  ): Promise<boolean>;

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
  ): Promise<boolean>;

  getDeliveryByPrebill(idPrebill: number): Promise<Delivery | null>;

  getDeliveryByQuote(idQuote: number): Promise<Delivery | null>;

  updateDocumentsVerify(
    idDelivery: number,
    documents: DocumentsVerifyInput[]
  ): Promise<boolean>;

  finishDelivery(idDelivery: number): Promise<boolean>;

  sendDataToHubspot(idDelivery: number): Promise<string | null>;
}
