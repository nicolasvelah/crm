import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useState,
  useReducer,
} from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import NewCreditApplication from '../lead/steps/new-credit-application/NewCreditApplication2';

import { Dependencies } from '../../dependency-injection';
import QuotesRepository from '../../data/repositories/quotes-repository';
import Get from '../../utils/Get';
import Quotes from '../../data/models/Quotes';
import Loading from '../../components/Loading';
import Menu from '../../components/Template';
import auth from '../../utils/auth';
import ClientsRepository from '../../data/repositories/clients-repository';
import { calcLegals, calcTotal, allValuesOfQuote } from '../../utils/extras';
import { Vehicle } from '../../data/models/Vehicle';
import LeadQuoteFinancialRepository from '../../data/repositories/leads-quote-financial-repository';
import Leads from '../../data/models/Leads';

const MainDetailCreditApplication: FunctionComponent = () => {
  return (
    <Menu page="Creditos">
      <DetailCreditApplication />
    </Menu>
  );
};

const DetailCreditApplication: FunctionComponent = () => {
  const { id, type } = useParams();

  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const leadsQuouteFinancialRepository = Get.find<LeadQuoteFinancialRepository>(
    Dependencies.leadQuoteFinancial
  );

  const [actualQuote, setActualQuote] = useState<Quotes | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataConSuc, setDataConSuc] = useState<any>({});

  const [dataFleet, setDataFleet] = useState<{
    idLeadsQuoteFinancial: number;
    isFleetCreditApplication: boolean;
    vehicles: Vehicle[];
    lead: Leads;
  } | null>(null);

  const componentdidmount = async () => {
    setLoading(true);
    //console.log('id', id);
    if (type === 'FLOTA') {
      const fleetAct = await leadsQuouteFinancialRepository.getLeadsQuoteFinancialById(
        parseInt(id)
      );
      //console.log('fleetAct --->', fleetAct);
      if (fleetAct) {
        const vehicles: Vehicle[] = fleetAct.quotes!.map((quo) => {
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
        setDataFleet({
          idLeadsQuoteFinancial: parseInt(id),
          isFleetCreditApplication: true,
          vehicles,
          lead: fleetAct.leads!,
        });
      }
    } else {
      const actualQ = await quouteRepository.getQuoteById(parseInt(id));
      //console.log({ actualQ });
      if (actualQ) {
        const insuranceCarrierAmmount = actualQ!.insuranceCarrier!
          ? actualQ!.insuranceCarrier!.cost! * actualQ!.insuranceCarrier!.years!
          : 0;
        const legalsAmount = calcLegals(actualQ!.vehiculo![0].pvp!, true);
        const accesoriesValue =
          typeof actualQ!.accesoriesValue !== 'number'
            ? 0
            : actualQ!.accesoriesValue;
        const servicesValue =
          typeof actualQ!.servicesValue !== 'number'
            ? 0
            : actualQ!.servicesValue;
        const total =
          actualQ!.vehiculo![0].pvp! +
          accesoriesValue! +
          servicesValue! +
          (legalsAmount - (legalsAmount - legalsAmount / 1.12)) +
          insuranceCarrierAmmount +
          (actualQ!.registration! ? actualQ!.registration! : 0);

        const financing =
          calcTotal(
            total,
            actualQ!.vehiculo![0].pvp!,
            actualQ!.registration!,
            insuranceCarrierAmmount,
            false
          ) -
          actualQ!.inputAmount! -
          actualQ!.registration!;

        //console.log({ financing, total, legalsAmount, insuranceCarrierAmmount });

        //Valor extra de es_kit de accesorios
        const valueEsKit = actualQ.idAccesories?.reduce(
          (acumulador, valorActual) => {
            if (valorActual.es_kit === 1) {
              return (
                acumulador +
                (valorActual.cost
                  ? valorActual.cost * (valorActual.quantity ?? 0)
                  : 0)
              );
            }
            return acumulador;
          },
          0
        );

        setVehicle({
          brand: actualQ!.vehiculo![0]!.brand!,
          description: actualQ!.vehiculo![0]!.description!,
          model: actualQ!.vehiculo![0]!.model!,
          value: actualQ!.vehiculo![0]!.pvp!,
          totalServices: actualQ!.servicesValue ?? 0,
          totalAccesories: actualQ!.accesoriesValue ?? 0,
          year: actualQ!.vehiculo![0].year!,
          entrada: actualQ!.inputAmount!,
          financing,
          monthlyPayments: actualQ!.monthly!,
          plazo: actualQ!.months!,
          tasa: actualQ!.rate!,
          valueExtraEsKit: valueEsKit ?? 0,
        });
      }
      setActualQuote(actualQ);
      const concessionaire = actualQ?.leads?.concesionario?.name;
      const sucursal = actualQ?.leads?.sucursal?.name;
      setDataConSuc({
        concessionaire,
        sucursal,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    componentdidmount();
  }, []);

  if (loading) {
    return <Loading visible />;
  }

  if (!actualQuote && !dataFleet) {
    return <div>Cotización no encontrada</div>;
  }

  const { user } = auth;

  //console.log('VALOR EXTRA BUTTONS details', vehicle);

  return (
    <div className="max-w-screen-lg m-auto">
      <Button
        className="my-2"
        type="primary"
        ghost
        onClick={() => {
          window.history.back();
        }}
        icon={<ArrowLeftOutlined />}
      >
        Volver a prospecto
      </Button>
      {actualQuote && (
        <NewCreditApplication
          user={{
            name: actualQuote
              ? `${actualQuote.leads!.user.nombre} ${
                  actualQuote.leads!.user.apellido
                }`
              : '',
            concessionaire: dataConSuc.concessionaire || '',
            place: actualQuote!.leads!.city!,
            role: actualQuote.leads!.user.role ?? 'ASESOR COMERCIAL',
            sucursal: dataConSuc.sucursal || '',
          }}
          vehicle={vehicle!}
          client={actualQuote!.leads!.client!}
          idQuoute={parseInt(id)}
          nextStep={() => {}}
          quoteFinan={actualQuote.quoteFinancial}
          concesionarioCode={actualQuote?.leads?.concesionario?.code}
        />
      )}

      {dataFleet && (
        <NewCreditApplication
          client={dataFleet.lead.client!}
          user={{
            concessionaire: dataFleet.lead?.concesionario?.name || '',
            name: dataFleet.lead
              ? `${dataFleet.lead.user.nombre} ${dataFleet.lead.user.apellido}`
              : '',
            place: dataFleet.lead?.city ?? 'Sin ciudad',
            role: dataFleet.lead
              ? dataFleet.lead.user!.role!
              : 'ASESOR COMERCIAL',
            sucursal: dataFleet.lead?.sucursal?.name || '',
          }}
          nextStep={() => {}}
          concesionarioCode={dataFleet.lead?.concesionario?.code}
          {...dataFleet}
        />
      )}
    </div>
  );
};

export default MainDetailCreditApplication;
