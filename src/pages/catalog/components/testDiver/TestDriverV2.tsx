import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  Input,
  DatePicker,
  TimePicker,
  Button,
  Checkbox,
  Form,
  Alert,
  Modal,
  message,
  Table,
  Divider,
  Row,
  Col,
  Select,
} from 'antd';

import { CatalogContext } from '../../../../state/CatalogueState';
import { Dependencies } from '../../../../dependency-injection';
import NewDriver from './NewDriver';
import Get from '../../../../utils/Get';
import TestDriverRepository from '../../../../data/repositories/testDriver-repository';
import Loading from '../../../../components/Loading';
import { ClientLeadContext } from '../../../../components/GetClientData';
import DataTestDrive from './DataTestDrive';
import milisecondsToDate from '../../../../utils/milisecondsToDate';
import { TestDriverInput } from '../../../../data/providers/apollo/mutations/testDriver';
import auth from '../../../../utils/auth';
import toPrint from '../../../../utils/templates-html/toPrintTemplate';
import { templateTestDriver } from '../../../../utils/templates-html/template-new-credit';
import SettingsRepository from '../../../../data/repositories/settings-repository';
import Financial from '../../../../data/models/Settings';
import { stringToJson } from '../../../../utils/extras';
import Leads from '../../../../data/models/Leads';
import TestDriverInterface from '../../../../data/models/TestDriver';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 6,
  },
};

const DATES_SATURDAY = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
const DATES_NO_SATURDAY = [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23];

