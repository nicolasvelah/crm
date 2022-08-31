import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { decrypt, crypt } from '../../utils/crypto';
import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import CRMRepository from '../../data/repositories/CRM-repository';
import { delay } from '../../utils/extras';

const RedirectVchat = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { idTracingVchat, idUserVchat, idLeadVchat } = useParams();

  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  const componentdidmount = async () => {
    try {
      //console.log('Params', { idTracingVchat, idUserVchat, idLeadVchat });
      if (!idTracingVchat || !idUserVchat || !idLeadVchat) {
        setError(true);
        setLoading(false);
        return;
      }
      //const dataToReasing = decrypt(idTracingVchat, true);
      //console.log('dataToReasing', dataToReasing);
      window.history.pushState('', '', '/redirect');
      const respApi = await CRMRepository.apiCall(
        'POST',
        '/api/v1/videocall/validate-vchat',
        {
          idTracingVchat,
          idUserVchat,
          idLeadVchat,
          //linkToRedirect: 'U2FsdGVkX1+uePk3rHMNjOJJKVkBO3TXfZ7aZZrKpUOG//brBwjToaE0Qbaf5ltqqe4gkIlHkzbM9Xe8CdqGBA=='
        }
      );
      if (!respApi.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      //console.log('respApi', respApi);
      const { data } = respApi.data;
      const linkVchat: string = decrypt(data.link);
      //console.log('decryot link', linkVchat);

      const crypGucToken = crypt({
        ...data.gucToken,
        createdAt: new Date(),
      });
      //console.log('crypGucToken', crypGucToken);
      localStorage.setItem('gucToken', crypGucToken);

      /* const crypLead = crypt(JSON.parse(linkVchat).lead);
      localStorage.setItem('lead', crypLead); */

      localStorage.setItem('link', data.link);

      const url = `${process.env.REACT_APP_API_URL_VCHAT}/vchat/${
        JSON.parse(linkVchat).code
      }`;
      window.history.replaceState(null, 'vchat', url);
      window.location.reload();
    } catch (er) {
      //console.log('Error RedirectVchat', er.message);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    componentdidmount();
  }, []);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading && <div>Cargando</div>}
      {error && <b>Link no válido</b>}
    </div>
  );
};

export default RedirectVchat;
