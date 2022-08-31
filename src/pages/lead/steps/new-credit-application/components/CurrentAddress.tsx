import React, { FunctionComponent, useContext } from 'react';
import { Input, Form } from 'antd';
import {
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../new-credit-controller';
import validatePhone from '../../../../../utils/validate-phone';

const CurrentAddress: FunctionComponent = () => {
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
        Domicilio actual
      </div>
      <Form.Item
        label="Tipo de vivienda"
        name="typeOfHousing"
        //initialValue={store.currentAddress.typeOfHousing ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el tipo de vivienda del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-typeOfHousing',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Provincia"
        name="province"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la provincia del solicitante',
          },
        ]}
      >
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item
        label="Cantón"
        name="canton"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el cantón del solicitante',
          },
        ]}
      >
        <Input disabled={!edit} />
      </Form.Item>
      <Form.Item
        label="Dirección"
        name="houseAddress"
        //initialValue={store.currentAddress.houseAddress ?? undefined}
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
              type: 'set-currentAddress-houseAddress',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Barrio"
        name="neighborhood"
        //initialValue={store.currentAddress.neighborhood ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el barrio del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-neighborhood',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Parroquia"
        name="parish"
        //initialValue={store.currentAddress.parish ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la parroquia del solicitante',
          },
        ]}
      >
        <Input
          disabled={!edit}
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-parish',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Teléfono domicilio"
        name="homePhone"
        //initialValue={store.currentAddress.homePhone ?? undefined}
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el teléfono de domicilio del solicitante',
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
              type: 'set-currentAddress-homePhone',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
      <Form.Item
        label="Teléfono celular"
        name="cellPhone"
        //initialValue={store.currentAddress.cellPhone ?? undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el celular del solicitante',
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
          //disabled={!edit }
          disabled
          /* onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-cellPhone',
              payload: event.target.value,
            });
          }} */
        />
      </Form.Item>
    </div>
  );
};

export default CurrentAddress;
