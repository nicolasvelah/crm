import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from 'react';
import { Select, Badge, notification, message } from 'antd';
import Quotes from '../../../data/models/Quotes';
import Financial from '../../../data/models/Financial';
import { ClientLeadContext } from '../../../components/GetClientData';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import Leads from '../../../data/models/Leads';
import QuoteFinancialRepository from '../../../data/repositories/quote-financial-repository';
import { financialSelected } from '../../../data/models/Quoute-Financial';

const { Option } = Select;

export const switchResponseBank = (responseBank: string | null) => {
  switch (responseBank) {
    case 'PREAPPROBED':
      return {
        status: 'PRE-APROBADO',
        color: 'processing',
        disabled: false,
      };
    case 'APPROBED':
      return {
        status: 'APROBADO',
        color: 'success',
        disabled: false,
      };
    case null:
      return {
        status: 'PENDIENTE',
        color: 'warning',
        disabled: true,
      };
    default:
      return {
        status: 'RECHAZADO',
        color: 'error',
        disabled: true,
      };
  }
};

const SelectFinancialConsorcium: FunctionComponent<{
  quote: Quotes;
  consorcio: { item: string; value: string; id: number }[];
  setVehiclesToShow: Function;
}> = ({ quote, consorcio, setVehiclesToShow }) => {
  /* Context and repository */
  const { lead, setLead } = useContext(ClientLeadContext);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const {
    quoteFinancialMutationProvider: { updateSelectedQuoteFinancialById },
  } = Get.find<QuoteFinancialRepository>(Dependencies.quoteFinancial);

  /* Hooks */
  const [loadingchosenEntity, setLoadingchosenEntity] = useState<boolean>(
    false
  );
  const [valueSelected, setValueSelected] = useState<string | null>(null);

  /* let valueSelected = quote.quoteFinancial?.find((qF) => qF.selected)?.financial
    ?.nameEntityFinancial;
 //console.log('valueSelected-------', valueSelected);
  if (quote.type === 'credit') {
    const returned = quote.quoteFinancial?.find((df: any) => {
      return df.responseBank === 'APPROBED' && df.selected === true;
    });
    if (returned && returned.financial) {
      valueSelected = returned.financial.nameEntityFinancial;
    }
  } else if (quote.chosenEntity) {
    valueSelected = quote.chosenEntity.entity;
  } */
  useEffect(() => {
    //console.log('valueSelected------- consorcio', consorcio);
  }, [consorcio]);

  useEffect(() => {
    if (quote.type === 'credit') {
      const selectFin = quote.quoteFinancial?.find((qF) => qF.selected)
        ?.financial?.nameEntityFinancial;
      if (selectFin) {
        setValueSelected(selectFin);
      }
    } else {
      const selectCon = quote.chosenEntity?.entity;
      if (selectCon) {
        setValueSelected(selectCon);
      }
    }
  }, []);

  const chosenEntity = async (
    idValue: number,
    idQuote: number,
    typeQuote: string
  ) => {
    //console.log('valueSelected-------', idValue);
    setLoadingchosenEntity(true);
    /* const selectConsorcio = consorcio.find(
      (df) => df.value === idValue.toString()
    ); */
    const selectConsorcio = consorcio.find((df) => df.id === idValue);
    if (!selectConsorcio) {
      notification.error({
        message: 'No se pudo actualizar la entidad.',
      });
      return;
    }
    //console.log('valueSelected------- selectConsorcio', selectConsorcio);
    const myNewChosenEntity = {
      idEntity: idValue,
      entity: selectConsorcio.item,
      type: typeQuote === 'counted' ? 'CONSORTIUM' : 'FINANCIAL',
    };
    //CONSORTIUM, FINANCIAL, ALL
    const resp = await quouteRepository.updateChosenEntityByIdQuote(
      idQuote,
      myNewChosenEntity
    );
    if (resp) {
      notification.open({
        message: 'Se actualizó la entidad.',
      });
      if (setVehiclesToShow) {
        setVehiclesToShow((prevState: any) => {
          const actualQuoteIndex = (prevState as any[]).findIndex(
            (quo) => quo.id === idQuote
          );
          //console.log('log4');
          //console.log({ actualQuoteIndex });
          if (actualQuoteIndex > -1) {
            const beforeQuotes = prevState;
            beforeQuotes[actualQuoteIndex] = {
              ...beforeQuotes[actualQuoteIndex],
              chosenEntity: myNewChosenEntity,
            };
            //console.log({ beforeQuotes });
            return [...beforeQuotes];
          }
          return prevState;
        });
        //console.log('log5');
      }
      if (setLead) {
        //console.log('log6');
        //setLead((prevLead: any) => ({ ...prevLead, quotes: newQuotes }));
        setLead((prevState: Leads) => {
          const copia = { ...prevState };
          //console.log('ESTADO PREV 1', prevState);
          const actualQuoteIndex = copia?.quotes?.findIndex(
            (quo) => quo.id === idQuote
          );
          if (typeof actualQuoteIndex === 'number' && actualQuoteIndex > -1) {
            copia.quotes![actualQuoteIndex] = {
              ...copia.quotes![actualQuoteIndex],
              chosenEntity: myNewChosenEntity,
            };
            //console.log('ESTADO PREV 2', copia);
            return copia;
          }
          return prevState;
        });
      }

      setValueSelected(selectConsorcio.item);
    } else {
      notification.error({
        message: 'No se pudo actualizar la entidad.',
      });
    }
    setLoadingchosenEntity(false);

    /* setTimeout(() => {
      // cambiar set time out por resolver para actualizar chosenEntity
    }, 3000); */
  };

  const setSelected = async (recordInput: Quotes, value: number) => {
    try {
      setLoadingchosenEntity(true);
      //console.log('martin_record_0', recordInput, value);
      // @ts-ignore
      const listSelected = recordInput.quoteFinancial?.filter(
        (datafilter: any) => {
          return (
            datafilter.responseBank === 'APPROBED' ||
            datafilter.responseBank === 'PREAPPROBED'
          );
        }
      );
      const arrayData: financialSelected[] = [];
      if (listSelected) {
        listSelected.forEach((dm) => {
          if (dm.id === value) {
            arrayData.push({ id: dm.id, selected: true });
          } else {
            arrayData.push({ id: dm.id!, selected: false });
          }
        });
      }

      // @ts-ignore
      const Api = await updateSelectedQuoteFinancialById(arrayData);
      if (Api) {
        if (setLead) {
          setLead((prevState: Leads) => {
            const actualLead = prevState;
            const indexQuote = actualLead?.quotes?.findIndex(
              (df) => df.id === recordInput.id
            );
            if (typeof indexQuote === 'number' && indexQuote > -1) {
              const indexfinancial = actualLead.quotes![
                indexQuote
              ].quoteFinancial?.findIndex((df) => df.id === value);
              if (typeof indexfinancial === 'number' && indexfinancial > -1) {
                const dataActual = actualLead.quotes![indexQuote]
                  .quoteFinancial![indexfinancial];
                actualLead.quotes![indexQuote].quoteFinancial![
                  indexfinancial
                ] = { ...dataActual, selected: true };
                return { ...actualLead };
              }
            }
            return prevState;
          });
        }
        const quoFinancial = recordInput.quoteFinancial?.find(
          (datafilter) => datafilter.id === value
        );
        const namefinancial = quoFinancial?.financial?.nameEntityFinancial;
        if (namefinancial) {
          setValueSelected(namefinancial);
        }

        //setTimeout(() => {//console.log('lead actualizado financiera_3', lead) }, 2000);
        message.success('Dato guardado con éxito');
        setLoadingchosenEntity(false);
        return true;
      }
      message.error('Error al guardar dato');
      setLoadingchosenEntity(false);
      return false;
    } catch (e) {
      message.error('Error al guardar dato');
      setLoadingchosenEntity(false);
      return false;
    }
  };

  return (
    <Select
      key={`select${quote.id}`}
      size="small"
      placeholder="Selecciona una opción"
      style={{ width: 150 }}
      loading={loadingchosenEntity}
      disabled={!!lead?.saleDown}
      value={valueSelected ?? undefined}
      onChange={async (value: string) => {
        //console.log('valueSelected-------', value);
        if (quote.type !== 'credit') {
          await chosenEntity(
            Number(value),
            quote.id ?? 0,
            quote.type ?? 'CONSORTIUM'
          );
          /* if (ok) {
            valueSelected = value;
           //console.log('valueSelected-------', value);
          } */
        } else if (quote.quoteFinancial && quote.quoteFinancial.length > 0) {
          setSelected(quote, Number(value));
        }
      }}
    >
      {quote.type !== 'credit' ? (
        <>
          {consorcio.map((option, indexOp) => (
            <Option key={indexOp} value={option.id}>
              {option.item}
            </Option>
          ))}
        </>
      ) : (
        <>
          {quote.quoteFinancial &&
            quote.quoteFinancial.length > 0 &&
            quote.quoteFinancial.map((option: any, indexOp: number) => (
              <Option
                disabled={switchResponseBank(option.responseBank).disabled}
                key={indexOp}
                value={option.id}
              >
                <Badge
                  status={switchResponseBank(option.responseBank).color as any}
                  text={option.financial.nameEntityFinancial}
                />
              </Option>
            ))}
        </>
      )}
    </Select>
  );
};

export default SelectFinancialConsorcium;