const TestDriver: FunctionComponent<{
  nextStepLead?: Function;
  dataTestDriverSelection?: any;
}> = ({ nextStepLead, dataTestDriverSelection }) => {
  const { user } = auth;
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const { setViewTestDriver, selectNewVehicle } = useContext(CatalogContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [modalDrivers, setModalDriver] = useState<boolean>(false);
  const testDriverRepository = Get.find<TestDriverRepository>(
    Dependencies.testDriver
  );
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );

  const [listDataDrivers, setListDataDrivers] = useState<any>([
    /*{
      key: 100,
      name: client?.name,
      lastName: client?.lastName,
      urlLicenceImage: '',
      validLicense: true,
    },*/
  ]);

  const [disebleHours, setDisebleHours] = useState<number[]>(DATES_NO_SATURDAY);
  const [dayString, setDayString] = useState<string>('');
  const [routes, setRoutes] = useState<Financial[]>([]);

  /****************************************************************************/

  const getSettings = async (idInput: number) => {
    try {
      setLoading(true);
      //console.log('configuraciones', idInput);
      const respSettings:
        | Financial[]
        | null = await settingsRepository.getAllSettings(idInput);
      //console.log('respSettings', respSettings);
      if (respSettings && respSettings.length > 0) {
        const respFilter = respSettings.filter((fin) => {
          return (
            stringToJson(fin.settingValue) &&
            fin.settingType === 'testdrive-Route'
          );
        });
        //console.log('respFilter', respFilter);
        setRoutes(respFilter);
        setLoading(false);
        return true;
      }
      message.warning(
        'Se requiere de una RUTA para poder realizar el TestDrive'
      );
      setLoading(false);
      return false;
    } catch (e) {
      message.error('Error al obtener las rutas');
      setLoading(false);
      return false;
    }
  };

  /****************************************************************************/

  const componentdidmout = async () => {
    //console.log('selectNewVehicle', selectNewVehicle);
    //console.log('dataTestDriverSelection !!!!!!', dataTestDriverSelection);
    if (dataTestDriverSelection && dataTestDriverSelection.drivers.length > 0) {
      //console.log('dataTestDriverSelection !!!!!!', dataTestDriverSelection);
      setListDataDrivers(dataTestDriverSelection.drivers);
    }
    await getSettings(user.dealer[0].sucursal[0].id_sucursal);
  };

  useEffect(() => {
    componentdidmout();
  }, []);

  const dataDrivers = (e: any) => {
    const dataIndex = { ...e, key: listDataDrivers.length };

    const newArray: any = [...listDataDrivers, dataIndex];
    setListDataDrivers(newArray);
  };

  const setCatalogueContextCalalog = () => {
    setViewTestDriver('catalogSelection');
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().add(-1, 'day').endOf('day');
  };

  if (loading) {
    return <Loading visible />;
  }

  if (!client) {
    return <Loading visible />;
  }

  return (
    <div className="ml-10">
      <div className="mb-10">
        <Button
          type="link"
          onClick={() => {
            setCatalogueContextCalalog();
          }}
          style={{ paddingLeft: 0 }}
        >
          <div style={{ display: 'flex' }}>
            <ArrowLeftOutlined
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 0,
              }}
            />
            <span>  Regresar a catálogo</span>
          </div>
        </Button>
      </div>

      <Divider>Test drive</Divider>
      <Alert
        message="Recuerda que el cliente será encuestado sobre la prueba."
        type="info"
      />
      <br />
      {client && lead && (
        <Form
          {...layout}
          initialValues={
            dataTestDriverSelection
              ? {
                  dateItemTestDriver: dataTestDriverSelection.dateTestDriver
                    ? moment(
                        milisecondsToDate(
                          dataTestDriverSelection.dateTestDriver,
                          'YYYY-MM-DD'
                        ),
                        'YYYY-MM-DD'
                      )
                    : moment(moment(), 'YYYY-MM-DD'),
                  timeTestDriver: moment(
                    milisecondsToDate(
                      dataTestDriverSelection.dateTestDriver,
                      'YYYY-MM-DD HH:mm'
                    ),
                    'YYYY-MM-DD HH:mm'
                  ),
                  vin: dataTestDriverSelection?.vin,
                  yearVehicle: dataTestDriverSelection?.yearVehicle,
                  colorVehicle: dataTestDriverSelection?.colorVehicle,
                  brandVehicle: dataTestDriverSelection.brandVehicle,
                  codeVehicle: dataTestDriverSelection.codeVehicle,
                  modelVehicle: dataTestDriverSelection.modelVehicle,
                  ClientName: `${client?.name} ${client?.lastName}`,
                  ruta: JSON.parse(dataTestDriverSelection.route).descripcion,
                }
              : {
                  ClientName: `${client?.name} ${client?.lastName}`,
                  brandVehicle: selectNewVehicle?.dataVehicle?.marca,
                  codeVehicle: selectNewVehicle?.dataVehicle?.codigo,
                  modelVehicle: selectNewVehicle?.dataVehicle?.modelo,
                  vin: selectNewVehicle?.dataVehicle?.vin,
                }
          }
          onFinish={async (values) => {
            //console.log('values FORM TESDRIVE', values);
            const routeFind = routes.find((item) => item.id === values.ruta);
            //console.log('routeFind', routeFind);
            /*  if (!!true) {
              return;
            } */
            if (listDataDrivers.length > 0 && selectNewVehicle) {
              setLoading(true);
              //console.log(
              //   'selectNewVehicle.imageVehicle',
              //   selectNewVehicle.imageVehicle
              // );
              const newTest: TestDriverInput = {
                testDrivePrint: false,
                brandVehicle: values.brandVehicle,
                codeVehicle: null,
                modelVehicle: values.modelVehicle,
                urlImageVehicle: selectNewVehicle.imageVehicle ?? null,
                yearVehicle: values.yearVehicle
                  ? parseInt(values.yearVehicle)
                  : null,
                colorVehicle: values.colorVehicle ?? null,
                priceVehicle: selectNewVehicle.dataVehicle!.precio,
                drivers: listDataDrivers,
                dateCreatedTestDriver: moment(moment()).format('YYYY-MM-DD'),
                dateTestDriver: `${values.dateItemTestDriver.format(
                  'YYYY-MM-DD'
                )} ${values.timeTestDriver.format('HH:mm')}`,
                vin: values.vin ?? null,
                route: routeFind?.settingValue ?? null,
              };
              //console.log({ newTest });
              const respGQL = await testDriverRepository.createTestDriver(
                newTest,
                lead.id!
              );
              //const respGQL = false;
              setLoading(false);
              //console.log('🚀 Created OK', respGQL);
              if (respGQL) {
                message.success('Test drive creado');
                /* if (setLead) {
                  setTimeout(() => {
                    setLead((prevState: Leads) => {
                      const copy: Leads = { ...prevState };
                      const newTestDrive: TestDriverInterface = {
                        brandVehicle: newTest.brandVehicle,
                        codeVehicle: newTest.codeVehicle,
                        colorVehicle: newTest.colorVehicle,
                        confirmTestDrive: false,
                        dateCreatedTestDriver: newTest.dateCreatedTestDriver,
                        dateTestConfirmation: newTest.dateTestConfirmation,
                        dateTestDriver: newTest.dateTestConfirmation,
                        dateUpdateTestDriver: newTest.dateUpdateTestDriver,
                        drivers: newTest.drivers,
                        endKm: null,
                        id: -1,
                        modelVehicle: newTest.modelVehicle,
                        observations: null,
                        priceVehicle: newTest.priceVehicle,
                        startKm: null,
                        testDrivePrint: newTest.testDrivePrint,
                        urlImageVehicle: newTest.urlImageVehicle,
                        vin: newTest.vin,
                        yearVehicle: newTest.yearVehicle,
                      };
                      if (copy.testDriver) {
                        copy.testDriver.push();
                      } else {
                        copy.testDriver = [newTestDrive];
                      }
                    });
                  }, 2000);
                } */
                setViewTestDriver('catalogSelection');
                //IMPRIMIR
                const data = auth.user;

                //console.log(
                //   'DATA CONCE ✅✅',
                //   data.dealer[0].sucursal[0].sucursal
                // );
                toPrint(
                  templateTestDriver({
                    client: client!,
                    listDataDrivers: listDataDrivers!,
                    user: lead
                      ? `${lead?.user?.nombre} ${lead?.user?.apellido}`
                      : '',
                    concessionaire: data.dealer[0].sucursal[0].sucursal,
                    brand: values.brandVehicle,
                    model: values.modelVehicle,
                    vin: values.vin,
                    anio: values.yearVehicle,
                    color: values.colorVehicle,
                    concesionarioCode: lead?.concesionario?.code,
                  })
                );
                return;
              }
              //await setCatalogueContextCalalog();
              message.error('Error al crear Test Drive.');
            } else {
              message.error('Se requiere al menos un conductor.');
            }
          }}
        >
          <Row gutter={20}>
            <Col md={10}>
              <Form.Item label="Nombre cliente" name="ClientName">
                <Input style={{ width: 200 }} disabled />
              </Form.Item>
              <Form.Item
                label="Fecha del test drive"
                name="dateItemTestDriver"
                rules={[
                  {
                    required: true,
                    message: 'Por favor seleccione una fecha.',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: 200 }}
                  disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  format="YYYY-MM-DD"
                  placeholder="Seleccione una fecha"
                  showNow={false}
                  disabledDate={disabledDate}
                  onChange={(date, dateString) => {
                    //console.log('datString', dateString);
                    const myDay = moment(dateString).format('dddd');
                    const myDate = moment(moment()).format('YYYY-MM-DD');
                    //console.log('dateString', dateString, myDay, myDate);
                    if (dateString === myDate) {
                      const timeA = moment().format('HH');
                      const timeEdit: any = [18, 19, 20, 21, 22, 23];
                      const timeEditSaturday: any = [
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                      ];

                      // eslint-disable-next-line no-plusplus
                      for (let index = parseInt(timeA); index >= 0; --index) {
                        if (myDay === 'sábado') {
                          timeEditSaturday.push(index);
                        } else {
                          timeEdit.push(index);
                        }
                      }
                      setDisebleHours(
                        myDay === 'sábado' ? timeEditSaturday : timeEdit
                      );
                    } else {
                      setDisebleHours(
                        myDay === 'sábado' ? DATES_SATURDAY : DATES_NO_SATURDAY
                      );
                    }

                    setDayString(myDay);
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Hora del test drive"
                name="timeTestDriver"
                rules={[
                  {
                    required: true,
                    message: 'Por favor seleccione una Hora.',
                  },
                ]}
              >
                <TimePicker
                  style={{ width: 200 }}
                  format="HH:mm"
                  hideDisabledOptions
                  minuteStep={60}
                  disabledHours={() => {
                    return disebleHours;
                  }}
                  showNow={false}
                  disabled={
                    !!dataTestDriverSelection ||
                    dayString === 'domingo' ||
                    !!lead?.saleDown
                  }
                  name="timeItemTestDriver"
                />
              </Form.Item>

              {/*INICIO DE SELECTOR DE RUTA*/}
              <Form.Item
                label="Ruta:"
                name="ruta"
                rules={[
                  {
                    required: true,
                    message: 'Por favor seleccione n ruta',
                  },
                ]}
              >
                <Select
                  disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  style={{ width: 200 }}
                >
                  {routes &&
                    routes.map((dm, index) => (
                      <React.Fragment key={index}>
                        {JSON.parse(dm.settingValue).descripcion && (
                          <Select.Option
                            value={dm.id}
                            //value={dm.settingValue}
                          >
                            {JSON.parse(dm.settingValue).descripcion}
                          </Select.Option>
                        )}
                      </React.Fragment>
                    ))}
                </Select>
              </Form.Item>
              {/*FIN INICIO DE SELECTOR DE RUTA*/}
            </Col>
            <Col md={10}>
              <>
                {dataTestDriverSelection &&
                  dataTestDriverSelection.urlImageVehicle && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '10px',
                      }}
                    >
                      <img
                        src={dataTestDriverSelection.urlImageVehicle}
                        alt="vehículo"
                        style={{ width: 200, height: 100 }}
                      />
                    </div>
                  )}

                <Form.Item
                  label="Marca:"
                  name="brandVehicle"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingrese la marca',
                    },
                  ]}
                >
                  <Input
                    style={{ width: 200 }}
                    disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  />
                </Form.Item>
                <Form.Item
                  label="Modelo:"
                  name="modelVehicle"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor ingrese el modelo',
                    },
                  ]}
                >
                  <Input
                    style={{ width: 200 }}
                    disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  />
                </Form.Item>
                <Form.Item label="Año:" name="yearVehicle">
                  <Input
                    style={{ width: 200 }}
                    disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  />
                </Form.Item>
                <Form.Item label="Color:" name="colorVehicle">
                  <Input
                    style={{ width: 200 }}
                    disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  />
                </Form.Item>
                <Form.Item label="Vin" name="vin">
                  <Input
                    style={{ width: 200 }}
                    disabled={!!dataTestDriverSelection || !!lead?.saleDown}
                  />
                </Form.Item>
              </>
            </Col>
          </Row>
          <span className="flex ">
            <span className="flex-1 ">
              {dayString === 'domingo' && (
                <Alert
                  message="No existe horario para el día domingo"
                  type="error"
                  className="mt-5 mb-10 "
                  style={{ width: 400, paddingRight: 0, marginRight: 0 }}
                />
              )}
            </span>
          </span>
          <Divider>Datos conductores</Divider>

          {listDataDrivers.length > 0 && (
            <>
              <TableDrivers
                listDataDrivers={listDataDrivers}
                setListDataDrivers={setListDataDrivers}
                disable={!!dataTestDriverSelection}
              />
            </>
          )}
          <br />
          <Button
            type="dashed"
            onClick={() => {
              setModalDriver(true);
            }}
            style={{ width: 200 }}
            icon={<PlusOutlined />}
            disabled={!!dataTestDriverSelection || !!lead?.saleDown}
          >
            Otro Conductor
          </Button>

          {!dataTestDriverSelection && (
            <div>
              <Alert
                message="Guarda y luego imprime este documento para que el cliente firme el acuerdo antes del Test Drive"
                type="warning"
                className="mt-5 mb-5"
                style={{ width: 600 }}
              />
              {/*<Button
                type="primary"
                className="ml-2"
                ghost
                icon={<PrinterOutlined />}
                style={{ marginRight: 20 }}
                onClick={() => {
                  //const data = JSON.parse(localStorage.getItem('user')!);
                  const data = auth.user;

                 //console.log(
                    'DATA CONCE ✅✅',
                    data.dealer[0].sucursal[0].sucursal
                  );
                  toPrint(
                    templateTestDriver({
                      client: client!,
                      listDataDrivers: listDataDrivers!,
                      user: lead
                        ? `${lead?.user?.nombre} ${lead?.user?.apellido}`
                        : '',
                      concessionaire: data.dealer[0].sucursal[0].sucursal,
                      brand: dataTestDriverSelection ? dataTestDriverSelection.brandVehicle : '',
                      model: dataTestDriverSelection ? dataTestDriverSelection.modelVehicle : '',
                      vin: dataTestDriverSelection ? dataTestDriverSelection.vin : '',
                      anio: dataTestDriverSelection ? dataTestDriverSelection.yearVehicle : '',
                      color: dataTestDriverSelection ? dataTestDriverSelection.colorVehicle : '',
                    })
                  );
                }}
              >
                Imprimir
              </Button>*/}
              <Button
                type="primary"
                htmlType="submit"
                disabled={!!lead?.saleDown}
              >
                Guardar e imprimir
              </Button>
            </div>
          )}
        </Form>
      )}

      {dataTestDriverSelection && (
        <DataTestDrive
          disabled={!!dataTestDriverSelection.dateTestConfirmation}
          idTestDriver={
            !dataTestDriverSelection.dateTestConfirmation
              ? dataTestDriverSelection.id
              : undefined
          }
          listDataDrivers={listDataDrivers}
          initData={
            dataTestDriverSelection.dateTestConfirmation
              ? {
                  observations: dataTestDriverSelection.observations,
                  initKm: dataTestDriverSelection.startKm,
                  finalKm: dataTestDriverSelection.endKm,
                  confirmTestDrive: dataTestDriverSelection.confirmTestDrive,
                }
              : undefined
          }
          model={dataTestDriverSelection.modelVehicle}
          vin={dataTestDriverSelection.vin}
          brand={dataTestDriverSelection.brandVehicle}
          anio={dataTestDriverSelection.yearVehicle}
          color={dataTestDriverSelection.colorVehicle}
          startKm={dataTestDriverSelection.startKm}
          endKm={dataTestDriverSelection.endKm}
        />
      )}

      <Modal
        title="Agregar conductor"
        visible={modalDrivers}
        onCancel={() => {
          setModalDriver(false);
        }}
        footer={null}
        maskClosable={false}
      >
        <NewDriver
          closedModal={setModalDriver}
          checkNewDriver={modalDrivers}
          dataDrivers={dataDrivers}
          sendNames={client}
        />
      </Modal>
    </div>
  );
};

const TableDrivers: FunctionComponent<{
  listDataDrivers: any[];
  setListDataDrivers: Function;
  disable: boolean;
}> = ({ listDataDrivers, setListDataDrivers, disable }) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Apellido',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Licencia válida?',
      dataIndex: 'validLicense',
      key: 'validLicense',
      render: (validLicense: any) => (
        <>
          <Checkbox defaultChecked={validLicense} disabled />
        </>
      ),
    },
    {
      title: 'Eliminar ',
      dataIndex: 'delete',
      key: 'delete',
      render: (text: any, record: any) => {
        return (
          <Button
            disabled={disable}
            danger
            onClick={() => {
              const newArray: any = [...listDataDrivers];
              const dataFilter = newArray.filter((data: any) => {
                return data.key !== record.key;
              });
              setListDataDrivers(dataFilter);
            }}
          >
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <Table columns={columns} dataSource={listDataDrivers} pagination={false} />
  );
};

export default TestDriver;
