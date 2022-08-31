import NotificationsAPI from '../providers/api/api-notifications';
import NotificationsRepositoryInterface from '../repositories-interfaces/notifications-repository-interface';
import INotification from '../models/Notification';

export default class NotificationsRepository
  implements NotificationsRepositoryInterface {
  private api!: NotificationsAPI;

  constructor(api: NotificationsAPI) {
    this.api = api;
  }

  getLastNotifications(): Promise<INotification[]> {
    return this.api.getLastNotifications();
  }

  setNotificationAsWiewed(notificationId: number): Promise<boolean> {
    return this.api.setNotificationAsWiewed(notificationId);
  }
}
