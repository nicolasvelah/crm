import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, InputNumber, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SettingsRepository from '../../../data/repositories/settings-repository';

interface DataRateMonths {
  idSetting: number;
  values: {
    rates: number[];
    months: number[];
  };
}

const SettingsRatesMonths: FunctionComponent<{
  idSucursal: string;
  dataRateTerm: any[];
  settingsRepository: SettingsRepository;
}> = ({ idSucursal, dataRateTerm, settingsRepository }) => {
  const [dataRatesMonths, setDataRatesMonths] = useState<DataRateMonths[]>([]);
  const [createItemRate, setCreateItemRate] = useState<boolean>(false);
  const [createItemMonth, setCreateItemMonth] = useState<boolean>(false);

  useEffect(() => {
    //console.log('dataRateTerm -->', dataRateTerm);
    if (dataRateTerm.length > 0) {
      const dataApi: DataRateMonths[] = [];

      dataRateTerm.forEach((setting) => {
        try {
          const values: { rates: number[]; months: number[] } = JSON.parse(
            setting.settingValue
          );
          dataApi.push({
            idSetting: setting.id,
            values,
          });
        } catch (error) {
          console.log('Error en SettingsRatesMonths:', error.message);
        }
      });

      setDataRatesMonths(dataApi);
    } else {
      setDataRatesMonths([]);
    }
  }, [dataRateTerm]);

  const createItemJSX = (val: {
    type: 'rates' | 'months';
    idSetting?: number;
    keyText: string;
    setCreateItem: React.Dispatch<React.SetStateAction<boolean>>;
    createItem: boolean;
  }) => (
    <div>
      {val.createItem ? (
        <ItemRateMonth
          type={val.type}
          isCreate
          idSetting={val.idSetting}
          setDataRatesMonths={setDataRatesMonths}
          //key="rate_item_create"
          key={val.keyText}
          settingsRepository={settingsRepository}
          setCreateItem={val.setCreateItem}
          //setCreateItem={setCreateItemRate}
          idSucursal={idSucursal}
          dataRatesMonths={dataRatesMonths}
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            icon={<PlusOutlined />}
            shape="circle"
            onClick={() => {
              val.setCreateItem(true);
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ margin: '0px 30px' }}>
      <div style={{ color: '#000' }}>
        <b>Sucursal:</b> {idSucursal}
      </div>
      <div style={{ display: 'flex', margin: '15px 20px' }}>
        <div style={{ width: '50%' }}>
          <div style={{ color: '#000' }}>Tasas:</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {dataRatesMonths.map((data, index) => (
              <React.Fragment key={`tasa_${index}`}>
                {data.values.rates.map((rate, indexRate) => (
                  <ItemRateMonth
                    type="rates"
                    item={rate}
                    idSetting={data.idSetting}
                    setDataRatesMonths={setDataRatesMonths}
                    key={`tasa_item_${indexRate}`}
                    settingsRepository={settingsRepository}
                    idSucursal={idSucursal}
                    dataRatesMonths={dataRatesMonths}
                  />
                ))}
                {createItemJSX({
                  type: 'rates',
                  idSetting: data.idSetting,
                  keyText: 'rate_item_create',
                  setCreateItem: setCreateItemRate,
                  createItem: createItemRate,
                })}
              </React.Fragment>
            ))}
            {dataRatesMonths.length === 0 &&
              createItemJSX({
                type: 'rates',
                keyText: 'rate_item_create',
                setCreateItem: setCreateItemRate,
                createItem: createItemRate,
              })}
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <div style={{ color: '#000' }}>Meses Plazo</div>
          {dataRatesMonths.map((data, index) => (
            <React.Fragment key={`meses_${index}`}>
              {data.values.months.map((month, indexMonth) => (
                <ItemRateMonth
                  type="months"
                  item={month}
                  idSetting={data.idSetting}
                  setDataRatesMonths={setDataRatesMonths}
                  key={`meses_item_${indexMonth}`}
                  settingsRepository={settingsRepository}
                  idSucursal={idSucursal}
                  dataRatesMonths={dataRatesMonths}
                />
              ))}

              {createItemJSX({
                type: 'months',
                idSetting: data.idSetting,
                keyText: 'month_item_create',
                setCreateItem: setCreateItemMonth,
                createItem: createItemMonth,
              })}
            </React.Fragment>
          ))}

          {dataRatesMonths.length === 0 &&
            createItemJSX({
              type: 'months',
              keyText: 'month_item_create',
              setCreateItem: setCreateItemMonth,
              createItem: createItemMonth,
            })}
        </div>
      </div>
    </div>
  );
};

const ItemRateMonth: FunctionComponent<{
  type: 'rates' | 'months';
  isCreate?: boolean;
  item?: number;
  idSetting?: number;
  setDataRatesMonths: React.Dispatch<React.SetStateAction<DataRateMonths[]>>;
  settingsRepository: SettingsRepository;
  setCreateItem?: React.Dispatch<React.SetStateAction<boolean>>;
  idSucursal: string;
  dataRatesMonths: DataRateMonths[];
}> = ({
  item,
  type,
  isCreate,
  setDataRatesMonths,
  idSetting,
  settingsRepository,
  setCreateItem,
  idSucursal,
  dataRatesMonths,
}) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actualValue, setActualValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    setEdit(typeof item !== 'number');
  }, []);

  useEffect(() => {
    //console.log('Se actualizó');
    setActualValue(item);
  }, [dataRatesMonths]);

  const handleDeleteItem = async () => {
    if (typeof item === 'number' && typeof idSetting === 'number') {
      const indexSetting = dataRatesMonths.findIndex(
        (itm) => itm.idSetting === idSetting
      );
      if (indexSetting > -1) {
        const indexItem = dataRatesMonths[indexSetting].values[type].findIndex(
          (itm) => itm === item
        );
        if (indexItem > -1) {
          //const copy = [...prevState];
          const newValue = [...dataRatesMonths];
          newValue[indexSetting].values[type].splice(indexItem, 1);
          const dataCreate = {
            settingName: 'RateTerm',
            settingType: 'rateTerm',
            settingValue: JSON.stringify(newValue[indexSetting].values),
          };

          const respSettings = await settingsRepository.updateSetting(
            idSetting,
            dataCreate
          );
          if (respSettings) {
            message.success('Configuración eliminada');
            setDataRatesMonths(newValue);
          } else {
            message.error('No se pudo eliminar la configuración');
          }
        }
      }
    }
  };

  const handleCreateItem = async () => {
    //console.log('actualValue -->', actualValue);
    //console.log('dataRatesMonths before -->', dataRatesMonths);
    setLoading(true);
    if (typeof idSetting === 'number') {
      /// ACTUALIZO
      //console.log('ENTRO ACTUALIZAR');
      const indexSetting = dataRatesMonths.findIndex(
        (itm) => itm.idSetting === idSetting
      );
      if (indexSetting > -1) {
        const values = {
          ...dataRatesMonths[indexSetting].values,
          [type]: [...dataRatesMonths[indexSetting].values[type], actualValue!],
        };
        //console.log('values', values);

        const dataCreate = {
          settingName: 'RateTerm',
          settingType: 'rateTerm',
          settingValue: JSON.stringify(values),
        };

        const respSettings = await settingsRepository.updateSetting(
          idSetting,
          dataCreate
        );
        if (respSettings) {
          message.success('Configuración creada');
          const copyCreate = [...dataRatesMonths];
          //const copyCreate = dataRatesMonths.map((dt) => dt);
          copyCreate[indexSetting].values = values;
          setDataRatesMonths(copyCreate);
        } else {
          message.error(
            'No se pudo crear la configuración. Vuelva a intentarlo.'
          );
          //console.log('dataRatesMonths after -->', dataRatesMonths);
          setDataRatesMonths([...dataRatesMonths]);
        }
      }
    } else {
      /// CREO DESDE CERO
      const value = {
        months: type === 'months' ? [actualValue!] : [],
        rates: type === 'rates' ? [actualValue!] : [],
      };
      const dataCreate = {
        settingName: 'RateTerm',
        settingType: 'rateTerm',
        settingValue: JSON.stringify(value),
        idSucursal: parseInt(idSucursal),
      };
      const respSettings = await settingsRepository.createSetting(dataCreate);

      if (respSettings) {
        message.success('Configuración creada');
        setDataRatesMonths([
          {
            idSetting: parseInt(respSettings),
            values: value,
          },
        ]);
      } else {
        message.error(
          'No se pudo crear la configuración. Vuelva a intentarlo.'
        );
        setDataRatesMonths([...dataRatesMonths]);
      }
    }
    setLoading(false);
    if (setCreateItem) {
      setCreateItem(false);
    }
  };

  const handleEditItem = async () => {
    setLoading(true);
    if (typeof item === 'number' && typeof idSetting === 'number') {
      const indexSetting = dataRatesMonths.findIndex(
        (itm) => itm.idSetting === idSetting
      );
      if (indexSetting > -1) {
        const indexItem = dataRatesMonths[indexSetting].values[type].findIndex(
          (itm) => itm === item
        );
        if (indexItem > -1) {
          const copy = [...dataRatesMonths];
          copy[indexSetting].values[type][indexItem] = actualValue!;

          const dataUpdate = {
            settingName: 'RateTerm',
            settingType: 'rateTerm',
            settingValue: JSON.stringify(copy[indexSetting].values),
          };
          //console.log('dataUpdate -->', dataUpdate);
          const respSettings = await settingsRepository.updateSetting(
            idSetting,
            dataUpdate
          );
          if (respSettings) {
            message.success('Configuración actualizada');
            setDataRatesMonths(copy);
          } else {
            message.error(
              'No se pudo actualizar la configuración. Vuelva a intentarlo.'
            );
          }
        }
      }
    }
    setLoading(false);
    setEdit(false);
  };

  return (
    <div style={{ display: 'flex', margin: 10, alignItems: 'center' }}>
      <InputNumber
        //defaultValue={item}
        value={actualValue}
        disabled={!edit}
        onChange={(val) => {
          //console.log('dataRatesMonths onChange -->', dataRatesMonths);
          if (typeof val === 'number') setActualValue(val);
        }}
        min={1}
        //max={type === 'months' ? 12 : undefined}
      />
      <div style={{ display: 'flex', marginLeft: 10 }}>
        {!isCreate ? (
          <>
            {edit ? (
              <>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleEditItem}
                  size="small"
                >
                  Guardar
                </Button>
                <Button
                  type="default"
                  danger
                  onClick={() => {
                    setEdit(false);
                    setDataRatesMonths([...dataRatesMonths]);
                  }}
                  size="small"
                  style={{ marginLeft: 5 }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Editar
                </Button>
                <Popconfirm
                  placement="rightTop"
                  title="¿Esta seguro de eliminar esta configuración?"
                  onConfirm={handleDeleteItem}
                  okText="Si"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              type="primary"
              size="small"
              loading={loading}
              onClick={handleCreateItem}
            >
              Crear
            </Button>
            <Button
              danger
              size="small"
              onClick={() => {
                if (setCreateItem) {
                  setCreateItem(false);
                }
              }}
              style={{ marginLeft: 5 }}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsRatesMonths;
