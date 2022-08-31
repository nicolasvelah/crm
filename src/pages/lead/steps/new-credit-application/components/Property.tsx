import React, { FunctionComponent, useContext } from 'react';
import { InputNumber, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';

import ItemForm from './ItemForm';

const Property: FunctionComponent = () => {
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
  // console.log('render Property');
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Activos</div>
      <div className="mt-2">
        <Form.Item
          label="Casa"
          name="house"
          //initialValue={store.property.house ?? undefined}
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el valor de la casa del solicitante',
            },
          ]}
        >
          <InputNumber
            disabled={!edit}
            min={0}
            onChange={(event: string | number | undefined) => {
              dispatch({
                type: 'set-property-house',
                payload: event,
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label="Vehículo"
          name="vehicle"
          //initialValue={store.property.vehicle ?? undefined}
          rules={[
            {
              required: true,
              message:
                'Por favor ingrese el valor del vehículo del solicitante',
            },
          ]}
        >
          <InputNumber
            disabled={!edit}
            min={0}
            onChange={(event: string | number | undefined) => {
              dispatch({
                type: 'set-property-vehicle',
                payload: event,
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label="Otros"
          name="othersProperty"
          //initialValue={store.property.others ?? undefined}
          rules={[
            {
              required: true,
              message:
                'Por favor ingrese el valor de los otros activos del solicitante',
            },
          ]}
        >
          <InputNumber
            min={0}
            disabled={!edit}
            onChange={(event: string | number | undefined) => {
              dispatch({
                type: 'set-property-others',
                payload: event,
              });
            }}
          />
        </Form.Item>
        <ItemForm
          title="Total"
          val={
            store.property.house +
            store.property.others +
            store.property.vehicle
          }
          adorno="$"
        />
      </div>
    </div>
  );
};

export default Property;
