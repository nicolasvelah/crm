import SettingsRepositoryInterface from '../repositories-interfaces/settings-repository-interface';
import Settings from '../models/Settings';
import SettingsQueryProvider from '../providers/apollo/queries/setting';
import SettingsMutationProvider, {
  SettingInput,
  UpdateSettingInput,
  ItemDocumentsInput,
} from '../providers/apollo/mutations/settings';

export default class SettingsRepository implements SettingsRepositoryInterface {
  settingsQueryProvider: SettingsQueryProvider;
  settingsMutationProvider: SettingsMutationProvider;

  constructor(
    settingsQueryProvider: SettingsQueryProvider,
    settingsMutationProvider: SettingsMutationProvider
  ) {
    this.settingsQueryProvider = settingsQueryProvider;
    this.settingsMutationProvider = settingsMutationProvider;
  }

  createSetting(settingInput: SettingInput): Promise<string | null> {
    return this.settingsMutationProvider.createSetting(settingInput);
  }

  updateSetting(
    idSetting: number,
    updateSettingInput: UpdateSettingInput
  ): Promise<boolean> {
    return this.settingsMutationProvider.updateSetting(
      idSetting,
      updateSettingInput
    );
  }

  deleteSetting(idSetting: number): Promise<boolean> {
    return this.settingsMutationProvider.deleteSetting(idSetting);
  }

  getAllSettings(id: number): Promise<Settings[] | null> {
    return this.settingsQueryProvider.getAllSettings(id);
  }

  createUpdateDeleteDocumentsSetting(
    idSetting: number | null,
    itemDocuments: ItemDocumentsInput[] | null,
    idSucursal: number | null
  ): Promise<string | null> {
    return this.settingsMutationProvider.createUpdateDeleteDocumentsSetting(
      idSetting,
      itemDocuments,
      idSucursal
    );
  }
}
