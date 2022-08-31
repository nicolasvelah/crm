import { DeleteOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Form,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Table,
} from 'antd';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import SettingsRepository from '../../../data/repositories/settings-repository';
import { Dependencies } from '../../../dependency-injection';
import auth from '../../../utils/auth';
import { currenyFormat } from '../../../utils/extras';
import Get from '../../../utils/Get';
import milisecondsToDate from '../../../utils/milisecondsToDate';

const Objectives: FunctionComponent = () => {
  const { user } = auth;

  const id = user.dealer[0].sucursal[0].id_sucursal;
  //console.log('IDD', id);

  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );

  //Hooks
  const [loading, setLoading] = useState<boolean>(false);
  const [dataObjective, setDataObjective] = useState<any[]>([]);

  async function getDataGraph() {
    setLoading(true);
    const respSettings: any = await settingsRepository.getAllSettings(id);

    const dataObjectives: any = [];

    respSettings.map((setting: any, index: number) => {
      if (setting.settingType === 'objective') {
        dataObjectives.push(setting);
      }
      return true;
    });
    const mapDataObjectives: any[] = dataObjectives.map(
      (dm: any, index: number) => {
        const dataJson = JSON.parse(dm.settingValue);
        let data: any = {};
        if (dm.idSucursal === id) {
          data = {
            key: index,
            idObjective: dm.id,
            type: dm.settingName,
            months: dataJson.months,
            amount: dataJson.amount,
            nameVehicle: dataJson.nameVehicle,
            vehicleAmount: dataJson.vehicleAmount,
            createdAt: milisecondsToDate(dm.createdAt, 'MM-YYYY'),
            idSucursal: dm.idSucursal.toString(),
          };
        }
        return data;
      }
    );
    //console.log('DTA OBJECTIVES', mapDataObjectives);
    setDataObjective(mapDataObjectives);
    setLoading(false);
  }

  useEffect(() => {
    const componentdidmount = async () => {
      await getDataGraph();
    };
    componentdidmount();
  }, []);

  const tableObjectives = [
    {
      title: 'Monto de la meta',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any, row: any) => (
        <span className="leading-none">{currenyFormat(text, true)}</span>
      ),
    },
    {
      title: 'Meses para la meta',
      dataIndex: 'months',
      key: 'months',
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Auto de referencia',
      dataIndex: 'nameVehicle',
      key: 'nameVehicle',
    },
  ];

  return (
    <>
      <div style={{ paddingBottom: 10, width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ paddingRight: 10 }}>
              <div
                style={{
                  display: 'flex',
                  paddingBottom: 5,
                  justifyContent: 'center',
                }}
              >
                <b>Metas para la marca</b>
              </div>
              <Table
                dataSource={dataObjective}
                columns={tableObjectives}
                pagination={false}
              />
              {dataObjective.length === 0 && (
                <span>No existe una meta para la marca</span>
              )}
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  paddingBottom: 5,
                  justifyContent: 'center',
                }}
              >
                <b>Metas para la sucursal</b>
              </div>
              <Table
                dataSource={dataObjective}
                columns={tableObjectives}
                pagination={false}
              />
              {dataObjective.length === 0 && (
                <span>No existe una meta para la sucursal</span>
              )}
            </div>
          </div>
        </Card>
        <Loading visible={loading} />
      </div>
    </>
  );
};

export default Objectives;
