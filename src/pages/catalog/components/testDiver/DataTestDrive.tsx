import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import moment from 'moment';
import { Divider, Form, InputNumber, Checkbox, Button, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { PrinterOutlined } from '@ant-design/icons';
import toPrint from '../../../../utils/templates-html/toPrintTemplate';
import { templateTestDriver } from '../../../../utils/templates-html/template-new-credit';
import Loading from '../../../../components/Loading';
import auth from '../../../../utils/auth';
import { ClientLeadContext } from '../../../../components/GetClientData';
import { Dependencies } from '../../../../dependency-injection';
import Get from '../../../../utils/Get';
import TestDriverRepository from '../../../../data/repositories/testDriver-repository';
import { TestDriverInputUpdate } from '../../../../data/providers/apollo/mutations/testDriver';
import { CatalogContext } from '../../../../state/CatalogueState';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

interface InitDataTestDrive {
  initKm: number;
  finalKm: number;
  confirmTestDrive: boolean;
  observations: string;
}

const DataTestDrive: FunctionComponent<{
  disabled?: boolean;
  initData?: InitDataTestDrive;
  listDataDrivers?: any[];
  idTestDriver?: number;
  model?: string;
  vin?: string;
  brand?: string;
  anio?: string;
  color?: string;
  startKm?: number;
  endKm?: number;
}> = ({
  initData,
  disabled,
  listDataDrivers,
  idTestDriver,
  model,
  vin,
  brand,
  anio,
  color,
  startKm,
  endKm,
}) => {
  const { client, lead } = useContext(ClientLeadContext);
  const { setViewTestDriver } = useContext(CatalogContext);
  const [starKmState, setStarKmState] = useState<number>(0);
  const [endKmState, setEndKmState] = useState<number>(0);
  const [confirmTestDriveState, setConfirmTestDriveState] = useState<boolean>(
    false
  );
  const [obs, setObs] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testDriverRepository = Get.find<TestDriverRepository>(
    Dependencies.testDriver
  );

  useEffect(() => {
    if (initData) {
      //console.log({ initData });
      setStarKmState(initData.initKm);
      setEndKmState(initData.finalKm);
      setConfirmTestDriveState(initData.confirmTestDrive);
      setObs(initData.observations);
    }
    //console.log('debug0000000', { client, listDataDrivers, model, vin });
  }, []);

  const onFinishUpdate = async (value: any) => {
    setLoading(true);
    //console.log({ value });
    const testDriverToUpdate: TestDriverInputUpdate = {
      confirmTestDrive: value.itemConfirmTestDrive,
      dateTestConfirmation: moment().format(),
      dateUpdateTestDriver: moment().format(),
      endKm: value.itemEndKm === 0 ? null : value.itemEndKm,
      observations: value.itemObs,
      startKm: value.itemStartKm === 0 ? null : value.itemStartKm,
    };
    const respGQL = await testDriverRepository.updateTestDriver(
      idTestDriver!,
      testDriverToUpdate
    );
    //console.log('🚀 UPDATED OK', respGQL);
    setLoading(false);
    if (respGQL) {
      message.success('Datos guardados');
      const data = auth.user;

      //console.log('DATA SUCURSAL ✅✅', data.dealer[0].sucursal[0].sucursal);
      toPrint(
        templateTestDriver({
          client: client!,
          listDataDrivers: listDataDrivers!,
          vin,
          brand,
          model,
          user: lead ? `${lead?.user?.nombre} ${lead?.user?.apellido}` : '',
          anio,
          color,
          concessionaire: data.dealer[0].sucursal[0].sucursal,
          startKm: starKmState,
          endKm: endKmState,
          concesionarioCode: lead?.concesionario?.code,
        })
      );
      setViewTestDriver('catalogSelection');
      return;
    }
    message.error('Error al guardar datos');

    //await setCatalogueContextCalalog();
  };
  const onChangeStartKm = (value: any) => {
    setStarKmState(value);
  };
  return (
    <div className="mt-10">
      <Divider>Datos del test drive</Divider>

      <Form
        {...layout}
        initialValues={
          initData
            ? {
                itemStartKm: initData.initKm ?? starKmState,
                itemEndKm: initData.finalKm ?? endKmState,
                itemConfirmTestDrive:
                  initData.confirmTestDrive ?? confirmTestDriveState,
                itemObs: initData.observations ?? obs,
              }
            : undefined
        }
        onFinish={onFinishUpdate}
        onFieldsChange={(val: any) => {
          try {
            //console.log('CHANGE', val[0]);
            if (typeof val[0].value === 'number') {
              if (val[0].name[0] === 'itemStartKm') {
                setStarKmState((prevState) => {
                  if (prevState === val[0].value) return prevState;
                  return val[0].value;
                });
              }
              if (
                val[0].name[0] === 'itemEndKm' &&
                typeof val[0].value === 'number'
              ) {
                setEndKmState((prevState) => {
                  if (prevState === val[0].value) return prevState;
                  return val[0].value;
                });
              }
            }
          } catch (error) {
            //console.log('Error change', error.message);
          }
        }}
      >
        <Form.Item
          label="Kilometraje inicial"
          name="itemStartKm"
          /* rules={[
            () => ({
              validator(rule, val: any) {
                if (val > 0) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('');
              },
            }),
          ]} */
        >
          <InputNumber
            //onChange={onChangeStartKm}
            value={starKmState}
            disabled={disabled || !!lead?.saleDown}
            formatter={(value) => `${value}km`}
            parser={(value) => value!.replace('km', '')}
          />
        </Form.Item>

        <Form.Item
          label="Kilometraje Final"
          name="itemEndKm"
          rules={[
            () => ({
              validator(rule, val: any) {
                if (
                  val > starKmState ||
                  (starKmState === 0 && endKmState === 0)
                ) {
                  return Promise.resolve();
                }

                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('');
              },
            }),
          ]}
        >
          <InputNumber
            value={endKmState}
            disabled={disabled || !!lead?.saleDown}
            formatter={(value) => `${value}km`}
            parser={(value) => value!.replace('km', '')}
          />
        </Form.Item>
        <div className="flex flex-row">
          <p>Confirmo que el Test Drive se realizó con éxito  </p>
          <Form.Item name="itemConfirmTestDrive" valuePropName="checked">
            <Checkbox
              value={confirmTestDriveState}
              disabled={disabled || !!lead?.saleDown}
            />
          </Form.Item>{' '}
        </div>

        <Form.Item name="itemObs" label="Observaciones">
          <TextArea
            value={obs}
            rows={4}
            style={{ width: 600 }}
            disabled={disabled || !!lead?.saleDown}
          />
        </Form.Item>
        {!initData && (
          <div className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              disabled={!!lead?.saleDown}
            >
              {starKmState === 0 && endKmState === 0
                ? 'Cerrar'
                : 'Guardar e imprimir'}
            </Button>
          </div>
        )}
      </Form>
      <Loading visible={loading} />
    </div>
  );
};

export default DataTestDrive;
