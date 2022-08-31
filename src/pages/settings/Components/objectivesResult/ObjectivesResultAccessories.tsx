/* eslint-disable no-unused-vars */
import {
  CalendarOutlined,
  CheckOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Progress, Tag } from 'antd';
import moment from 'moment';
import React, { FunctionComponent, useState } from 'react';
import { currenyFormat } from '../../../../utils/extras';

export interface ObjectivesResultAccessoriesProps {
  monthDate: string;
  goalNumber: number;
  objectivesNumber: number;
  porcentage: number;
  goalExoneratedNumber: number;
  objectivesExoneratedNumber: number;
  porcentageExonerated: number;
  countedCredit: [];
}

const ObjectivesResultAccessories: FunctionComponent<ObjectivesResultAccessoriesProps> = ({
  monthDate,
  goalNumber,
  objectivesNumber,
  porcentage,
  goalExoneratedNumber,
  objectivesExoneratedNumber,
  porcentageExonerated,
  countedCredit,
}) => {
  const [month, setMonth] = useState<string>(
    moment.months()[moment().month()].toUpperCase()
  );
  const [color, setColor] = useState<string>('#ffff');

  return (
    <>
      <div className="main-container-accessories">
        <div className="submmain-container-accessories">
          <div className="month-result-accessories">
            <div>
              <CalendarOutlined />
              <span>  {monthDate}</span>
            </div>

            <div
              className="ml-5"
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              {countedCredit.map((data: any, index: number) => {
                return (
                  <div key={index}>
                    {data === 'counted' ? (
                      <Tag icon={<DollarOutlined />} color="blue">
                        Contado  
                      </Tag>
                    ) : (
                      <Tag icon={<CreditCardOutlined />} color="blue">
                        Crédito  
                      </Tag>
                    )}
                  </div>
                );
              })}
              <div>
                {objectivesNumber === 0 && (
                  <Tag
                    style={{ marginLeft: 10 }}
                    icon={<ExclamationCircleOutlined />}
                    color="warning"
                  >
                    Mes no registra objectivos  
                  </Tag>
                )}
              </div>
            </div>
          </div>

          <div className="resut-accessories">
            <div className="graphic-result">
              <div>
                <Progress
                  type="circle"
                  percent={porcentage}
                  width={180}
                  strokeColor={
                    porcentage < 50
                      ? '#EA3D3F'
                      : porcentage > 50 && porcentage <= 90
                      ? '#2E86C1'
                      : '#52BE80'
                  }
                />
              </div>
              <div className="result-objective-value">
                <div style={{ fontSize: 30 }}>{currenyFormat(goalNumber)}</div>
                <div style={{ fontSize: 14, color: '#979A9A' }}>
                  Objetivo: {currenyFormat(objectivesNumber)}
                </div>
              </div>
            </div>
            <div style={{ width: 20 }} />
            <div className="graphic-result-exonerated">
              <div className="tag-accessories">
                <Tag color="#108ee9">
                  <CheckOutlined />
                    Exonerados  
                </Tag>
              </div>
              <div>
                <Progress
                  type="circle"
                  percent={porcentageExonerated}
                  width={180}
                  strokeColor={
                    porcentage < 50
                      ? '#EA3D3F'
                      : porcentage > 50 && porcentage <= 90
                      ? '#2E86C1'
                      : '#52BE80'
                  }
                />
              </div>
              <div className="result-objective-value">
                <div style={{ fontSize: 30 }}>
                  {currenyFormat(goalExoneratedNumber)}
                </div>
                <div style={{ fontSize: 14, color: '#979A9A' }}>
                  Objetivo: {currenyFormat(objectivesExoneratedNumber)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObjectivesResultAccessories;
