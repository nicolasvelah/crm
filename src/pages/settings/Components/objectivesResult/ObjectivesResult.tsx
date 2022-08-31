/* eslint-disable no-unused-vars */
import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';
import { Divider } from 'antd';
import ObjectivesRepository from '../../../../data/repositories/objetives-repository';
import QuotesRepository from '../../../../data/repositories/quotes-repository';
import { Dependencies } from '../../../../dependency-injection';
import Get from '../../../../utils/Get';
import { Objectives } from '../../../../data/models/Objectives';
import Quotes from '../../../../data/models/Quotes';
import '../../css/settings.scss';
import Result from './Result';
import { RangeDates } from '../../../Follow/components/MainFollow';
import Loading from '../../../../components/Loading';
import auth from '../../../../utils/auth';

const dateFormat = 'YYYY/MM/DD';
export interface ObjectivesResultProps {}

const { user } = auth;

const ObjectivesResult: FunctionComponent<ObjectivesResultProps> = () => {
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const objectivesRepository = Get.find<ObjectivesRepository>(
    Dependencies.objectives
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [marginObjective, setMarginObjective] = useState<number>(0);
  const [qualityObjective, setQualityObjective] = useState<number>(0);
  const [marginCurrentObjective, setMarginCurrentObjective] = useState<number>(
    0
  );
  const [
    quantityCurrentObjective,
    setQuatityCurrentObjective,
  ] = useState<number>(0);
  const [
    marginPorcentageExonerated,
    setMarginPorcentageExonerated,
  ] = useState<number>(0);
  const [
    quantityPorcentageExonerated,
    setQuantityPorcentageExonerated,
  ] = useState<number>(0);
  const [
    marginObjectiveExonerated,
    setMarginObjectiveExonerated,
  ] = useState<number>(0);
  const [
    qualityObjectiveExonerated,
    setQualityObjectiveExonerated,
  ] = useState<number>(0);
  const [
    marginCurrentObjectiveExonerated,
    setMarginCurrentObjectiveExonerated,
  ] = useState<number>(0);
  const [
    quantityCurrentObjectiveExonerated,
    setQuatityCurrentObjectiveExonerated,
  ] = useState<number>(0);
  const [marginPorcentage, setMarginPorcentage] = useState<number>(0);
  const [quantityPorcentage, setQuantityPorcentage] = useState<number>(0);
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment().endOf('month')).format(dateFormat),
  });

  const calc = (valorRef: number, valorIn: number) => {
    if (valorRef === 0) return 0;
    const calcPorcetage = (valorIn * 100) / valorRef;
    return calcPorcetage;
  };

  const globalData = async (goalData: any, objecData: any) => {
    let total = 0;
    if (goalData) {
      setQualityObjective(goalData.length);
      goalData.map((quoteData: any, index: number) => {
        if (quoteData && quoteData.vimVehiculoData) {
          total += quoteData.vimVehiculoData.margen;
        }
        return true;
      });
      setMarginObjective(total);
    }
    let totalObjectives = 0;
    let quatityObjectives = 0;
    if (objecData) {
      objecData.map((objectivesData: any, objectiveIndex: number) => {
        totalObjectives += objectivesData.margin;
        quatityObjectives += objectivesData.quantity;
        return true;
      });
      setQuatityCurrentObjective(quatityObjectives);
      setMarginCurrentObjective(totalObjectives);
    }
    console.log('PORCENTAJE', totalObjectives, total);
    const valorMargin = await calc(totalObjectives, total);

    console.log('PORCENTAJE', valorMargin);
    const valorQuantity = await calc(quatityObjectives, goalData.length);
    const convertedValorMargin = Number.isInteger(valorQuantity)
      ? valorQuantity.toFixed(0)
      : valorQuantity.toFixed(2);
    setQuantityPorcentage(Number(convertedValorMargin));

    const convertedValorQuantity = Number.isInteger(valorMargin)
      ? valorMargin.toFixed(0)
      : valorMargin.toFixed(2);
    setMarginPorcentage(Number(convertedValorQuantity));
  };

  const globalDataExonerated = async (goalData: any, objecData: any) => {
    let total = 0;
    if (goalData) {
      setQualityObjectiveExonerated(goalData.length);
      goalData.map((quoteData: any, index: number) => {
        if (quoteData && quoteData.vimVehiculoData) {
          total += quoteData.vimVehiculoData.margen;
        }
        return true;
      });
      setMarginObjectiveExonerated(total);
    }
    let totalObjectives = 0;
    let quatityObjectives = 0;
    if (objecData) {
      objecData.map((objectivesData: any, objectiveIndex: number) => {
        totalObjectives += objectivesData.margin;
        quatityObjectives += objectivesData.quantity;
        return true;
      });
      setQuatityCurrentObjectiveExonerated(quatityObjectives);
      setMarginCurrentObjectiveExonerated(totalObjectives);
    }
    const valorMargin = await calc(totalObjectives, total);

    const valorQuantity = await calc(quatityObjectives, goalData.length);
    const convertedValorMargin = Number.isInteger(valorQuantity)
      ? valorQuantity.toFixed(0)
      : valorQuantity.toFixed(2);
    setQuantityPorcentageExonerated(Number(convertedValorMargin));

    const convertedValorQuantity = Number.isInteger(valorMargin)
      ? valorMargin.toFixed(0)
      : valorMargin.toFixed(2);
    setMarginPorcentageExonerated(Number(convertedValorQuantity));
  };
  const quoteObjectivesExonerated = async (
    data: any[]
  ): Promise<{ exoneratedQuotes: any; notExoneratedQuotes: any }> => {
    const exoneratedQuotes: any = [];
    const notExoneratedQuotes: any = [];

    if (data.length > 0) {
      data.map((s: any) => {
        if (s.exonerated != null) {
          exoneratedQuotes.push(s);
        } else {
          notExoneratedQuotes.push(s);
        }
        return true;
      });
    }
    /*     console.log('-🟩', { exoneratedQuotes, notExoneratedQuotes }); */
    return { exoneratedQuotes, notExoneratedQuotes };
  };
  const objectivesExonerated = async (
    data: any
  ): Promise<{ exoneratedObjectives: any; notExoneratedObjectives: any }> => {
    const exoneratedObjectives: any = [];
    const notExoneratedObjectives: any = [];

    if (data.length > 0) {
      data.map((s: any) => {
        if (s.exonerated === 1) {
          exoneratedObjectives.push(s);
        } else {
          notExoneratedObjectives.push(s);
        }
        return true;
      });
    }
    /*     console.log('-🟩', { exoneratedObjectives, notExoneratedObjectives }); */
    return { exoneratedObjectives, notExoneratedObjectives };
  };

  const getAllObjectives = async (start?: any, end?: any) => {
    setLoading(true);
    const date = {
      startDate: start ?? rangeDate.startDate,
      endDate: end ?? rangeDate.endDate,
    };
    //METAS
    const actualQuote:
      | Quotes[]
      | null = await quouteRepository.getQuoteObjectives(
      date.startDate,
      date.endDate
    );

    /*     console.log('Quote⭕', actualQuote); */

    const exoneratedFilter = await quoteObjectivesExonerated(actualQuote ?? []);
    /*     console.log('👍', exoneratedFilter); */
    //OBJECTIVOS
    const respObjectives:
      | Objectives[]
      | null = await objectivesRepository.getObjectivesSalesResult(
      date.startDate,
      date.endDate,
      1,
      1
    );

    console.log('Objectives⭕', respObjectives);
    const objectivesFilter = await objectivesExonerated(respObjectives);
    /* console.log('👍', objectivesFilter); */
    if (exoneratedFilter && objectivesFilter) {
      await globalData(
        exoneratedFilter.notExoneratedQuotes,
        objectivesFilter.notExoneratedObjectives
      );
    }
    if (exoneratedFilter && objectivesFilter) {
      globalDataExonerated(
        exoneratedFilter.exoneratedQuotes,
        objectivesFilter.exoneratedObjectives
      );
    }
    setLoading(false);
  };

  const employeeFilter = async (id: number, date?: any) => {
    setLoading(true);
    if (!id) {
      getAllObjectives();
      return;
    }
    console.log('fechas🔴0', rangeDate.startDate)
    const dateGlobal = {
      startDate: date?.startDate ?? rangeDate.startDate,
      endDate: date?.endDate ?? rangeDate.endDate,
    };
    console.log('fechas🔴1', dateGlobal)
  
    const actualQuote:
      | Quotes[]
      | null = await quouteRepository.getQuoteObjectivesByIdAdviser(
      id,
      dateGlobal.startDate,
      dateGlobal.endDate
    );
    const exoneratedFilter = await quoteObjectivesExonerated(actualQuote ?? []);
    const respObjectives:
      | Objectives[]
      | null = await objectivesRepository.getObjectivesByIdAdviser(
      id,
      dateGlobal.startDate,
      dateGlobal.endDate
    );

    const objectivesFilter = await objectivesExonerated(respObjectives ?? []);
    if (exoneratedFilter && objectivesFilter) {
      await globalData(
        exoneratedFilter.notExoneratedQuotes,
        objectivesFilter.notExoneratedObjectives
      );
    }
    if (exoneratedFilter && objectivesFilter) {
      globalDataExonerated(
        exoneratedFilter.exoneratedQuotes,
        objectivesFilter.exoneratedObjectives
      );
    }
    /* console.log('👍👍👍', respObjectives); */
    setLoading(false);
  };

  const dateFiler = async (e: any) => {
    /* console.log(
      'FechaInit⭕',
      moment(moment(e).startOf('month')).format(dateFormat)
    );
    console.log(
      'FechaEnd⭕',
      moment(moment(e).endOf('month')).format(dateFormat)
    ); */
    await setRangeDate({
      startDate: moment(moment(e).startOf('month')).format(dateFormat),
      endDate: moment(moment(e).endOf('month')).format(dateFormat),
    });
    await getAllObjectives(
      moment(moment(e).startOf('month')).format(dateFormat),
      moment(moment(e).endOf('month')).format(dateFormat)
    );
  };

  const dateFilterByAdviser = async (e: any) => {
    await setRangeDate({
      startDate: moment(moment(e).startOf('month')).format(dateFormat),
      endDate: moment(moment(e).endOf('month')).format(dateFormat),
    });
    employeeFilter(user.id, {
      startDate: moment(moment(e).startOf('month')).format(dateFormat),
      endDate: moment(moment(e).endOf('month')).format(dateFormat),
    });
  };

  const dateFilerByAdviser = async (e: any) => {
    await setRangeDate({
      startDate: moment(moment(e).startOf('month')).format(dateFormat),
      endDate: moment(moment(e).endOf('month')).format(dateFormat),
    });
    employeeFilter(user.id, {
      startDate: moment(moment(e).startOf('month')).format(dateFormat),
      endDate: moment(moment(e).endOf('month')).format(dateFormat),
    });
  };

  useEffect(() => {
    if (user.role === 'JEFE DE VENTAS') {
      getAllObjectives();
    } else {
      console.log('ENTRO A GLOBAL');
      employeeFilter(user.id);
    }
  }, []);

  return (
    <>
      <div>
        <Result
          marginPorcentage={marginPorcentage}
          marginPorcentageExonerated={marginPorcentageExonerated}
          quantityPorcentage={quantityPorcentage}
          quantityPorcentageExonerated={quantityPorcentageExonerated}
          margin={{ marginObjective, marginCurrentObjective }}
          quantity={{ qualityObjective, quantityCurrentObjective }}
          marginExonerated={{
            marginObjectiveExonerated,
            marginCurrentObjectiveExonerated,
          }}
          quantityExonerated={{
            qualityObjectiveExonerated,
            quantityCurrentObjectiveExonerated,
          }}
          employeeFilter={employeeFilter}
          dateFilterMain={dateFiler}
          dateFilerByAdviser={dateFilerByAdviser}
          dateFilterMainByAdviser={dateFilterByAdviser}
        />
      </div>
      <Loading visible={loading} />
    </>
  );
};

export default ObjectivesResult;
