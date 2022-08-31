import React, { FunctionComponent, useEffect, useState } from 'react';
import { Statistic, Card, Row, Col, Tooltip, Divider } from 'antd';
import {
  ArrowUpOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  AlertOutlined,
} from '@ant-design/icons';

import Get from '../../../utils/Get';
import TracingsRepository from '../../../data/repositories/tracings-repository';
import { Dependencies } from '../../../dependency-injection';
import { outTime } from '../../../components/Follow/TimeLine';
import { RangeDates } from '../../Follow/components/MainFollow';

import ClientsRepository from '../../../data/repositories/clients-repository';
import LoadingDashboard from '../../../components/LoadingDashboard';
import LeadsRepository from '../../../data/repositories/leads-repository';
import Leads from '../../../data/models/Leads';
import Client from '../../../data/models/Client';
import './css/funnel.css';
import { getStateOfLead, StateLead } from '../../../utils/extras';

const CRMColorBrand = '#F89829';

interface ClientsByChannels {
  channel: string;
  numberClients: number;
}

const Statistics: FunctionComponent<{
  rangeDate: RangeDates;
  getLeads: (leads: Leads[]) => void;
}> = ({ rangeDate, getLeads }) => {
  /******************************HOOKS*****************************************/
  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const leadRepository = Get.find<LeadsRepository>(Dependencies.leads);
  // Contadores
  const [redTracings, setRedTracings] = useState<number>();
  const [greenTracings, setGreenTracings] = useState<number>();
  const [blueTracings, setBlueTracings] = useState<number>();
  const [prospect, setProspect] = useState<number>();
  const [lead, setLead] = useState<number>();
  const [countLeads, setCountLeads] = useState<{
    active: number;
    saleDown: number;
    requestSaleDown: number;
  }>({
    active: 0,
    saleDown: 0,
    requestSaleDown: 0,
  });
  const [numberOfSales, setNumberOfSales] = useState<number>(0);
  // const [quote, setQuote] = useState<number>();

  const [clientsChannelsData, setClientsByChannelsData] = useState<{
    numberTotalClients: number;
    clientsByChannels: ClientsByChannels[];
  }>({
    numberTotalClients: 0,
    clientsByChannels: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  /******************************GENERALFUNCTIONAPI****************************/

  // Funcion que setea los seguimeintos a tiempo
  const countTracings = async (startDateGQ?: string, endDateGQ?: string) => {
    setLoading(true);
    /* const userTracingsByAPI = await tracingsRepository.getTracingsOfDay(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate
    ); */
    const userTracingsByAPI = await tracingsRepository.getTracingsByDates(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate,
      null
    );
    // console.log('userTracingsByAPI -->', userTracingsByAPI);
    let blueT: number = 0;
    let greenT: number = 0;
    let redT: number = 0;
    if (userTracingsByAPI) {
      userTracingsByAPI.forEach((dataMap) => {
        if (dataMap.closeDate) {
          blueT += 1;
        } else if (outTime(dataMap.executionDate!)) {
          redT += 1;
        } else {
          greenT += 1;
        }
      });
      setBlueTracings(blueT);
      setRedTracings(redT);
      setGreenTracings(greenT);
      setLoading(false);
      return 'ok';
    }
    setLoading(false);
    return 'No tiene seguimientos del mes';
  };

  const getClientsByChannelsFromLeads = (
    clients: Client[]
  ): {
    numberTotalClients: number;
    clientsByChannels: ClientsByChannels[];
  } => {
    const clientsByChannels: ClientsByChannels[] = [];

    clients.forEach((client) => {
      const indexList = clientsByChannels.findIndex(
        (item) => item.channel === client.chanel
      );
      if (indexList === -1 && client.chanel) {
        clientsByChannels.push({ channel: client!.chanel!, numberClients: 1 });
      } else if (indexList > -1) {
        // eslint-disable-next-line operator-assignment
        clientsByChannels[indexList].numberClients =
          clientsByChannels[indexList].numberClients + 1;
      }
    });
    return { numberTotalClients: clients.length, clientsByChannels };
  };

  //Funcion retorna los clientes del mes
  async function getDataGraph(startDateGQ?: string, endDateGQ?: string) {
    setLoading(true);

    const responseLeads = await leadRepository.getLeadsForUser(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate,
      ''
    );

    let leadCount1: number = 0;
    let salesComplete: number = 0;

    const leads = {
      active: 0,
      saleDown: 0,
      requestSaleDown: 0,
    };
    if (responseLeads) {
      // console.log('responseLeads stadistics-->', responseLeads);
      responseLeads.forEach((dataMap) => {
        leadCount1 += 1;
        if (dataMap.statusSaleDown === 'solicitada') {
          leads.requestSaleDown += 1;
        } else if (dataMap.saleDown) {
          leads.saleDown += 1;
        } else {
          leads.active += 1;
        }
        const resp = getStateOfLead(dataMap);
        if (resp === StateLead.FINALIZED) {
          salesComplete += 1;
        }
      });
      setCountLeads(leads);

      getLeads(responseLeads);
    }

    const responseClient = await clientsRepository.getClientsByBosses(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate
    );
    // console.log('responseClient -->', responseClient);
    if (responseClient) {
      setProspect(responseClient?.length);

      const dataResult = getClientsByChannelsFromLeads(responseClient);
      // console.log('dataResult -->', dataResult);
      setClientsByChannelsData(dataResult);
    }
    if (responseLeads) {
      setLead(leadCount1);
      setNumberOfSales(salesComplete);
    }
    setLoading(false);
  }

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await countTracings();
      await getDataGraph();
    };
    componentdidmount();
  }, [rangeDate]);

  const calcPercetage = (value: number, total: number) => {
    if (total === 0) {
      return '0 %';
    }
    return `${
      Number.isInteger((value * 100) / total)
        ? ((value * 100) / total).toFixed(0)
        : ((value * 100) / total).toFixed(2)
    } %`;
  };

  const tailLayout = {
    wrapperCol: { offset: 14 },
  };

  /*******************************RETURN***************************************/
  return (
    <>
      <div className="site-statistic-demo-card items-center">
        <Row gutter={16} justify="center" align="middle">
          <Col span={5}>
            <Card>
              <Statistic
                title="Número de ventas"
                value={numberOfSales}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div>Mis negocios</div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Tooltip
                  placement="top"
                  title={() => {
                    return <p>Activos</p>;
                  }}
                  color="#3f8600"
                >
                  <Statistic
                    value={countLeads.active}
                    precision={0}
                    valueStyle={{ color: '#3f8600', margin: '0px 5px' }}
                    prefix={<CheckOutlined />}
                  />
                </Tooltip>

                {countLeads.requestSaleDown > 0 && (
                  <Tooltip
                    placement="top"
                    title={() => {
                      return <p>Solicitud de Venta Caída</p>;
                    }}
                    color="#2a91d4"
                  >
                    <Statistic
                      value={countLeads.requestSaleDown}
                      precision={0}
                      valueStyle={{ color: '#2a91d4', margin: '0px 5px' }}
                      prefix={<AlertOutlined />}
                    />
                  </Tooltip>
                )}

                {countLeads.saleDown > 0 && (
                  <Tooltip
                    placement="top"
                    title={() => {
                      return <p>Venta Caída</p>;
                    }}
                    color="#cf1322"
                  >
                    <Statistic
                      value={countLeads.saleDown}
                      precision={0}
                      valueStyle={{ color: '#cf1322', margin: '0px 5px' }}
                      prefix={<CloseOutlined />}
                    />
                  </Tooltip>
                )}
              </div>
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Mis prospectos"
                value={prospect}
                precision={0}
                valueStyle={{ color: CRMColorBrand }}
                prefix={<UsergroupAddOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ margin: 'auto' }}>
                <div>Seguimientos del mes</div>
                <div className="inline-block mr-6">
                  <Statistic
                    value={greenTracings!}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </div>
                <div className="inline-block ">
                  <Statistic
                    value={redTracings!}
                    precision={0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </div>
                <div className="inline-block ml-10">
                  <Statistic
                    value={blueTracings!}
                    precision={0}
                    valueStyle={{ color: '#2a91d4' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="funnel-tag-containner w-12/12 flex justify-center">
        {clientsChannelsData.clientsByChannels.map((item, index) => (
          <Tooltip
            placement="top"
            title={() => {
              return (
                <div className="ml-3">
                  El 
                  {calcPercetage(
                    item.numberClients,
                    clientsChannelsData.numberTotalClients
                  )}
                    de los clientes provienen del canal{' '}
                  {item.channel.toLowerCase()}
                </div>
              );
            }}
            color="#ff8f00e8"
            key={index}
          >
            <div
              key={`index_${index}`}
              className={`funnel-tag-xl funnel-tag-${index + 2}`}
            >
              {calcPercetage(
                item.numberClients,
                clientsChannelsData.numberTotalClients
              )}{' '}
              / {clientsChannelsData.numberTotalClients} {item.channel}
            </div>
          </Tooltip>
        ))}
        {clientsChannelsData.clientsByChannels.length === 0 && (
          <div className="flex justify-center">
            <div className="funnel-tag-xl funnel-tag-2">
              0% / 0 Base de datos
            </div>
            <div className="funnel-tag-xl funnel-tag-3">0% / 0 Digital</div>
            <div className="funnel-tag-xl funnel-tag-4">0% / 0 Teléfono</div>
            <div className="funnel-tag-xl funnel-tag-5">0% / 0 Recompra</div>
            <div className="funnel-tag-xl funnel-tag-6">0% / 0 Referidos</div>
            <div className="funnel-tag-xl funnel-tag-7">
              0% / 0 Gestión Externa
            </div>
            <div className="funnel-tag-xl funnel-tag-8">0% / 0 Showroom</div>
          </div>
        )}
      </div>
      <Divider />
      <LoadingDashboard visible={loading} />
    </>
  );
};

export default Statistics;
