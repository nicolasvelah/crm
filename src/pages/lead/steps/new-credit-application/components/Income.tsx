import React, { FunctionComponent, useContext } from 'react';
import { InputNumber, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';

const Income: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    edit,
  }: {
    store: NewCreditGlobalState;
    dispatch: DispatchNewCredit;
    edit: boolean;
  } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Ingresos</div>
      <Form.Item
        label="Sueldo mensual"
        //initialValue={store.income.monthlySalary ?? undefined}
        name="monthlySalary"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el sueldo mensual del solicitante',
          },
        ]}
      >
        <InputNumber
          disabled={!edit}
          min={0}
          formatter={(val) => {
            return `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }}
          parser={(val) => val!.replace(/\$\s?|(,*)/g, '')}
          /* onChange={(event: string | number | undefined) => {
            dispatch({
              type: 'set-income-monthlySalary',
              payload: event,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Otros ingresos"
        name="otherIncome"
        //initialValue={store.income.otherIncome ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese los otros ingresos del solicitante',
          },
        ]}
      >
        <InputNumber
          disabled={!edit}
          min={0}
          formatter={(val) => {
            return `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }}
          parser={(val) => val!.replace(/\$\s?|(,*)/g, '')}
          /* onChange={(event: string | number | undefined) => {
            dispatch({
              type: 'set-income-otherIncome',
              payload: event,
            });
          }} */
        />
      </Form.Item>
      {store.applicant.civilStatus === 'Casado/a' && (
        <>
          <Form.Item
            label="Sueldo mensual cónyuge"
            //initialValue={store.income.monthlySpouseSalary ?? undefined}
            name="monthlySpouseSalary"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el sueldo mensual del cónyuge',
              },
            ]}
          >
            <InputNumber
              disabled={!edit}
              min={0}
              formatter={(val) => {
                return `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }}
              parser={(val) => val!.replace(/\$\s?|(,*)/g, '')}
              /* onChange={(event: string | number | undefined) => {
            dispatch({
              type: 'set-income-monthlySpouseSalary',
              payload: event,
            });
          }} */
            />
          </Form.Item>
          <Form.Item
            label="Otros ingresos cónyuge"
            name="otherSpouseIncome"
            //initialValue={store.income.otherSpouseIncome ?? undefined}
            rules={[
              {
                required: true,
                message: 'Por favor ingrese los otros ingresos del cónyuge',
              },
            ]}
          >
            <InputNumber
              disabled={!edit}
              min={0}
              formatter={(val) => {
                return `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }}
              parser={(val) => val!.replace(/\$\s?|(,*)/g, '')}
              /* onChange={(event: string | number | undefined) => {
            dispatch({
              type: 'set-income-otherSpouseIncome',
              payload: event,
            });
          }} */
            />
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default Income;
