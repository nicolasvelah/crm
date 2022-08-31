import React, { useState, FunctionComponent, useEffect } from 'react';
//import Quote from '../Quote';
import MainCreditApplication from '../../lead/steps/new-credit-application/MainCreditApplication';
import setHistoryState from '../../../utils/set-history-state';

export const SwitchQuoteCreditContext = React.createContext<{
  isCreditView: boolean;
  setIsCreditView: Function;
  idQuote: number | null;
  setIdQuote: Function;
}>({
  isCreditView: false,
  setIsCreditView: () => {},
  idQuote: null,
  setIdQuote: () => {},
});

const SwitchQuoteCredit: FunctionComponent<{
  dataVehicleSelect: any;
  nextStep: Function;
}> = ({ dataVehicleSelect, nextStep }) => {
  const [isCreditView, setIsCreditView] = useState<boolean>(false);
  const [idQuote, setIdQuote] = useState<number | null>(null);
  useEffect(() => {
    setHistoryState(2);
  }, []);
  //console.log('RENDER SwitchQuoteCreditContext');
  return (
    <SwitchQuoteCreditContext.Provider
      value={{ isCreditView, setIsCreditView, idQuote, setIdQuote }}
    >
      {!isCreditView ? (
        {
          /*<Quote dataVehicleSelect={dataVehicleSelect} nextStep={nextStep} />*/
        }
      ) : (
        <MainCreditApplication nextStep={nextStep} />
      )}
    </SwitchQuoteCreditContext.Provider>
  );
};

export default SwitchQuoteCredit;
