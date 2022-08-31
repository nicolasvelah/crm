import React, { useState } from 'react';
import { Button, Form, Input, message, Select, Switch } from 'antd';
import { RespValidate } from '../../utils/validate-id-ruc';
import './css/contactar.scss';
import Validation from './components/Validation';
import { IContactar } from './interfaces/iContactar';
import TipoAtencionCliente from './components/TipoAtencionCliente';

import validatePhone from '../../utils/validate-phone';
import Get from '../../utils/Get';
import CRMRepository from '../../data/repositories/CRM-repository';
import { Dependencies } from '../../dependency-injection';
import Loading from '../../components/Loading';
import ValidarIdentificacion from './../../utils/validate-id-ruc-v2';

type SizeType = Parameters<typeof Form>[0]['size'];

const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

const initialState: IContactar = {
  name: '',
  lastName: '',
  cellphone: '',
  email: '',
  typeIdentification: 'CEDULA',
  identification: '',
  isPerson: 0,
};

const initialValidations = {
  isValidate: false,
  message: '',
};

//  ---------------------- Componente Cotizador Publico-------------------------------

const CotizadorPublico = () => {
  const [contactar, setContactar] = useState(initialState);
  const [disabledInputs, setDisabledInputs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataClient, setDataClient] = useState({});
  const {
    name,
    lastName,
    cellphone,
    email,
    isPerson,
    typeIdentification,
    identification,
  } = contactar;

  const [validations, setValidations] =
    useState<RespValidate>(initialValidations);
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default'
  );
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const onChangeInput = (e: any) => {
    const { name, value } = e.target;
    setContactar({ ...contactar, [name]: value });
    switch (name) {
      case 'identification':
        const validar = new ValidarIdentificacion();
        switch (contactar.typeIdentification) {
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

          default:
            break;
        }
        break;
      default:
        break;
    }
  };
  const onChangeSelect = (value: any, option: any) => {
    if (option.name === 'typeIdentification') {
      setContactar({
        ...contactar,
        [option.name]: value,
        isPerson: 0,
        identification: '',
      });
    } else {
      setContactar({ ...contactar, [option.name]: value });
    }
  };

  const onFinishForm = async () => {
    setIsLoading(true);
    const response = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/new-client',
      {
        data: {
          typeIdentification,
          identification,
          name,
          isPerson,
          lastName,
          cellphone,
          email,
        },
      }
    );
    if (response && response.ok) {
      setDisabledInputs(true);
      setDataClient(response.data.data);
    } else {
      message.error('Verifique que todos los datos sean correctos');
      setDisabledInputs(false);
    }
    setIsLoading(false);
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 14,
    },
  };

  return (
    <>
      {isLoading && <Loading visible={isLoading} />}
      <div className="contactar">
        <h3>CONTACTAR</h3>
        <Form
          {...layout}
          layout="horizontal"
          name="basic"
          size={componentSize as SizeType}
          initialValues={{ typeIdentification }}
          onValuesChange={() => onFormLayoutChange}
          onFinish={onFinishForm}
        >
          <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
            <Input
              name="name"
              value={name}
              onChange={onChangeInput}
              disabled={disabledInputs}
            />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input
              name="lastName"
              value={lastName}
              onChange={onChangeInput}
              disabled={disabledInputs}
            />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="cellphone"
            rules={[
              {
                required: true,
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
              name="cellphone"
              value={cellphone}
              onChange={onChangeInput}
              disabled={disabledInputs}
            />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={onChangeInput}
              disabled={disabledInputs}
            />
          </Form.Item>

          <Form.Item
            label="Tipo de Identificación"
            name="typeIdentification"
            rules={[{ required: true }]}
          >
            <Select onChange={onChangeSelect} disabled={disabledInputs}>
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

          <div className="contactar-identification">
            <Form.Item
              label="Identificación"
              name="identification"
              className={
                !validations.isValidate && identification.length > 0
                  ? 'contactar-identification'
                  : ''
              }
              rules={[{ required: true }]}
              style={{
                marginBottom: `${
                  !validations.isValidate && identification.length > 0 ? 0 : ''
                }`,
              }}
            >
              <Input
                name="identification"
                value={identification}
                onChange={onChangeInput}
                disabled={disabledInputs}
              />
            </Form.Item>
            {!validations.isValidate && identification.length > 0 && (
              <Validation
                message={validations.message}
                param={typeIdentification}
                value={identification}
              />
            )}
          </div>

          {typeIdentification === 'RUC' && (
            <Form.Item label="¿Es persona jurídica?">
              <Switch
                defaultChecked={false}
                onChange={(value) =>
                  setContactar({
                    ...contactar,
                    ['isPerson']: value === true ? 1 : 0,
                  })
                }
              />
            </Form.Item>
          )}
          <div className="contactar-next">
            <Button
              type="primary"
              htmlType="submit"
              className="contactar-next-btn"
              disabled={disabledInputs}
            >
              Siguiente
            </Button>
          </div>
        </Form>
        {disabledInputs && <TipoAtencionCliente dataClient={dataClient} />}
        {/*  <TipoAtencionCliente dataClient={dataClient} /> */}
      </div>
    </>
  );
};

export default CotizadorPublico;
