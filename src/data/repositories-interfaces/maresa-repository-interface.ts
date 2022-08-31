import { MailData } from '../providers/api/api-CRM';

/* eslint-disable semi */
export default interface CRMRepositoryInterface {
  init(data: any): Promise<any>;
  getCatalog(data: any): Promise<any>;
  getVehicle(data: any): Promise<any>;
  getAccesories(data: any): Promise<any>;
  getInsurance(data: any): Promise<any>;
  getVersions(data: any): Promise<any>;
  uploadFile(data: { file: File; metadata: any }): Promise<string | null>;
  sendMail(data: MailData): Promise<boolean>;
  catalog(data: { operacion: string; filtro: any }): Promise<any>;
  verifyVINs(arrayVIN: { vin: string; idQuote: number }[]): Promise<any>;
  apiCall(
    method: any,
    url: string,
    data: any,
    headers?: any
  ): Promise<{ ok: boolean; data: any; message: string }>;
  getPublicCatalog(
    method: any,
    url: string,
    data: any,
    headers?: any
  ): Promise<any>;
  rejectCallVchat(data: { room: string }): Promise<any>;
}
