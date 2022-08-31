import React, { FunctionComponent } from 'react';
import { Row, Col, Form, Input, InputNumber, Divider } from 'antd';

import Quotes from '../../../../data/models/Quotes';
import { InitDataClosure } from '../../form-closure-controller';
import MechanicalAppraisal from './MechanicalAppraisal';

const AvaluoMecanico: FunctionComponent<{
  actualQuote: Quotes;
  store: InitDataClosure;
  dispatch: Function;
}> = ({ actualQuote, store, dispatch }) => {
  return (
    <Row gutter={24}>
      <Col span={12}>
        <Divider orientation="left">Avalúo Mecánico</Divider>
        <Form.Item label="Marca" name="carAsPayFromBrand" className="mr-4 mb-4">
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        <Form.Item
          label="Modelo"
          name="carAsPayFromModel"
          className="mr-4 mb-4"
        >
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="Año" name="carAsPayFromYear" className="mr-4 mb-4">
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        <Form.Item
          label="Kilometrage"
          name="carAsPayFromKm"
          className="mr-4 mb-4"
        >
          <InputNumber
            disabled
            style={{ width: 150 }}
            formatter={(value) => `${value}km`}
            parser={(value) => value!.replace('km', '')}
          />
        </Form.Item>
        <Form.Item
          label="Precio deseado"
          name="carAsPayFromDesiredPrice"
          className="mr-4 mb-4"
        >
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <MechanicalAppraisal
          preOwnedSupplier={{
            appraisalValue: actualQuote.preOwnedSupplier
              ? actualQuote.preOwnedSupplier.appraisalValue
              : 0,
            bussinessName: actualQuote.preOwnedSupplier
              ? actualQuote.preOwnedSupplier!.bussinessName
              : '',
            email: actualQuote.preOwnedSupplier
              ? actualQuote.preOwnedSupplier!.email
              : '',
            identification: actualQuote.preOwnedSupplier
              ? actualQuote.preOwnedSupplier!.identification
              : '',
            phone: actualQuote.preOwnedSupplier
              ? actualQuote.preOwnedSupplier!.phone
              : 0,
            acceptedAppraisal: actualQuote.acceptedAppraisal,
          }}
        />
      </Col>
    </Row>
  );
};

export default AvaluoMecanico;
