import React, { FunctionComponent, useContext } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  InputNumber,
  Switch,
  Select,
  Tag,
} from 'antd';
import { ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Quotes from '../../../../data/models/Quotes';
import { InitDataClosure } from '../../form-closure-controller';
import { ClientLeadContext } from '../../../../components/GetClientData';

const ParamsBusiness: FunctionComponent<{
  actualQuote: Quotes;
  store: InitDataClosure;
  dispatch: Function;
  valueToFinance: number;
}> = ({ actualQuote, store, dispatch, valueToFinance }) => {
  const { lead } = useContext(ClientLeadContext);
  return (
    <Row gutter={24}>
      <Col span={12}>
        <Form.Item label="PVP:" name="pvp" className="mr-4 mb-4">
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        {actualQuote!.exonerated && (
          <div>
            <Form.Item
              label="Exonerado"
              name="exonerated"
              className="mr-4 mb-4"
            >
              <Input disabled style={{ width: 150 }} />
            </Form.Item>
            <Form.Item label="Tipo" name="exoneratedType" className="mr-4 mb-4">
              <Input disabled style={{ width: 150 }} />
            </Form.Item>
            {actualQuote.exonerated.percentage && (
              <Form.Item
                label="% de exoneración"
                name="exoneratedPercentage"
                className="mr-4 mb-4"
              >
                <Input disabled style={{ width: 150 }} />
              </Form.Item>
            )}
          </div>
        )}
        <Form.Item label="Forma de pago:" name="payType" className="mr-4 mb-4">
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        {actualQuote!.inputAmount && (
          <Form.Item label="Entrada:" name="inputAmount" className="mr-4 mb-4">
            <Input disabled style={{ width: 150 }} />
          </Form.Item>
        )}

        {actualQuote.months && (
          <Form.Item
            label="Meses plazo:"
            name="creditMonths"
            className="mr-4 mb-4"
          >
            <Input disabled style={{ width: 150 }} />
          </Form.Item>
        )}

        {actualQuote.monthly && (
          <Form.Item label="Cuota:" name="quoteAmount" className="mr-4 mb-4">
            <Input disabled style={{ width: 150 }} />
          </Form.Item>
        )}
        {/* <Form.Item label="Valor cuota sin seguro:">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Valor cuota con seguro:">
                    <Input />
                  </Form.Item> */}

        {actualQuote.registration && (
          <Form.Item
            label="Matrícula"
            name="registrationValue"
            className="mr-4 mb-4"
          >
            <Input disabled style={{ width: 150 }} />
          </Form.Item>
        )}
        {valueToFinance ? (
          <Form.Item
            label="Saldo a financiar:"
            name="valueToFinance"
            className="mr-4 mb-4"
          >
            <Input disabled style={{ width: 150 }} />
          </Form.Item>
        ) : null}
        <Form.Item label="Total" name="totalValue" className="mr-4 mb-4">
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        <Form.Item
          label="Auto parte de pago"
          name="carAsPayFrom"
          className="mr-4 mb-4"
        >
          <Checkbox
            disabled
            //defaultChecked={!!actualQuote.mechanicalAppraisalQuote}
            checked={!!actualQuote.mechanicalAppraisalQuote}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Descuento ortogado:"
          name="discount"
          className="mr-4 mb-4"
          rules={[{ required: true, message: 'Debes ingresar al menos 0' }]}
        >
          <InputNumber
            min={0}
            //value={descuento}
            //onChange={(value) => setDescuento(value as number)}
            style={{ width: 150 }}
            formatter={(value) => `${value}%`}
            parser={(value) => value!.replace('%', '')}
          />
        </Form.Item>

        {actualQuote.insuranceCarrier && (
          <div>
            <Form.Item
              label="Aseguradora:"
              name="insuranceName"
              className="mr-4 mb-4"
            >
              <Input disabled style={{ width: 150 }} />
            </Form.Item>
            <Form.Item
              label="Mensual seguro:"
              name="insuranceMonthlyPayment"
              className="mr-4 mb-4"
            >
              <Input disabled style={{ width: 150 }} />
            </Form.Item>
            <Form.Item
              label="Años:"
              name="insuranceYears"
              className="mr-4 mb-4"
            >
              <Input disabled style={{ width: 150 }} />
            </Form.Item>
            <Form.Item
              label="Total seguro:"
              name="insuranceCost"
              className="mr-4 mb-4"
            >
              <Input disabled style={{ width: 150 }} />
            </Form.Item>
          </div>
        )}
        <Form.Item
          label="Paga tercera persona:"
          name="payThirdPerson"
          className="mr-4 mb-4"
        >
          <Switch
            //disabled
            disabled={!!(store as InitDataClosure).payThirdPerson}
            checked={!!actualQuote.payThirdPerson}
            //onChange={onChangeSwitch}
          />
        </Form.Item>
        {actualQuote.type === 'credit' ? (
          <>
            <Form.Item
              label="Financiera:"
              className="mr-4 mb-4"
              name="entity"
              rules={[
                {
                  required: true,
                  message: 'Debes seleccionar una financiera.',
                },
              ]}
            >
              <Select
                //onChange={onChangeEntity}
                disabled={
                  (store as InitDataClosure).entity !== null || !!lead?.saleDown
                }
                //disabled={!!actualQuote.chosenEntity}
                //value={entityType.entity ?? undefined}
                placeholder="Seleccione una financiera"
              >
                {actualQuote.quoteFinancial &&
                  actualQuote.quoteFinancial.map((quoFi, index) => {
                    if (quoFi.responseBank === 'APPROBED') {
                      return (
                        <Select.Option
                          key={index}
                          value={quoFi.financial!.nameEntityFinancial!}
                        >
                          {quoFi.financial?.nameEntityFinancial!}
                        </Select.Option>
                      );
                    }
                    return null;
                  })}
                <Select.Option key="CRM" value="CRM">
                  CRM
                </Select.Option>
              </Select>
            </Form.Item>
            <div className="my-1 p-2 flex">
              <div className="w-1/2">Solicitudes en espera o rechazadas:</div>
              <div className="mx-2">
                {actualQuote.quoteFinancial &&
                actualQuote.quoteFinancial.length > 0
                  ? actualQuote.quoteFinancial.map((quoFinan, index) => {
                      if (!quoFinan.responseBank) {
                        return (
                          <div key={index}>
                            <Tag
                              icon={<ClockCircleOutlined />}
                              style={{ marginRight: 5 }}
                              color="warning"
                              className="mx-1 mb-1"
                            >
                              {quoFinan.financial!.nameEntityFinancial}
                            </Tag>
                          </div>
                        );
                      }
                      if (quoFinan.responseBank === 'REJECT') {
                        return (
                          <div key={index}>
                            <Tag
                              icon={<CloseCircleOutlined />}
                              style={{ marginRight: 5 }}
                              color="error"
                              className="mx-1 mb-1"
                            >
                              {quoFinan.financial!.nameEntityFinancial}
                            </Tag>
                          </div>
                        );
                      }
                      return null;
                    })
                  : ' NINGUNA'}
              </div>
            </div>
          </>
        ) : (
          <Form.Item
            label="Consorcio:"
            name="entity"
            rules={[
              {
                required: true,
                message: 'Debes seleccionar un consorcio.',
              },
            ]}
          >
            <Select
              disabled={!!actualQuote.chosenEntity || !!lead?.saleDown}
              //onChange={onChangeEntity}
              //value={entityType.entity ?? undefined}
              placeholder="Selecione un consorcio"
            >
              <Select.Option value="Consorcio del Pichincha">
                Consorcio del Pichincha
              </Select.Option>
              <Select.Option value="Consorcio de Quito">
                Consorcio de Quito
              </Select.Option>
            </Select>
          </Form.Item>
        )}
      </Col>
    </Row>
  );
};

export default ParamsBusiness;
