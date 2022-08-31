import React, { FunctionComponent, useContext, useState } from 'react';
import { Select, Badge, message } from 'antd';
import LeadsQuoteFinancial from '../../../data/models/LeadsQuoteFinancial';
import { ClientLeadContext } from '../../../components/GetClientData';
import { Dependencies } from '../../../dependency-injection';
import QuoteFinancialRepository from '../../../data/repositories/quote-financial-repository';
import Get from '../../../utils/Get';
import { switchResponseBank } from './SelectFinancialConsorcium';
import Leads from '../../../data/models/Leads';
import { financialSelected } from '../../../data/models/Quoute-Financial';

const SelectFinancialFleet: FunctionComponent<{
  leadQuoteFinancial: LeadsQuoteFinancial;
}> = ({ leadQuoteFinancial }) => {
  const { lead, setLead } = useContext(ClientLeadContext);
  const quoteFinancialRepository = Get.find<QuoteFinancialRepository>(
    Dependencies.quoteFinancial
  );

  const [loadingchosenEntity, setLoadingchosenEntity] = useState<boolean>(
    false
  );

  const handleChosenEntity = async (value: number) => {
    console.log('Selected', value);
    setLoadingchosenEntity(true);
    if (leadQuoteFinancial.quoteFinancial) {
      const arrayToSend: financialSelected[] = leadQuoteFinancial.quoteFinancial.map(
        (qf) => ({
          id: qf.id!,
          selected: qf.id === value,
        })
      );
      console.log('arrayToSend -->', arrayToSend);
      const resp = await quoteFinancialRepository.updateSelectedQuoteFinancialById(
        arrayToSend
      );
      if (resp) {
        message.success('Dato guardado con éxito');
        if (setLead) {
          setLead((prevState: Leads) => {
            const copy = { ...prevState };
            const newQuotesFinancial = copy.leadsQuoteFinancial?.quoteFinancial?.map(
              (qF) => {
                const newQF = { ...qF };
                if (qF.id === value) {
                  newQF.selected = true;
                } else {
                  newQF.selected = false;
                }
                return newQF;
              }
            );
            if (copy.leadsQuoteFinancial?.quoteFinancial) {
              copy.leadsQuoteFinancial.quoteFinancial = newQuotesFinancial;
            }

            return copy;
          });
        }
      } else {
        message.error('Error al guardar dato');
      }
    }
    setLoadingchosenEntity(false);
  };
  return (
    <Select
      key={`select_leadQuoteFinancial_${leadQuoteFinancial.id}`}
      size="small"
      placeholder="Selecciona una opción"
      style={{ width: 150 }}
      loading={loadingchosenEntity}
      disabled={!!lead?.saleDown}
      value={
        lead?.leadsQuoteFinancial?.quoteFinancial?.find((qf) => qf.selected)?.id
      }
      onChange={handleChosenEntity}
    >
      {leadQuoteFinancial.quoteFinancial &&
        leadQuoteFinancial.quoteFinancial.length > 0 &&
        leadQuoteFinancial.quoteFinancial.map((option, indexOp: number) => (
          <Select.Option
            disabled={switchResponseBank(option.responseBank!).disabled}
            key={indexOp}
            value={option.id!}
          >
            <Badge
              status={switchResponseBank(option.responseBank!).color as any}
              text={option.financial!.nameEntityFinancial!}
            />
          </Select.Option>
        ))}
    </Select>
  );
};

export default SelectFinancialFleet;
