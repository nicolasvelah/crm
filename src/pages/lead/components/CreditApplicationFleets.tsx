import React, {
  useContext,
  useState,
  useEffect,
  FunctionComponent,
} from 'react';
import { Button, Modal, Checkbox, message, Alert } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { ClientLeadContext } from '../../../components/GetClientData';
import Quotes from '../../../data/models/Quotes';
import { Vehicle } from '../../../data/models/Vehicle';
import Leads from '../../../data/models/Leads';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import LeadQuoteFinancialRepository from '../../../data/repositories/leads-quote-financial-repository';
import { allValuesOfQuote } from '../../../utils/extras';

const CreditApplicationFleets: FunctionComponent<{
  setDataFleet: React.Dispatch<
    React.SetStateAction<{
      idLeadsQuoteFinancial: number;
      isFleetCreditApplication: boolean;
      vehicles: Vehicle[];
    } | null>
  >;
  openDraweCredit: () => void;
}> = ({ setDataFleet, openDraweCredit }) => {
  const leadQuoteFinancialRepository = Get.find<LeadQuoteFinancialRepository>(
    Dependencies.leadQuoteFinancial
  );

  const [viewModal, setViewModal] = useState(false);
  const [options, setOptions] = useState<Quotes[]>([]);
  const [quotesId, setQuotesId] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { lead, setLead } = useContext(ClientLeadContext);

  useEffect(() => {
    const quotes = lead?.quotes?.filter((quo) => quo.type === 'credit');

    if (quotes) {
      setOptions(quotes);
      if (lead?.leadsQuoteFinancial) {
        //console.log('Entro leadsQuoteFinancial');
        const quotesFleet = lead.leadsQuoteFinancial.quotes?.map(
          (quo) => quo.id!
        );
        //console.log('quotesFleet', quotesFleet);
        if (quotesFleet) {
          setQuotesId(quotesFleet);
        }
      } else if (quotes.length > 0) {
        //console.log('Entro quotes.length');
        setQuotesId([quotes[0].id!]);
      }
    }
  }, [viewModal]);

  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
    setQuotesId(checkedValues.map((item) => parseInt(item as string)));
  };

  const createFleets = async () => {
    //console.log('quotesIds', { quotesId, idLead: lead?.id });

    /// Obtengo las cotizaciones actuales
    const actualQuotes = lead!.quotes!.filter((quo) => {
      return quotesId.includes(quo.id!);
    });

    if (lead?.leadsQuoteFinancial) {
      /// Preparo la data a ser mostrada en la solicitud de crédito
      const vehicles: Vehicle[] = actualQuotes.map((quo) => {
        const dataVal = allValuesOfQuote(quo);
        return {
          brand: dataVal.brand,
          description: dataVal.version,
          model: dataVal.model,
          value: dataVal.pvp,
          totalServices: dataVal.servicesValue,
          totalAccesories: dataVal.accesoriesValue,
          year: dataVal.year,
          entrada: dataVal.entry,
          financing: dataVal.financingValue,
          monthlyPayments: dataVal.monthly,
          plazo: dataVal.months,
          tasa: dataVal.rate,
          valueExtraEsKit: dataVal.valueEsKit,
        };
      });
      //console.log('vehicles CA -->', vehicles);

      /// seteo la data para que se muestre la solicitud de crédito
      setDataFleet({
        idLeadsQuoteFinancial: lead.leadsQuoteFinancial.id!,
        isFleetCreditApplication: true,
        vehicles,
      });
      /// Cierro el modal
      setViewModal(false);

      /// abro el drawer de la solcitud de crédito
      openDraweCredit();
    } else {
      setLoading(true);
      const resp = await leadQuoteFinancialRepository.createLeadQuoteFinancial(
        lead!.id!,
        quotesId
      );
      if (resp) {
        message.success('Datos preparados');

        /// Seteo leadsQuoteFinancial
        if (setLead) {
          setLead((prevState: Leads) => {
            const copy: Leads = { ...prevState };
            copy.leadsQuoteFinancial = resp;
            return copy;
          });
        }

        /// Preparo la data a ser mostrada en la solicitud de crédito
        const vehicles: Vehicle[] = actualQuotes.map((quo) => {
          const dataVal = allValuesOfQuote(quo);
          return {
            brand: dataVal.brand,
            description: dataVal.version,
            model: dataVal.model,
            value: dataVal.pvp!,
            totalServices: dataVal.servicesValue,
            totalAccesories: dataVal.accesoriesValue,
            year: dataVal.year,
            entrada: dataVal.entry,
            financing: dataVal.financingValue,
            monthlyPayments: dataVal.monthly,
            plazo: dataVal.months,
            tasa: dataVal.rate,
            valueExtraEsKit: dataVal.valueEsKit,
          };
        });
        //console.log('vehicles CA -->', vehicles);
        //console.log('vehicles', vehicles);

        /// seteo la data para que se muestre la solicitud de crédito
        setDataFleet({
          idLeadsQuoteFinancial: resp.id ?? 0,
          isFleetCreditApplication: true,
          vehicles,
        });
        setLoading(false);
        /// Cierro el modal
        setViewModal(false);

        /// abro el drawer de la solcitud de crédito
        openDraweCredit();
      } else {
        setLoading(false);
        message.error('No se pudo preparar los datos necesarios');
      }
    }
  };

  return (
    <>
      <Button loading={loading} onClick={() => setViewModal(true)}>
        Solicitud de Crédito Flotas
      </Button>
      <Modal
        title="Seleccione las cotizaciones para flotas"
        visible={viewModal}
        footer={
          <Button
            type="primary"
            disabled={quotesId.length <= 0}
            onClick={createFleets}
            loading={loading}
          >
            {lead?.leadsQuoteFinancial ? 'Ir a solicitud' : 'Confirmar'}
          </Button>
        }
        onCancel={() => setViewModal(false)}
        width={600}
      >
        {viewModal && (
          <div>
            {lead?.leadsQuoteFinancial && (
              <Alert
                message="Cotizaciones elegidas para la solicitud de crédito de flota"
                type="success"
                style={{ marginBottom: 10 }}
              />
            )}

            <Checkbox.Group
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
              defaultValue={
                options.length > 0
                  ? quotesId.length > 0
                    ? quotesId.map((quo) => quo.toString())
                    : [options[0].id!.toString()]
                  : undefined
              }
              onChange={onChange}
            >
              {options.map((op, index) => {
                const vehicle = op.vehiculo ? op.vehiculo![0] : null;
                return (
                  <Checkbox
                    style={{ display: 'flex', alignItems: 'center', margin: 5 }}
                    key={index}
                    disabled={!!lead?.leadsQuoteFinancial}
                    value={op.id?.toString()}
                  >
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: '#FDF4EC',
                      }}
                    >
                      <b>No: {op.id}</b>
                      <br />
                      <span>
                        {vehicle?.brand} {vehicle?.model} - {vehicle?.year}
                      </span>
                    </div>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreditApplicationFleets;
