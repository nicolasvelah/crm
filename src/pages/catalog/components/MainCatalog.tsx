import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import { Alert, Button, Drawer, message } from 'antd';
import axios from 'axios';
import {
  CatalogContext,
  SelectNewVehicle,
} from '../../../state/CatalogueState';
import TestDriver from './testDiver/TestDriverV2';
import { ClientLeadContext } from '../../../components/GetClientData';
import ViewTestDriver from './testDiver/ViewTestDriver';
import setHistoryState from '../../../utils/set-history-state';
import Loading from '../../../components/Loading';
import graphqlRoute from '../../../data/providers/api/api-graphql';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import CatalogV2 from './Catalog';
import QuotesGenerated from '../../quote/components/QuotesGenerated';
import Quotes from '../../../data/models/Quotes';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import auth from '../../../utils/auth';
import { templateQuote } from '../../../utils/templates-html/template-new-credit';
import Inquiry from '../../../components/Inquiry/Inquiry';
import Leads from '../../../data/models/Leads';

const MainPriorityCatalog: FunctionComponent<{
  nextStepLead: Function;
  setDataVehicle: Function;
}> = ({ nextStepLead, setDataVehicle }) => {
  const { client, lead } = useContext(ClientLeadContext);

  return (
    <MainCatalog
      idLead={lead?.id ?? -1}
      nextStepLead={nextStepLead}
      setDataVehicle={setDataVehicle}
      client={client}
    />
  );
};

