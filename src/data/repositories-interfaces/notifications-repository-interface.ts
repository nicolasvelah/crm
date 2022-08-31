import INotification from '../models/Notification'

export default interface NotificationsRepositoryInterface {
  getLastNotifications(): Promise<INotification[]>;
  setNotificationAsWiewed(notificationId: number): Promise<boolean>;
}
