/* eslint-disable no-unused-vars */
import { ConsoleSqlOutlined, FilterOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Select, Tooltip } from 'antd';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import User from '../../../../data/models/User';
import UserRepository from '../../../../data/repositories/user-repository';
import ObjectivesResultAccessories from '../objectivesResult/ObjectivesResultAccessories';
import { Dependencies } from '../../../../dependency-injection';
import auth from '../../../../utils/auth';
import Get from '../../../../utils/Get';
import ObjectivesRepository from '../../../../data/repositories/objetives-repository';
import { ObjectivesAccessories } from '../../../../data/models/Objectives';
import { RangeDates } from '../../../Follow/components/MainFollow';
import QuotesRepository from '../../../../data/repositories/quotes-repository';
import Quotes from '../../../../data/models/Quotes';
import Loading from '../../../../components/Loading';

const { Option } = Select;
const { user } = auth;
const dateFormat = 'YYYY/MM/DD';

export interface ObjectivesAccesoriesProps {}

const ObjectivesAccesories: FunctionComponent<ObjectivesAccesoriesProps> = () => {
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const [month, setMonth] = useState<string>(
    moment.months()[moment().month()].toUpperCase()
  );
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment().endOf('month')).format(dateFormat),
  });
  const [isEmployee, setIsemployee] = useState<boolean>(false);
  const [employee, setEmployee] = useState<User[] | null>(null);
  const disabledDate = (current: any) => {
    return current && current > moment().endOf('day');
  };
  const userRepository = Get.find<UserRepository>(Dependencies.users);
  const objectivesRepository = Get.find<ObjectivesRepository>(
    Dependencies.objectives
  );
  const [countedCredit, setCountedCredit] = useState<any>([
    'counted',
    'credit',
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  // todo: Estados para pintar los porcentajes y valores de los objetivos y metas
  const [goalNumber, setGoalNumber] = useState<number>(0);
  const [objectiveNumber, setObjectiveNumber] = useState<number>(0);
  const [porcentage, setPorcentage] = useState<number>(0);
  const [goalExoneratedNumber, setGoalExoneratedNumber] = useState<number>(0);
  const [
    objectiveExoneratedNumber,
    setObjectiveExoneratedNumber,
  ] = useState<number>(0);
  const [porcentageExonerated, setPorcentageExonerated] = useState<number>(0);

  // todo: Funcion para traer los empleados del jefe de ventas
  const userEmployee = async () => {
    setLoading(true);
    const employeeDataApi = await userRepository.getEmployeesByBoss();
    if (employeeDataApi) {
      setEmployee(employeeDataApi);
    }
    setLoading(true);
    return true;
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
    data: any[]
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
  const calcPocentage = (valueRef: number, value: number) => {
    if (valueRef === 0) return 0;
    return (value * 100) / valueRef;
  };

  // todo: Calculo para accesorios de vehiculos no exonerados
  const calcData = async (goalData: any, objecData: any) => {
    //console.log('CALCULOS', goalData);
    //console.log('CALCULOS', objecData);
    let goalTotal = 0;
    if (goalData) {
      goalData.map((goal: any) => {
        goalTotal += goal.accesoriesValue;
        return true;
      });
    }
    let objectiveTotal = 0;
    if (objecData) {
      objecData.map((object: any) => {
        objectiveTotal += object.amountAccessories;
        return true;
      });
    }
    setGoalNumber(goalTotal);
    setObjectiveNumber(objectiveTotal);
    const calcPorce = calcPocentage(objectiveTotal, goalTotal);
    const convertedCalcPorce = Number.isInteger(calcPorce)
      ? calcPorce.toFixed(0)
      : calcPorce.toFixed(2);
    setPorcentage(Number(convertedCalcPorce));
  };

  // todo: Calculo para accesorios de vehiculos exonerados
  const calcDataExonerated = async (goalData: any, objecData: any) => {
    let goalTotal = 0;
    if (goalData) {
      goalData.map((goal: any) => {
        goalTotal += goal.accesoriesValue;
        return true;
      });
    }
    let objectiveTotal = 0;
    if (objecData) {
      objecData.map((object: any) => {
        objectiveTotal += object.amountAccessories;
        return true;
      });
    }
    //console.log('goalTotal⭕', goalTotal);
    //console.log('objectiveTotal⭕', objectiveTotal);
    setGoalExoneratedNumber(goalTotal);
    setObjectiveExoneratedNumber(objectiveTotal);
    const calcPorce = calcPocentage(objectiveTotal, goalTotal);
    const convertedCalcPorce = Number.isInteger(calcPorce)
      ? calcPorce.toFixed(0)
      : calcPorce.toFixed(2);
    setPorcentageExonerated(Number(convertedCalcPorce));
  };

  //* TRAER DATOS GLOBALES
  //Todo: Funcion para cargar datos en la gráfica
  const globalData = async (
    date?: any,
    dataCountedCredit?: any,
    id?: number
  ) => {
    setLoading(true);
    const dateGlobal = {
      startDate: date?.startDate ?? rangeDate.startDate,
      endDate: date?.endDate ?? rangeDate.endDate,
    };
    // Todo: Obtenemos el tipo contado
    const valueCounted = dataCountedCredit
      ? dataCountedCredit.find((value: any) => value === 'counted')
        ? 1
        : 0
      : countedCredit.find((value: any) => value === 'counted')
      ? 1
      : 0;

    // Todo: Obtenemos el tipo credito
    const valueCredit = dataCountedCredit
      ? dataCountedCredit.find((value: any) => value === 'credit')
        ? 1
        : 0
      : countedCredit.find((value: any) => value === 'credit')
      ? 1
      : 0;
    console.log('CREDIT OR COUNTED', valueCounted, valueCredit);

    // Todo: Obtenemos los quotes para accesorios

    let quotesObjectivesAccessories: Quotes[] | null = null;
    if (!id) {
      quotesObjectivesAccessories = await quouteRepository.getQuoteObjectivesAccessories(
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    } else {
      quotesObjectivesAccessories = await quouteRepository.getQuoteObjectivesAccessoriesByIdAdviser(
        id,
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    }

    const exoneratedFilter = await quoteObjectivesExonerated(
      quotesObjectivesAccessories ?? []
    );

    // Todo: Obtenemos los objetivos para accesorios

    let objectivesAccessoriesResult: ObjectivesAccessories[] | null = null;
    if (!id) {
      objectivesAccessoriesResult = await objectivesRepository.getObjectivesAccessoriesResult(
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    } else {
      objectivesAccessoriesResult = await objectivesRepository.getObjectivesAccessoriesResultByIdAdviser(
        id,
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    }

    const objectivesFilter = await objectivesExonerated(
      objectivesAccessoriesResult ?? []
    );

    if (exoneratedFilter && objectivesFilter) {
      await calcData(
        exoneratedFilter.notExoneratedQuotes,
        objectivesFilter.notExoneratedObjectives
      );
    }
    if (exoneratedFilter && objectivesFilter) {
      await calcDataExonerated(
        exoneratedFilter.exoneratedQuotes,
        objectivesFilter.exoneratedObjectives
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('user🟡', user);
    userEmployee();
    if (user.role === 'JEFE DE VENTAS') {
      globalData();
    } else {
      console.log('ENTRO A GLOBAL');
      globalData(null, null, user.id);
    }
  }, []);

  const dateFilter = (date: any, dateString: any) => {
    setLoading(true);
    if (date) {
      setIsemployee(true);
      setMonth(moment.months()[moment(date).month()].toUpperCase());
      setRangeDate({
        startDate: moment(moment(date).startOf('month')).format(dateFormat),
        endDate: moment(moment(date).endOf('month')).format(dateFormat),
      });
      if (user.role === 'JEFE DE VENTAS') {
        globalData({
          startDate: moment(moment(date).startOf('month')).format(dateFormat),
          endDate: moment(moment(date).endOf('month')).format(dateFormat),
        });
      } else if (user.role === 'ASESOR COMERCIAL') {
        globalData(
          {
            startDate: moment(moment(date).startOf('month')).format(dateFormat),
            endDate: moment(moment(date).endOf('month')).format(dateFormat),
          },
          null,
          user.id
        );
      }
    } else {
      globalData();
    }
  };

  const options = [
    {
      label: 'Contado',
      value: 'counted',
      disabled: !!(
        countedCredit.length === 1 && countedCredit[0] === 'counted'
      ),
    },
    {
      label: 'Credito',
      value: 'credit',
      disabled: !!(countedCredit.length === 1 && countedCredit[0] === 'credit'),
    },
  ];

  const onChangeCheck = async (value: any) => {
    await setCountedCredit(value);
    if (user.role === 'JEFE DE VENTAS') {
      await globalData(null, value);
    } else if (user.role === 'ASESOR COMERCIAL') {
      await globalData(null, value, user.id);
    }
  };

  const employeeFilterResult = async (id: any) => {
    setLoading(true);
    /* console.log('Empleado 🟡', id); */
    const valueCounted = countedCredit.find((value: any) => value === 'counted')
      ? 1
      : 0;
    const valueCredit = countedCredit.find((value: any) => value === 'credit')
      ? 1
      : 0;
    const objectivesAccessoriesResult:
      | ObjectivesAccessories[]
      | null = await objectivesRepository.getObjectivesAccessoriesResultByIdAdviser(
      id,
      rangeDate.startDate,
      rangeDate.endDate,
      valueCounted,
      valueCredit
    );

    const quotesObjectivesAccessories:
      | Quotes[]
      | null = await quouteRepository.getQuoteObjectivesAccessoriesByIdAdviser(
      id,
      rangeDate.startDate,
      rangeDate.endDate,
      valueCounted,
      valueCredit
    );

    const objectivesFilter = await objectivesExonerated(
      objectivesAccessoriesResult ?? []
    );

    const exoneratedFilter = await quoteObjectivesExonerated(
      quotesObjectivesAccessories ?? []
    );

    if (exoneratedFilter && objectivesFilter) {
      await calcData(
        exoneratedFilter.notExoneratedQuotes,
        objectivesFilter.notExoneratedObjectives
      );
    }
    if (exoneratedFilter && objectivesFilter) {
      await calcDataExonerated(
        exoneratedFilter.exoneratedQuotes,
        objectivesFilter.exoneratedObjectives
      );
    }
    /*     console.log('EMPLEADO🟡🟡', objectivesAccessoriesResult);
    console.log('EMPLEADO QUOTES🟡🟡', quotesObjectivesAccessories); */
    setLoading(false);
  };
  return (
    <>
      <div className="main-obj">
        <div className="main-filtro">
          <div>
            <FilterOutlined />
              Filtros
          </div>
          {user.role === 'JEFE DE VENTAS' && (
            <div>
              <div
                className="mt-5"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Checkbox.Group
                  options={options}
                  defaultValue={['counted', 'credit']}
                  onChange={onChangeCheck}
                  style={{ display: 'flex', flexDirection: 'column' }}
                />
              </div>
              <div className="mt-5">
                <DatePicker
                  onChange={dateFilter}
                  picker="month"
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="mt-5">
                <Select
                  placeholder="Empleados"
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!isEmployee}
                  onChange={employeeFilterResult}
                >
                  {employee &&
                    employee.map((dme, index) => (
                      <Option key={index} value={dme.id!}>
                        {dme.apellido} {dme.nombre}
                      </Option>
                    ))}
                </Select>
              </div>
            </div>
          )}
          {user.role === 'ASESOR COMERCIAL' && (
            <div>
              <div
                className="mt-5"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Checkbox.Group
                  options={options}
                  defaultValue={['counted', 'credit']}
                  onChange={onChangeCheck}
                  style={{ display: 'flex', flexDirection: 'column' }}
                />
              </div>
              <div className="mt-5">
                <DatePicker
                  onChange={dateFilter}
                  picker="month"
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="main-result-acc">
          {month && (
            <ObjectivesResultAccessories
              porcentage={porcentage}
              porcentageExonerated={porcentageExonerated}
              monthDate={month}
              goalNumber={goalNumber}
              objectivesNumber={objectiveNumber}
              goalExoneratedNumber={goalExoneratedNumber}
              objectivesExoneratedNumber={objectiveExoneratedNumber}
              countedCredit={countedCredit}
            />
          )}
        </div>
      </div>
      <Loading visible={loading} />
    </>
  );
};

export default ObjectivesAccesories;
