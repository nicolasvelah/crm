/* eslint-disable no-underscore-dangle */
import io from 'socket.io-client';
import { notification } from 'antd';
import { Subject } from 'rxjs';
import auth from './auth';
import INotification from '../data/models/Notification';
import Get from './Get';
import NotificationsRepository from '../data/repositories/notifications-repository';
import { Dependencies } from '../dependency-injection';
import { NOTIFICATION_TYPES } from './types-notification';

export default class SocketClient {
  private static _instance: SocketClient | null = null;
  private socket: SocketIOClient.Socket | null = null;
  static get instance(): SocketClient {
    if (SocketClient._instance === null) {
      SocketClient._instance = new SocketClient();
    }
    return SocketClient._instance;
  }

  onNotificationStream = new Subject<INotification>();
  onConnectionStream = new Subject<boolean>();
  onCallUser = new Subject<INotification>();

  connected = false;
  notifications: INotification[] | null = null;

  connect = async () => {
    //console.log('process.env.WS_STATE -->', process.env.REACT_APP_WS_STATE);
    if (process.env.REACT_APP_WS_STATE === 'inactive') {
      console.log('WS Desactivated');
      return;
    }

    if (this.socket !== null) return; // si ya tenemos una conexion anterior

    if (!auth.wsToken) return;

    this.socket = io(process.env.REACT_APP_API_URL!, {
      query: {
        token: auth.wsToken,
      },
      reconnection: true,
      //transports: ['websocket'],
    });

    this.socket.on('connected', () => {
      //console.log('ws connected');
      this.connected = true;
      this.onConnectionStream.next(true);
    });
    this.socket.on('error', (data: any) => {
      //console.log('ws error', data);
    });

    this.socket.on('disconnect', () => {
      //console.log('ws disconnect');
      this.connected = false;
      this.onConnectionStream.next(false);
    });
    this.socket.on('on-notification', (data: INotification) => {
      //console.log('on-notification', data);

      switch (data.type) {
        case NOTIFICATION_TYPES.SALE_DOWN:
          notification.warning({
            message: data.title,
            description: data.description,
            className: 'cursor-pointer',
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (data.type === NOTIFICATION_TYPES.SALE_DOWN) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      idLead: data.content.idLead,
                      id: data.content.identification,
                    },
                  },
                  '',
                  `/lead/id-lead=${data.content.idLead}/identification=${data.content.identification}`
                );
                window.location.reload();
              }
            },
          });
          break;

        case NOTIFICATION_TYPES.SALE_DOWN_APROVED:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
            },
          });
          break;

        case NOTIFICATION_TYPES.SALE_DOWN_CALL_CENTER:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
            },
          });
          break;

        case NOTIFICATION_TYPES.LEAD_REASSIGNED:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
            },
          });
          break;
        case NOTIFICATION_TYPES.CREDIT_APPLICATION:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              window.history.pushState(
                {},
                '',
                `/credit/list/${data.content.id}/${
                  data.content.isFleet ? 'FLOTA' : 'COTIZACION'
                }`
              );
              window.location.reload();
            },
          });
          break;
        case NOTIFICATION_TYPES.RESPONSE_CREDIT_APPLICATION:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              window.history.pushState(
                {},
                '',
                `/credit/list/${data.content.id}/${
                  data.content.isFleet ? 'FLOTA' : 'COTIZACION'
                }`
              );
              window.location.reload();
            },
          });
          break;
        case NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED:
          if (data.content.status === 'APPROVED') {
            notification.success({
              message: data.title,
              description: data.description,
              duration: 5,
              onClick: async () => {
                await Get.find<NotificationsRepository>(
                  Dependencies.notifications
                ).setNotificationAsWiewed(data.id);
                if (data.type === NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED) {
                  window.history.replaceState(
                    {
                      ...window.history.state,
                      state: {
                        step: 0,
                        idLead: data.content.idLead,
                        id: data.content.identificationClient,
                      },
                    },
                    '',
                    `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                  );

                  window.location.reload();
                }
              },
            });
          }
          if (data.content.status === 'REJECTED') {
            notification.warning({
              message: data.title,
              description: data.description,
              duration: 5,
              onClick: async () => {
                await Get.find<NotificationsRepository>(
                  Dependencies.notifications
                ).setNotificationAsWiewed(data.id);
                if (data.type === NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED) {
                  window.history.replaceState(
                    {
                      ...window.history.state,
                      state: {
                        step: 0,
                        idLead: data.content.idLead,
                        id: data.content.identificationClient,
                      },
                    },
                    '',
                    `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                  );

                  window.location.reload();
                }
              },
            });
          }
          if (data.content.status === 'REQUESTED') {
            notification.success({
              message: data.title,
              description: data.description,
              duration: 5,
              onClick: async () => {
                await Get.find<NotificationsRepository>(
                  Dependencies.notifications
                ).setNotificationAsWiewed(data.id);
                if (data.type === NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED) {
                  window.history.replaceState(
                    {
                      ...window.history.state,
                      state: {
                        step: 0,
                        idLead: data.content.idLead,
                        id: data.content.identificationClient,
                      },
                    },
                    '',
                    `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                  );

                  window.location.reload();
                }
              },
            });
          }
          break;
        case NOTIFICATION_TYPES.WALLET_STATUS_CHANGED:
          if (data.content.status === 'APPROVED') {
            notification.success({
              message: data.title,
              description: data.description,
              duration: 5,
              onClick: async () => {
                await Get.find<NotificationsRepository>(
                  Dependencies.notifications
                ).setNotificationAsWiewed(data.id);
                if (data.type === NOTIFICATION_TYPES.WALLET_STATUS_CHANGED) {
                  window.history.replaceState(
                    {
                      ...window.history.state,
                      state: {
                        step: 0,
                        idLead: data.content.idLead,
                        id: data.content.identificationClient,
                      },
                    },
                    '',
                    `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                  );

                  window.location.reload();
                }
              },
            });
          } else {
            notification.warning({
              message: data.title,
              description: data.description,
              duration: 5,
              onClick: async () => {
                await Get.find<NotificationsRepository>(
                  Dependencies.notifications
                ).setNotificationAsWiewed(data.id);
                if (data.type === NOTIFICATION_TYPES.WALLET_STATUS_CHANGED) {
                  window.history.replaceState(
                    {
                      ...window.history.state,
                      state: {
                        step: 0,
                        idLead: data.content.idLead,
                        id: data.content.identificationClient,
                      },
                    },
                    '',
                    `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                  );

                  window.location.reload();
                }
              },
            });
          }
          break;
        case NOTIFICATION_TYPES.PREBILL_APROVED_REQUESTED:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (data.type === NOTIFICATION_TYPES.PREBILL_APROVED_REQUESTED) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      idLead: data.content.idLead,
                      id: data.content.identificationClient,
                    },
                  },
                  '',
                  `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                );

                window.location.reload();
              }
            },
          });
          break;
        case NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (data.type === NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      idLead: data.content.idLead,
                      deliveryData: data.content.deliveryData,
                      quoteData: data.content.quoteData,
                    },
                  },
                  '',
                  `/wallet/id-lead=${data.content.idLead}`
                );

                window.location.reload();
              }
            },
          });
          break;
        case NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED_LEAD:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (
                data.type === NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED_LEAD
              ) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      idLead: data.content.idLead,
                      deliveryData: data.content.deliveryDataArray,
                      quotesData: data.content.quotesDataArray,
                    },
                  },
                  '',
                  `/wallet/id-lead=${data.content.idLead}`
                );

                window.location.reload();
              }
            },
          });
          break;
        case NOTIFICATION_TYPES.QUOTERESERVEVALUE:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (data.type === NOTIFICATION_TYPES.QUOTERESERVEVALUE) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      idLead: data.content.idLead,
                      id: data.content.identificationClient,
                    },
                  },
                  '',
                  `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                );

                window.location.reload();
              }
            },
          });
          break;
        case 'EXAMPLE':
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
            },
          });
          break;
        case NOTIFICATION_TYPES.BOSS_MESSAGE:
          notification.warning({
            message: data.title,
            description: data.description,
            className: 'cursor-pointer',
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              window.history.pushState(
                {},
                '',
                `/messages/${data.content.idMessage}`
              );
              window.location.reload();
            },
          });
          break;
        case NOTIFICATION_TYPES.WALLET_CONFIRM_DOCUMENTS:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
            },
          });
          break;
        case NOTIFICATION_TYPES.NEW_TRACING:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (data.type === NOTIFICATION_TYPES.NEW_TRACING) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      id: data.content.client.identification,
                      idLead: data.content.idLead,
                      viewTracing: true,
                    },
                  },
                  '',
                  `/lead/id-lead=${data.content.idLead}/identification=${data.content.client.identification}`
                );

                window.location.reload();
              }
            },
          });
          break;
        case NOTIFICATION_TYPES.PUBLIC_CATALOG:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              if (data.type === NOTIFICATION_TYPES.PUBLIC_CATALOG) {
                window.history.replaceState(
                  {
                    ...window.history.state,
                    state: {
                      step: 0,
                      id: data.content.identificationClient,
                      idLead: data.content.idLead,
                    },
                  },
                  '',
                  `/lead/id-lead=${data.content.idLead}/identification=${data.content.identificationClient}`
                );

                window.location.reload();
              }
            },
          });
          break;
        case NOTIFICATION_TYPES.LEAD_TO_REASSIGN:
          notification.success({
            message: data.title,
            description: data.description,
            duration: 5,
            onClick: async () => {
              await Get.find<NotificationsRepository>(
                Dependencies.notifications
              ).setNotificationAsWiewed(data.id);
              window.history.pushState({}, '', '/re-asign');
              window.location.reload();
            },
          });
          break;
        default:
      }

      this.onNotificationStream.next(data);
    });
    this.socket.on('call-user', (data: INotification) => {
      //console.log('call-user', data);
      this.onCallUser.next(data);
    });
  };

  getNotifications = async (): Promise<INotification[]> => {
    if (this.notifications) return this.notifications;

    this.notifications = await Get.find<NotificationsRepository>(
      Dependencies.notifications
    ).getLastNotifications();

    return this.notifications;
  };

  addNotitication = (notificationAdd: INotification) => {
    this.notifications = [...this.notifications!, notificationAdd];
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  };
}
