import React, { useEffect, FunctionComponent, useState } from 'react';
import { Select } from 'antd';
import Get from '../utils/Get';
import SettingsRepository from '../data/repositories/settings-repository';
import { Dependencies } from '../dependency-injection';

const SelectCampaign: FunctionComponent<{
  idSucursal: number;
  setCampaign: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ idSucursal, setCampaign }) => {
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );

  const [campaigns, setCampaigns] = useState<string[] | null>(null);
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);

  const getCampaign = async () => {
    setLoadingSelect(true);
    const dataCampaigns = await settingsRepository.getAllSettings(idSucursal);
    //console.log('CAMPANAS', dataCampaigns);
    if (dataCampaigns) {
      const mapCampaigns: string[] = [];
      dataCampaigns.map((dm) => {
        let nombre = null;
        if (dm.settingType === 'campaign') {
          const dataJson = JSON.parse(dm.settingValue);
          nombre = dataJson.nombre;
          mapCampaigns.push(nombre);
        }
        return nombre;
      });

      setCampaigns(mapCampaigns);
    }
    setLoadingSelect(false);
  };
  useEffect(() => {
    getCampaign();
  }, [idSucursal]);

  return (
    <div style={{ margin: '5px 0px', display: 'flex', alignItems: 'center' }}>
      <b style={{ marginRight: 5, minWidth: 260 }}>
        Seleccione una campaña para el negocio
      </b>
      <Select
        placeholder="Selecciona una campaña"
        defaultValue="none"
        loading={loadingSelect}
        onChange={(value) => setCampaign(value === 'none' ? null : value)}
        style={{ marginTop: 5, width: 140 }}
      >
        <Select.Option value="none" label="Ninguna" key="campaign_none">
          Ninguna
        </Select.Option>
        {campaigns?.map((campaign: string, index: number) => (
          <Select.Option
            value={campaign}
            label={campaign}
            key={`campaign_${index}`}
          >
            {campaign}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectCampaign;
