import CRMProvider, {
  MailData,
  ResponseExcel,
  ResponseExcelObjectives,
} from '../providers/api/api-CRM';
import CRMRepositoryInterface from '../repositories-interfaces/CRM-repository-interface';

export default class CRMRepository implements CRMRepositoryInterface {
  CRMProvider: CRMProvider;

  constructor(CRMProvider: CRMProvider) {
    this.CRMProvider = CRMProvider;
  }

  apiCall(
    method: any,
    url: string,
    data: any,
    headers?: any
  ): Promise<{ ok: boolean; data: any; message: string }> {
    return this.CRMProvider.apiCall(method, url, data, headers);
  }

  getPublicCatalog(
    method: any,
    url: string,
    data: any,
    headers?: any
  ): Promise<any> {
    return this.CRMProvider.getPublicCatalog(method, url, data, headers);
  }

  getInsurance(data: any): Promise<any> {
    return this.CRMProvider.getInsurance(data);
  }

  init(data: any): Promise<any> {
    return this.CRMProvider.init(data);
  }

  getCatalog(data: any): Promise<any> {
    return this.CRMProvider.getCatalog(data);
  }

  getVehicle(data: any): Promise<any> {
    return this.CRMProvider.getVehicle(data);
  }

  getAccesories(data: any): Promise<any> {
    return this.CRMProvider.getAccesories(data);
  }

  getServices(data: any): Promise<any> {
    return this.CRMProvider.getServices(data);
  }

  getVersions(data: any): Promise<any> {
    return this.CRMProvider.getVersions(data);
  }

  uploadFile(data: { file: File; metadata: any }): Promise<string | null> {
    return this.CRMProvider.uploadFile(data);
  }
  sendMail(data: MailData): Promise<boolean> {
    return this.CRMProvider.sendMail(data);
  }
  catalog(data: { operacion: string; filtro: any }): Promise<any> {
    return this.CRMProvider.searhCatalog(data);
  }
  colorsGet(filtro?: any | null): Promise<any> {
    return this.CRMProvider.colorsGet(filtro);
  }
  verifyVINs(arrayVIN: { vin: string; idQuote: number }[]): Promise<any> {
    return this.CRMProvider.verifyVINs(arrayVIN);
  }
  uploadFileExcel(data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcel[] | null> {
    return this.CRMProvider.uploadFileExcel(data);
  }

  uploadExcelObjectives(data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcelObjectives[] | null> {
    return this.CRMProvider.uploadExcelObjectives(data);
  }

  uploadExcelObjectivesAccesories(data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcelObjectives[] | null> {
    return this.CRMProvider.uploadExcelObjectivesAccesories(data);
  }

  uploadExcelObjectivesAllies(data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcelObjectives[] | null> {
    return this.CRMProvider.uploadExcelObjectivesAllies(data);
  }

  rejectCallVchat(data: { room: string }): Promise<any> {
    return this.CRMProvider.rejectCallVchat(data);
  }
}
