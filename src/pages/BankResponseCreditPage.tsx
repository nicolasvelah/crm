import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { Input, message } from 'antd';
import Loading from '../components/Loading';
import Get from '../utils/Get';
import { crypt } from '../utils/crypto';
import { Dependencies } from '../dependency-injection';
import QuoteFinancialRepository from '../data/repositories/quote-financial-repository';

const { TextArea } = Input;

const CLASS_BUTTON =
  'rounded text-white h-10 flex justify-center items-center my-1';

const BankResponseCreditPage: FunctionComponent = () => {
  const { token, idQuoteFinancial, idUserFyI } = useParams();
  const historyRouter = useHistory();
  const quouteFinancialRepository = Get.find<QuoteFinancialRepository>(
    Dependencies.quoteFinancial
  );

  const [buttons, setButtons] = useState<{
    approbed: boolean;
    preapprobed: boolean;
    reject: boolean;
  }>({ approbed: true, preapprobed: false, reject: false });
  const [opinion, setOpinion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [okCreditResponse, setOkCreditResponse] = useState<boolean>(false);
  const [contact, setContact] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  const componentdidmout = async () => {
    try {
      //console.log({ token, idQuoteFinancial });
      if (token && idQuoteFinancial) {
        const updateButtons: any = (data: string) => {
          if (data === 'APPROBED') {
            return { approbed: true, reject: false, preapprobed: false };
          }
          if (data === 'PREAPPROBED') {
            return { approbed: false, reject: false, preapprobed: true };
          }
          if (data === 'REJECT') {
            return { approbed: false, reject: true, preapprobed: false };
          }
          return false;
        };
        const gucToken = crypt({
          token,
          expiresIn: 604800, // 7 dias 604800 segundos
          createdAt: moment().format('YYYY-MM-DDTHH:mm:ssZ'), //'2020-10-08T16:09:56.584Z'
        });
        localStorage.setItem('gucToken', gucToken);
        //console.log('ANTES');
        const respQuoteFinancial = await quouteFinancialRepository.getCreditsApplicationsById(
          parseInt(idQuoteFinancial)
        );

        if (respQuoteFinancial?.responseBank !== null) {
          setOkCreditResponse(true);
          setButtons(updateButtons(respQuoteFinancial?.responseBank!));
        }

        setLoading(false);
        if (respQuoteFinancial && !respQuoteFinancial.responseBank) {
          //if (respQuoteFinancial) {
          //console.log('respQuoteFinancial', respQuoteFinancial);
          setContact(
            `${respQuoteFinancial.financial?.nameContact} ${respQuoteFinancial.financial?.lastNameContact}`
          );
          setPhone(respQuoteFinancial.financial!.phoneEntityFinancial!);
          return;
        }
        // historyRouter.push('/');
        //localStorage.clear();
      } else {
        //console.log('ERROR', { token, idQuoteFinancial });
        setLoading(false);
        historyRouter.push('/');
        localStorage.clear();
      }
    } catch (error) {
      //console.log('ERROR', error.message);
      localStorage.clear();
      historyRouter.push('/');
    }
  };

  useEffect(() => {
    componentdidmout();
  }, []);

  if (loading) {
    return <Loading visible={loading} />;
  }
  return (
    <div className="container flex flex-col items-center">
      <div>
        <img
          width={200}
          src="/img/logo.png"
          alt=""
          style={{ margin: '0 auto' }}
        />
      </div>
      {!okCreditResponse ? (
        <div className="flex flex-col w-full md:w-1/2">
          <div className="mx-auto">
            <h3>Responda a la solicitud</h3>
          </div>
          <div
            className="mx-auto w-1/2"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <button
              className={CLASS_BUTTON}
              style={{
                backgroundColor: '#4e9a1c',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                opacity: buttons.approbed ? 1 : 0.2,
                width: buttons.approbed ? '100%' : '95%',
                cursor: 'pointer',
                transition: 'esase 0.3s',
              }}
              onClick={() => {
                setButtons({
                  approbed: true,
                  reject: false,
                  preapprobed: false,
                });
              }}
            >
              <b>APROBADO</b>
            </button>
            <button
              className={CLASS_BUTTON}
              style={{
                backgroundColor: '#789a1c',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                opacity: buttons.preapprobed ? 1 : 0.2,
                width: buttons.preapprobed ? '100%' : '95%',
                cursor: 'pointer',
                transition: 'esase 0.3s',
              }}
              onClick={() => {
                setButtons({
                  approbed: false,
                  reject: false,
                  preapprobed: true,
                });
              }}
            >
              <b>PREAPROBADO</b>
            </button>
            <button
              className={CLASS_BUTTON}
              style={{
                backgroundColor: '#d64242',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                opacity: buttons.reject ? 1 : 0.2,
                width: buttons.reject ? '100%' : '95%',
                cursor: 'pointer',
                transition: 'esase 0.3s',
              }}
              onClick={() => {
                setButtons({
                  approbed: false,
                  reject: true,
                  preapprobed: false,
                });
              }}
            >
              <b>RECHAZADO</b>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full md:w-1/2">
          <div className="mx-auto">
            <h3>Su respuesta se guardó con éxito</h3>
            <div
              className="px-2 py-1 w-1/2 text-center text-white mx-auto"
              style={{
                backgroundColor: buttons.approbed
                  ? '#4e9a1c'
                  : buttons.preapprobed
                  ? '#789a1c'
                  : '#d64242',
              }}
            >
              <span>
                {buttons.approbed
                  ? 'APROBADO'
                  : buttons.preapprobed
                  ? 'PREAPROBADO'
                  : 'RECHAZADO'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/*<div className="mt-6 mb-1 px-2">
        Si quieres modificar tu respuesta comunicate con{' '}
        <b>
          {contact} al {phone}
        </b>
                </div>*/}
      {!okCreditResponse && (
        <>
          <div className="w-1/2 m-2">
            <b>Comentario</b>
            <TextArea
              cols={15}
              onChange={(value) => setOpinion(value.target.value)}
            />
          </div>
          <div>
            <button
              className={`${CLASS_BUTTON} px-3`}
              style={{
                backgroundColor: '#FF9E30',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
              onClick={async () => {
                //console.log({ opinion, buttons });
                setLoading(true);
                const respQuoteFinancial = await quouteFinancialRepository.updateQuoteFinancialById(
                  parseInt(idQuoteFinancial),
                  buttons.approbed
                    ? 'APPROBED'
                    : buttons.preapprobed
                    ? 'PREAPPROBED'
                    : 'REJECT',
                  opinion,
                  parseInt(idUserFyI)
                );
                //console.log('respQuoteFinancial', respQuoteFinancial);
                setLoading(false);
                if (respQuoteFinancial) {
                  setOkCreditResponse(true);
                  localStorage.clear();
                } else {
                  message.error('Algo salió mal, vuelve a intentar.');
                }
                /* setOkCreditResponse(true);
                setLoading(false); */
              }}
            >
              <b>GUARDAR RESPUESTA</b>
            </button>
          </div>
        </>
      )}
      {/*  <div className="text-center">Powered by ITZAM</div> */}
    </div>
  );
};

export default BankResponseCreditPage;
