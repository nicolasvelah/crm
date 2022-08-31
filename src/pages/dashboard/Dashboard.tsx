import React, { useEffect, useState } from 'react';
import { UserAddOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider } from 'antd';

import moment from 'moment';
import Menu from '../../components/Template';
import MyNotifications from './components/myNotifications';
import Statistics from './components/statistics';
import Funnel from './components/funnel';
import MisSeguimientos from './components/misseguimientos';

import './components/css/modules.css';
import Loading from '../../components/Loading';
import Objectives from './components/objectives';
import { RangeDates } from '../Follow/components/MainFollow';
import Leads from '../../data/models/Leads';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  return (
    <Menu page="Dashboard">
      <MainDashboard />
    </Menu>
  );
};

const dateFormat = 'YYYY/MM/DD';

const MainDashboard = () => {
  const [leads, setLeads] = useState<Leads[]>([]);

  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment().endOf('month')).format(dateFormat),
  });

  const getLeads = (allLeads: Leads[]) => {
    setLeads(allLeads);
  };

  return (
    <div className="max-w-screen-lg m-auto mt-10">
      <div className="mb-6 flex justify-between">
        <div className="">
          <div style={{ color: '#9e9e9ede' }}>
            Seleccione un rango de fechas:  
          </div>
          <div className="mt-4">
            <RangePicker
              defaultValue={[
                moment(rangeDate.startDate, dateFormat),
                moment(rangeDate.endDate, dateFormat),
              ]}
              format={dateFormat}
              onChange={async (dates: any, formatString: [string, string]) => {
                setRangeDate({
                  startDate: formatString[0],
                  endDate: formatString[1],
                });
              }}
            />
          </div>
        </div>

        <div className="">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            href="/prospect/form"
          >
            Crear Prospecto
          </Button>
        </div>
      </div>

      {/*<Objectives />*/}
      <div className="mb-6">
        <Statistics rangeDate={rangeDate} getLeads={getLeads} />
      </div>
      <div style={{ margin: '20px auto' }}>
        <Funnel rangeDate={rangeDate} allLeads={leads} />
      </div>
      <div className="mb-6 flex">
        <div className="w-6/12">
          <MisSeguimientos />
        </div>
        <div className="w-6/12">
          {/*   <MisNotificaciones /> */}
          <MyNotifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
