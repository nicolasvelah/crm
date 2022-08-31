import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  UserOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { Button, List, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Get from '../../../utils/Get';
import TracingsRepository from '../../../data/repositories/tracings-repository';
import { Dependencies } from '../../../dependency-injection';
import { outTime } from '../../../components/Follow/TimeLine';
import LoadingDashboard from '../../../components/LoadingDashboard';
import { dateFormat, RangeDates } from '../../Follow/components/MainFollow';

const Misseguimientos: FunctionComponent = () => {
  /******************************HOOKS*****************************************/
  const [loading, setLoading] = useState<boolean>(false);
  // Seguimientos del mes
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('day')).format(dateFormat),
    endDate: moment(moment().endOf('day')).format(dateFormat),
  });
  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  const [data, setData] = useState([
    <Item title="" message="" time="" read={false} link="" />,
  ]);

  /******************************GENERALFUNCTIONAPI****************************/

  const tracingsOfDay = async () => {
    setLoading(true);
    const userTracingsByAPI = await tracingsRepository.getTracingsOfDay(
      rangeDate.startDate,
      rangeDate.endDate
    );
    if (userTracingsByAPI) {
      const mapData = userTracingsByAPI.map((dataMap) => (
        <Item
          title={`${dataMap.client?.name!} ${dataMap.client?.lastName!}`}
          message={dataMap.motive!}
          time={
            dataMap.closeDate
              ? 'Cerrado'
              : outTime(dataMap.executionDate!)
              ? 'Tarde'
              : 'A tiempo'
          }
          read={false}
          link=""
          identificationProspect={dataMap.client?.identification!}
          idLeadInput={dataMap.leads?.id!}
        />
      ));
      setData(mapData);
      setLoading(false);
      return 'ok';
    }
    setLoading(false);
    setData([]);
    return 'No tiene seguimientos del día';
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await tracingsOfDay();
    };
    componentdidmount();
  }, []);

  /*******************************RETURN***************************************/

  return (
    <>
      <div className="DashboardModule MisNotificaciones">
        <List
          style={{ height: 460, overflowY: 'auto' }}
          header={
            <div className="misnotificacionesHeader">
              {/*<ClockCircleOutlined />*/}
              <span> {data.length}</span> Seguimientos pendientes
            </div>
          }
          bordered
          /*pagination={{ onChange: (page) => {
              console.log(page);
            },
            pageSize: 6,
          }}*/
          className="container-notification"
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
      <LoadingDashboard visible={loading} />
    </>
  );
};

const Item: FunctionComponent<{
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
  identificationProspect?: string;
  idLeadInput?: number;
}> = ({
  title,
  message,
  time,
  link,
  read,
  identificationProspect,
  idLeadInput,
}) => {
  /******************************HOOKS*****************************************/

  // Direcciona a la pagina del usuario
  const historyRouter = useHistory();
  const goToLeadHistory = (idLead: number, identification: string) => {
    historyRouter.push(
      `/lead/id-lead=${idLead}/identification=${identification}`,
      {
        step: 0,
        id: identification,
        idLead,
      }
    );
  };

  /*******************************RETURN***************************************/
  return (
    <Button
      type="text"
      className="notificacionItem flex text-left"
      onClick={() => {
        goToLeadHistory(idLeadInput || 0, identificationProspect!);
      }}
    >
      <div className="misseguimientosItemIcon">
        <UserOutlined />
      </div>
      <div>
        <h6 className="notificacionItemT">{title}</h6>
        <span className="notificacionItemMessage">{message} </span>
        <span
          className={`notificacionItemTime ${
            time === 'Cerrado'
              ? 'closed'
              : time === 'A tiempo'
              ? 'ontime'
              : 'late'
          }`}
        >{`${time}`}</span>
      </div>
    </Button>
  );
};

export default Misseguimientos;
