/* eslint-disable no-restricted-properties */
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CloseOutlined, CheckOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Form,
  Select,
  Input,
  Row,
  Col,
  Modal,
  Switch,
  Radio,
  Button,
  Spin,
  message,
  Tabs,
  Alert,
  InputNumber,
} from 'antd';
//import GlobalQuoteContext from '../../../state/Quote-states';
import CarAsFormPay from './CarAsFormPay';
import Exonerated from './Exonerated';
import Result from './QuoteResult';
import AccessoriesOthers from '../../../components/AccessoriesOthers';
import { ClientLeadContext } from '../../../components/GetClientData';
import Quotes from '../../../data/models/Quotes';
//import MechanicalAppraisal from '../../../data/models/MechanicalAppraisal';
import { currenyFormat, calcLegals, netType } from '../../../utils/extras';
import Get from '../../../utils/Get';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { Dependencies } from '../../../dependency-injection';
import TableAccesories from '../../Closure/components/TableAccesories';
import TableServices, {
  ServicesTable,
} from '../../Closure/components/TableServices';
import Financial from '../../../data/models/Settings';
import SettingsRepository from '../../../data/repositories/settings-repository';
import auth from '../../../utils/auth';

const { Option } = Select;

interface accesoryAndOthersInput {
  accesories: Array<any>;
  services: Array<any>;
}

