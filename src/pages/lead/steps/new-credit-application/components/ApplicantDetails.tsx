import React, { FunctionComponent, useContext } from 'react';
import { Input, DatePicker, InputNumber, Select, TimePicker, Form } from 'antd';
import moment, { Moment } from 'moment';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';

import ItemForm from './ItemForm';
import Client from '../../../../../data/models/Client';

const ApplicantDetails: FunctionComponent = () => {
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
        Datos del Solicitante
      </div>
      <ItemForm title="Nombres" val={store.applicant.names ?? 'N/A'} />

      <ItemForm title="Apellidos" val={store.applicant.lastNames ?? 'N/A'} />
      <ItemForm title="Cédula" val={store.applicant.identification ?? 'N/A'} />
      <ItemForm
        title="Teléfono celular"
        val={store.currentAddress.cellPhone!}
      />
      <Form.Item
        label="Fecha de nacimiento"
        name="dateOfBirth"
        /* initialValue={
          store.applicant.dateOfBirth
            ? moment(store.applicant.dateOfBirth)
            : undefined
        } */
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la fecha de nacimiento del solicitante',
          },
        ]}
      >
        <DatePicker
          disabled={!edit}
          disabledDate={(current: any) => {
            return current && current > moment().add(-18, 'year');
          }}
          /* onChange={(val: Moment | null, dateString: string) => {
            dispatch({
              type: 'set-applicant-dateOfBirth',
              payload: dateString,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Lugar de nacimiento"
        //initialValue={store.applicant.placeOfBirth ?? undefined}
        name="placeOfBirth"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el lugar de nacimiento del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          //value={store.applicant.placeOfBirth ?? undefined}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-placeOfBirth',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Nacionalidad"
        name="nationality"
        //initialValue={store.applicant.nationality ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la nacionalidad del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-nationality',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Estado civil"
        name="civilStatus"
        //initialValue={store.applicant.civilStatus ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el estado civil del solicitante',
          },
        ]}
      >
        <Select
          onChange={(val) => {
            dispatch({
              type: 'set-applicant-civilStatus',
              payload: val,
            });
          }}
          disabled={!edit}
          placeholder="Seleccione un estado civil"
        >
          <Select.Option value="Unión Libre">Unión Libre</Select.Option>
          <Select.Option value="Soltero/a">Soltero/a</Select.Option>
          <Select.Option value="Casado/a">Casado/a</Select.Option>
          <Select.Option value="Divorciado/a">Divorciado/a</Select.Option>
        </Select>
        {/* <Input
          disabled={!edit}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-civilStatus',
              payload: event.target.value,
            });
          }}
        /> */}
      </Form.Item>
    </div>
  );
};

export default ApplicantDetails;
