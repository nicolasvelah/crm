import React, { FunctionComponent, useContext } from 'react';
import { Input, InputNumber, Form } from 'antd';

import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';
import validatePhone from '../../../../../utils/validate-phone';

const ApplicantActivity: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    edit,
  }: {
    store: NewCreditGlobalState;
    dispatch: DispatchNewCredit;
    edit: boolean;
  } = value;
  //console.log('REnde rApplicantActivity', store);
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Empleo / Actividad del Solicitante
      </div>
      <Form.Item
        label="Empresa"
        //initialValue={store.applicantActivity.company ?? undefined}
        name="company"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la empresa del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-company',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Teléfono Trabajo"
        name="workPhone"
        //initialValue={store.applicantActivity.workPhone ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el teléfono de trabajo del solicitante',
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
              type: 'set-applicantActivity-workPhone',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Años trabajando"
        name="yearsOfWork"
        //initialValue={store.applicantActivity.yearsOfWork ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese los años de trabajo del solicitante',
          },
        ]}
      >
        <InputNumber
          disabled={!edit}
          min={0}
          /* onChange={(event: string | number | undefined) => {
            dispatch({
              type: 'set-applicantActivity-yearsOfWork',
              payload: event,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Cargo"
        name="workPosition"
        //initialValue={store.applicantActivity.workPosition ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el cargo de trabajo del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-workPosition',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Dirección"
        name="workAddress"
        //initialValue={store.applicantActivity.workAddress ?? undefined}
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese la dirección de trabajo del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-workAddress',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Tipo de relación laboral"
        name="employmentRelationship"
        /* initialValue={
          store.applicantActivity.employmentRelationship ?? undefined
        } */
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el tipo de relacoón laboral del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-employmentRelationship',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
    </div>
  );
};

export default ApplicantActivity;
