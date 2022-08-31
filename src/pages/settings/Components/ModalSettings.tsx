/* eslint-disable no-unused-vars */
import { Button, Divider, Form, Input, message, Select } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import FinancialRepository from '../../../data/repositories/financial-repository';

import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import auth from '../../../utils/auth';
import { TableEntity } from './Settings';
import Loading from '../../../components/Loading';
import validatePhone from '../../../utils/validate-phone';

export interface ModalSettingsProps {}

const { Option } = Select;
export interface typeModal {
  typeModal: 'edit' | 'new' | 'view';
}
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const layoutButtons = {
  wrapperCol: {
    offset: 16,
    span: 12,
  },
};
const dataNew = {
  key: 0,
  entity: '',
  typeEntity: '',
  contact: '',
  createdAt: '',
  phoneEntityFinancial: '',
  emailcontact: '',
  nameContact: '',
  lastNameContact: '',
};

const { user } = auth;

const ModalSettings: FunctionComponent<{
  dataModal: any;
  viewModal: Function;
  update: Function;
  typeModal: any;
  idSucursal: string;
}> = ({ dataModal, viewModal, typeModal, update, idSucursal }) => {
  const financialRepository = Get.find<FinancialRepository>(
    Dependencies.financial
  );
  const [data, setData] = useState<TableEntity>();
  const [type, setType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const init = () => {
    if (dataModal !== null) {
      setData(dataModal);
      setType(typeModal);
    } else {
      setData(dataNew);
      setType(typeModal);
    }
  };

  const createFinacial = async () => {
    const dataCreate = {
      typeEntity: 'xx',
      nameEntityFinancial: 'xx',
      phoneEntityFinancial: '09986454545',
      nameContact: 'xx',
      lastNameContact: 'xx',
      emailcontact: 'xx',
      idSucursal: '20',
    };

    const respEntities: any = await financialRepository.createFinancialEntity(
      dataCreate
    );
  };

  const updateFinancial = async () => {
    const dataCreate = {
      typeEntity: 'ff',
      nameEntityFinancial: 'ff',
      phoneEntityFinancial: '0998645454567',
      nameContact: 'f',
      lastNameContact: 'f',
      emailcontact: 'f',
    };

    const respEntities: any = await financialRepository.updateFinancialEntity(
      26,
      dataCreate
    );
  };

  const deleteFinancial = async () => {
    const respEntities: any = await financialRepository.deleteFinancialEntity(
      26
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>
        <Divider orientation="left" style={{ marginTop: 0 }}>
          Contacto
        </Divider>
        <div className="mt-10">
          {data && (
            <Form
              {...layout}
              initialValues={
                data
                  ? {
                      nameContact: data.nameContact,
                      lastNameContact: data.lastNameContact,
                      emailContact: data.emailcontact,
                      nameEntity: data.entity,
                      phoneEntity: data.phoneEntityFinancial,
                      typeEntity: data.typeEntity,
                    }
                  : {}
              }
              onFinish={async (values) => {
                //const idSucursalV = user.dealer[0].sucursal[0].id_sucursal;
                if (type === 'new') {
                  setLoading(true);
                  const dataCreate = {
                    typeEntity: values.typeEntity,
                    nameEntityFinancial: values.nameEntity,
                    phoneEntityFinancial: values.phoneEntity,
                    nameContact: values.nameContact,
                    lastNameContact: values.lastNameContact,
                    emailcontact: values.emailContact,
                    idSucursal
                  };
                  /* if (!!true) {
                    console.log('dataCreate -->', dataCreate);
                    setLoading(false);
                    return;
                  } */

                  const respEntities: any = await financialRepository.createFinancialEntity(
                    dataCreate
                  );
                  if (respEntities) {
                    message.success(
                      `Se guardo la entidad finaciera ${values.nameEntity} correctamente`
                    );

                    update();
                    setType('view');
                  } else {
                    message.error(
                      `No se pudo guardar la entidad financiera ${values.nameEntity}`
                    );
                  }
                  setLoading(false);
                }
                if (type === 'edit') {
                  setLoading(true);
                  const dataCreate = {
                    typeEntity: values.typeEntity,
                    nameEntityFinancial: values.nameEntity,
                    phoneEntityFinancial: values.phoneEntity,
                    nameContact: values.nameContact,
                    lastNameContact: values.lastNameContact,
                    emailcontact: values.emailContact,
                  };

                  const respEntities: any = await financialRepository.updateFinancialEntity(
                    dataModal.idFinancial,
                    dataCreate
                  );

                  if (respEntities) {
                    message.success(
                      `Se actualizo la información de ${values.nameEntity} correctamente`
                    );
                    update();
                    setType('view');
                  } else {
                    message.error(
                      `No se pudo actualizar la información de ${values.nameEntity}`
                    );
                  }
                  setLoading(false);
                }
              }}
            >
              <Form.Item
                name="nameContact"
                label="Nombre"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={type === 'view'} />
              </Form.Item>

              <Form.Item
                name="lastNameContact"
                label="Apellido"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={type === 'view'} />
              </Form.Item>

              <Form.Item
                name="emailContact"
                label="Email"
                rules={[
                  { type: 'email' },
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={type === 'view'} />
              </Form.Item>
              <div className="mt-10 mb-10">
                <Divider orientation="left" style={{ marginTop: 0 }}>
                  Entidad finaciera
                </Divider>
              </div>

              <Form.Item
                name="nameEntity"
                label="Nombre"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={type === 'view'} />
              </Form.Item>

              <Form.Item
                name="phoneEntity"
                label="Teléfono"
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
                <Input disabled={type === 'view'} />
              </Form.Item>
              <Form.Item
                name="typeEntity"
                label="Tipo"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                {/*  <Input disabled={type === 'view'} /> */}
                <Select style={{ width: 200 }} disabled={type === 'view'}>
                  <Option value="FINANCIAL">FINANCIERA</Option>
                  <Option value="CONSORTIUM">CONSORCIO</Option>
                </Select>
              </Form.Item>
              {type === 'view' && (
                <Button
                  type="link"
                  style={{ marginLeft: 15, marginTop: 15 }}
                  onClick={() => {
                    setType('edit');
                  }}
                >
                  Editar información
                </Button>
              )}
              {(type === 'edit' || type === 'new') && (
                <Form.Item {...layoutButtons}>
                  <div className="flex flex-row">
                    <Button
                      style={{ marginTop: 10, marginRight: 10 }}
                      onClick={() => {
                        viewModal(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginTop: 10 }}
                      icon={<SaveOutlined />}
                    >
                      Guardar
                    </Button>
                  </div>
                </Form.Item>
              )}

              {type === 'view' && (
                <Button
                  style={{ marginTop: 10, marginLeft: 400, marginBottom: 30 }}
                  onClick={() => {
                    viewModal(false);
                  }}
                  type="primary"
                >
                  Aceptar
                </Button>
              )}
            </Form>
          )}
        </div>
        {/* <Button
          onClick={() => {
            updateFinancial();
          }}
        >
          Update
        </Button>
        <Button
          onClick={() => {
            deleteFinancial();
          }}
        >
          Delete
        </Button> */}
        <Loading visible={loading} />
      </div>
    </>
  );
};

export default ModalSettings;
