import React, { FunctionComponent, useContext } from 'react';
import { Input, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';
import validatePhone from '../../../../../utils/validate-phone';

const PersonalReferences: FunctionComponent = () => {
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
        Referencias Personales
      </div>
      <Form.Item
        label="Nombres"
        name="personalReferencesNames"
        //initialValue={store.personalReferences.names ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese los nombres de la referencia',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-names',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Apellidos"
        name="personalReferencesLastName"
        //initialValue={store.personalReferences.lastNames ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese los apellidos de la referencia',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-lastNames',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Parentesco"
        name="personalReferencesRelation"
        //initialValue={store.personalReferences.relationship ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la relación de la referencia',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-relationship',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Teléfono"
        name="personalReferencesPhone"
        //initialValue={store.personalReferences.phone ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el teléfono de la referencia',
          },
          () => ({
            validator(rule, val: string) {
              const isvalid = validatePhone(val);
              if (isvalid) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('Número telefónico no válido');
            },
          }),
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-phone',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
    </div>
  );
};

export default PersonalReferences;
