/* eslint-disable no-unused-vars */
import { FilterOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Select } from 'antd';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import User from '../../../../data/models/User';
import UserRepository from '../../../../data/repositories/user-repository';
import { Dependencies } from '../../../../dependency-injection';
import ObjectivesResultAllies from '../objectivesResult/ObjectivesResultAllies';
import auth from '../../../../utils/auth';
import Get from '../../../../utils/Get';
import ObjectivesRepository from '../../../../data/repositories/objetives-repository';
import { RangeDates } from '../../../Follow/components/MainFollow';
import Quotes from '../../../../data/models/Quotes';
import QuotesRepository from '../../../../data/repositories/quotes-repository';
import Loading from '../../../../components/Loading';

export interface ObjectivesAlliesProps {}

export interface Value {
  quantity: number;
  amount: number;
}

export interface PorcentageValue {
  porcentageQuantityInsurance: number;
  porcentageAmountInsurance: number;
  porcentageQuantityUsed: number;
  porcentageAmountUsed: number;
  porcentageQuantityDevice: number;
  porcentageAmountDevice: number;
  porcentageQuantityPrepaid: number;
  porcentageAmountPrepaid: number;
}

export interface QuoteValue {
  quantityInsurance: number;
  amountInsurance: number;
  quantityUsed: number;
  amountUsed: number;
  quantityDevice: number;
  amountDevice: number;
  quantityPrepaid: number;
  amountPrepaid: number;
}

const { Option } = Select;
const { user } = auth;
const dateFormat = 'YYYY/MM/DD';

