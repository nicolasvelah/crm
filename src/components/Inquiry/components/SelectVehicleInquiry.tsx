import React, { FunctionComponent, useState, useEffect } from 'react';
import { Menu, Row, Col, Divider, Spin, message } from 'antd';
import auth from '../../../utils/auth';
import { Dependencies } from '../../../dependency-injection';
import CRMRepository from '../../../data/repositories/CRM-repository';
import Get from '../../../utils/Get';
import { currenyFormat } from '../../../utils/extras';

const SelectVehicleInquiry: FunctionComponent<{
  setSelectedVehicle: React.Dispatch<any>;
}> = ({ setSelectedVehicle }) => {
  const [brandsList, setBrandsList] = useState<any[] | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const [modelsList, setModelsList] = useState<any[] | null>(null);
  const [modelsGRAPHList, setModelsGRAPHList] = useState<any[] | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const [versionsList, setVersionsList] = useState<any[] | null>(null);
  const [versionsGRAPHList, setVersionsGRAPHList] = useState<any[] | null>(
    null
  );
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedGRAPHVersion, setSelectedGRAPHVersion] = useState<any | null>(
    null
  );

  const [viewLoad, setViewLoad] = useState<boolean>(false);

  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  const brandLocalStorage = auth.user;

  useEffect(() => {
    if (brandLocalStorage !== null) {
      setBrandsList(brandLocalStorage.brand);
    }
  }, []);

  const selectedBrandFunction = async (item: any) => {
    //console.log('Item', item);
    setSelectedBrand(item);
    setViewLoad(true);
    const getCatalogData = await CRMRepository.getCatalog({
      marca: item,
    });
    //console.log('getCatalogData -->', { getCatalogData });
    if (getCatalogData) {
      const modelsString = getCatalogData.map(
        (cat: any) => `${cat.marca} ${cat.modelo}`
      );
      //console.log('getCatalogData -->', { modelsString });
      setModelsList(modelsString);
      setModelsGRAPHList(getCatalogData);

      setVersionsList(null);
      setVersionsGRAPHList(null);

      setSelectedGRAPHVersion(null);
      setSelectedVersion(null);

      setSelectedVehicle(null);
    } else {
      message.error('No se pudo obtener los vehículos');
    }
    setViewLoad(false);
  };

  const selectedModelFunction = async (item: any) => {
    //console.log('Item', item);
    setSelectedModel(item);
    setViewLoad(true);
    const version = modelsGRAPHList?.find(
      (cat) => `${cat.marca} ${cat.modelo}` === item
    );
    if (version && version.versiones) {
      const mapVersiones = version.versiones.map(
        (ver: any) => `${ver.modelo} ${ver.id_modelo}`
      );
      setVersionsList(mapVersiones);
      setVersionsGRAPHList(version.versiones);

      setSelectedGRAPHVersion(null);
      setSelectedVersion(null);

      setSelectedVehicle(null);
    }

    setViewLoad(false);
  };

  const selectedVersionFunction = async (item: any) => {
    //console.log('Item', item);
    setSelectedVersion(item);
    setViewLoad(true);
    const version = versionsGRAPHList?.find(
      (ver) => `${ver.modelo} ${ver.id_modelo}` === item
    );
    if (version) {
      setSelectedGRAPHVersion(version);
      setSelectedVehicle(version);
    }

    setViewLoad(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Row>
        <Col span={6}>
          {brandsList && (
            <SelectItem
              data={brandsList}
              title="Marca"
              type="brand"
              onSelect={selectedBrandFunction}
              itemSelected={selectedBrand}
            />
          )}
        </Col>

        <Col span={6}>
          {modelsList && selectedBrand && (
            <SelectItem
              data={modelsList}
              title="Modelo"
              type="model"
              onSelect={selectedModelFunction}
              itemSelected={selectedModel}
            />
          )}
        </Col>
        <Col span={6}>
          {versionsList && selectedModel && modelsList && selectedBrand && (
            <SelectItem
              data={versionsList}
              title="Versión"
              type="version"
              onSelect={selectedVersionFunction}
              itemSelected={selectedVersion}
            />
          )}
        </Col>
        <Col span={6}>
          <div style={{ padding: 5 }}>
            <b>Vehículo</b>
            <br />
            {selectedVersion && selectedGRAPHVersion && (
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <b>MARCA:</b>
                      </td>
                      <td>{selectedGRAPHVersion.marca}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>CÓDIGO:</b>
                      </td>
                      <td>{selectedGRAPHVersion.codigo}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>ID:</b>
                      </td>
                      <td>{selectedGRAPHVersion.id_modelo}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>MODELO:</b>
                      </td>
                      <td>{selectedGRAPHVersion.modelo}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>PRECIO:</b>
                      </td>
                      <td>
                        {currenyFormat(selectedGRAPHVersion.precio, true)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <LoadingModal view={viewLoad} />
    </div>
  );
};

const SelectItem: FunctionComponent<{
  data: any[];
  title: string;
  type: 'brand' | 'model' | 'version';
  onSelect: (num: any) => void;
  itemSelected?: any;
}> = ({ data, title, type, onSelect, itemSelected }) => {
  return (
    <div style={{ padding: 5, borderRight: '1px solid #f0f0f0' }}>
      <b>{title}</b>
      <br />
      {data.map((num) => (
        <div
          style={{
            border: '1px solid #f0f0f0',
            cursor: 'pointer',
            padding: 5,
            marginBottom: 5,
            borderRadius: 5,
            textAlign: 'center',
            backgroundColor:
              itemSelected && itemSelected === num ? '#8aeacb54' : undefined,
          }}
          key={num}
          onClick={() => onSelect(num)}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

export const LoadingModal: FunctionComponent<{
  view: boolean;
  opacity?: number;
  message?: string;
}> = ({ view, opacity, message }) => {
  if (!view) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `rgba(255,255,255,${opacity ?? '0.2'})`,
      }}
    >
      {message ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <b>{message}</b>
          <Spin />
        </div>
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default SelectVehicleInquiry;
