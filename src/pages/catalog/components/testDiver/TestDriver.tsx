import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import {
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Checkbox,
  Form,
  Radio,
  Alert,
  Upload,
  Modal,
  message,
  Table,
  Divider,
} from 'antd';

import { CatalogContext } from '../../../../state/CatalogueState';
import { Dependencies } from '../../../../dependency-injection';
import NewDriver from './NewDriver';
import Get from '../../../../utils/Get';
import TestDriverRepository from '../../../../data/repositories/testDriver-repository';
import Loading from '../../../../components/Loading';
import toPrint from '../../../../utils/templates-html/toPrintTemplate';
import { templateTestDriver } from '../../../../utils/templates-html/template-new-credit';
import { ClientLeadContext } from '../../../../components/GetClientData';
import DataTestDrive from './DataTestDrive';
import milisecondsToDate from '../../../../utils/milisecondsToDate';

//const { TextArea } = Input;

const TestDriver: FunctionComponent<{
  nextStepLead?: Function;
  dataTestDriverSelection?: any;
}> = ({ nextStepLead, dataTestDriverSelection }) => {
  const { client } = useContext(ClientLeadContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [typeDocumnet, setTypeDocument] = useState<string | null>(null);
  const [modalDrivers, setModalDriver] = useState<boolean>(false);

  const testDriverRepository = Get.find<TestDriverRepository>(
    Dependencies.testDriver
  );

  const { catalog, setCatalog } = useContext(CatalogContext);
  const [isDate, setIsDate] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<string>('');
  const [isDriver, setIsDriver] = useState<boolean>(true);
  const [imagenLicense, setImagenLicense] = useState('');
  const [listDataDrivers, setListDataDrivers] = useState<any>([
    {
      key: 100,
      name: client?.name,
      lastName: client?.lastName,
      urlLicenceImage: '',
      validLicense: true,
    },
  ]);
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [phase, setPhase] = useState<string>('');
  //const [id, setId] = useState<number>();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [dateTestDriver, setDateTestDriver] = useState<any>(
    moment().format('YYYY-MM-DD')
  );
  const [timeTestDriver, setTimeTestDriver] = useState<any>(
    moment('08:00', 'HH:mm')
  );
  const [validLicenseState, setValidLicenseState] = useState<boolean>(false);
  const [starKmState, setStarKmState] = useState<number>(0);
  const [endKmState, setEndKmState] = useState<number>(0);
  const [confirmTestDriveState, setConfirmTestDriveState] = useState<boolean>(
    false
  );
  const [obs, setObs] = useState<string>('');
  const [disebleHours, setDisebleHours] = useState<number[]>([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    18,
    19,
    20,
    21,
    22,
    23,
  ]);
  const [dayString, setDayString] = useState<string>(moment().format('dddd'));

  useEffect(() => {
    const componentdidmount = () => {
      /* if (catalog.dataTestDriverSelection && catalog.dataTestDriverSelection.dateTestDriver) {
        const dateTestDriverContext =
          catalog.dataTestDriverSelection.dateTestDriver;
        //console.log('🚀✅ DATA TEST DRIVER', catalog.dataTestDriverSelection);
        setDateTestDriver(moment(milisecondsToDate(dateTestDriverContext, 'YYYY-MM-DD')).format('YYYY-MM-DD'));
        setTimeTestDriver(
          moment(milisecondsToDate(catalog.dataTestDriverSelection.dateTestDriver, 'HH:mm')).format('HH:mm')
        );
        //console.log('timeTestDriver', timeTestDriver);
        const date = moment(
          new Date(parseInt(dateTestDriverContext)).toISOString()
        );

        if (catalog.dataTestDriverSelection.drivers.length === 1) {
          setValidLicenseState(
            catalog.dataTestDriverSelection.drivers[0].validLicense
          );
        } else {
          setIsDriver(false);
          setListDataDrivers(catalog.dataTestDriverSelection.drivers);
        }
        setId(catalog.dataTestDriverSelection.id);

        setSchedule(date.format('dddd'));
        setEndKmState(catalog.dataTestDriverSelection.endKm);
        setStarKmState(catalog.dataTestDriverSelection.startKm);
        setConfirmTestDriveState(
          catalog.dataTestDriverSelection.confirmTestDrive
        );
        setObs(catalog.dataTestDriverSelection.observations);
        //console.log('TIME', moment(date.format('HH:mm'), 'HH:mm'));
        //setTimeTestDriver(moment().format('HH:mm'));
        //setDateTestDriver(moment().format('YYYY-MM-DD'));
        setRefreshData(true);
        setPhase(catalog.dataTestDriverSelection.phase);
        setIsEdit(true);
      } */
      //setRefreshData(true);
    };
    componentdidmount();
  }, []);

  /*const setCatalogueContext = () => {
    setCatalog((prevState: any) => ({
      ...prevState,
      page: 'vehicleFeature',
    }));
  };*/

  const setCatalogueContextCalalog = () => {
    if (catalog.vehicleSelectionFeature.length > 0) {
      setCatalog((prevState: any) => ({
        ...prevState,
        page: 'vehicleFeature',
      }));
    } else {
      setCatalog((prevState: any) => ({
        ...prevState,
        page: 'catalogSelection',
        vehicleSelectionFeature: '',
        dataVehicle: null,
      }));
    }
  };

  const onFormLayoutChange = async ({
    dateItemTestDriver,
    timeItemTestDriver,
    itemIsDriver,
    itemImagenLicense,
    itemValidLicense,
    itemStartKm,
    itemEndKm,
    itemConfirmTestDrive,
    itemObs,
  }: any) => {
    if (dateItemTestDriver) {
      await setDateTestDriver(dateItemTestDriver);
      await setIsDate(true);
      await setSchedule(dateItemTestDriver.format('dddd'));
    }
    if (timeItemTestDriver) {
      setTimeTestDriver(timeItemTestDriver);
    }

    if (itemIsDriver === undefined) {
      await setIsDriver(isDriver);
    } else {
      await setIsDriver(itemIsDriver);
    }

    if (itemImagenLicense) {
      setImagenLicense(itemImagenLicense);
    }

    if (itemValidLicense === undefined) {
      await setValidLicenseState(validLicenseState);
    } else {
      await setValidLicenseState(itemValidLicense);
    }

    if (itemStartKm) {
      setStarKmState(itemStartKm);
    }
    if (itemEndKm) {
      setEndKmState(itemEndKm);
    }
    if (itemConfirmTestDrive) {
      setConfirmTestDriveState(itemConfirmTestDrive);
    }
    if (itemObs) {
      setObs(itemObs);
    }
  };
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const beforeUpload = (file: any) => {
    //console.log({ file });
    setTypeDocument(file.type);
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getBase64 = (img: any, callback: any) => {
    //console.log({ img, callback });
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info: any) => {
    //console.log('handleChange', { info });
    if (info.file.status === 'uploading') {
      setLoading(true);
      //console.log('FIn handleChange');
    }
    if (info.file.status === 'done' || info.file.status === 'error') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imgUrl: any) => {
        //console.log('IMAGEN', { imgUrl });
        setImageUrl(imgUrl);
        setLoading(false);
      });
    }
  };

  const dataDrivers = (e: any) => {
    const dataIndex = { ...e, key: listDataDrivers.length };

    const newArray: any = [...listDataDrivers, dataIndex];
    setListDataDrivers(newArray);
  };

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
      title: 'Acciones ',
      dataIndex: 'delete',
      key: 'delete',
      render: (text: any, record: any) => {
        return (
          <Button
            disabled={isEdit}
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

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };
  if (loading) {
    return <Loading visible />;
  }

  //console.log('CONTEXT  ✅✅', catalog.dataTestDriverSelection);

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
      {refreshData && (
        <Form
          {...layout}
          onValuesChange={onFormLayoutChange}
          initialValues={{
            dateItemTestDriver:
              dataTestDriverSelection &&
              dataTestDriverSelection.dateCreatedTestDriver
                ? moment(
                    milisecondsToDate(
                      dataTestDriverSelection.dateCreatedTestDriver,
                      'YYYY-MM-DD'
                    ),
                    'YYYY-MM-DD'
                  )
                : moment(moment(), 'YYYY-MM-DD'),
            timeTestDriver: moment(`${dateTestDriver}`, 'HH:mm'),
            itemIsDriver: isDriver,
            itemValidLicense: validLicenseState,
            itemObs: obs,
            itemStartKm: starKmState,
            itemEndKm: endKmState,
            itemConfirmTestDrive: confirmTestDriveState,
            ClientName: `${client?.name} ${client?.lastName}`,
          }}
          onFinish={async (values) => {
            //console.log('values FORM TESDRIVE', values);
            if (listDataDrivers.length > 0) {
              const dataSetTestDriver: any = {
                testDrivePrint: false,
                phase: 'phase_1',
                dateCreatedTestDriver: String(
                  moment(moment()).format('YYYY-MM-DD')
                ),
                dateUpdateTestDriver: String(
                  moment(moment()).format('YYYY-MM-DD')
                ),
                dateTestConfirmation: String(
                  moment(moment()).format('YYYY-MM-DD')
                ),
              };
              if (!isEdit) {
                const brand = catalog.vehicleSelectionFeature[0].marca;
                const code = catalog.vehicleSelectionFeature[0].codigo;
                const model = catalog.vehicleSelectionFeature[0].modelo;
                const year = catalog.vehicleSelectionFeature[0].anio;
                const price = catalog.vehicleSelectionFeature[0].precio;
                const urlImageVehicle = catalog.imageVehicle;

                dataSetTestDriver.codeVehicle = code;
                dataSetTestDriver.brandVehicle = brand;
                dataSetTestDriver.modelVehicle = model;
                dataSetTestDriver.urlImageVehicle =
                  urlImageVehicle !== undefined ? urlImageVehicle : '';
                dataSetTestDriver.yearVehicle = year;
                dataSetTestDriver.priceVehicle = price;
              }

              const dataSetTestDriverUpdate: any = {
                dateUpdateTestDriver: String(
                  moment(moment()).format('YYYY-MM-DD')
                ),
                dateTestConfirmation: String(
                  moment(moment()).format('YYYY-MM-DD')
                ),
                phase: 'phase_2',
              };

              dataSetTestDriver.dateTestDriver = await `${String(
                moment(dateTestDriver).format('YYYY-MM-DD')
              )} ${moment(timeTestDriver).format('HH:mm')}`;

              //console.log(
              //   'dataSetTestDriver.dateTestDriver',
              //   dataSetTestDriver.dateTestDriver
              // );

              if (values.itemStartKm) {
                dataSetTestDriverUpdate.startKm = starKmState;
              }
              if (values.itemEndKm) {
                dataSetTestDriverUpdate.endKm = endKmState;
              }

              if (values.itemConfirmTestDrive) {
                dataSetTestDriverUpdate.confirmTestDrive = confirmTestDriveState;
              }

              if (values.itemObs) {
                dataSetTestDriverUpdate.observations = obs;
              }

              dataSetTestDriver.drivers = listDataDrivers;

              const { idLead } = catalog.idLead;
              //const idTestDriver: any = id;

              //console.log('✅Created TESTDRIVER', dataSetTestDriver);
              //console.log('✅Updated TESTDRIVER', dataSetTestDriverUpdate);

              if (isEdit) {
                setLoading(true);
                /* const respGQL = await testDriverRepository.updateTestDriver(
                  idTestDriver,
                  dataSetTestDriverUpdate
                );
                //console.log('🚀 UPDATED OK', respGQL); */
                setLoading(false);
                //await setCatalogueContextCalalog();
                await message.success('Test drive creado');
              } else {
                setLoading(true);
                const respGQL = await testDriverRepository.createTestDriver(
                  dataSetTestDriver,
                  idLead
                );
                //console.log('🚀 CREATED OK', respGQL);
                setLoading(false);
                setIsEdit(true);
                //await setCatalogueContext();
                message.success('Test drive creado');
              }
            } else {
              message.error('Se requiere al menos un conductor.');
            }
          }}
        >
          <Form.Item label="Nombre cliente" name="ClientName">
            <Input disabled />
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
              disabled={isEdit}
              format="YYYY-MM-DD"
              placeholder="Seleccione una fecha"
              showNow={false}
              disabledDate={disabledDate}
              onChange={(date, dateString) => {
                //console.log('dateString', dateString);
                setDayString(moment(dateString).format('dddd'));
                if (moment(dateString).format('dddd') === 'Saturday') {
                  setDisebleHours([
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
                  ]);
                } else {
                  setDisebleHours([
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    18,
                    19,
                    20,
                    21,
                    22,
                    23,
                  ]);
                }
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
              onChange={() => {}}
              format="HH:mm"
              //value={timeTestDriver}
              hideDisabledOptions
              minuteStep={60}
              disabledHours={() => disebleHours}
              showNow={false}
              disabled={dayString === 'Sunday' || isEdit}
              name="timeItemTestDriver"
            />
          </Form.Item>

          {schedule === 'Sunday' ? (
            <Alert
              message="No existe horario para el día domingo"
              type="error"
              className="mt-5 mb-10 "
              style={{ width: 400, paddingRight: 0, marginRight: 0 }}
            />
          ) : (
            ''
          )}
          <Divider>Datos conductores</Divider>

          {listDataDrivers.length > 0 && (
            <Table
              columns={columns}
              dataSource={listDataDrivers}
              pagination={false}
            />
          )}

          {null && (
            <div className="flex flex-col mt-10 mb-10">
              <div>
                <Form.Item
                  rules={[
                    {
                      required: false,
                      message: 'Por favor agregue la licencia del conductor.',
                    },
                  ]}
                  name="itemImagenLicense"
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      typeDocumnet && typeDocumnet !== 'application/pdf' ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        <div style={{ width: '100%' }}>
                          <PlusOutlined />
                          <br />
                          PDF
                        </div>
                      )
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </div>
            </div>
          )}
          <br />
          <Button
            type="dashed"
            onClick={() => {
              setModalDriver(true);
            }}
            style={{ width: 200 }}
            icon={<PlusOutlined />}
            disabled={isEdit}
          >
            Otro Conductor
          </Button>

          {/* {isEdit && (
            <div className="mt-10">
              <Divider>Datos del test drive</Divider>
              <Form.Item label="Kilometraje inicial" name="itemStartKm">
                <InputNumber
                  value={starKmState}
                  disabled={phase === 'phase_2'}
                />
              </Form.Item>

              <Form.Item label="Kilometraje Final" name="itemEndKm">
                <InputNumber
                  value={endKmState}
                  disabled={phase === 'phase_2'}
                />
              </Form.Item>

              <Form.Item name="itemConfirmTestDrive" valuePropName="checked">
                <Checkbox
                  value={confirmTestDriveState}
                  disabled={phase === 'phase_2'}
                >
                  Confirmo que se realizó con éxito
                </Checkbox>
              </Form.Item>

              <Form.Item name="itemObs" label="Observaciones">
                <TextArea
                  value={obs}
                  rows={4}
                  style={{ width: 600 }}
                  disabled={phase === 'phase_2'}
                />
              </Form.Item>
              {phase === 'phase_2' ? (
                ''
              ) : (
                <div className="text-center">
                  <Button
                    type="primary"
                    className="ml-2"
                    ghost
                    icon={<PrinterOutlined />}
                    style={{ marginRight: 20 }}
                    onClick={() => {
                      toPrint(templateTestDriver(client!, listDataDrivers!));
                    }}
                  >
                    Imprimir
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          )} */}

          {!isEdit && (
            <div>
              <Alert
                message="Imprime este documento para que el cliente firme el acuerdo antes del Test Drive"
                type="warning"
                className="mt-5 mb-5"
                style={{ width: 600 }}
              />
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </div>
          )}
        </Form>
      )}
      {phase === 'phase_2' && (
        <DataTestDrive
          disabled={phase === 'phase_2'}
          initData={{
            observations: obs,
            initKm: starKmState,
            finalKm: endKmState,
            confirmTestDrive: confirmTestDriveState,
          }}
        />
      )}
      {phase === 'phase_1' && (
        <DataTestDrive
          listDataDrivers={listDataDrivers}
          idTestDriver={dataTestDriverSelection.id}
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
        />
      </Modal>
    </div>
  );
};

export default TestDriver;
