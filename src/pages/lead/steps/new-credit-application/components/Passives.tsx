import React, { FunctionComponent, useContext } from 'react';
import { InputNumber, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';

import ItemForm from './ItemForm';

const Passives: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
    edit,
  }: {
    store: NewCreditGlobalState;
    dispatch: DispatchNewCredit;
    edit: boolean;
  } = value;
  // //console.log('render Property');
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Pasivos</div>
      <div className="mt-2">
        <Form.Item
          label="Cuentas por pagar"
          name="debtsToPay"
          //initialValue={store.passives.debtsToPay ?? undefined}
          /* rules={[
            {
              required: true,
              message:
                'Por favor ingrese el valor de cuentas a pagar del solicitante',
            },
          ]} */
        >
          <InputNumber
            disabled={!edit}
            min={0}
            onChange={(event: string | number | undefined) => {
              dispatch({
                type: 'set-passives-debtsToPay',
                payload: event,
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label="Tarjetas de crédito"
          name="creditCards"
          //initialValue={store.passives.creditCards ?? undefined}
          /* rules={[
            {
              required: true,
              message:
                'Por favor ingrese el valor de las tarjetas de crédito solicitante',
            },
          ]} */
        >
          <InputNumber
            disabled={!edit}
            min={0}
            onChange={(event: string | number | undefined) => {
              dispatch({
                type: 'set-passives-creditCards',
                payload: event,
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label="Otros"
          name="othersPassives"
          //initialValue={store.passives.others ?? undefined}
          /* rules={[
            {
              required: true,
              message:
                'Por favor ingrese el valor de los otros gastos del solicitante',
            },
          ]} */
        >
          <InputNumber
            disabled={!edit}
            min={0}
            onChange={(event: string | number | undefined) => {
              dispatch({
                type: 'set-passives-others',
                payload: event,
              });
            }}
          />
        </Form.Item>
        <ItemForm
          title="Total"
          val={
            store.passives.creditCards +
            store.passives.debtsToPay +
            store.passives.others
          }
          adorno="$"
        />
      </div>
    </div>
  );
};

export default Passives;
