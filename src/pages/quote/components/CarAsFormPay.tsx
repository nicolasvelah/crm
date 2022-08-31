/* eslint-disable no-restricted-properties */
import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import moment from 'moment';

const CarAsFormPay = React.memo<{ activeProviderData: boolean }>(
  ({ activeProviderData }) => {
    //console.log(activeProviderData);
    return (
      <div>
        <Form.Item
          label="Marca"
          name="carPayBrand"
          rules={[{ required: true, message: 'Ingresa la marca!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Modelo"
          name="carPayModel"
          rules={[{ required: true, message: 'Ingresa el modelo!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Año"
          name="carPayYear"
          rules={[{ required: true, message: 'Ingresa el año!' }]}
        >
          <InputNumber min={1900} max={Number(moment().format('YYYY')) + 1} />
        </Form.Item>
        <Form.Item
          label="Kilometraje"
          name="carPayKm"
          rules={[{ required: true, message: 'Ingresa el Kilometraje' }]}
        >
          <InputNumber
            min={1}
            max={10000000}
            formatter={(value) => `${value}km`}
            parser={(value: any) => value.replace('km', '')}
          />
        </Form.Item>
        <Form.Item
          label="Precio deseado"
          name="carPayDesiredPrice"
          rules={[{ required: true, message: 'Ingresa el  precio deseado!' }]}
        >
          <InputNumber
            min={1}
            max={100000}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
      </div>
    );
  }
);

export default CarAsFormPay;
