import React, { FunctionComponent, useEffect, useState } from 'react';
import { Input, Button, Checkbox, Form } from 'antd';
import Client from '../../../../data/models/Client';

const NewDriver: FunctionComponent<{
  closedModal: Function;
  checkNewDriver: boolean;
  dataDrivers: Function;
  sendNames?: Client;
}> = ({ closedModal, checkNewDriver, dataDrivers, sendNames }) => {
  const [modalDrivers, setModalDriver] = useState<boolean>(false);
  const [nameDriver, setNameDriver] = useState<string>(sendNames?.name!);
  const [lastName, setLastName] = useState<string>(sendNames?.lastName!);
  const [validLicense, setValidLicense] = useState<boolean>(false);

  useEffect(() => {
    const componentdidmount = async () => {
      setNameDriver(sendNames?.name!);
      setLastName(sendNames?.lastName!);
      setModalDriver(checkNewDriver);
    };
    componentdidmount();
  }, [checkNewDriver]);

  const onFormLayoutChange = async ({
    driverName,
    driverLastName,
    driverValidLicense,
  }: any) => {
    if (driverName) {
      await setNameDriver(driverName);
    }
    if (driverLastName) {
      await setLastName(driverLastName);
    }

    await setValidLicense(driverValidLicense);
  };
  return (
    <>
      {checkNewDriver && (
        <Form
          onValuesChange={onFormLayoutChange}
          initialValues={{
            driverName: nameDriver,
            driverLastName: lastName,
            driverValidLicense: validLicense,
          }}
          onFinish={async (values) => {
            const dataSetTestDriver: any = {};
            if (values.driverName) {
              dataSetTestDriver.name = values.driverName;
            }

            if (values.driverLastName) {
              dataSetTestDriver.lastName = values.driverLastName;
            }
            if (values.driverValidLicense) {
              dataSetTestDriver.validLicense = values.driverValidLicense;
            } else {
              dataSetTestDriver.validLicense = false;
            }
            dataSetTestDriver.urlLicenceImage = '';
            dataDrivers(dataSetTestDriver);
            await setModalDriver(checkNewDriver);
            await setNameDriver('');
            await setLastName('');
            await setValidLicense(false);
            await closedModal(false);
          }}
        >
          <Form.Item
            label="Nombre"
            name="driverName"
            rules={[
              {
                required: true,
                message: 'Por favor agregue el nombre del conductor.',
              },
            ]}
          >
            <Input
              value={nameDriver} 
            />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name="driverLastName"
            rules={[
              {
                required: true,
                message: 'Por favor agregue el apellido  del conductor.',
              },
            ]}
          >
            <Input
              value={lastName}
            />
          </Form.Item>
          <Form.Item 
            name="driverValidLicense" 
            valuePropName="checked" 
            rules={[
              // eslint-disable-next-line prefer-promise-reject-errors
              { validator: (_, value) => (value ? Promise.resolve() : Promise.reject('Debe ser una licencia válida.')) },
            ]}
          >
            <Checkbox value={validLicense}>Licencia válida</Checkbox>
          </Form.Item>
          <div className="flex justify-end">
            <Button
              onClick={async () => {
                await setModalDriver(checkNewDriver);
                await setNameDriver('');
                await setLastName('');
                await setValidLicense(false);
                await closedModal(false);
              }}
              style={{ marginRight: 10 }}
            >
              Cancelar
            </Button>
            <Button htmlType="submit" type="primary">
              Agregar
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default NewDriver;
