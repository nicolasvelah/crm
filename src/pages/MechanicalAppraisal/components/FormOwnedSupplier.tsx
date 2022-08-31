import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Form,
  Input,
  Switch,
  InputNumber,
  Divider,
  Button,
  message,
} from 'antd';
import validatePhone from '../../../utils/validate-phone';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import Loading from '../../../components/Loading';
import validateIdRuc from '../../../utils/validate-id-ruc';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export interface FormOwnedSupplierProps {}

const FormOwnedSupplier: FunctionComponent<{
  dataFormOwnedSupplier?: boolean;
  acceptedAppraisal: any;
  loadForm: Function;
  viewModal: Function;
  idLead: number;
}> = ({
  dataFormOwnedSupplier,
  acceptedAppraisal,
  loadForm,
  idLead,
  viewModal,
}) => {
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const [loading, setLoading] = useState<boolean>(false);
  const [parameterUpdate, setParameterUpdate] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [
    dataFormOwnedSupplierProps,
    setDataFormOwnedSupplierProps,
  ] = useState<any>({});

  useEffect(() => {
    const componentDidMount = () => {
      console.log('dataFormOwnedSupplier', {dataFormOwnedSupplier, acceptedAppraisal});
      setDataFormOwnedSupplierProps(dataFormOwnedSupplier);
      setId(idLead);
    };

    componentDidMount();
  }, [dataFormOwnedSupplier]);

  return (
    <div className="ml-10" style={{ width: 400 }}>
      {id && (
        <Form
          {...layout}
          initialValues={{
            bussinessName:
              dataFormOwnedSupplierProps !== null
                ? dataFormOwnedSupplierProps.bussinessName
                : '',
            identification: dataFormOwnedSupplierProps
              ? dataFormOwnedSupplierProps.identification
              : '',
            phone: dataFormOwnedSupplierProps
              ? dataFormOwnedSupplierProps.phone
              : '',
            email: dataFormOwnedSupplierProps
              ? dataFormOwnedSupplierProps.email
              : '',
            appraisalValue: dataFormOwnedSupplierProps
              ? dataFormOwnedSupplierProps.appraisalValue
              : '',
            acceptedAppraisal: dataFormOwnedSupplierProps
              ? dataFormOwnedSupplierProps.acceptedAppraisal
              : false,
          }}
          onFinish={async (values) => {
            const dataSetUpdate = {
              preOwnedSupplier: {
                bussinessName: values.bussinessName,
                identification: values.identification,
                phone: values.phone,
                email: values.email,
                appraisalValue: values.appraisalValue,
              },
              acceptedAppraisal: values.acceptedAppraisal,
            };

            setLoading(true);
            const resp = await quouteRepository.updateQuoteAppraisal(
              idLead,
              dataSetUpdate
            );
            setLoading(false);

            viewModal();
            //setParameterUpdate(true);

            if (resp === true) {
              loadForm(dataSetUpdate, idLead);
              message.success('Se guardó con éxito');
            } else {
              message.warning('No se pudo guardar');
            }
          }}
        >
          <Form.Item
            label="Razón Social"
            name="bussinessName"
            rules={[
              { required: true, message: 'Por favor ingrese una razón social' },
            ]}
          >
            <Input
              disabled={
                !!dataFormOwnedSupplierProps || parameterUpdate === true
              }
              value={
                dataFormOwnedSupplierProps !== null
                  ? dataFormOwnedSupplierProps.bussinessName
                  : ''
              }
            />
          </Form.Item>

          <Form.Item
            label="Idetificación"
            name="identification"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese una identificación',
              },
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
                    (valId && valId.isValidate) ||
                    (valIdRuc && valIdRuc.isValidate)
                  ) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Identificación incorrecta');
                },
              }),
            ]}
          >
            <Input
              disabled={
                !!dataFormOwnedSupplierProps || parameterUpdate === true
              }
            />
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
            <Input
              disabled={
                !!dataFormOwnedSupplierProps || parameterUpdate === true
              }
            />
          </Form.Item>
          <Form.Item
            label="Mail"
            name="email"
            rules={[
              { type: 'email' },
              { required: true, message: 'Por favor ingrese un email' },
            ]}
          >
            <Input
              disabled={
                !!dataFormOwnedSupplierProps || parameterUpdate === true
              }
            />
          </Form.Item>
          <Form.Item
            label="Valor Avalúo"
            name="appraisalValue"
            rules={[{ required: true, message: 'Por favor ingrese un valor' }]}
          >
            <InputNumber
              min={0}
              disabled={
                !!dataFormOwnedSupplierProps || parameterUpdate === true
              }
            />
          </Form.Item>
          <Form.Item
            label="¿Aceptó la oferta?"
            name="acceptedAppraisal"
            valuePropName="checked"
          >
            <Switch
              defaultChecked={acceptedAppraisal}
              disabled={
                !!dataFormOwnedSupplierProps || parameterUpdate === true
              }
            />
          </Form.Item>

          {parameterUpdate === true ||
            (dataFormOwnedSupplierProps === null && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  //disabled={!!dataFormOwnedSupplierProps}
                >
                  Guardar
                </Button>
              </Form.Item>
            ))}
        </Form>
      )}

      {/*  <Button
        onClick={() => {
          updateAppraisal();
        }}
      >
        Prueba
      </Button> */}
      <Loading visible={loading} />
    </div>
  );
};

export default FormOwnedSupplier;
