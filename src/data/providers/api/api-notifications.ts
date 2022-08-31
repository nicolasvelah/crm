import axios from 'axios';
import auth from '../../../utils/auth';

import INotification from '../../models/Notification';

export default class NotificationsAPI {
  getLastNotifications = async (): Promise<INotification[]> => {
    try {
      const token = await auth.getAccessToken();
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/user/last-notifications`,
        method: 'GET',
        headers: { token },
      });
      return response.data;
    } catch (e) {
      //console.log(e);
      return [];
    }
  };

  setNotificationAsWiewed = async (
    notificationId: number
  ): Promise<boolean> => {
    try {
      const token = await auth.getAccessToken();
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/v1/user/notification-viewed`,
        method: 'POST',
        headers: { token },
        data: { notificationId },
      });
      return true;
    } catch (e) {
      //console.log(e);
      return false;
    }
  };
}
