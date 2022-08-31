import React, { FunctionComponent, useContext } from 'react';
import { Input, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';
import validatePhone from '../../../../../utils/validate-phone';

const CommercialReferences: FunctionComponent = () => {
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
        Referencias Comerciales
      </div>
      <Form.Item
        label="Compañía"
        name="companyComercialReference"
        /*  rules={[
          {
            required: true,
            message: 'Por favor ingrese el tipo de vivienda del solicitante',
          },
        ]} */
      >
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item label="Sector" name="sector">
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item
        label="Teléfono"
        name="phone"
        rules={[
          () => ({
            validator(rule, val) {
              //console.log('val', val);
              if (val === undefined || val === null) {
                return Promise.resolve();
              }
              if (val.length === 0) {
                return Promise.resolve();
              }
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
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item label="Domicilio" name="placeCompany">
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item label="Nombre" name="referenceName">
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item label="Cargo" name="position">
        <Input disabled={!edit} />
      </Form.Item>
    </div>
  );
};

export default CommercialReferences;
