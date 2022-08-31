import React, { FunctionComponent, useContext } from 'react';
import { Input, Select, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';

const { Option } = Select;

const BankReferences: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    edit,
  }: {
    store: NewCreditGlobalState;
    dispatch: DispatchNewCredit;
    edit: boolean;
  } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Referencias Bancarias
      </div>
      <Form.Item
        label="Banco"
        name="bank"
        //initialValue={store.bankReferences.bank ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el banco del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-bankReferences-bank',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Número cuenta"
        name="accountNumber"
        //initialValue={store.bankReferences.accountNumber ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la dirección del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-bankReferences-accountNumber',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Tipo de cuenta"
        name="accountType"
        //initialValue={store.bankReferences.accountType ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el tipo de cuenta del solicitante',
          },
        ]}
      >
        <Select
          disabled={!edit}
          /* onChange={(val: any) => {
            dispatch({
              type: 'set-bankReferences-accountType',
              payload: val,
            });
          }} */
        >
          <Option value="ahorros">Cuenta de Ahorros</Option>
          <Option value="corriente">Cuenta Corriente</Option>
        </Select>
      </Form.Item>
    </div>
  );
};

export default BankReferences;
