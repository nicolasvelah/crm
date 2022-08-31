import CRMProvider from '../api/api-CRM';

export default class CRMFakeProvider extends CRMProvider {
  init = async (data: any): Promise<any> => {
    return { token: 'kasksaksaksak' };
  };

  getCatalog = async (data: any): Promise<any> => {
    return [
      { id: 1, name: 'lskskks' },
      { id: 2, name: 'lskskks' },
    ];
  };

  getVehicle = async (data: any): Promise<any> => {
    return { id: 1, name: 'lskskks' };
  };
}
