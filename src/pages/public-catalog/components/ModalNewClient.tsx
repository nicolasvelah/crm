/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable no-undef */
import { RightOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Switch } from 'antd';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { RespValidate } from '../../../utils/validate-id-ruc';
import ValidarIdentificacion from '../../../utils/validate-id-ruc-v2';
import validatePhone from '../../../utils/validate-phone';
import Validation from '../../contactar/components/Validation';
import PublicCatalogContext from '../context/PublicCatalogContext';

export interface ModalNewClientProps {}

const ModalNewClient: FunctionComponent<{ nextModal: Function }> = ({
  nextModal,
}) => {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const initialValidations = {
    isValidate: false,
    message: '',
  };

  const [clientData, setClientData] = useState<any>();
  const [typeIdentification, setTypeIdentification] = useState<string>('');
  const [validations, setValidations] = useState<RespValidate>(
    initialValidations
  );
  const [isPerson, setIsPerson] = useState<number>(0);
  const [identification, setIdentification] = useState<any>([]);
  const { setClientDataContext } = useContext(PublicCatalogContext);

  const finishClientdata = (value: any) => {
    setClientData({ ...clientData, ...value });
    if (setClientDataContext) setClientDataContext({ ...clientData, ...value });
    nextModal();
  };

  const onChangeSelect = (value: any, option: any) => {
    setTypeIdentification(value);
    if (value === 'RUC') {
      setClientData({
        ...clientData,
        [option.name]: value,
        isPerson: 0,
      });
    } else {
      setClientData({ ...clientData, [option.name]: value });
    }
  };
  const onChangeIdentification = (e: any) => {
    setIdentification(e.target.value);
    const { name, value } = e.target;
    switch (name) {
      case 'identification':
        const validar = new ValidarIdentificacion();
        switch (typeIdentification) {
          case 'CEDULA':
            setValidations(validar.validarCedula(value));
            break;
          case 'RUC':
            let ruc: RespValidate = initialValidations;
            if (isPerson !== 0) {
              if (value[2] === '6') {
                ruc = validar.validarRucSociedadPublica(value);
              } else if (value[2] === '9') {
                ruc = validar.validarRucSociedadPrivada(value);
              } else {
                ruc = { ...initialValidations, message: 'No es un ruc valido' };
              }
            } else {
              ruc = validar.validarRucPersonaNatural(value);
            }
            setValidations(ruc);
            break;
        }
    }
  };

  useEffect(() => {
    setTypeIdentification('CEDULA');
  }, []);
  return (
    <>
      <div>
        <Form
          {...layout}
          layout="horizontal"
          name="basic"
          initialValues={{ typeIdentification: 'CEDULA' }}
          onValuesChange={() => {}}
          onFinish={finishClientdata}
        >
          <Form.Item
            label="Tipo de Identificación"
            name="typeIdentification"
            rules={[
              {
                required: true,
                message: 'Por favor escoja su tipo de identificación',
              },
            ]}
          >
            <Select onChange={onChangeSelect}>
              <Select.Option name="typeIdentification" value="CEDULA">
                Cédula
              </Select.Option>
              <Select.Option name="typeIdentification" value="RUC">
                RUC
              </Select.Option>
              <Select.Option name="typeIdentification" value="PASAPORTE">
                Pasaporte
              </Select.Option>
            </Select>
          </Form.Item>

          {typeIdentification === 'RUC' && (
            <Form.Item label="¿Es persona jurídica?">
              <Switch
                defaultChecked={false}
                onChange={(value) => {
                  setClientData({
                    ...clientData,
                    isPerson: value === true ? 1 : 0,
                  });
                  setIsPerson(value === true ? 1 : 0);
                }}
              />
            </Form.Item>
          )}
          {!validations.isValidate && identification.length > 0 && (
            <div style={{ marginBottom: 5 }}>
              <Validation
                message={validations.message}
                param={typeIdentification}
                value={identification}
              />
            </div>
          )}
          <Form.Item
            label="Identificación"
            name="identification"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese su identificación',
              },
            ]}
          >
            <Input name="identification" onChange={onChangeIdentification} />
          </Form.Item>

          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
          >
            <Input name="name" onChange={() => {}} />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name="lastName"
            rules={[
              { required: true, message: 'Por favor ingrese su apellido' },
            ]}
          >
            <Input name="lastName" onChange={() => {}} />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="cellphone"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese su teléfono',
              },
              () => ({
                validator(rule, val: string) {
                  const isvalid = validatePhone(val);
                  if (isvalid) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject(
                    <div className="mt-2">Número telefónico no válido</div>
                  );
                },
              }),
            ]}
          >
            <Input name="cellphone" onChange={() => {}} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Por favor ingrese su email' }]}
          >
            <Input name="email" type="email" onChange={() => {}} />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: 0,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {}}
              style={{ marginTop: 20 }}
            >
                Siguiente <RightOutlined />
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ModalNewClient;
