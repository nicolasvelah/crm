/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/state-in-constructor */
import React from 'react';
import { Subscription } from 'rxjs';
import INotification from '../../../data/models/Notification';
import NotificationsRepository from '../../../data/repositories/notifications-repository';
import { Dependencies } from '../../../dependency-injection';
import ListNotifications from './ListNotifications';
import auth from '../../../utils/auth';
import Get from '../../../utils/Get';
import SocketClient from '../../../utils/socket-client';

interface SettingButton {
  name: string;
  pathImage: string;
  route: string;
}

class MyNotifications extends React.Component<{}> {
  state = {
    contract: true,
    notifications: [] as INotification[],
  };

  notificationsSubscription: Subscription | null = null;

  componentDidMount() {
    const { user } = auth;

    SocketClient.instance.connect(); // nos conectamos al ws
    this.notificationsSubscription = SocketClient.instance.onNotificationStream.subscribe(
      (data) => {
        const tmp = this.state.notifications;
        this.setState({ notifications: [data, ...tmp] });
      }
    );
    this.loadNotifications();
  }

  componentWillUnmount() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }
  loadNotifications = async () => {
    const notifications = await SocketClient.instance.getNotifications();
    this.setState({
      notifications,
    });
  };

  onNotificationViewed = async (index: number) => {
    const tmp = this.state.notifications;
    tmp[index].viewed = true;
    await Get.find<NotificationsRepository>(
      Dependencies.notifications
    ).setNotificationAsWiewed(tmp[index].id);
    SocketClient.instance.notifications = tmp;
    this.setState({ notifications: [...tmp] });
  };

  render() {
    const { contract, notifications } = this.state;

    const { user } = auth;

    return (
      <div>
        <ListNotifications
          onViewed={this.onNotificationViewed}
          items={notifications}
        />
      </div>
    );
  }
}

export default MyNotifications;
