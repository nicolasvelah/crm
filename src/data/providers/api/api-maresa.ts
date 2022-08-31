/* eslint-disable no-console */
import axios from 'axios';
import auth from '../../../utils/auth';

export interface ResponseExcel {
  idLead: number | null;
  addedInGUC: boolean;
  errors?: string[];
}

export interface ResponseExcelObjectives {
  idObjective: number | null;
  addedInGUC: boolean;
  errors?: string[];
}

const baseURL = process.env.REACT_APP_API_URL;

export default class CRMProvider {
  apiCall = async (
    method: any,
    url: string,
    data: any,
    headers?: any
  ): Promise<{ ok: boolean; data: any; message: string }> => {
    try {
      //console.log('Entro API CALL');
      const response = await axios({
        method,
        url: baseURL + url,
        data,
        headers,
      });
      return { ok: true, data: response.data, message: 'ok' };
    } catch (error) {
      console.log('Error en apiCall:', error.response?.data);
      return { ok: false, data: null, message: error.response?.data.message };
    }
  };

  getPublicCatalog = async (
    method: any,
    url: string,
    data: any,
    headers?: any
  ): Promise<any> => {
    try {
      const response = await axios({
        method,
        url: baseURL + url,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      return null;
    }
  };

  init = async (data: any): Promise<any> => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/user/login`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          tokenportaldealer: data,
        },
      });
      return response.data.data;
    } catch (error) {
      //console.log('error validateCRMToken ', error);
      return null;
    }
  };

  // Get catalog vehicles token(tokenTransactional - Brand) -> API -> API CRM
  getCatalog = async (data: any) => {
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });
      return response.data.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      //console.log('error getCatalog ', error.message);
      return null;
    }
  };

  // Get catalog vehicles token - codeVehicle -> API -> API CRM
  getVehicle = async (data: any): Promise<any> => {
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get/vehicle`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });
      return response.data.data;
    } catch (error) {
      //console.log('error validateCRMToken ', error.message);
      return null;
    }
  };

  // Get catalog vehicles token - (brand-model)  -> API -> API CRM
  getVersions = async (data: any) => {
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get/versions`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });

      return response.data.data;
    } catch (error) {
      //console.log('error getVersions ', error.message);
      return null;
    }
  };

  getAccesories = async (data: any): Promise<any> => {
    //console.log('Data para accesories', data);
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get/accesories`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });
      //console.log('Accesories', response.data.data);
      return response.data.data;
    } catch (error) {
      //console.log('error validateCRMToken ', error.message);
      return null;
    }
  };

  getServices = async (data: any): Promise<any> => {
    //console.log('Data para services', data);
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get/services`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });
      //console.log('Services', response.data.data);
      return response.data.data;
    } catch (error) {
      //console.log('error validateCRMToken ', error.message);
      return null;
    }
  };

  getInsurance = async (data: any): Promise<any> => {
    //console.log('Data aseguradora', data);
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get/insurance`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });
      //console.log('Insurance Services', response.data.data);
      /// ESTO SE HACE PARA AUMENTAR EL IVA EN LOS SEGUROS
      if (response.data.data) {
        const newData = response.data.data.map((insu: any) => {
          const seguros = insu?.seguros?.map((segu: any) => ({
            ...segu,
            //subtotal: segu.subtotal * 1.12,
            total: segu.total * 1.12,
          }));
          return { ...insu, seguros };
        });
        //console.log('NewDataInsurance', newData);
        return newData;
      }
      return response.data.data;
    } catch (error) {
      //console.log('error validateCRMToken ', error.message);
      return null;
    }
  };

  getVehicle2 = async (data: any): Promise<any> => {
    //console.log('Data para envio', data);
    try {
      const token = await auth.getAccessToken();
      const url = `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/get/versions`;
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        data,
      });

      return response.data.data;
    } catch (error) {
      //console.log('error getVersions ', error.message);
      return null;
    }
  };

  uploadFile = async (data: {
    file: File;
    metadata: any;
  }): Promise<string | null> => {
    try {
      const token = await auth.getAccessToken();
      if (!token) throw Error('access denied');
      const { file, metadata } = data;
      const fd = new FormData();
      fd.append('file', file);
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/contenido/upload`,
        method: 'POST',
        headers: {
          token,
          metadata: JSON.stringify(metadata),
          'Content-Type': 'multipart/form-data',
        },
        data: fd,
      });
      console.log('DEBUG_0_uploadFile', response);
      //adaptacion provisional para llegar a wallet
      if (response.data.response) {
        return response.data.response[0].link;
      }
      return null;
    } catch (e) {
      //console.log(e);
      return null;
    }
  };

  sendMail = async (mailData: MailData): Promise<boolean> => {
    try {
      const token = await auth.getAccessToken();
      const { asunto, template, bodyData, destinatario, copia, cc, adjuntos } =
        mailData;
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/v1/CRM/sendmail`,
        headers: {
          token,
        },
        data: {
          asunto,
          template,
          bodyData,
          destinatario, //client.email
          copia,
          cc,
          adjuntos,
        },
      });
      return true;
    } catch (e) {
      //console.log('sendMail', e);
      return false;
    }
  };

  searhCatalog = async (data: {
    operacion: string;
    filtro: any;
  }): Promise<any> => {
    try {
      const token = await auth.getAccessToken();
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/search-catalog`,
        headers: {
          token,
        },
        data,
      });
      if (response.data.response) {
        return response.data.response;
      }
      return null;
    } catch (e) {
      //console.log(e);
      return null;
    }
  };

  colorsGet = async (filtro?: any | null): Promise<any> => {
    try {
      const token = await auth.getAccessToken();
      let data: any = null;
      if (filtro) {
        data = {
          filtro,
        };
      }
      const colors = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/v1/CRM/colors/get`,
        headers: {
          token,
        },
        data,
      });
      return colors;
    } catch (e) {
      //console.log(e);
      return false;
    }
  };

  verifyVINs = async (
    arrayVIN: { vin: string; idQuote: number }[]
  ): Promise<{ vin: string; idQuote: number; ok: boolean } | null> => {
    try {
      const token = await auth.getAccessToken();
      const vins: any = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/v1/CRM/catalog/vin/verify`,
        headers: {
          token,
        },
        data: {
          arrayVIN,
        },
      });
      //console.log('vins', vins);
      return vins.data.data;
    } catch (e) {
      //console.log('Error verifyVINs', e.message);
      return null;
    }
  };

  /// uploadExcel business
  uploadFileExcel = async (data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcel[] | null> => {
    try {
      const token = await auth.getAccessToken();
      if (!token) throw Error('access denied');
      const { file, metadata } = data;
      const fd = new FormData();
      fd.append('file', file);
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/excel/load-file`,
        method: 'POST',
        headers: {
          token,
          metadata: JSON.stringify(metadata),
          'Content-Type': 'multipart/form-data',
        },
        data: fd,
      });
      //console.log('DEBUG_0_uploadFileExcel', response);
      //adaptacion provisional para llegar a wallet
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (e) {
      //console.log(e);
      return null;
    }
  };

  uploadExcelObjectives = async (data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcelObjectives[] | null> => {
    try {
      const token = await auth.getAccessToken();
      if (!token) throw Error('access denied');
      const { file, metadata } = data;
      const fd = new FormData();
      fd.append('file', file);
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/excel/load-objectives`,
        method: 'POST',
        headers: {
          token,
          metadata: JSON.stringify(metadata),
          'Content-Type': 'multipart/form-data',
        },
        data: fd,
      });
      console.log('DEBUG_0_uploadFileExcel', response);
      //adaptacion provisional para llegar a wallet
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  uploadExcelObjectivesAccesories = async (data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcelObjectives[] | null> => {
    try {
      const token = await auth.getAccessToken();
      if (!token) throw Error('access denied');
      const { file, metadata } = data;
      const fd = new FormData();
      fd.append('file', file);
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/excel/load-objectives-accesories`,
        method: 'POST',
        headers: {
          token,
          metadata: JSON.stringify(metadata),
          'Content-Type': 'multipart/form-data',
        },
        data: fd,
      });
      console.log('DEBUG_0_uploadExcelObjectivesAccesories', response);
      //adaptacion provisional para llegar a wallet
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  uploadExcelObjectivesAllies = async (data: {
    file: File;
    metadata: any;
  }): Promise<ResponseExcelObjectives[] | null> => {
    try {
      const token = await auth.getAccessToken();
      if (!token) throw Error('access denied');
      const { file, metadata } = data;
      const fd = new FormData();
      fd.append('file', file);
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/excel/load-objectives-allies`,
        method: 'POST',
        headers: {
          token,
          metadata: JSON.stringify(metadata),
          'Content-Type': 'multipart/form-data',
        },
        data: fd,
      });
      console.log('DEBUG_0_uploadExcelObjectivesAllies', response);
      //adaptacion provisional para llegar a wallet
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  ////VCHAT USER
  /// rejectCallVchat
  rejectCallVchat = async (data: {
    room: string;
  }): Promise<ResponseExcel[] | null> => {
    try {
      const token = await auth.getAccessToken();
      if (!token) throw Error('access denied');

      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/videocall/reject-vchat`,
        method: 'POST',
        headers: {
          token,
        },
        data: { room: data.room },
      });
      //console.log('DEBUG_0_uploadFileExcel', response);
      //adaptacion provisional para llegar a wallet
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (e) {
      //console.log(e);
      return null;
    }
  };
}

export interface MailData {
  asunto: string;
  template: string;
  bodyData: any;
  destinatario: string; //client.email
  copia: string;
  cc: string;
  adjuntos?: number;
}
