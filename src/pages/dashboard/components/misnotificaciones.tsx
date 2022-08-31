import React, { FunctionComponent, useEffect, useState } from 'react';
import { List } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import SocketClient from '../../../utils/socket-client';

const Misnotificaciones = () => {
  const [dataItems, setDataItems] = useState([]);

  const getNotifications = async () => {
    const notifications = await SocketClient.instance.getNotifications();
    const arrayItem: any = [];
    notifications.map((item: any) => (
      arrayItem.push(
        <Item
          title={item.title}
          message={item.description}
          time={moment(item.createdAt).fromNow()}
          read={item.viewed}
          link="/leads"
          id={item.id}
          dataContent={item.content}
        />
      )
    ));
    setDataItems(arrayItem);
  };

  useEffect(() => {
    getNotifications();
  }, []);
  const historyRouter = useHistory();
  return (
    <>
      <div className="DashboardModule MisNotificaciones">
        <List
          style={{ maxHeight: 460, overflowY: 'auto' }}
          header={
            <div className="misnotificacionesHeader">
              <BellOutlined /> Mis últimas notificaciones
            </div>
          }
          bordered
          dataSource={dataItems}
          renderItem={(i) => (
            <List.Item
              onClickCapture={() => {
                const { props } = i;
                const item: any = props;
                historyRouter.push(
                  `/lead/id-lead=${item.dataContent.idLead}/identification=${item.dataContent.identification}`,
                  {
                    step: 0,
                    id: item.dataContent.identification,
                    idLead: item.dataContent.idLead,
                  }
                );
              }}
            >
              {i}
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

const Item: FunctionComponent<{
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
  id: number;
  dataContent: any;
}> = ({ title, message, time, read, link }) => {
  return (
    <div className="notificacionItem flex">
      <div className="misseguimientosItemIcon">
        <div className={`readMarker ${read ? '' : 'active'}`} />
      </div>
      <div>
        <h6 className="mr-2">{title}</h6>
        <p className="notificacionItemMessage">{message}</p>
        <p className="notificacionItemTime">{`Hace ${time}`}</p>
      </div>
    </div>
  );
};

export default Misnotificaciones;
