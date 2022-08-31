import { gql } from '@apollo/client';
import Settings from '../../../models/Settings';
import apolloClient from '..';

const QUERY_ALL_GET_SETTINGS = gql`
  query GetAllSettings($id: Int!) {
    getAllSettings(id: $id) {
      id
      settingName
      settingValue
      settingType
      idSucursal
      updateAt
      createdAt
    }
  }
`;

export default class SettingsQueryProvider {
  getAllSettings = async (id: number): Promise<Settings[] | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_ALL_GET_SETTINGS,
        variables: {
          id,
        },
      });

      if (error || errors) {
        return null;
      }
      return data.getAllSettings;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };
}
