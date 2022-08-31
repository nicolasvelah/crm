import Settings from '../models/Settings';
import {
  SettingInput,
  UpdateSettingInput,
  ItemDocumentsInput,
} from '../providers/apollo/mutations/settings';

export default interface SettingsRepositoryInterface {
  createSetting(settingInput: SettingInput): Promise<string | null>;

  updateSetting(
    idSetting: number,
    updateSettingInput: UpdateSettingInput
  ): Promise<boolean>;

  deleteSetting(idSetting: number): Promise<boolean>;

  getAllSettings(id: number): Promise<Settings[] | null>;

  createUpdateDeleteDocumentsSetting(
    idSetting: number | null,
    itemDocuments: ItemDocumentsInput[] | null,
    idSucursal: number | null
  ): Promise<string | null>;
}