const MainCatalog: FunctionComponent<{
  idLead?: any;
  nextStepLead: Function;
  setDataVehicle: Function;
  client: any;
}> = ({ idLead, nextStepLead, setDataVehicle, client }) => {
  const { lead } = useContext(ClientLeadContext);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const [catalog, setCatalog] = useState<any[] | null>(null);
  const [quotesGenerated, setQuotesGenerated] = useState<Quotes[]>([]);
  const [viewTestDriver, setViewTestDriver] =
    useState<string>('catalogSelection');
  const [inquiryOpen, setInquiryOpen] = useState<boolean>(false);
  const [inquiryClosable, setInquiryClosable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTestDriverSelection, setDataTestDriverSelection] =
    useState<any>(null);
  const [selectNewVehicle, setSelectNewVehicle] =
    useState<SelectNewVehicle | null>(null);
  const [dataTestDriver, setDataTestDriver] = useState<any>([]);

  const getDataQuote = async () => {
    try {
      /* const responseDataQuotes = await quouteRepository.getQuotesByLead(
        idLead!
      );
      if (responseDataQuotes) {
        setQuotesGenerated([...responseDataQuotes]);
      } */
      //console.log('responseDataQuotes',responseDataQuotes, lead?.quotes);
      if (lead && lead.quotes) {
        setQuotesGenerated(lead.quotes);
      }
    } catch (err) {
      //console.log(err.message);
      message.error('No se puedo traer las cotizaciones.');
    }
  };

  const sendQuoteMail = async (quote: any) => {
    setLoading(true);
    try {
      const token = await auth.getAccessToken();
      console.log(
        'ultimo dato',
        client!,
        quote,
        true,
        lead!.concesionario!.code!
      );
      const templateStringHTML = templateQuote(
        client!,
        quote,
        true,
        lead!.concesionario!.code!
      );

      //console.log('debug_0SENDQUOTEMAIL', templateStringHTML);
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/v1/CRM/sendmail`,
        headers: {
          token,
        },
        data: {
          asunto: 'Cotización de vehículo',
          template: 'FreeTemplate',
          bodyData: templateStringHTML!,
          destinatario: client.email,
          //copia: 'nvela@pas-hq.com',
          copia: '',
          //cc: 'vhidalgo@pas-hq.com',
          cc: '',
          adjuntos: 1,
        },
      });
      //console.log('response', response);

      message.success('Mail enviado al cliente');
    } catch (err) {
      //console.log('Error', err.message);
      message.error('Algo salió mal, vuelve a intentar.');
    }
    setLoading(false);
  };

  const setOnFinishValue = (booleanData: boolean) => {
    setInquiryClosable(booleanData);
  };

  useEffect(() => {
    getDataQuote();
    setHistoryState(1);
    //console.log('INQUIRY LEADS', lead);
    if (!lead?.inquiry || !lead?.workPage) {
      setInquiryOpen(true);
      setInquiryClosable(false);
    }
  }, []);

  useEffect(() => {
    if (lead && lead.quotes) {
      setQuotesGenerated(lead.quotes);
    }
  }, [lead]);

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Button type="link" onClick={() => setInquiryOpen(true)}>
          Ver Indagación
        </Button>
      </div>
      <CatalogContext.Provider
        value={{
          catalog,
          setCatalog,
          setDataTestDriver,
          setDataTestDriverSelection,
          setViewTestDriver,
          selectNewVehicle,
          setSelectNewVehicle,
        }}
      >
        {viewTestDriver === 'catalogSelection' && (
          <div>
            {quotesGenerated && (
              <QuotesGenerated
                title="Mis cotizaciones"
                dataQuote={quotesGenerated}
                nextStep={nextStepLead}
                sendQuoteMail={sendQuoteMail}
                loading={loading}
                idLead={idLead}
                setViewTestDriver={setViewTestDriver}
                setSelectNewVehicle={setSelectNewVehicle}
              />
            )}

            <GetTestDriver idLead={idLead} />
            <CatalogV2
              nextStep={nextStepLead}
              setViewTestDriver={setViewTestDriver}
              setSelectNewVehicle={setSelectNewVehicle}
              setDataVehicle={setDataVehicle}
              setQuotesGenerated={setQuotesGenerated}
            />
          </div>
        )}
        {viewTestDriver === 'testDriver' && (
          <TestDriver dataTestDriverSelection={dataTestDriverSelection} />
        )}
        <Drawer
          placement="bottom"
          closable={inquiryClosable}
          onClose={() => setInquiryOpen(false)}
          visible={inquiryOpen}
          getContainer={false}
          key="Indagación"
          style={{
            position: 'absolute',
            height: inquiryClosable && !inquiryOpen ? '0' : '100%',
          }}
          drawerStyle={{
            backgroundColor: 'rgba(255,255,255,1)',
            height: '100%',
          }}
          headerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
          bodyStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
          mask={false}
        >
          <Inquiry
            setOnFinishValue={setOnFinishValue}
            setInquiryClosable={setInquiryClosable}
            inquiryClosable={inquiryClosable}
            setInquiryOpen={setInquiryOpen}
          />
        </Drawer>

        <Loading visible={loading} />
      </CatalogContext.Provider>
    </div>
  );
};

const GetTestDriver: FunctionComponent<{ idLead: number }> = ({ idLead }) => {
  const { setLead } = useContext(ClientLeadContext);
  const { setDataTestDriverSelection } = useContext(CatalogContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTestDriver, setDataTestDriver] = useState<any[]>([]);

  useEffect(() => {
    const componentdidmount = async () => {
      setLoading(true);
      setDataTestDriverSelection(null);
      const QUERY = `{getTestDriverId(idLead: ${idLead}) {
        id
        testDrivePrint
        codeVehicle
        brandVehicle
        vin
        route
        drivers {
          name
          lastName
          urlLicenceImage
          key
          validLicense
        }
        dateCreatedTestDriver
        dateUpdateTestDriver
        dateTestDriver
        dateTestConfirmation
        startKm
        endKm
        observations
        urlImageVehicle
        modelVehicle
        yearVehicle
        colorVehicle
        priceVehicle
        confirmTestDrive
      }}`;
      const resp = await graphqlRoute(QUERY);
      setLoading(false);
      if (resp.data) {
        //console.log('RESP DATA', resp.data.getTestDriverId);
        setDataTestDriver(resp.data.getTestDriverId);
        if (setLead) {
          setLead((prevState: Leads) => {
            const copy: Leads = { ...prevState };
            copy.testDriver = resp.data.getTestDriverId;
            return copy;
          });
        }
      }
    };

    //console.log('LEAD GetTestDriver', lead);

    componentdidmount();
  }, []);
  return (
    <>
      <ViewTestDriver dataTestDriver={dataTestDriver} />
      <Loading visible={loading} />
    </>
  );
};

export default MainPriorityCatalog;
