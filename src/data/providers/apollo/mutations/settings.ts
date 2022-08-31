import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';

export interface SettingInput {
  settingName: string;
  settingValue: string;
  settingType: string | null;
  idSucursal: number;
}

export interface UpdateSettingInput {
  settingName: string;
  settingValue: string;
  settingType: string | null;
}

export interface ItemDocumentsInput {
  name: string;
  when: number[] | null;
  optional: number[] | null;
  invoice: boolean | null;
}

export const MUTATION_CREATE_SETTINGS = gql`
  mutation CreateSetting($settingInsert: SettingInput!) {
    createSetting(settingInsert: $settingInsert)
  }
`;

export const MUTATION_UPDATE_SETTINGS = gql`
  mutation UpdateSetting(
    $idSetting: Int!
    $updateSettingInsert: UpdateSettingInput!
  ) {
    updateSetting(
      idSetting: $idSetting
      updateSettingInsert: $updateSettingInsert
    )
  }
`;

export const MUTATION_DELETE_SETTINGS = gql`
  mutation DeleteSetting($idSetting: Int!) {
    deleteSetting(idSetting: $idSetting)
  }
`;

export const MUTATION_UPDATE_DOCUMENTS_SETTINGS = gql`
  mutation createUpdateDeleteDocumentsSetting(
    $idSetting: Int
    $itemDocuments: [ItemDocumentsInput!]
    $idSucursal: Int
  ) {
    createUpdateDeleteDocumentsSetting(
      idSetting: $idSetting
      itemDocuments: $itemDocuments
      idSucursal: $idSucursal
    )
  }
`;

export default class SettingsMutationProvider {
  createSetting = async (
    settingInsert: SettingInput
  ): Promise<string | null> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_SETTINGS,
        variables: {
          settingInsert,
        },
      });

      if (errors) return null;
      //console.log('create', data);
      return data.createSetting;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  updateSetting = async (
    idSetting: number,
    updateSettingInsert: UpdateSettingInput
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_SETTINGS,
        variables: {
          idSetting,
          updateSettingInsert,
        },
      });

      if (errors) return false;
      //console.log('Update', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  deleteSetting = async (idSetting: number): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_DELETE_SETTINGS,
        variables: {
          idSetting,
        },
      });

      if (errors) return false;
      //console.log('Delete', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  createUpdateDeleteDocumentsSetting = async (
    idSetting: number | null,
    itemDocuments: ItemDocumentsInput[] | null,
    idSucursal: number | null
  ): Promise<string | null> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_DOCUMENTS_SETTINGS,
        variables: {
          idSetting,
          itemDocuments,
          idSucursal
        },
      });

      if (errors) {
        return null;
      }
      return data.createUpdateDeleteDocumentsSetting;
    } catch (e) {
      //console.error('Error createUpdateDeleteDocumentsSetting', e.message);
      return null;
    }
  };
}
