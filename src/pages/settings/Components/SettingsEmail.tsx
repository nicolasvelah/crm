import { Alert, Button, Form, Input, Row, Col, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import SettingsRepository from '../../../data/repositories/settings-repository';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';

export interface SettingsEmailProps {}

const SettingsEmail: FunctionComponent<{
  data: any[];
  type: 'email-reserve' | 'email-registration';
  idSucursal: string;
}> = ({ data, type, idSucursal }) => {
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );
  const [form] = Form.useForm();
  const [editData, setEditData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataActual, setDataActual] = useState<any[]>([]);

  useEffect(() => {
    console.log('entro update', data);
    if (data.length > 0) {
      setEditData(false);
      form.setFieldsValue({
        email: data[0].settingValue,
      });
    } else {
      form.setFieldsValue({ email: undefined });
      setEditData(true);
    }
    setDataActual(data);
  }, [data]);

  const createEmail = async () => {
    const dataCreate = {
      settingName: 'nombre2',
      settingType: 'email2',
      settingValue: 'correo@correo.com2',
      idSucursal: parseInt(idSucursal),
    };
    const respSettings: any = await settingsRepository.createSetting(
      dataCreate
    );
  };

  const updateEmail = async () => {
    const dataCreate = {
      settingName: 'nombrexxxx',
      settingType: 'emailxxxx',
      settingValue: 'correo@correo.comxxx',
    };
    const respSettings: any = await settingsRepository.updateSetting(
      4,
      dataCreate
    );
  };

  const deleteEmail = async () => {
    const respSettings: any = await settingsRepository.deleteSetting(4);
  };

  return (
    <div>
      {data.length === 0 && (
        <Alert
          message="No exite un email configurado porfavor registre un email."
          /* description="No exite un email configurado porfavor registre un email para caja" */
          type="warning"
          showIcon
          closable
        />
      )}

      <Form
        form={form}
        onFinish={async (values) => {
          if (data.length > 0) {
            setLoading(true);
            const dataCreate = {
              settingName: type,
              settingType: type,
              settingValue: values.email,
            };
            const respSettings: any = await settingsRepository.updateSetting(
              data[0].id || 0,
              dataCreate
            );

            setEditData(false);
            setLoading(false);
            if (respSettings) {
              message.success(
                `Se actualizó el email ${values.email} correctamente`
              );
              setDataActual([dataCreate]);
            } else {
              message.error(`No se pudo actualizar el email ${values.email}`);
            }
          } else {
            setLoading(true);
            const dataCreate = {
              settingName: type,
              settingType: type,
              settingValue: values.email,
              idSucursal: parseInt(idSucursal),
            };
            const respSettings: any = await settingsRepository.createSetting(
              dataCreate
            );
            //setNotEmail(false);
            setEditData(false);
            setLoading(false);
            if (respSettings) {
              message.success(
                `Se guardo el email ${values.email} correctamente`
              );
              setDataActual([dataCreate]);
            } else {
              message.error(`No se pudo guardar el email ${values.email}`);
            }
          }
        }}
      >
        <div className="mt-5">
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email' },
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled={!editData} />
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={4}>
              <div className="flex">
                {editData ? (
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                    >
                      Guardar
                    </Button>
                  </Form.Item>
                ) : (
                  <Button
                    type="link"
                    onClick={() => {
                      /*  setTypeAction('edit');
                      setNotEmail(true); */
                      setEditData(true);
                    }}
                  >
                    Editar
                  </Button>
                )}
                {editData && (
                  <Button
                    type="link"
                    onClick={() => {
                      //setNotEmail(false);
                      setEditData(false);
                      form.setFieldsValue({
                        email:
                          dataActual.length === 0
                            ? undefined
                            : dataActual[0].settingValue,
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Form>

      {/*  <Button
        onClick={() => {
          createEmail();
        }}
      >
        Crear
      </Button>
      <Button
        onClick={() => {
          updateEmail();
        }}
      >
        Actualizar
      </Button>
      <Button
        onClick={() => {
          deleteEmail();
        }}
      >
        Eliminar
      </Button> */}
    </div>
  );
};

export default SettingsEmail;
