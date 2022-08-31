import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  BellOutlined,
  CheckCircleOutlined,
  FireFilled,
} from '@ant-design/icons';
import { Popover, List, Button, Badge, Tooltip, Modal } from 'antd';
import moment from 'moment';
import INotification from '../data/models/Notification';
import { NOTIFICATION_TYPES } from '../utils/types-notification';

const Notifications: FunctionComponent<{
  items: INotification[];
  onViewed: (index: number) => void;
}> = ({ items, onViewed }) => {
  const historyRouter = useHistory();
  return (
    <Popover
      placement="bottom"
      content={
        <div style={{ width: 300 }}>
          <div className="bold">Notificaciones</div>
          <List
            dataSource={items}
            style={{ maxHeight: 300, overflowY: 'auto' }}
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

                    case NOTIFICATION_TYPES.RESPONSE_CREDIT_APPLICATION:
                      //console.log('item', item);
                      historyRouter.push(
                        `/credit/list/${item.content.id}/${
                          item.content.isFleet ? 'FLOTA' : 'COTIZACION'
                        }`
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
                    case NOTIFICATION_TYPES.PREBILL_APROVED_REQUESTED:
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
                      historyRouter.push(
                        `/wallet/id-lead=${item.content.idLead}`,
                        {
                          step: 0,
                          idLead: item.content.idLead,
                          deliveryData: item.content.deliveryData,
                          quoteData: item.content.quoteData,
                        }
                      );
                      window.location.reload();
                      break;
                    case NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED_LEAD:
                      historyRouter.push(
                        `/wallet/id-lead=${item.content.idLead}`,
                        {
                          step: 0,
                          idLead: item.content.idLead,
                          deliveryData: item.content.deliveryDataArray,
                          quotesData: item.content.quotesDataArray,
                        }
                      );
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
                    case NOTIFICATION_TYPES.BOSS_MESSAGE:
                      historyRouter.push(`/messages/${item.content.idMessage}`);
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
                  className="w-full"
                  style={{
                    backgroundColor: !item.viewed ? '#f9f9f9' : '#ffff',
                  }}
                >
                  <div className="flex justify-between items-end">
                    <span className="regular">{item.title}</span>
                    <small style={{ color: '#d2d2d2' }}>
                      {moment(item.createdAt).fromNow()}
                    </small>
                  </div>
                  <div>
                    <Tooltip
                      title={!item.viewed ? 'Pendiente' : 'Visto'}
                      placement="leftTop"
                    >
                      <div
                        className="normal "
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                        }}
                      >
                        {item.description}
                        <Button
                          type="link"
                          size="middle"
                          style={{ paddingRight: 15 }}
                          onClick={() => {
                            if (!item.viewed) {
                              onViewed(index);
                            }
                          }}
                          icon={
                            <CheckCircleOutlined
                              style={{
                                color: item.viewed ? '#0ADB28' : '#6d6875',
                                fontSize: 22,
                              }}
                            />
                          }
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      }
    >
      <Button
        type="link"
        className="py-1 px-5"
        size="large"
        style={{ color: '#000' }}
      >
        <Badge count={items.filter((e) => e.viewed === false).length}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Button>
    </Popover>
  );
};

export default Notifications;