const ObjectivesAllies: FunctionComponent<{}> = () => {
  const objectivesRepository = Get.find<ObjectivesRepository>(
    Dependencies.objectives
  );
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const userRepository = Get.find<UserRepository>(Dependencies.users);
  const [countedCredit, setCountedCredit] = useState<any>([
    'counted',
    'credit',
  ]);
  const [month, setMonth] = useState<string>(
    moment.months()[moment().month()].toUpperCase()
  );
  const [employee, setEmployee] = useState<User[] | null>(null);
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment().endOf('month')).format(dateFormat),
  });
  const [isEmployee, setIsemployee] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataQuote, setDataQuote] = useState<QuoteValue>({
    quantityInsurance: 0,
    amountInsurance: 0,
    quantityUsed: 0,
    amountUsed: 0,
    quantityDevice: 0,
    amountDevice: 0,
    quantityPrepaid: 0,
    amountPrepaid: 0,
  });
  const [porcentage, setPorcentage] = useState<PorcentageValue>({
    porcentageQuantityInsurance: 0,
    porcentageAmountInsurance: 0,
    porcentageQuantityUsed: 0,
    porcentageAmountUsed: 0,
    porcentageQuantityDevice: 0,
    porcentageAmountDevice: 0,
    porcentageQuantityPrepaid: 0,
    porcentageAmountPrepaid: 0,
  });
  const [insuranceValue, setInsuranceValue] = useState<Value>({
    quantity: 0,
    amount: 0,
  });
  const [deviceValue, setDeviceValue] = useState<Value>({
    quantity: 0,
    amount: 0,
  });
  const [usedValue, setUsedValue] = useState<Value>({
    quantity: 0,
    amount: 0,
  });
  const [prepaidValue, setPrepaidValue] = useState<Value>({
    quantity: 0,
    amount: 0,
  });

  const disabledDate = (current: any) => {
    return current && current > moment().endOf('day');
  };

  const userEmployee = async () => {
    setLoading(true);
    const employeeDataApi = await userRepository.getEmployeesByBoss();
    if (employeeDataApi) {
      setEmployee(employeeDataApi);
    }
    setLoading(true);
    return true;
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
    /* {
      label: 'Exonerado',
      value: 'exonerated',
    }, */
  ];

  // todo: Función para sumar los datos de seguros
  const insurance = async (
    data: any[]
  ): Promise<{ quantity: number; amount: number }> => {
    let quantity: number = 0;
    let amount: number = 0;

    if (data.length > 0) {
      data.map((s: any) => {
        quantity += s.insurance;
        amount += s.insuranceAmount;

        return true;
      });
    }
    setInsuranceValue({ quantity, amount });
    console.log('🟩 INSURANCE', { quantity, amount });
    return { quantity, amount };
  };

  // todo: Función para sumar los datos de dispositivos
  const device = async (
    data: any[]
  ): Promise<{ quantity: number; amount: number }> => {
    let quantity: number = 0;
    let amount: number = 0;

    if (data.length > 0) {
      data.map((s: any) => {
        quantity += s.device;
        amount += s.amountDevice;
        return true;
      });
    }
    setDeviceValue({ quantity, amount });
    console.log('🟩 DEVICE', { quantity, amount });
    return { quantity, amount };
  };

  // todo: Función para sumar los datos de usados
  const used = async (
    data: any[]
  ): Promise<{ quantity: number; amount: number }> => {
    let quantity: number = 0;
    let amount: number = 0;

    if (data.length > 0) {
      data.map((s: any) => {
        quantity += s.used;
        amount += s.amountUsed;
        return true;
      });
    }
    setUsedValue({ quantity, amount });
    console.log('🟩 USED', { quantity, amount });
    return { quantity, amount };
  };

  // todo: Función para sumar los datos de prepagados
  const prepaid = async (
    data: any[]
  ): Promise<{ quantity: number; amount: number }> => {
    let quantity: number = 0;
    let amount: number = 0;

    if (data.length > 0) {
      data.map((s: any) => {
        quantity += s.prepaid;
        amount += s.amountPrepaid;
        return true;
      });
    }
    setPrepaidValue({ quantity, amount });
    console.log('🟩 PREPAID', { quantity, amount });
    return { quantity, amount };
  };

  const calcPorcentage = (valueRef: number, value: number) => {
    if (valueRef === 0) return 0;
    return (value * 100) / valueRef;
  };

  // todo: Funcion para sumar los datos para seguros
  const calcInsurance = async (
    data: any[],
    objectivesCalc: any
  ): Promise<{ quantityInsurance: number; amountInsurance: number }> => {
    let quantityInsurance: number = 0;
    let amountInsurance: number = 0;
    let quantityUsed: number = 0;
    let amountUsed: number = 0;
    let quantityDevice: number = 0;
    let amountDevice: number = 0;
    let quantityPrepaid: number = 0;
    let amountPrepaid: number = 0;
    if (data.length > 0) {
      data.map((ins: any) => {
        if (ins.insuranceCarrier !== null) {
          quantityInsurance += 1;
          amountInsurance += ins.insuranceCarrier.cost;
        }
        if (ins.preOwnedSupplier !== null && ins.preOwnedSupplier.acceptedAppraisal) {
          quantityUsed += 1;
          amountUsed += ins.preOwnedSupplier.appraisalValue;
        }
        if (ins.device !== null) {
          quantityDevice += 1;
          amountDevice += ins.device.cost;
        }
        if (ins.servicesValue !== null) {
          quantityPrepaid += 1;
          amountPrepaid += ins.servicesValue;
        }
        return true;
      });
    }
    /*   console.log('🚩', objectivesCalc);
    console.log('seguros🌎', { quantityInsurance, amountInsurance });
    console.log('usados🌎', { quantityUsed, amountUsed });
    console.log('device🌎', { quantityDevice, amountDevice });
    console.log('prepaid🌎', { quantityPrepaid, amountPrepaid }); */

    const decimal = (valueConverted: number) => {
      return Number(
        Number.isInteger(valueConverted)
          ? valueConverted.toFixed(0)
          : valueConverted.toFixed(2)
      );
    };

    const porcentageQuantityInsurance = decimal(
      calcPorcentage(objectivesCalc.insuranceCalc.quantity, quantityInsurance)
    );
    const porcentageAmountInsurance = decimal(
      calcPorcentage(objectivesCalc.insuranceCalc.amount, amountInsurance)
    );

    const porcentageQuantityUsed = decimal(
      calcPorcentage(objectivesCalc.usedCalc.quantity, quantityUsed)
    );
    const porcentageAmountUsed = decimal(
      calcPorcentage(objectivesCalc.usedCalc.amount, amountUsed)
    );

    const porcentageQuantityDevice = decimal(
      calcPorcentage(objectivesCalc.deviceCalc.quantity, quantityDevice)
    );
    const porcentageAmountDevice = decimal(
      calcPorcentage(objectivesCalc.deviceCalc.amount, amountDevice)
    );

    const porcentageQuantityPrepaid = decimal(
      calcPorcentage(objectivesCalc.prepaidCalc.quantity, quantityPrepaid)
    );
    const porcentageAmountPrepaid = decimal(
      calcPorcentage(objectivesCalc.prepaidCalc.amount, amountPrepaid)
    );

    setPorcentage({
      porcentageQuantityInsurance,
      porcentageAmountInsurance,
      porcentageQuantityUsed,
      porcentageAmountUsed,
      porcentageQuantityDevice,
      porcentageAmountDevice,
      porcentageQuantityPrepaid,
      porcentageAmountPrepaid,
    });
    /* console.log(
      'Porcentages🌎',
      porcentageQuantityInsurance,
      porcentageAmountInsurance,
      porcentageQuantityUsed,
      porcentageAmountUsed,
      porcentageQuantityDevice,
      porcentageAmountDevice,
      porcentageQuantityPrepaid,
      porcentageAmountPrepaid
    ); */
    setDataQuote({
      quantityInsurance,
      amountInsurance,
      quantityUsed,
      amountUsed,
      quantityDevice,
      amountDevice,
      quantityPrepaid,
      amountPrepaid,
    });
    return { quantityInsurance, amountInsurance };
  };

  const globalData = async (
    dataCountedCredit?: any,
    date?: any,
    id?: number
  ) => {
    setLoading(true);
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

    //* fechas

    const dateGlobal = {
      startDate: date?.startDate ?? rangeDate.startDate,
      endDate: date?.endDate ?? rangeDate.endDate,
    };
    console.log('FECHAS DE ENVIO✅', dateGlobal);
    let objectivesAccessoriesResult = null;
    if (!id) {
      objectivesAccessoriesResult = await objectivesRepository.getObjectivesAlliesResult(
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    } else {
      objectivesAccessoriesResult = await objectivesRepository.getObjectivesAlliesResultByIdAdviser(
        id,
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    }

    let insuranceCalc = {};
    let deviceCalc = {};
    let usedCalc = {};
    let prepaidCalc = {};
    if (objectivesAccessoriesResult) {
      insuranceCalc = await insurance(objectivesAccessoriesResult);
      deviceCalc = await device(objectivesAccessoriesResult);
      usedCalc = await used(objectivesAccessoriesResult);
      prepaidCalc = await prepaid(objectivesAccessoriesResult);
    }

    const objectivesCalc = { insuranceCalc, deviceCalc, usedCalc, prepaidCalc };
    let quotesObjectivesAllies: Quotes[] | null = null;
    if (!id) {
      quotesObjectivesAllies = await quouteRepository.getQuoteObjectivesAllies(
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    } else {
      quotesObjectivesAllies = await quouteRepository.getQuoteObjectivesAlliesByIdAdviser(
        id,
        dateGlobal.startDate,
        dateGlobal.endDate,
        valueCounted,
        valueCredit
      );
    }

    if (quotesObjectivesAllies) {
      await calcInsurance(quotesObjectivesAllies, objectivesCalc);
    }
    setLoading(false);
  };
  useEffect(() => {
    userEmployee();
    if (user.role === 'JEFE DE VENTAS') {
      globalData();
    } else {
      globalData(null, null, user.id);
    }
  }, []);

  const dateFilter = (date: any) => {
    setLoading(true);
    console.log('Fechas🚩', date);

    if (date) {
      setIsemployee(true);
      setMonth(moment.months()[moment(date).month()].toUpperCase());
      setRangeDate({
        startDate: moment(moment(date).startOf('month')).format(dateFormat),
        endDate: moment(moment(date).endOf('month')).format(dateFormat),
      });
      if (user.role === 'JEFE DE VENTAS') {
        globalData(null, {
          startDate: moment(moment(date).startOf('month')).format(dateFormat),
          endDate: moment(moment(date).endOf('month')).format(dateFormat),
        });
      } else if (user.role === 'ASESOR COMERCIAL') {
        globalData(
          null,
          {
            startDate: moment(moment(date).startOf('month')).format(dateFormat),
            endDate: moment(moment(date).endOf('month')).format(dateFormat),
          },
          user.id
        );
      }
    } else {
      globalData();
    }
  };
  //! Filtro por empleado
  const employeeFilterResult = async (id: any) => {
    if (!id) {
      globalData(null, {
        startDate: rangeDate.startDate,
        endDate: rangeDate.endDate,
      });
      return;
    }
    setLoading(true);
    console.log('employee🚀', id);
    const valueCounted = countedCredit.find((value: any) => value === 'counted')
      ? 1
      : 0;
    const valueCredit = countedCredit.find((value: any) => value === 'credit')
      ? 1
      : 0;
    const objectivesAlliesResult = await objectivesRepository.getObjectivesAlliesResultByIdAdviser(
      id,
      rangeDate.startDate,
      rangeDate.endDate,
      valueCounted,
      valueCredit
    );

    let insuranceCalc = {};
    let deviceCalc = {};
    let usedCalc = {};
    let prepaidCalc = {};
    if (objectivesAlliesResult) {
      insuranceCalc = await insurance(objectivesAlliesResult);
      deviceCalc = await device(objectivesAlliesResult);
      usedCalc = await used(objectivesAlliesResult);
      prepaidCalc = await prepaid(objectivesAlliesResult);
    }
    const objectivesCalc = { insuranceCalc, deviceCalc, usedCalc, prepaidCalc };
    console.log('objectivesAlliesResult🚀', objectivesAlliesResult);
    const quotesObjectivesAllies:
      | Quotes[]
      | null = await quouteRepository.getQuoteObjectivesAlliesByIdAdviser(
      id,
      rangeDate.startDate,
      rangeDate.endDate,
      valueCounted,
      valueCredit
    );
    if (quotesObjectivesAllies) {
      await calcInsurance(quotesObjectivesAllies, objectivesCalc);
    }
    console.log('quotesObjectivesAllies🚀', quotesObjectivesAllies);
    setLoading(false);
  };

  //!Filtro check
  const onChangeCheck = async (value: any) => {
    await setCountedCredit(value);
    if (user.role === 'JEFE DE VENTAS') {
      await globalData(value, null);
    } else if (user.role === 'ASESOR COMERCIAL') {
      await globalData(value, null, user.id);
    }
  };
  return (
    <>
      <div className="main-obj-allies">
        <div className="main-filtro">
          <div>
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
        </div>
        <div className="main-result-acc">
          <ObjectivesResultAllies
            insuranceValue={insuranceValue}
            prepaidValue={prepaidValue}
            deviceValue={deviceValue}
            usedValue={usedValue}
            dataQuote={dataQuote}
            porcentageResult={porcentage}
          />
        </div>
      </div>
      <Loading visible={loading} />
    </>
  );
};

export default ObjectivesAllies;
