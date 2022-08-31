import React, { FunctionComponent } from 'react';
import { Form, Input, InputNumber, Switch, Divider } from 'antd';
import validatePhone from '../../../../utils/validate-phone';
import validateIdRuc from '../../../../utils/validate-id-ruc';

const MechanicalAppraisal: FunctionComponent<{
  preOwnedSupplier: any;
}> = ({ preOwnedSupplier }) => {
  //console.log('mechanicalAppraisalQuote >>>', preOwnedSupplier);
  return (
    <>
      <Divider orientation="left">Proveedor de seminuevos</Divider>

      <Form.Item
        label="Razon Social"
        name="bussinessName"
        rules={[
          { required: true, message: 'Por favor ingrese una razón social' },
        ]}
      >
        <Input disabled={preOwnedSupplier.bussinessName !== ''} />
      </Form.Item>

      <Form.Item
        label="Idetificación"
        name="identification"
        rules={[
          { required: true, message: 'Por favor ingrese una identificación' },
          () => ({
            validator(rule, val: any) {
              //console.log('My Val', val);
              if (!val) {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('Cédula incorrecta');
              }
              const valId = validateIdRuc('CEDULA', val);
              const valIdRuc = validateIdRuc('RUC', val);
              //console.log('My valId', valId);
              if (
                (valIdRuc && valIdRuc.isValidate) ||
                (valId && valId.isValidate)
              ) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('Identificación incorrecta');
            },
          }),
        ]}
      >
        <Input disabled={preOwnedSupplier.identification !== ''} />
      </Form.Item>
      <Form.Item
        label="Celular"
        name="phone"
        rules={[
          { required: true, message: 'Por favor ingrese un celular' },
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
        <Input disabled={preOwnedSupplier.phone !== 0} />
      </Form.Item>
      <Form.Item
        label="Mail"
        name="email"
        rules={[
          { type: 'email' },
          { required: true, message: 'Por favor ingrese un email' },
        ]}
      >
        <Input disabled={preOwnedSupplier.email !== ''} />
      </Form.Item>
      <Form.Item
        label="Valor Avalúo"
        name="appraisalValue"
        rules={[{ required: true, message: 'Por favor ingrese un valor' }]}
      >
        <InputNumber min={0} disabled={preOwnedSupplier.appraisalValue !== 0} />
      </Form.Item>
      <Form.Item label="¿Aceptó la oferta?" name="acceptedAppraisal">
        <Switch
          //checked={!!preOwnedSupplier.acceptedAppraisal}
          defaultChecked={!!preOwnedSupplier.acceptedAppraisal}
          disabled={preOwnedSupplier.acceptedAppraisal !== null}
        />
      </Form.Item>
    </>
  );
};

export default MechanicalAppraisal;
