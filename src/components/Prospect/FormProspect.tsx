/* eslint-disable object-curly-newline */
import React, { FunctionComponent } from 'react';
import { Input, Form, Button, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';

import Client from '../../data/models/Client';

type TypeForm = 'create' | 'edit' | 'viewProspect' | 'update';

const { Option } = Select;

const typeId = (val: string): string => {
  switch (val) {
    case 'C':
      return 'Cédula';
    case 'R':
      return 'RUC';
    default:
      return 'Pasaporte';
  }
};

const FormProspect: FunctionComponent<{
  initData?: Client;
  onFinish?: Function;
  onCancel?: Function;
  type?: TypeForm;
  typeIdenetification?: string;
}> = ({
  initData,
  onFinish,
  onCancel,
  type = 'create',
  typeIdenetification = 'Cédula',
}) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinishForm = (values: Store) => {
    //console.log('Success:', values);
    if (onFinish) onFinish(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    //console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      onFinish={onFinishForm}
      onFinishFailed={onFinishFailed}
    >
      {initData && (initData as Client).typeIdentification && (
        <Form.Item
          label="Tipo"
          name="type"
          initialValue={
            initData && (initData as Client).typeIdentification
              ? typeId((initData as Client).typeIdentification!)
              : undefined
          }
          rules={[
            {
              required: true,
              message: 'Por favor ingresa un tipo de documento.',
            },
          ]}
        >
          <Select disabled={initData !== undefined && type !== 'update'}>
            <Option value="C">Cédula</Option>
            <Option value="R">RUC</Option>
            <Option value="P">Pasaporte</Option>
          </Select>
        </Form.Item>
      )}
      {initData && (initData as Client).identification && (
        <Form.Item
          label="Nro. Identificación"
          name="id"
          initialValue={
            initData && (initData as Client).identification
              ? (initData as Client).identification
              : undefined
          }
          rules={[
            { required: true, message: 'Por favor ingresa un documento.' },
          ]}
        >
          <Input disabled={initData !== undefined && type !== 'update'} />
        </Form.Item>
      )}

      {((initData && (initData as Client).typeIdentification === 'RUC') ||
        typeIdenetification === 'RUC') && (
        <Form.Item
          label="Razón Social"
          name="socialReason"
          initialValue={initData ? initData.socialRazon : undefined}
          rules={[
            { required: true, message: 'Por favor ingresa una Razón Social' },
          ]}
        >
          <Input disabled={initData !== undefined && type !== 'update'} />
        </Form.Item>
      )}
      <Form.Item
        label="Nombre del contacto"
        name="name"
        initialValue={initData ? initData.name : undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingresa el nombre del contacto',
          },
        ]}
      >
        <Input disabled={initData !== undefined && type !== 'update'} />
      </Form.Item>

      <Form.Item
        label="Apellido del contacto"
        name="lastName"
        initialValue={initData ? initData.lastName : undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingresa el apellido del contacto',
          },
        ]}
      >
        <Input disabled={initData !== undefined && type !== 'update'} />
      </Form.Item>

      <Form.Item
        label="Celular"
        name="phone"
        initialValue={initData ? initData.cellphone : undefined}
        rules={[
          {
            required: true,
            message: 'Por favor ingresa el celular del contacto.',
          },
        ]}
      >
        <Input disabled={initData !== undefined && type !== 'update'} />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        initialValue={initData ? initData.email : undefined}
        rules={[
          {
            type: 'email',
            message: 'E-mail no válido',
          },
          {
            required: true,
            message: 'Por favor ingresa el e-mail del contacto.',
          },
        ]}
      >
        <Input disabled={initData !== undefined && type !== 'update'} />
      </Form.Item>
      <Form.Item
        label="Canal"
        name="canal"
        initialValue={initData ? initData.chanel : undefined}
        rules={[
          {
            required: true,
            message: 'Por favor selecciona una canal.',
          },
        ]}
      >
        <Select disabled={initData !== undefined && type !== 'update'}>
          <Option value="Showroom">Showroom</Option>
          <Option value="Referidos">Referidos</Option>
          <Option value="Gestión externa">Gestión externa</Option>
          <Option value="Recompra">Recompra</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Campaña"
        name="campaign"
        initialValue={initData ? initData.campaign : undefined}
        rules={[
          {
            required: true,
            message: 'Por favor selecciona una campaña.',
          },
        ]}
      >
        <Select disabled={initData !== undefined && type !== 'update'}>
          <Option value="Día de las madres">Día de las madres</Option>
          <Option value="Promo 10 años">Promo 10 años</Option>
          <Option value="Navidad">Navidad</Option>
          <Option value="Black Friday">Black Friday</Option>
          <Option value="Fiestas de Guayaquil">Fiestas de Guayaquil</Option>
          <Option value="Fiestas de Quito">Fiestas de Quito</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        {type === 'update' && (
          <Button
            type="link"
            onClick={() => {
              if (onCancel) onCancel();
            }}
            danger
          >
            Cancelar
          </Button>
        )}
        <Button type={type === 'edit' ? 'link' : 'primary'} htmlType="submit">
          {type === 'create' && <>Crear</>}
          {type === 'edit' && <>Editar</>}
          {type === 'viewProspect' && <>Ver Prospecto</>}
          {type === 'update' && <>Actualizar</>}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormProspect;
