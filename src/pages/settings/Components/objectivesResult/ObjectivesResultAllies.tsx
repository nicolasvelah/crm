import {
  CarOutlined,
  CustomerServiceOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { Progress, Tag } from 'antd';
import React, { FunctionComponent } from 'react';
import { currenyFormat } from '../../../../utils/extras';
import {
  PorcentageValue,
  QuoteValue,
  Value,
} from '../objectivesAllies/ObjectivesAllies';

export interface ObjectivesResultAlliesProps {
  insuranceValue: Value;
  prepaidValue: Value;
  deviceValue: Value;
  usedValue: Value;
  dataQuote: QuoteValue;
  porcentageResult: PorcentageValue;
}

const ObjectivesResultAllies: FunctionComponent<ObjectivesResultAlliesProps> = ({
  insuranceValue,
  prepaidValue,
  deviceValue,
  usedValue,
  dataQuote,
  porcentageResult,
}) => {
  /*   console.log('porcentage', porcentageResult) */
  return (
    <>
      <div className="main-allies">
        <div style={{ padding: '0px 10px' }}>
          {insuranceValue.quantity === 0 && (
            <Tag
              style={{ marginLeft: 10 }}
              icon={<ExclamationCircleOutlined />}
              color="warning"
            >
              Mes no registra objectivos  
            </Tag>
          )}
        </div>

        <div className="submain-allies">
          <div className="category-allies">
            <div style={{ fontSize: 17 }}>
              <MedicineBoxOutlined />
                Seguros
            </div>
            <div className="details-allies">
              <div>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Cantidad: {dataQuote.quantityInsurance}
                </div>
                <Progress
                  percent={porcentageResult.porcentageQuantityInsurance}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {insuranceValue.quantity}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Monto: {currenyFormat(dataQuote.amountInsurance)}
                </div>
                <Progress
                  percent={porcentageResult.porcentageAmountInsurance}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {currenyFormat(insuranceValue.amount)}
                </div>
              </div>
            </div>
          </div>
          <div className="category-allies">
            <div style={{ fontSize: 17 }}>
              <CarOutlined />
                Usados
            </div>
            <div className="details-allies">
              <div>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Cantidad: {dataQuote.quantityUsed}
                </div>
                <Progress
                  percent={porcentageResult.porcentageQuantityUsed}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {usedValue.quantity}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Monto: {currenyFormat(dataQuote.amountUsed)}
                </div>
                <Progress
                  percent={porcentageResult.porcentageAmountUsed}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {currenyFormat(usedValue.amount)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="submain-allies">
          <div className="category-allies">
            <div style={{ fontSize: 17 }}>
              <CustomerServiceOutlined />
                Dispositivos
            </div>
            <div className="details-allies">
              <div>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Cantidad: {dataQuote.quantityDevice}
                </div>
                <Progress
                  percent={porcentageResult.porcentageQuantityDevice}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {deviceValue.quantity}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Monto: {currenyFormat(dataQuote.amountDevice)}
                </div>
                <Progress
                  percent={porcentageResult.porcentageAmountDevice}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {currenyFormat(deviceValue.amount)}
                </div>
              </div>
            </div>
          </div>
          <div className="category-allies">
            <div style={{ fontSize: 17 }}>
              <DollarOutlined />
                Prepagados
            </div>
            <div className="details-allies">
              <div>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Cantidad: {dataQuote.quantityPrepaid}
                </div>
                <Progress
                  percent={porcentageResult.porcentageQuantityPrepaid}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {prepaidValue.quantity}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 16, marginBottom: 5 }}>
                  Monto: {currenyFormat(dataQuote.amountPrepaid)}
                </div>
                <Progress
                  percent={porcentageResult.porcentageAmountPrepaid}
                  strokeColor="#566573 "
                />
                <div style={{ fontSize: 13, color: '#979A9A', marginTop: 5 }}>
                  Objetivo: {currenyFormat(prepaidValue.amount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ObjectivesResultAllies;
