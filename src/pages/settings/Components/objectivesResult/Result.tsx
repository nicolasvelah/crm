/* eslint-disable no-unused-vars */
import React, { FunctionComponent, useEffect, useState } from 'react';

import { DatePicker, Divider, Progress, Select, Tag } from 'antd';
import {
  CalendarOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { currenyFormat } from '../../../../utils/extras';
import User from '../../../../data/models/User';
import UserRepository from '../../../../data/repositories/user-repository';
import { Dependencies } from '../../../../dependency-injection';
import Get from '../../../../utils/Get';
import auth from '../../../../utils/auth';

const { Option } = Select;
const { user } = auth;
export interface marginType {
  marginObjective: number;
  marginCurrentObjective: number;
}

export interface quantityType {
  qualityObjective: number;
  quantityCurrentObjective: number;
}

export interface marginTypeExonerated {
  marginObjectiveExonerated: number;
  marginCurrentObjectiveExonerated: number;
}

export interface quantityTypeExonerated {
  qualityObjectiveExonerated: number;
  quantityCurrentObjectiveExonerated: number;
}
export interface ResultProps {
  marginPorcentage: number;
  quantityPorcentage: number;
  marginPorcentageExonerated: number;
  quantityPorcentageExonerated: number;
  margin: marginType;
  quantity: quantityType;
  marginExonerated: marginTypeExonerated;
  quantityExonerated: quantityTypeExonerated;
  employeeFilter: Function;
  dateFilterMain: Function;
  dateFilterMainByAdviser: Function;
  dateFilerByAdviser: Function;
}

const Result: FunctionComponent<ResultProps> = ({
  marginPorcentage,
  marginPorcentageExonerated,
  quantityPorcentage,
  quantityPorcentageExonerated,
  margin,
  marginExonerated,
  quantity,
  quantityExonerated,
  employeeFilter,
  dateFilterMain,
  dateFilterMainByAdviser,
  dateFilerByAdviser

}) => {
  const [marginT, setMargin] = useState<number>(0);
  const [quantityT, setQuantity] = useState<number>(0);
  const [color, setColor] = useState<string>('#ffff');
  const [colorQuantity, setColorQuantity] = useState<string>('#ffff');
  const [employee, setEmployee] = useState<User[] | null>(null);
  const userRepository = Get.find<UserRepository>(Dependencies.users);
  const [month, setMonth] = useState<string>(
    moment.months()[moment().month()].toUpperCase()
  );
  const [isEmployee, setIsemployee] = useState<boolean>(false);
  function disabledDate(current: any) {
    return current && current > moment().endOf('day');
  }
  const userEmployee = async () => {
    const employeeDataApi = await userRepository.getEmployeesByBoss();
    if (employeeDataApi) {
      setEmployee(employeeDataApi);
    }
    return true;
  };
  useEffect(() => {
    if (marginPorcentage <= 50) {
      setColor('#EA3D3F');
    } else if (marginPorcentage > 50 && marginPorcentage <= 90) {
      setColor('#2E86C1');
    } else if (marginPorcentage > 90) {
      setColor('#52BE80');
    }
    if (quantityPorcentage < 50) {
      setColorQuantity('#EA3D3F');
    } else if (quantityPorcentage >= 50 && quantityPorcentage <= 90) {
      setColorQuantity('#2E86C1');
    } else if (quantityPorcentage > 90) {
      setColorQuantity('#52BE80');
    }
    setMargin(marginPorcentage);
    setQuantity(quantityPorcentage);
    userEmployee();
  }, [marginPorcentage, quantityPorcentage]);

  const dateFilter = (date: any, dateString: any) => {
    dateFilterMain(date);
    if (date) {
      setIsemployee(true);
      setMonth(moment.months()[moment(date).month()].toUpperCase());
    }
  };

  const dateFilerByAdviserResult = (date: any, dateString: any) => {
    dateFilerByAdviser(date);
    if (date) {
      dateFilterMainByAdviser(
        moment.months()[moment(date).month()].toUpperCase()
      );
      setMonth(moment.months()[moment(date).month()].toUpperCase());
    }
  };

  const employeeFilterResult = (id: any) => {
    /* console.log('employee filter', id); */
    if (id) {
      employeeFilter(id);
    } else {
      setIsemployee(false);
      employeeFilter(id);
    }
  };

  return (
    <>
      <div className="main-obj">
        <div className="main-filtro">
          <div>
            <FilterOutlined />
              Filtros
          </div>
          {user.role === 'ASESOR COMERCIAL' && (
            <div>
              <div className="mt-5">
                <DatePicker
                  onChange={dateFilerByAdviserResult}
                  picker="month"
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
          {user.role === 'JEFE DE VENTAS' && (
            <div>
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
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '80%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div className="end-result">
                <CalendarOutlined />
                <span>  {month}</span>
              </div>
              {margin.marginCurrentObjective === 0 && (
                <div>
                  {' '}
                  <Tag
                    style={{ marginLeft: 10 }}
                    icon={<ExclamationCircleOutlined />}
                    color="warning"
                  >
                    Mes no registra objectivos  
                  </Tag>
                </div>
              )}
            </div>

            <div className="main-result">
              <div className="sub-main">
                <div className="content-main">
                  <div>
                    <Divider
                      orientation="left"
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      Margen
                    </Divider>
                  </div>
                  <div className="data-result">
                    <div className="data-result-center">
                      <div style={{ fontSize: 20 }}>
                        <span>{currenyFormat(margin.marginObjective)}</span>{' '}
                      </div>
                      <div style={{ fontSize: 14, color: '#979A9A' }}>
                        Objetivo: {currenyFormat(margin.marginCurrentObjective)}
                      </div>
                    </div>
                    <div>
                      <Progress
                        type="circle"
                        percent={marginPorcentage}
                        width={100}
                        strokeColor={color}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ width: '10%' }}> </div>
                <div className="content-main">
                  <div>
                    <Divider
                      orientation="left"
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      Cantidad
                    </Divider>
                  </div>
                  <div className="data-result">
                    <div className="data-result-center">
                      <div
                        style={{
                          fontSize: 20,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div>Vehículos: </div>
                        <div>{quantity.qualityObjective}</div>
                      </div>
                      <div style={{ fontSize: 14, color: '#979A9A' }}>
                        Objetivo: {quantity.quantityCurrentObjective}
                      </div>
                    </div>
                    <div>
                      <Progress
                        type="circle"
                        percent={quantityPorcentage}
                        width={100}
                        strokeColor={colorQuantity}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '80%',
              marginTop: '30px',
            }}
          >
            <div className="end-result">
              <CalendarOutlined />
              <span>  {month}</span>
                  
              <Tag color="#108ee9">
                <CheckOutlined />
                  Exonerados  
              </Tag>
              {quantityExonerated.quantityCurrentObjectiveExonerated === 0 && (
                <Tag
                  style={{ marginLeft: 10 }}
                  icon={<ExclamationCircleOutlined />}
                  color="warning"
                >
                  Mes no registra objectivos  
                </Tag>
              )}
            </div>
            <div className="main-result">
              <div className="sub-main">
                <div className="content-main">
                  <div>
                    <Divider
                      orientation="left"
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      Margen
                    </Divider>
                  </div>
                  <div className="data-result">
                    <div className="data-result-center">
                      <div style={{ fontSize: 20 }}>
                        <span>
                          {currenyFormat(
                            marginExonerated.marginObjectiveExonerated
                          )}
                        </span>{' '}
                      </div>
                      <div style={{ fontSize: 14, color: '#979A9A' }}>
                        Objetivo:{' '}
                        {currenyFormat(
                          marginExonerated.marginCurrentObjectiveExonerated
                        )}
                      </div>
                    </div>
                    <div>
                      <Progress
                        type="circle"
                        percent={marginPorcentageExonerated}
                        width={100}
                        strokeColor={color}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ width: '10%' }}> </div>
                <div className="content-main">
                  <div>
                    <Divider
                      orientation="left"
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      Cantidad
                    </Divider>
                  </div>
                  <div className="data-result">
                    <div className="data-result-center">
                      <div
                        style={{
                          fontSize: 20,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div>Vehículos: </div>
                        <div>
                          {quantityExonerated.qualityObjectiveExonerated}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, color: '#979A9A' }}>
                        Objetivo:{' '}
                        {quantityExonerated.quantityCurrentObjectiveExonerated}
                      </div>
                    </div>
                    <div>
                      <Progress
                        type="circle"
                        percent={quantityPorcentageExonerated}
                        width={100}
                        strokeColor={colorQuantity}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;
