import React, { FunctionComponent, useContext } from 'react';
import { Input, DatePicker, Form } from 'antd';
import moment, { Moment } from 'moment';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';
import validateIdRuc from '../../../../../utils/validate-id-ruc';

const SpouseData: FunctionComponent = () => {
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
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Datos del Cónyuge
      </div>
      <Form.Item
        label="Nombres"
        name="spouseNames"
        //initialValue={store.spouseData.names ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese los nombres del cónyuge',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-names',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Apellidos"
        name="spouseLastNames"
        //initialValue={store.spouseData.lastNames ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese los apellidos del cónyuge',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-lastNames',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Cédula"
        name="spouseIdentification"
        //initialValue={store.spouseData.identification ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la cédula del cónyuge',
          },
          () => ({
            validator(rule, val: any) {
              //console.log('My Rule', val, rule);

              if (!val) {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('Cédula incorrecta');
              }
              const valId = validateIdRuc('CEDULA', val);
              //console.log('My valId', valId);
              if (valId && valId.isValidate) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('Cédula incorrecta');
            },
          }),
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-identification',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Fecha de nacimiento"
        name="spouseDateOfBirth"
        /* initialValue={
          store.spouseData.dateOfBirth
            ? moment(store.spouseData.dateOfBirth)
            : undefined
        } */
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la fecha de nacimiento del cónyuge',
          },
        ]}
      >
        <DatePicker
          disabled={!edit}
          disabledDate={(current: any) => {
            return current && current > moment().add(-18, 'year')
          }}
          /* onChange={(val: Moment | null, dateString: string) => {
            dispatch({
              type: 'set-spouseData-dateOfBirth',
              payload: dateString,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Lugar de nacimiento"
        name="spousePlaceOfBirth"
        //initialValue={store.spouseData.placeOfBirth ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el lugar de nacimiento del cónyuge',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-placeOfBirth',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
    </div>
  );
};

export default SpouseData;
