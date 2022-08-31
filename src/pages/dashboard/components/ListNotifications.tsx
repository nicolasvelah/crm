import { List } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import INotification from '../../../data/models/Notification';
import { NOTIFICATION_TYPES } from '../../../utils/types-notification';

export interface ListNotificationsProps {}

const ListNotifications: FunctionComponent<{
  items: INotification[];
  onViewed: (index: number) => void;
}> = ({ items, onViewed }) => {
  const historyRouter = useHistory();
  return (
    <div>
      <List
        dataSource={items}
        header={
          <div className="misnotificacionesHeader" style={{ margin: '4px' }}>
            <BellOutlined /> Mis últimas notificaciones
          </div>
        }
        bordered
        className="container-notification"
        style={{ height: 460, overflowY: 'auto' }}
        renderItem={(item, index) => (
          <List.Item
            className="cursor-pointer"
            onClick={() => {
              if (!item.viewed) {
                onViewed(index);
              }
              switch (item.type) {
                case NOTIFICATION_TYPES.SALE_DOWN:
                  historyRouter.push(
                    `/lead/id-lead=${item.content.idLead}/identification=${item.content.identification}`,
                    {
                      step: 0,
                      id: item.content.identification,
                      idLead: item.content.idLead,
                    }
                  );
                  break;
                case NOTIFICATION_TYPES.LEAD_REASSIGNED:
                  break;

                case NOTIFICATION_TYPES.CREDIT_APPLICATION:
                  //console.log('item', item);
                  historyRouter.push(
                    `/credit/list/${item.content.id}/${
                      item.content.isFleet ? 'FLOTA' : 'COTIZACION'
                    }`
                  );
                  break;
                case NOTIFICATION_TYPES.RESPONSE_CREDIT_APPLICATION:
                  //console.log('item', item);
                  historyRouter.push(
                    `/credit/list/${item.content.id}/${
                      item.content.isFleet ? 'FLOTA' : 'COTIZACION'
                    }`
                  );
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.NEW_TRACING:
                  historyRouter.push(
                    `/lead/id-lead=${item.content.idLead}/identification=${item.content.client.identification}`,
                    {
                      step: 0,
                      id: item.content.client.identification,
                      idLead: item.content.idLead,
                      viewTracing: true,
                    }
                  );
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.PUBLIC_CATALOG:
                  historyRouter.push(
                    `/lead/id-lead=${item.content.idLead}/identification=${item.content.identificationClient}`,
                    {
                      step: 0,
                      id: item.content.identificationClient,
                      idLead: item.content.idLead,
                    }
                  );
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED:
                  historyRouter.push(
                    `/lead/id-lead=${item.content.idLead}/identification=${item.content.identificationClient}`,
                    {
                      step: 0,
                      id: item.content.identificationClient,
                      idLead: item.content.idLead,
                    }
                  );
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.WALLET_STATUS_CHANGED:
                  historyRouter.push(
                    `/lead/id-lead=${item.content.idLead}/identification=${item.content.identificationClient}`,
                    {
                      step: 0,
                      id: item.content.identificationClient,
                      idLead: item.content.idLead,
                    }
                  );
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED:
                  historyRouter.push(`/wallet/id-lead=${item.content.idLead}`, {
                    step: 0,
                    idLead: item.content.idLead,
                    deliveryData: item.content.deliveryData,
                    quoteData: item.content.quoteData,
                  });
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED_LEAD:
                  historyRouter.push(`/wallet/id-lead=${item.content.idLead}`, {
                    step: 0,
                    idLead: item.content.idLead,
                    deliveryData: item.content.deliveryDataArray,
                    quotesData: item.content.quotesDataArray,
                  });
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.QUOTERESERVEVALUE:
                  historyRouter.push(
                    `/lead/id-lead=${item.content.idLead}/identification=${item.content.identificationClient}`,
                    {
                      step: 0,
                      id: item.content.identificationClient,
                      idLead: item.content.idLead,
                    }
                  );
                  window.location.reload();
                  break;
                case NOTIFICATION_TYPES.LEAD_TO_REASSIGN:
                  historyRouter.push('/re-asign');
                  break;
                default:
                  break;
              }
            }}
          >
            <div
              className="w-full  DashboardModule MisNotificaciones flex flex-row"
              /*  style={{
                backgroundColor: !item.viewed ? '#f9f9f9' : '#ffff',
              }} */
            >
              <div style={{ width: 40 }}>
                <div className={`readMarker ${!item.viewed ? 'active' : ''}`} />
              </div>
              <div>
                <h6 className="mr-2">{item.title}</h6>
                {/* <div className="">
                  <span className="mr-2">{item.title}</span>
                </div> */}
                {/*<div className="flex justify-between">*/}
                <div className="notificacionItemMessage">
                  {item.description}
                </div>
                <small style={{ color: '#d2d2d2' }}>
                  {moment(item.createdAt).fromNow()}
                </small>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListNotifications;
