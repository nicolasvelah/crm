import React from 'react';
import { Spin } from 'antd';

import auth from '../utils/auth';
import { getQueryParameterByName } from '../utils/extras';
import { Dependencies } from '../dependency-injection';
import Get from '../utils/Get';
import CRMRepository from '../data/repositories/CRM-repository';

export default class SplashPage extends React.PureComponent {
  componentDidMount() {
    this.init();
  }

  init = async () => {
    const token = getQueryParameterByName('dt');
    if (token) {
      const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
      const resp = await CRMRepository.init(token);
      //console.log('res', resp);
      if (!resp) {
        auth.signOut();
        window.location.href = '/404';
        return;
      }
      const role = auth.setSession(resp);
      if (role === 'ANFITRIÓN') {
        window.location.href = '/anfitrion';
        return;
      }
      if (role === 'CALL CENTER') {
        window.location.href = '/business';
        return;
      }
      window.location.href = '/dashboard';
    }
  };

  render() {
    return (
      <div className="h-screen flex text-center justify-center items-center ">
        <div>
          <Spin size="large" />
          <br />
          <span className="text-sm">Validando Acceso</span>
          {/* <div className="t-color-bn text-xs md:text-xl">Powered by ITZAM</div> */}
        </div>
      </div>
    );
  }
}
