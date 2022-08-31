/* eslint-disable no-unused-vars */
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Pie,
  PieChart,
} from 'recharts';
import { Col, Divider, message, Row, Tabs } from 'antd';
import moment from 'moment';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import StadisticRepository from '../../../data/repositories/stadistic-repository';
import Loading from '../../../components/Loading';
import { StaidsticInputType } from '../../../data/providers/apollo/queries/stadistic';
import ObjectivesResult from '../../settings/Components/objectivesResult/ObjectivesResult';
import ObjectivesAllies from '../../settings/Components/objectivesAllies/ObjectivesAllies';
import ObjectivesAccessories from '../../settings/Components/objectivesAccessories/ObjectivesAccessories';
import auth from '../../../utils/auth';

const { user } = auth;
const { TabPane } = Tabs;

const MainStadistic: FunctionComponent = () => {
  // DEPENDENCY INJECTION
  const stadisticRepository = Get.find<StadisticRepository>(
    Dependencies.stadistic
  );
  // ESTADO PARA ACTIVAR EL LOADING SCREEN MIENTRAS OPERA
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<StaidsticInputType[]>();
  const [dataSaleDown, setDataSaleDown] = useState<StaidsticInputType[]>();

  const getDataStadistic = async () => {
    try {
      setLoading(true);
      const dataApi = await stadisticRepository.getLeadByMonth();
      const dataApiGetSaleDown = await stadisticRepository.getSaleDown();
      if (dataApi && dataApiGetSaleDown) {
        const nameMoth: StaidsticInputType[] = dataApi.map((datamap) => {
          return {
            name: moment(datamap.name, 'YYYY/MM').format('MMMM'),
            value: datamap.value,
          };
        });
        //console.log('dataApiGetSaleDown', dataApiGetSaleDown);
        setDataSaleDown(dataApiGetSaleDown);
        setData(nameMoth);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (e) {
      setLoading(false);
      //console.log(e.message);
      message.error('Error al obtener información');
      return false;
    }
  };

  useEffect(() => {
    const componentdidmount = async () => {
      await getDataStadistic();
    };
    componentdidmount();
  }, []);

  
  return (
    <>
      <h2 className="text-2xl c-black m-0 p-0 flex">
        <img
          className="mr-2"
          src="https://www.flaticon.es/svg/static/icons/svg/591/591813.svg"
          width="25"
        />
        Estadísticas
      </h2>
      <Divider />

      {user.role === 'JEFE DE VENTAS' && (
        <div style={{ marginBottom: 80 }}>
          <Divider
            orientation="left"
            style={{ marginTop: 20, marginBottom: 50 }}
          >
            Gráficos
          </Divider>
          <Row>
            <Col span={6}>
              <p style={{ textAlign: 'center', color: 'black' }}>
                Número de Leads mensuales
              </p>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="value" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#108ee9" />
              </BarChart>
            </Col>
            <Col offset={2} span={6}>
              <p style={{ textAlign: 'center', color: 'black' }}>
                Porcentaje de ventas caídas
              </p>
              <PieChart width={400} height={300}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={dataSaleDown}
                  cx={200}
                  cy={200}
                  outerRadius={80}
                  fill="#108ee9"
                  label
                />
                <Tooltip />
              </PieChart>
            </Col>
          </Row>
        </div>
      )}

      <div style={{ padding: ' 1px 20px' }}>
        <Divider orientation="left" style={{ marginTop: 10, marginBottom: 50 }}>
          Objetivos y metas
        </Divider>
        <Tabs tabPosition="left">
          <TabPane tab="Ventas" key="1">
            <div>
              <ObjectivesResult />
            </div>
          </TabPane>
          <TabPane tab="Aliados" key="2">
            <ObjectivesAllies />
          </TabPane>
          <TabPane tab="Accesorios" key="3">
            <ObjectivesAccessories />
          </TabPane>
        </Tabs>
      </div>

      <Loading visible={loading} />
    </>
  );
};

export default MainStadistic;
