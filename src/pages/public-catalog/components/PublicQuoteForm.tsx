/* eslint-disable no-restricted-properties */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-vars */
import { CheckOutlined, CloseOutlined, RightOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
} from 'antd';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import Quotes from '../../../data/models/Quotes';
import { Dependencies } from '../../../dependency-injection';
import { calcLegals, currenyFormat, netType } from '../../../utils/extras';
import Get from '../../../utils/Get';
import TableAccesoriesPublic from './TableAccesoriesPublic';
import TableServicesPublic, { ServicesTable } from './TableServicesPublic';
import CarAsFormPay from '../../quote/components/CarAsFormPay';
import Exonerated from '../../quote/components/Exonerated';
import QuoteResult from './QuoteResult';
import ModalNewClient from './ModalNewClient';
import ModalSelectSucursal from './ModalSelectSucursal';
import ModalFinish from './ModalFinish';
import Financial from '../../../data/models/Settings';
import '../css/public-catalog.scss';
import PublicCatalogContext from '../context/PublicCatalogContext';
import CRMRepository from '../../../data/repositories/CRM-repository';

const { Option } = Select;
export interface PublicQuoteFormProps {}

interface accesoryAndOthersInput {
  accesories: Array<any>;
  services: Array<any>;
}

const PublicQuoteForm: FunctionComponent<{
  insurances: any;
  dataVehicleSelect: any;
  finishDrawer: Function;
}> = ({ insurances, dataVehicleSelect, finishDrawer }) => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [loading, setLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0);
  const [months, setMonths] = useState<number>(12);
  const [maried, setMaried] = useState<boolean>(true);
  const [typeExonerated, setTypeExonerated] = useState<string>('');
  const [pvp, setPvp] = useState<number>(dataVehicleSelect.precio);
  const [carRegistration, setCarRegistration] = useState<number>(0);
  const [grade, setGrade] = useState<string>('');
  const [actualServices, setActualServices] = useState<ServicesTable[]>([]);
  const [servicesAmount, setServicesAmount] = useState<number>(0);
  const [entryQuantity, setEntryQuantity] = useState<number>(0);
  const [tasaOther, setTasaOther] = useState<boolean>(false);
  const [cuota, setCuota] = useState<number>(0);
  const [insuranceAmountYears, setInsuranceAmountYears] = useState<number>(0);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [autoPayment, setAutoPayment] = useState<boolean>(false);
  const [actualAccessories, setActualAccessories] = useState<any[]>([]);
  const [accesoriesAmount, setAccesoriesAmount] = useState<number>(0);
  const [exonerated, setExonerated] = useState<boolean>(false);
  const [dataExonerated, setDataExonerated] = useState<any>({});
  const [renderPayForm, setRenderPayForm] = useState<boolean>(true);
  const [paymenType, setpaymenType] = useState<string>('');
  const [typeEntry, setTypeEntry] = useState<string>('');
  const [entryPercentage, setEntryPercentage] = useState<number>(0);
  const [rates, setRates] = useState<string[] | null>(null);
  const [monthsSelect, setMonthsSelect] = useState<string[] | null>(null);
  const [accesoriesServices, setAccesoriesServices] =
    useState<accesoryAndOthersInput>({ accesories: [], services: [] });
  const [total, setTotal] = useState<number>(0);
  //*----------------------Estados setValuesCotizador
  const [legalsAmount, setLegalsAmount] = useState<number>(0);
  const [insuranceAmountYear, setInsuranceAmountYear] = useState<number>(0);
  const [insuranceYears, setInsuranceYears] = useState<number>(1);
  const [insuranceName, setInsuranceName] = useState<string>('');
  const [activeDevice, setActiveDevice] = useState<boolean>(false);
  const [device, setDevice] = useState<number>(0);
  const [deviceAmountYear, setDeviceAmountYear] = useState<number>(0);
  const [deviceYears, setDeviceYears] = useState<number>(1);
  const [deviceAmountYears, setDeviceAmountYears] = useState<number>(0);
  const [triger, setTriger] = useState<boolean>(false);
  //*----------------------Estados newProspect
  const [viewModalNewProspect, setViewModalNewProspect] =
    useState<boolean>(false);
  const [viewNewUser, setViewNewUser] = useState<boolean>(false);
  const [viewSucursal, setViewSucursal] = useState<boolean>(false);
  const [viewFinish, setViewFinish] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { setQuote } = useContext(PublicCatalogContext);
  const getSettings = async () => {
    const responseGetSettings = await CRMRepository.getPublicCatalog(
      'POST',
      '/api/v1/public-catalog/get-conf',
      {
        data: {},
      }
    );
    const dataRateTerm = responseGetSettings.data;
    if (dataRateTerm) {
      let mapDataRate: any[] = [];
      dataRateTerm.map((dm: Financial, index: number) => {
        if (dm.settingType === 'rateTerm') {
          const dataJson = JSON.parse(dm.settingValue);
          mapDataRate = dataJson.rates.sort((a: any, b: any) => {
            return a - b;
          });
        }
        return true;
      });
      setRates(mapDataRate);
      let mapDataMOnths: any[] = [];
      dataRateTerm.map((dm: Financial, index: number) => {
        if (dm.settingType === 'rateTerm') {
          const dataJson = JSON.parse(dm.settingValue);
          mapDataMOnths = dataJson.months.sort((a: any, b: any) => {
            return a - b;
          });
        }
        return true;
      });
      setMonthsSelect(mapDataMOnths);
    }
  };
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const setLegalAmountSelector = (pvpInput: number, mariedInput: boolean) => {
    setLegalsAmount(calcLegals(pvpInput, maried));
  };

  useEffect(() => {
    getSettings();
    if (paymenType === 'credit' && rate > 0) {
      // eslint-disable-next-line no-use-before-define
      calcCoute();
    } else if (paymenType === 'counted') {
      // eslint-disable-next-line no-use-before-define
      calcTotalContado();
    }
  }, [
    rate,
    pvp,
    legalsAmount,
    insuranceAmountYears,
    accesoriesAmount,
    servicesAmount,
    carRegistration,
    device,
    entryQuantity,
    months,
    total,
    accesoriesServices,
    actualServices,
    paymenType,
    triger,
  ]);

  const calcTotalContado = () => {
    const totalPay =
      pvp +
      insuranceAmountYears +
      accesoriesAmount +
      servicesAmount +
      carRegistration;
    setLegalsAmount(0);
    setTotal(totalPay);
    //console.log('Total a pagar contado', totalPay);
  };

  const calcCoute = () => {
    //console.log('cuota');
    const tasaDeci: number = rate / 100;
    const totalPay = pvp + accesoriesAmount + servicesAmount;
    const totalPayRen = totalPay * 1.12 + legalsAmount + insuranceAmountYears;
    const cuoteAmount =
      ((tasaDeci / 12) * (Number(totalPayRen.toFixed(2)) - entryQuantity)) /
      (1 - Math.pow(1 + tasaDeci / 12, -months));
    setCuota(parseFloat(cuoteAmount.toFixed(2)));
    const totalToSave =
      totalPay +
      (legalsAmount - (legalsAmount - legalsAmount / 1.12)) +
      insuranceAmountYears +
      carRegistration;
    setTotal(Number(totalToSave.toFixed(2)));
  };

  const setValuesCotizador = async ({
    payType,
    vehiclePvp,
    quateExonerted,
    tipoEntrada,
    entrada,
    tasaInput,
    meses,
    aseguradora,
    aniosSeguro,
    matricula,
    dispositivoActive,
    dispositivoValue,
    aniosDispositivo,
    autopartepago,
    mariedInput,
    tasaOtroInput,
  }: any) => {
    if (vehiclePvp) {
      setPvp(parseFloat(vehiclePvp));
      setLegalsAmount(calcLegals(parseFloat(vehiclePvp), maried));
    }
    if (mariedInput !== null) {
      setLegalAmountSelector(pvp, mariedInput);
    }

    if (payType) {
      setpaymenType(payType);
      if (payType === 'credit') {
        calcLegals(pvp, maried);
        setLegalsAmount(calcLegals(pvp, maried));
      } else {
        setLegalsAmount(0);
      }
    }
    if (quateExonerted !== undefined) {
      setpaymenType('');
      if (dataVehicleSelect.exonerados) {
        const dataE = {
          diplomatic: dataVehicleSelect.exonerados[0]['100'],
          disabled: {
            a: dataVehicleSelect.exonerados[0]['60'],
            b: dataVehicleSelect.exonerados[0]['70'],
            c: dataVehicleSelect.exonerados[0]['80'],
            d: dataVehicleSelect.exonerados[0]['100'],
          },
        };
        setDataExonerated(dataE);
      }

      await setExonerated(quateExonerted);
      setRenderPayForm(false);
      form.resetFields(['payType']);
      setRenderPayForm(true);
      if (!quateExonerted) {
        await setPvp(dataVehicleSelect.precio);
      }
    }
    if (tipoEntrada) {
      await setTypeEntry(tipoEntrada);
    }
    if (entrada) {
      if (typeEntry === 'percentage') {
        await setEntryPercentage(parseFloat(entrada));
        const entry2 = (parseFloat(entrada) / 100) * (pvp * 1.12);
        await setEntryQuantity(entry2);
      } else {
        const percetageCaculateValue =
          (parseFloat(entrada) * 100) / (pvp * 1.12);
        await setEntryPercentage(
          parseFloat(percetageCaculateValue.toFixed(0).toString())
        );
        await setEntryQuantity(parseFloat(entrada));
      }
    }
    if (tasaInput) {
      if (tasaInput === 'otro') {
        setTasaOther(true);
      } else {
        await setRate(tasaInput);
        setTasaOther(false);
      }
    }
    if (meses) {
      await setMonths(meses);
    }
    if (aseguradora) {
      const aseguradoraValue = insurances[aseguradora].value;
      const aseguradoraName = insurances[aseguradora].name;
      const aseguradoraAmountYears = aseguradoraValue * 12;
      await setInsuranceAmount(aseguradoraValue);
      await setInsuranceAmountYear(aseguradoraAmountYears);
      if (insuranceYears <= 1) {
        await setInsuranceAmountYears(aseguradoraAmountYears);
      }
      await setInsuranceName(aseguradoraName);
    }
    if (aniosSeguro) {
      await setInsuranceYears(parseFloat(aniosSeguro));
      await setInsuranceAmountYears(
        parseFloat(aniosSeguro) * insuranceAmountYear
      );
    }
    if (matricula) {
      await setCarRegistration(parseFloat(matricula));
    }
    if (dispositivoActive !== undefined) {
      await setActiveDevice(dispositivoActive);
    }
    if (dispositivoValue) {
      await setDevice(parseFloat(dispositivoValue));
      await setDeviceAmountYear(parseFloat(dispositivoValue) * 12);
    }
    if (aniosDispositivo) {
      await setDeviceYears(parseFloat(aniosDispositivo));
      await setDeviceAmountYears(
        deviceAmountYear * parseFloat(aniosDispositivo)
      );
    }
    if (autopartepago !== undefined) {
      await setAutoPayment(autopartepago);
    }

    if (tasaOtroInput) {
      setRate(tasaOtroInput);
    }
  };

  // Función para abrir el modal de un nuevo prospecto del para el catalogo público
  const newProspect = () => {
    setViewNewUser(true);
    setViewModalNewProspect(true);
  };

  const nextModel = () => {
    setViewNewUser(false);
    setViewSucursal(true);
  };

  const nextModalFinish = () => {
    setViewNewUser(false);
    setViewSucursal(false);
    setViewFinish(true);
  };

  const finish = () => {
    finishDrawer();
    setViewModalNewProspect(false);
  };

  return (
    <>
      <Row justify="space-around" gutter={[16, 16]}>
        <Col className="gutter-row" xs={20} sm={16} md={12}>
          <Spin spinning={loading}>
            <Form
              form={form}
              {...formItemLayout}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              initialValues={{
                vehiclePvp: currenyFormat(
                  dataVehicleSelect.precio * 1.12,
                  false
                ),
                tasaImput: rate,
                meses: months,
                aniosDispositivo: '1',
                matricula: carRegistration,
                aniosSeguro: '1',
                maried,
              }}
              onValuesChange={setValuesCotizador}
              onFinish={async (values) => {
                const quoteInfo: Quotes = {
                  vehiculo: [
                    {
                      cantidad: 1,
                      code: dataVehicleSelect.codigo,
                      brand: dataVehicleSelect.marca,
                      model: dataVehicleSelect.modelo,
                      idModel: dataVehicleSelect.idModelo.toString(),
                      year: dataVehicleSelect.anio,
                      cost: dataVehicleSelect.costo,
                      pvp,
                      description: dataVehicleSelect.descripcion,
                      cylinder: dataVehicleSelect.cilidraje
                        ? dataVehicleSelect.cilidraje
                        : null,
                      numPassengers: dataVehicleSelect.nropasajeros
                        ? dataVehicleSelect.nropasajeros
                        : null,
                      doors: dataVehicleSelect.puertas
                        ? dataVehicleSelect.puertas
                        : null,
                      fuel: dataVehicleSelect.combustible
                        ? dataVehicleSelect.combustible
                        : null,
                      stock: dataVehicleSelect.totalstock
                        ? dataVehicleSelect.totalstock
                        : null,
                      margen: dataVehicleSelect.margen
                        ? dataVehicleSelect.margen
                        : null,
                      imgs: dataVehicleSelect.imageData
                        ? dataVehicleSelect.imageData
                        : null,
                      pdf: dataVehicleSelect.urlpdf
                        ? dataVehicleSelect.urlpdf
                        : null,
                      color: dataVehicleSelect.color
                        ? dataVehicleSelect.color
                        : null,
                    },
                  ],
                  type: values.payType, //requerido
                  registration: null, //requerido
                };

                if (values.quateExonerted) {
                  quoteInfo.exonerated = {};
                  quoteInfo.exonerated.type = typeExonerated;
                  if (typeExonerated === 'disabled') {
                    quoteInfo.exonerated.percentage = grade;
                  }
                }

                if (actualServices.length > 0) {
                  quoteInfo.services = actualServices;
                  quoteInfo.servicesValue = servicesAmount; //opcional
                }

                if (values.payType === 'credit') {
                  quoteInfo.inputAmount = entryQuantity; //opcional
                  if (tasaOther) {
                    quoteInfo.rate = Number(values.tasaOtroInput); //opcional
                  } else {
                    quoteInfo.rate = Number(values.tasaInput); //opcional
                  }
                  quoteInfo.months = parseFloat(values.meses); //opcional
                  quoteInfo.monthly = cuota; //opcional
                }

                if (values.aseguradora) {
                  quoteInfo.insuranceCarrier = {
                    name: insurances[values.aseguradora].name,
                    cost: insuranceAmountYears,
                    monthlyPayment: insuranceAmount,
                    years: parseFloat(values.aniosSeguro),
                  };
                }

                if (autoPayment) {
                  quoteInfo.mechanicalAppraisalQuote = {
                    brand: values.carPayBrand,
                    model: values.carPayModel,
                    year: values.carPayYear,
                    mileage: values.carPayKm,
                    desiredPrice: values.carPayDesiredPrice,
                  };
                }

                if (actualAccessories.length > 0) {
                  quoteInfo.idAccesories = actualAccessories;
                  quoteInfo.accesoriesValue = accesoriesAmount;
                }

                quoteInfo.observations = values.observations ?? null;
                const quoteRenderAny: any = quoteInfo;
                /* const NewQuote: Quotes | null = await quotesRepository.createQuote(
                  quoteRenderAny,
                  lead.id!
                ); */
                if (setQuote) setQuote(quoteRenderAny);
                newProspect();
              }}
            >
              <Form.Item label="PVP" name="vehiclePvp">
                <Input prefix="$" disabled />
              </Form.Item>
              {dataVehicleSelect.exonerados && (
                <Form.Item label="Exonerado" name="quateExonerted">
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              )}

              {exonerated && dataVehicleSelect.exonerados && (
                <Exonerated
                  setPvpExternal={setPvp}
                  pvp={pvp}
                  setTypeExonerated={setTypeExonerated}
                  setGrade={setGrade}
                  exoneratePvp={dataExonerated}
                  typeExonerated={typeExonerated}
                  grade={grade}
                />
              )}
              <Form.Item label="Extras">
                <div style={{ marginTop: -15 }}>
                  <Tabs
                    type="card"
                    defaultActiveKey="1"
                    onChange={() => {
                      //console.log('VEHICULO', dataVehicleSelect);
                    }}
                  >
                    <Tabs.TabPane tab="Accesorios" key="1">
                      <TableAccesoriesPublic
                        paramsToFind={{
                          code: dataVehicleSelect.codigo,
                          brand: dataVehicleSelect.marca,
                          model: dataVehicleSelect.modelo,
                        }}
                        actualAccessories={actualAccessories}
                        setActualAccessories={setActualAccessories}
                        setAccesoriesAmount={setAccesoriesAmount}
                      />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Servicios" key="2">
                      <TableServicesPublic
                        actualServices={actualServices}
                        setActualServices={setActualServices}
                        setServicesAmount={setServicesAmount}
                        code={dataVehicleSelect.codigo}
                      />
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </Form.Item>
              {renderPayForm && (
                <Form.Item
                  label="Forma de pago"
                  name="payType"
                  rules={[
                    { required: true, message: 'Selecciona la forma de pago!' },
                  ]}
                >
                  <Select
                    placeholder="Seleccion la forma de pago"
                    value={paymenType === '' ? undefined : paymenType}
                  >
                    <Option value="counted">Contado</Option>
                    {!exonerated && <Option value="credit">Crédito</Option>}
                  </Select>
                </Form.Item>
              )}
              {paymenType === 'credit' && (
                <div>
                  <Form.Item
                    label="Tipo de entrada"
                    name="tipoEntrada"
                    rules={[
                      {
                        required: true,
                        message: 'Seleciona el tipo de entrada!',
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio.Button value="cost">Monto ($)</Radio.Button>
                      <Radio.Button value="percentage">
                        Porcentaje (%)
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  {typeEntry !== '' && (
                    <div>
                      <Form.Item
                        label="Entrada"
                        name="entrada"
                        rules={[
                          { required: true, message: 'Ingresa la entrada!' },
                          () => ({
                            validator(rule, val: string | number) {
                              let myValue = val;
                              if (typeof myValue === 'string') {
                                myValue = parseInt(val as string);
                              }
                              if (
                                (myValue as number) <
                                dataVehicleSelect.precio * 1.12
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject('Entrada no válida');
                            },
                          }),
                        ]}
                      >
                        <Input
                          prefix={typeEntry === 'cost' ? '$' : ''}
                          suffix={typeEntry === 'percentage' ? '%' : ''}
                        />
                      </Form.Item>
                      {typeEntry === 'percentage' ? (
                        <Form.Item label="Valor de la entrada">
                          <b>{currenyFormat(entryQuantity, true)}</b>
                        </Form.Item>
                      ) : (
                        <Form.Item label="% entrada">
                          <b>{entryPercentage}%</b>
                        </Form.Item>
                      )}
                    </div>
                  )}
                  <Form.Item
                    label="Tasa"
                    name="tasaInput"
                    rules={[{ required: true, message: 'Selecciona la Tasa!' }]}
                  >
                    <Select placeholder="Seleccion la tasa">
                      {rates &&
                        rates.map((el: any, index: number) => (
                          <Option value={el} key={index}>
                            {el}
                          </Option>
                        ))}
                      {/*  {netType(lead?.concesionario?.code!).toLowerCase() ===
                        'red externa' && <Option value="otro">Otro</Option>} */}
                    </Select>
                  </Form.Item>
                  {tasaOther && (
                    <Form.Item
                      label=""
                      name="tasaOtroInput"
                      rules={[{ required: true, message: 'Agrega una tasa' }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ marginLeft: 160 }}
                        formatter={(value) => `${value}%`}
                        parser={(value) => {
                          return value ? value.replace('%', '') : '';
                        }}
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    label="Meses plazo"
                    name="meses"
                    rules={[
                      { required: true, message: 'Selecciona los meses plazo' },
                    ]}
                  >
                    <Select placeholder="Seleccion los mese plazo">
                      {monthsSelect &&
                        monthsSelect.map((el: any, index: number) => (
                          <Option value={el} key={index}>
                            {el}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
              )}
              {paymenType !== '' && (
                <div>
                  <Form.Item label="Aseguradora" name="aseguradora">
                    <Select
                      placeholder="Seleccion la aseguradora"
                      notFoundContent={
                        <div>Este modelo no posee una aseguradora</div>
                      }
                    >
                      {insurances.map((data: any, i: number) => (
                        <Option value={i.toString()} key={i}>
                          {data.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Años de Seguro" name="aniosSeguro">
                    <Input disabled={insuranceAmount === 0} />
                  </Form.Item>
                </div>
              )}
              <Form.Item label="Auto parte pago" name="autopartepago">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
              {autoPayment && <CarAsFormPay activeProviderData={false} />}
              {/*  <Form.Item label="Detalle del Negocio" name="observations">
                <Input.TextArea />
              </Form.Item> */}
              <div className="text-center mb-6">
                <p>
                  Usted está generando una cotización del vehículo{' '}
                  {dataVehicleSelect.marca} {dataVehicleSelect.modelo}{' '}
                  {dataVehicleSelect.anio}.
                </p>
                {/* <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                >
                  Generar cotización
                </Button> */}
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  style={{ marginTop: 30 }}
                >
                  Proximos pasos <RightOutlined />
                </Button>
              </div>
            </Form>
          </Spin>
        </Col>
        <Col className="gutter-row" xs={20} sm={16} md={12}>
          <QuoteResult
            insuranceAmount={insuranceAmount}
            insuranceAmountYear={insuranceAmountYear}
            insuranceAmountYears={insuranceAmountYears}
            insuranceYears={insuranceYears}
            insuranceName={insuranceName}
            accesoriesServices={accesoriesServices}
            accesoriesAmount={accesoriesAmount}
            servicesAmount={servicesAmount}
            legals={legalsAmount}
            pvp={pvp}
            cuota={cuota}
            total={total}
            paymenType={paymenType}
            Exonerated={exonerated}
            typeExonerated={typeExonerated}
            grade={grade}
            autoPayment={autoPayment}
            EntryQuantity={entryQuantity}
            rate={rate}
            months={months}
            carRegistration={carRegistration}
            activeDevice={activeDevice}
            device={device}
            deviceYears={deviceYears}
            deviceAmountYear={deviceAmountYear}
            deviceAmountYears={deviceAmountYears}
            imgurl={dataVehicleSelect.imageData}
          />
        </Col>
      </Row>
      {viewModalNewProspect && (
        <>
          <Modal
            title="Cotización"
            visible={viewModalNewProspect}
            onOk={() => {
              setViewModalNewProspect(false);
            }}
            onCancel={() => {
              setViewModalNewProspect(false);
              setViewNewUser(false);
              setViewSucursal(false);
              setViewFinish(false);
            }}
            width={800}
            footer={
              false /* [
              <Button
                type="primary"
                key="back"
                onClick={() => {
                  setViewNewUser(false);
                  setViewSucursal(true);
                }}
              >
                Siguiente
              </Button>,
            ] */
            }
          >
            {viewNewUser && (
              <div className="p-modal p-height">
                <ModalNewClient nextModal={nextModel} />
              </div>
            )}
            {viewSucursal && (
              <div className="p-height container-sucursal">
                <ModalSelectSucursal nextModalFinish={nextModalFinish} />
              </div>
            )}
            {viewFinish && (
              <div className="p-modal-finish">
                <ModalFinish finish={finish} />
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default PublicQuoteForm;
