import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button } from 'antd';
import Closure from './components/Closure';
import ClosureV2 from './components/ClosureV2';
import { ClientLeadContext } from '../../components/GetClientData';

import Quotes from '../../data/models/Quotes';
import { Dependencies } from '../../dependency-injection';
import QuotesRepository from '../../data/repositories/quotes-repository';
import Get from '../../utils/Get';
import setHistoryState from '../../utils/set-history-state';
import Loading from '../../components/Loading';

const MainClousure: FunctionComponent<{ nextStep: Function }> = ({
  nextStep,
}) => {
  const { client, lead } = useContext(ClientLeadContext);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  /* const [quoteArray, setQuoteArray] = useState<Quotes[] | null>(null); */
  const [myActualQuote, setMyActual] = useState<Quotes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getDataQuote = async () => {
    //console.log('--> LLEGO A MAINCLOSURE', lead!.id!);
    setLoading(true);
    const respQuo = await quouteRepository.getQuotesByLead(lead!.id!);
    //console.log('respQuo', respQuo);
    if (respQuo) {
      const actualQuote = respQuo.find((qou) => qou.closed === true);

      //console.log('actualQuote', actualQuote);
      if (actualQuote) {
        //console.log('Cotizacion de cierre', actualQuote);
        setMyActual(actualQuote);
      } else {
        window.location.reload(); //// PARCHE PARA CUANDO NO RESPONDA LA BASE
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setHistoryState(3);
    getDataQuote();
  }, []);

  const selecQuote = (actualQ: Quotes) => {
    setMyActual(null);
    setTimeout(() => {
      setMyActual(actualQ);
    }, 500);
  };

  if (loading) {
    return <Loading visible />;
  }

  if (!myActualQuote) {
    return <div>No existe la cotización</div>;
  }

  return (
    <>
      {/* <Closure actualQuote={myActualQuote} nextStep={nextStep} /> */}
      <ClosureV2 actualQuote={myActualQuote} nextStep={nextStep} />
    </>
  );
};

export default MainClousure;