const QuotesForm: FunctionComponent<{
  nextStep: Function;
  onCreatedQuote: Function;
  dataVehicleSelect: any;
  insurances: any;
}> = ({ nextStep, onCreatedQuote, dataVehicleSelect, insurances }) => {
  const { user } = auth;
  //const id = user.dealer[0].sucursal[0].id_sucursal;
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );

  const [pvp, setPvp] = useState<number>(dataVehicleSelect.precio);
  const [legalsAmount, setLegalsAmount] = useState<number>(0);

  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  const [insuranceYears, setInsuranceYears] = useState<number>(1);
  const [insuranceAmountYears, setInsuranceAmountYears] = useState<number>(0);
  const [insuranceAmountYear, setInsuranceAmountYear] = useState<number>(0);
  const [insuranceName, setInsuranceName] = useState<string>('');

  const [paymenType, setpaymenType] = useState<string>('');
  const [rate, setRate] = useState<number>(0);
  const [months, setMonths] = useState<number>(12);
  const [monthsSelect, setMonthsSelect] = useState<string[] | null>(null);
  const [cuota, setCuota] = useState<number>(0);
  const [autoPayment, setAutoPayment] = useState<boolean>(false);

  // tasa otro
  const [tasaOther, setTasaOther] = useState<boolean>(false);
  const [rates, setRates] = useState<string[] | null>(null);

  const [typeEntry, setTypeEntry] = useState<string>('');
  const [entryQuantity, setEntryQuantity] = useState<number>(0);
  const [entryPercentage, setEntryPercentage] = useState<number>(0);

  const [carRegistration, setCarRegistration] = useState<number>(0);

  const [activeDevice, setActiveDevice] = useState<boolean>(false);
  const [device, setDevice] = useState<number>(0);
  const [deviceAmountYear, setDeviceAmountYear] = useState<number>(0);
  const [deviceAmountYears, setDeviceAmountYears] = useState<number>(0);
  const [deviceYears, setDeviceYears] = useState<number>(1);

  const [exonerated, setExonerated] = useState<boolean>(false);
  const [typeExonerated, setTypeExonerated] = useState<string>('');
  const [grade, setGrade] = useState<string>('');

  const [total, setTotal] = useState<number>(0);

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [typeOthers, setTypeOthers] = useState<string>('');

  const [
    accesoriesServices,
    setAccesoriesServices,
  ] = useState<accesoryAndOthersInput>({ accesories: [], services: [] });
  const [accesoriesAmount, setAccesoriesAmount] = useState<number>(0);
  const [servicesAmount, setServicesAmount] = useState<number>(0);

  const [buttonsDisabled, setButtonsDisabled] = useState<any>([]);
  const [buttonsDisabledMod2, setButtonsDisabledMod2] = useState<any>([]);

  const [triger, setTriger] = useState<boolean>(false);
  const [actualAccessories, setActualAccessories] = useState<any[]>([]);
  const [actualServices, setActualServices] = useState<ServicesTable[]>([]);
  const [maried, setMaried] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataExonerated, setDataExonerated] = useState<any>({});

  //estado que nos apoya en el rederizado del tipo de pago
  const [renderPayForm, setRenderPayForm] = useState<boolean>(true);

  //console.log('dataVehicleSelect', dataVehicleSelect);

  /*  const insurances = [
    {
      name: 'Equinoccial',
      value: 54.26,
    },
    {
      name: 'Liberty',
      value: 56.83,
    },
    {
      name: 'Chubb',
      value: 48.72,
    },
    {
      name: 'Endoso',
      value: 0,
    },
  ]; */

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();
  const getSettings = async () => {
    const dataRateTerm = await settingsRepository.getAllSettings(parseInt(lead?.sucursal?.code ?? '-1'));
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

  const setLegalAmountSelector = (pvpInput: number, mariedInput: boolean) => {
    //setMaried(mariedInput);
    setLegalsAmount(calcLegals(pvpInput, maried));
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
      //console.log('pvp', vehiclePvp);
      setPvp(parseFloat(vehiclePvp));
      setLegalsAmount(calcLegals(parseFloat(vehiclePvp), maried));
    }
    if (mariedInput !== null) {
      //console.log('maried', mariedInput);
      //setMaried(mariedInput);
      setLegalAmountSelector(pvp, mariedInput);
    }

    if (payType) {
      //console.log('payType', payType);
      //leadStep(payType === 'credit');
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
      //console.log('quateExonerted', quateExonerted);
      if (dataVehicleSelect.exonerados) {
        //console.log('quateExonerted', quateExonerted);
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
      //console.log('tipoEntrada', tipoEntrada);
      await setTypeEntry(tipoEntrada);
    }
    if (entrada) {
      //console.log('entrada', entrada);
      if (typeEntry === 'percentage') {
        await setEntryPercentage(parseFloat(entrada));
        const entry2 = (parseFloat(entrada) / 100) * (pvp * 1.12);
        //console.log('entry2', entry2);
        await setEntryQuantity(entry2);
      } else {
        const percetageCaculateValue =
          (parseFloat(entrada) * 100) / (pvp * 1.12);
        //console.log('percetageCaculateValue', percetageCaculateValue);
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
        //console.log('tasa', tasaInput);
        await setRate(tasaInput);
        setTasaOther(false);
        //console.log('setRate', rate);
        //console.log('setRate', Number(rate));
      }
    }
    if (meses) {
      //console.log('meses', meses);
      await setMonths(meses);
    }
    if (aseguradora) {
      //console.log('Insurance QuoteForm', insurances);
      const aseguradoraValue = insurances[aseguradora].value;
      const aseguradoraName = insurances[aseguradora].name;
      const aseguradoraAmountYears = aseguradoraValue * 12;
      await setInsuranceAmount(aseguradoraValue);
      await setInsuranceAmountYear(aseguradoraAmountYears);
      if (insuranceYears <= 1) {
        await setInsuranceAmountYears(aseguradoraAmountYears);
      }
      //console.log('insuranceAmountYear', insuranceAmountYear);
      await setInsuranceName(aseguradoraName);
    }
    if (aniosSeguro) {
      //console.log('aniosSeguro', aniosSeguro);
      await setInsuranceYears(parseFloat(aniosSeguro));
      await setInsuranceAmountYears(
        parseFloat(aniosSeguro) * insuranceAmountYear
      );
    }
    if (matricula) {
      //console.log('matricula', matricula);
      await setCarRegistration(parseFloat(matricula));
    }
    if (dispositivoActive !== undefined) {
      //console.log('dispositivoActive', dispositivoActive);
      await setActiveDevice(dispositivoActive);
    }
    if (dispositivoValue) {
      //console.log('dispositivoValue', dispositivoValue);
      await setDevice(parseFloat(dispositivoValue));
      await setDeviceAmountYear(parseFloat(dispositivoValue) * 12);
    }
    if (aniosDispositivo) {
      //console.log('aniosDispositivo', aniosDispositivo);
      await setDeviceYears(parseFloat(aniosDispositivo));
      await setDeviceAmountYears(
        deviceAmountYear * parseFloat(aniosDispositivo)
      );
    }
    if (autopartepago !== undefined) {
      //console.log('autopartepago', autopartepago);
      await setAutoPayment(autopartepago);
    }

    if (tasaOtroInput) {
      setRate(tasaOtroInput);
    }
  };

  const handleCancel = () => {
    setModalShow(false);
  };

  const onReset = () => {
    form.resetFields();
    setpaymenType('');
    setAccesoriesAmount(0);
    setAccesoriesServices({ accesories: [], services: [] });
    setActiveDevice(false);
    setAutoPayment(false);
    setButtonsDisabled([]);
    setButtonsDisabledMod2([]);
    setCarRegistration(0);
    setCuota(0);
    setEntryQuantity(0);
    setExonerated(false);
    setInsuranceAmount(0);
    setInsuranceAmountYear(0);
    setInsuranceYears(1);
    setInsuranceName('');
    setTotal(0);
  };

  const quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);

  if (!client || !lead) {
    return <div />;
  }
  ////console.log('accesoriesServices.services ✅✅', entryQuantity);
  return (
    <Row className="QuateForm" gutter={16}>
      <Col className="gutter-row" span={16}>
        <Spin spinning={loading}>
          <Form
            form={form}
            {...formItemLayout}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={{
              vehiclePvp: currenyFormat(dataVehicleSelect.precio * 1.12, false),
              tasaImput: rate,
              meses: months,
              aniosDispositivo: '1',
              matricula: carRegistration,
              aniosSeguro: '1',
              maried,
            }}
            onValuesChange={setValuesCotizador}
            onFinish={async (values) => {
              //console.log('valores onFinish', values);
              setLoading(true);

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
                    //commercialized: 1, //No se tiene este dato
                    //numberAxles: 0, //No se tiene este dato
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
                //registration: parseFloat(values.matricula), //requerido
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
                //console.log('cuota a base----->', cuota);
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
                quoteInfo.accesoriesValue = accesoriesAmount; //opcional
              }
              //Observaciones
              quoteInfo.observations = values.observations ?? null;

              //console.log('quoteInfo', quoteInfo);
              //console.log('values', values);
              const quoteRenderAny: any = quoteInfo;
              //console.log('quoteRenderAny----+++++++', quoteRenderAny);
              //setLoading(false);
              ////console.log("DATA QUOTE VEHICLE >", )
              const NewQuote: Quotes | null = await quotesRepository.createQuote(
                quoteRenderAny,
                lead.id!
              );
              //const NewQuote: any = false;
              //console.log('COT FROM BACK', NewQuote);

              //const NewQuote: any = false;
              if (NewQuote) {
                NewQuote.observations = values.observations ?? null;
                onCreatedQuote((prevState: any) => [...prevState, NewQuote]);
                //console.log('lead quotes', lead);
                const NewQuoteUp = {
                  ...NewQuote,
                  exonerated: values.quateExonerted
                    ? quoteInfo.exonerated
                    : null,
                };
                //console.log('NewQuote', NewQuoteUp);
                const leadUpdate = JSON.parse(JSON.stringify(lead));
                leadUpdate.quotes!.push(NewQuoteUp);
                if (setLead) {
                  setLead(leadUpdate);
                }
                setLoading(false);
                //console.log('Cotización guardada', added);
                await onReset();
                message.success('La cotización se guardó con éxito');
                setActualServices([]);
                setActualAccessories([]);
                setPvp(dataVehicleSelect.precio);
              } else {
                message.error('Error al crear cotización');
                setLoading(false);
              }
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
                    <TableAccesories
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
                    {/* <TableServices
                      actualServices={actualServices}
                      setActualServices={setActualServices}
                      setServicesAmount={setServicesAmount}
                      brand={dataVehicleSelect.marca}
                    /> */}
                    <TableServices
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

            {/* Opciones de credito */}
            {paymenType === 'credit' && (
              <div>
                {/*<Form.Item label="Casado?" name="mariedInput">
                  <Switch
                    checkedChildren="Si"
                    unCheckedChildren="No"
                  />
            </Form.Item>*/}
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
                            // eslint-disable-next-line prefer-promise-reject-errors
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
                    {netType(lead?.concesionario?.code!).toLowerCase() ===
                      'red externa' && <Option value="otro">Otro</Option>}
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
                    {/*    <Option value="0">Equinoccial</Option>
                    <Option value="1">Liberty</Option>
                    <Option value="2">Chubb</Option>
                    <Option value="3">Endoso</Option> */}
                  </Select>
                </Form.Item>
                <Form.Item label="Años de Seguro" name="aniosSeguro">
                  <Input disabled={insuranceAmount === 0} />
                </Form.Item>
                {/* <Form.Item
                  label="Matrícula"
                  name="matricula"
                  rules={[
                    {
                      required: true,
                      validator: (rule, value) => {
                        if (value >= 0) {
                          return Promise.resolve();
                        }
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject('Matrícula debe ser al menos 0');
                      },
                    },
                  ]}
                >
                  <Input prefix="$" />
                </Form.Item> */}
                {/*<Form.Item label="Dispositivo" name="dispositivoActive">
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                    </Form.Item>*/}
                {/*activeDevice && (
                  <Form.Item label="Dispositivo / mes" name="dispositivoValue">
                    <Input prefix="$" />
                  </Form.Item>
                )*/}
                {/*activeDevice && (
                  <Form.Item label="Años" name="aniosDispositivo">
                    <Input />
                  </Form.Item>
                )*/}
              </div>
            )}
            <Form.Item label="Auto parte pago" name="autopartepago">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
            {autoPayment && <CarAsFormPay activeProviderData={false} />}
            <Form.Item label="Detalle del Negocio" name="observations">
              <Input.TextArea />
            </Form.Item>
            <div className="text-center mb-6">
              <p>
                Guarda la cotización para el modelo {dataVehicleSelect.marca}{' '}
                {dataVehicleSelect.modelo} {dataVehicleSelect.anio}.
              </p>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<SaveOutlined />}
              >
                Guardar cotización
              </Button>
            </div>
            <Alert
              message="¿Dónde van las cotizaciones al guardarlas?"
              description={`Al guardar se añadirá al módulo superior donde podrás imprimir, 
                enviar al cliente, generar una solicitud de crédito o vincularla al cierre de tu negocio. 
                Genera las cotizaciones que necesites con este modelo
                ${dataVehicleSelect.marca} ${dataVehicleSelect.modelo} ${dataVehicleSelect.anio}.`}
              type="info"
              showIcon
            />
          </Form>
        </Spin>
      </Col>
      <Col className="gutter-row" span={8}>
        <Result
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
          nextStep={nextStep}
        />
      </Col>
      <Modal
        title="Accesorios y otros"
        visible={modalShow}
        onCancel={handleCancel}
        footer=""
        width={600}
      >
        <AccessoriesOthers
          type={typeOthers}
          setAccesoriesServices={setAccesoriesServices}
          accesoriesServices={accesoriesServices}
          accesoriesAmount={accesoriesAmount}
          setAccesoriesAmount={setAccesoriesAmount}
          servicesAmount={servicesAmount}
          setServicesAmount={setServicesAmount}
          buttonsDisabled={buttonsDisabled}
          setButtonsDisabled={setButtonsDisabled}
          buttonsDisabledMod2={buttonsDisabledMod2}
          setButtonsDisabledMod2={setButtonsDisabledMod2}
        />
      </Modal>
    </Row>
  );
};

export default QuotesForm;
