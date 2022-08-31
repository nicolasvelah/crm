/* eslint-disable class-methods-use-this */
import axios from 'axios';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import User from '../data/models/User';
import milisecondsToDate from './milisecondsToDate';
import { decrypt, crypt } from './crypto';

interface SessionData {
  token: string;
  expiresIn: number;
  wsToken: string;
}

class Auth {
  async getAccessToken(): Promise<string | null> {
    const data = localStorage.getItem('gucToken');
    const dataToken = decrypt(data!, true);
    if (dataToken.data) {
      // get the session data
      const { token, expiresIn, createdAt } = dataToken.data;
      const deco = atob(token.split('.')[1]);
      const decoJson = JSON.parse(deco);
      const dateConverted = moment(decoJson.vigencia).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      const myDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));
      //const dateFake = moment('2020-10-30 08:30:41').format('YYYY-MM-DD HH:mm:ss')
      const dateComparison = moment(myDate).isAfter(dateConverted);
      //console.log('Fecha-actual ⏰', myDate, 'Fecha-token ⏰', dateConverted, 'vence ❌', dateComparison)
      const currentDate = new Date();
      const tokenDate = new Date(createdAt);
      // diference in seconds
      const difference = (currentDate.getTime() - tokenDate.getTime()) / 1000;
      //console.log('Tiempo restante 🚀', Math.round((expiresIn - difference) / 3600), 'HORAS')
      if (expiresIn - difference >= 60 && dateComparison === false) {
        // if the token is inside a valid time
        ////console.log('Token aun valido')
        return token;
      }
      // if the the token is expired
      //console.log('jwt✅✅✅', dataToken, '✅', token)
      const newToken = await this.refreshToken(token);
      if (newToken) {
        return newToken;
      }
      return null;
    }
    return null;
  }

  getApolloContext = async (): Promise<{
    headers: { token: string };
  } | null> => {
    const token = await this.getAccessToken();
    if (!token) return null;
    return {
      headers: {
        token,
      },
    };
  };

  /**
   * guradamos los datos de la session
   * @param data
   */
  setSession = (data: any): string | null => {
    this.setGucTokenStorage({ ...data, userData: undefined }); // guardamos el token de sesion
    const role = this.setGucUserStorage(data.userData); // guardamos el token de sesion
    return role;
  };

  // eslint-disable-next-line class-methods-use-this
  private setGucTokenStorage(data: SessionData): void {
    const crypGucToken = crypt({ ...data, createdAt: new Date() });
    localStorage.setItem('gucToken', crypGucToken);
  }

  // eslint-disable-next-line class-methods-use-this
  private setGucUserStorage(data: string): string | null {
    const userData = decrypt(data, true);
    //console.log('userData', userData);
    //localStorage.setItem('user', JSON.stringify(userData.userGUC));
    const crypData = crypt(userData.userGUC);
    localStorage.setItem('user', crypData);
    return userData.userGUC.role;
  }

  private async refreshToken(
    tokenToRefresh: string
  ): Promise<string | undefined | null> {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/v1/user/refresh-token`,
        headers: {
          token: tokenToRefresh,
        },
      });
      const { token, expiresIn, wsToken } = response.data;
      this.setGucTokenStorage({ token, expiresIn, wsToken }); // saves the data in the localStorage
      return token;
    } catch (error) {
      //console.log('refreshToke error', error);
      if (error.response && error.response.status) {
        //console.log('refreshToke error.response', error.response);
        return null;
      }
      return null;
      // throw new Error(error.message);
    }
  }

  get user(): any | null {
    const data = localStorage.getItem('user');
    if (!data) return null;
    const dataDecrypt = decrypt(data, true);
    //console.log('dataDecrypt', dataDecrypt);
    return dataDecrypt.data;
  }

  get wsToken(): string | null {
    const data = localStorage.getItem('gucToken');
    const dataWsToken = decrypt(data!, true);
    if (!data) {
      return null;
    }
    //console.log('DATA_WEB_SOCKET⭕', dataWsToken.data.wsToken)
    return dataWsToken.data.wsToken;
  }

  signOut = (): void => {
    localStorage.clear();
  };
}

const auth = new Auth();
export default auth;
