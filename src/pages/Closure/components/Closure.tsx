import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  InputNumber,
  Divider,
  Tooltip,
  Tag,
  message,
  Alert,
  Radio,
  Avatar,
  Row,
  Col,
  Checkbox,
  Badge,
} from 'antd';
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  ArrowRightOutlined,
  UserOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { ClientLeadContext } from '../../../components/GetClientData';
import Quotes, {
  Accesories,
  MechanicalAppraisalQuote,
  Services,
} from '../../../data/models/Quotes';
import TableAccesories from './TableAccesories';
import NewCreditApplication from '../../lead/steps/new-credit-application/NewCreditApplication2';
import AspectRatio from '../../../components/AspectRatio';
import Reservation from '../../quote/components/Reservation';
import Box from '../../quote/components/Box';
import Get from '../../../utils/Get';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { Dependencies } from '../../../dependency-injection';
import TableServices from './TableServices';
import auth from '../../../utils/auth';
import { currenyFormat } from '../../../utils/extras';
import DeliveryQueryProvider from '../../../data/providers/apollo/queries/delivery';
import Loading from '../../../components/Loading';
import validatePhone from '../../../utils/validate-phone';

//import { Dependencies } from '../../dependency-injection';

export interface AccesoriesServices {
  name: string;
  value: number;
  quantity: number;
}

export interface ServiceWithType {
  code?: string;
  name?: string;
  exonerated?: number;
  wayToPay?: string;
  iva?: number;
  brands?: string;
  total?: number;
  quantity?: number | null;
  type: string;
  value: number;
}

interface EntityType {
  type: 'Financiera' | 'Consorcio';
  entity: string | null;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Closure: FunctionComponent<{
  actualQuote: Quotes;
  nextStep: Function;
}> = ({ actualQuote, nextStep }) => {
  const { client, lead } = useContext(ClientLeadContext);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const [autoPartePago, setAutoPartePago] = useState<boolean>(
    !!actualQuote.mechanicalAppraisalQuote
  );
  const [verSolicitud, setVerSolicitud] = useState<boolean>(false);
  const [descuento, setDescuento] = useState<number>(0);
  const [actualAccessories, setActualAccessories] = useState<Accesories[]>([]);
  const [actualServices, setActualServices] = useState<ServiceWithType[]>([]);
  const [vin, setVin] = useState<string>(
    actualQuote.vimVehiculo ? actualQuote.vimVehiculo : ''
  );
  const [reliceVehicleView, setReliceVehicleView] = useState<boolean>(
    !!actualQuote.vimVehiculo
  );
  const [payThirdPerson, setPayThirdPerson] = useState<boolean>(false);
  const [entityType, setEntityType] = useState<EntityType>({
    type: 'Financiera',
    entity: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    //console.log('MY ACTUAL QUOTE', actualQuote);
    if (actualQuote.idAccesories) {
      setActualAccessories(actualQuote.idAccesories);
    }
    if (actualQuote.services) {
      //console.log('Servicios de BASE: ', actualQuote.services);
      const myServices: ServiceWithType[] = [];
      actualQuote.services!.forEach((serviceGroup) => {
        //console.log({ serviceGroup });
        Object.keys(serviceGroup).forEach((key) => {
          const respaldo: any = serviceGroup;
          if (key !== '__typename') {
            //console.log({ key }, respaldo[key]);
            const groupSer: any = respaldo[key];
            //console.log('groupSer', groupSer);
            groupSer.forEach((serviceItem: any) => {
              myServices.push({
                ...serviceItem,
                type: key,
                value: serviceItem.value ?? 0,
              });
            });
          }
        });
      });
      //console.log({ myServices });
      /* Object.keys(actualQuote.services).forEach((key) => {
        
      }); */
      setActualServices(myServices);
    }
    if (actualQuote.vimVehiculo) {
      setVin(actualQuote.vimVehiculo);
    }
    if (actualQuote.chosenEntity) {
      const setEntity: any = {
        entity: actualQuote.chosenEntity.entity,
        type: actualQuote.chosenEntity.type,
      };
      setEntityType(setEntity);
    }

    if (actualQuote.payThirdPerson) {
      setPayThirdPerson(actualQuote.payThirdPerson);
    }
  }, []);
  const onChange = (checkedValues: any) => {
    //console.log('checked = ', checkedValues);
    setEntityType({
      type: checkedValues.target.value,
      entity: null,
    });
  };

  const onChangeSwitch = (val: any) => {
    //console.log('val switch', val);
    setPayThirdPerson(val);
  };

  const onChangeEntity = (val: any) => {
    //console.log('onChangeEntity', val);
    setEntityType((prevState) => ({
      ...prevState,
      entity: val,
    }));
  };

  //recupero mi auto
  const vehicle = actualQuote!.vehiculo![0];
  const { user } = auth;

  let exoneratedTypeRender = null;
  if (actualQuote.exonerated) {
    exoneratedTypeRender =
      actualQuote.exonerated.type === 'diplomatics'
        ? 'Diplomático'
        : 'Discapacitado';
  }

  let total: number = 0;
  let legalAmount: number = 0;
  let valueToFinance: number = 0;
  //console.log('actualQuote', actualQuote);
  if (actualQuote && vehicle) {
    if (actualQuote.type === 'credit') {
      legalAmount = vehicle.pvp! * 0.005 + 25 + 300 + 95;
    }
    total = vehicle.pvp! + legalAmount;
    if (actualQuote.accesoriesValue) {
      total += actualQuote.accesoriesValue;
    }
    if (actualQuote.servicesValue) {
      total += actualQuote.servicesValue;
    }
    if (actualQuote.registration) {
      total += actualQuote.registration;
    }
    if (actualQuote.insuranceCarrier) {
      total += actualQuote.insuranceCarrier.cost;
    }
    if (actualQuote.type === 'credit') {
      valueToFinance = total - actualQuote.inputAmount!;
    }
    //console.log('actualQuote, Total', total);
  }

  //Valor extra de es_kit de accesorios
  const valueEsKit = actualQuote.idAccesories?.reduce(
    (acumulador, valorActual) => {
      if (valorActual.es_kit === 1) {
        return (
          acumulador +
          (valorActual.cost
            ? valorActual.cost * (valorActual.quantity ?? 0)
            : 0)
        );
      }
      return acumulador;
    },
    0
  );

  return (
    <div className="max-w-screen-lg m-auto">
      {verSolicitud ? (
        <div className="text-right">
          <Button
            type="primary"
            onClick={() => {
              setVerSolicitud((prevState) => !prevState);
            }}
          >
            Cerrar solicitud
          </Button>
        </div>
      ) : null}

      {verSolicitud ? (
        <NewCreditApplication
          client={client!}
          vehicle={{
            brand: vehicle.brand!,
            description: vehicle.description!,
            model: vehicle.model!,
            value: vehicle.pvp!,
            totalServices: null,
            totalAccesories: null,
            year: vehicle.year!,
            entrada: actualQuote.inputAmount!,
            financing: vehicle.pvp! - actualQuote.inputAmount!,
            monthlyPayments: actualQuote.monthly!,
            plazo: actualQuote.months!,
            tasa: actualQuote.rate!,
            valueExtraEsKit: valueEsKit ?? 0,
          }}
          user={{
            concessionaire: user!.concessionaire || '',
            name: user!.nombre || '',
            place: 'Quitooooo',
            role: user!.role ?? 'ASESOR COMERCIAL',
            sucursal: '',
          }}
          idQuoute={actualQuote.id!}
          nextStep={() => {}}
          concesionarioCode={lead?.concesionario?.code}
        />
      ) : (
        <>
          <div className="">
            <div className="w-1/2 inline-block">
              <h2 className="text-black text-2xl">Cierre del Negocio</h2>
            </div>
            <div className="w-1/2 inline-block">
              <p className="mb-0 text-right">
                <b>Fecha:</b>
                <span>{moment().format('DD-MM-YYYY HH:mm')}</span>
              </p>
            </div>
          </div>

          <Divider orientation="left">Datos Cliente</Divider>
          <div className="flex flex-row justify-start">
            <div className="flex flex-col pr-4">
              <Avatar size={64} icon={<UserOutlined />} />
            </div>
            <div className="">
              <p className="leading-tight mb-0">{`Nombre: ${client!
                .name!} ${client!.lastName!}`}</p>
              <p className="leading-tight mb-0">
                {client?.identification
                  ? `Identificación: ${client?.identification}`
                  : ''}
              </p>
              <p className="leading-tight mb-0">
                {client?.phone ? `Teléfono: ${client?.phone}` : ''}
              </p>
              <p className="leading-tight mb-0">
                {client?.cellphone ? `Celular: ${client?.cellphone}` : ''}
              </p>
              <p className="leading-tight mb-0">
                {client?.email ? `Email: ${client?.email}` : ''}
              </p>
            </div>
          </div>

          <Divider orientation="left">
            <h3>
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </h3>
          </Divider>

          <div>
            <div className="flex justify-between ">
              <div className="flex flex-col w-6/12 ">
                <div className="p-3">
                  <AspectRatio ratio={9 / 16}>
                    <img
                      src={vehicle.imgs! || '/img/no-image-found-360x250.png'}
                      alt=""
                      className="w-full"
                      style={{ objectFit: 'cover' }}
                    />
                  </AspectRatio>
                </div>
              </div>
              <div className="w-6/12 ml-3">
                <div className=" flex flex-col border-1 rounded-lg p-5 ">
                  <span>
                    <strong>Caracteristicas</strong>
                  </span>
                  <div className="mt-5">
                    {vin !== '' ? (
                      <Alert
                        className="mb-2"
                        message={
                          <div>
                            VIN: {vin}
                            {actualQuote.discount && (
                              <Button
                                className="ml-2"
                                type="primary"
                                danger
                                style={{
                                  backgroundColor: '#fff',
                                  borderColor: '#2e7d32',
                                  color: '#2e7d32',
                                }}
                                onClick={() => nextStep()}
                                icon={<ArrowRightOutlined />}
                              >
                                Prefacturar
                              </Button>
                            )}
                          </div>
                        }
                        type="success"
                      />
                    ) : null}
                    <div className="flex flex-row justify-start">
                      <div className="flex flex-col mr-1">
                        <p className="font-bold mb-0 text-right">Marca:</p>
                        <p className="font-bold mb-0 text-right">Modelo:</p>
                        <p className="font-bold mb-0 text-right">Año:</p>
                        <p className="font-bold mb-0 text-right">
                          {vehicle.cylinder! ? 'Cilindraje:' : ''}
                        </p>
                        <p className="font-bold mb-0 text-right">Pasajeros:</p>
                        <p className="font-bold mb-0 text-right">Puertas:</p>
                        <p className="font-bold mb-0 text-right">
                          Combustible:
                        </p>
                        <p className="font-bold mb-0 text-right text-xl">
                          PVP:
                        </p>
                      </div>
                      <div className="flex flex-col ">
                        <p className=" mb-0">{vehicle.brand! ?? 'N/A'}</p>
                        <p className=" mb-0">{vehicle.model! ?? 'N/A'}</p>
                        <p className=" mb-0">{vehicle.year! ?? 'N/A'}</p>
                        <p className=" mb-0">{vehicle.cylinder! ?? ''}</p>
                        <p className=" mb-0">
                          {vehicle.numPassengers! ?? 'N/A'}
                        </p>
                        <p className=" mb-0">{vehicle.doors! ?? 'N/A'}</p>
                        <p className=" mb-0">{vehicle.fuel! ?? 'N/A'}</p>
                        <p className=" mb-0 text-xl">
                          {currenyFormat(vehicle.pvp!, true) ?? 'N/A'}{' '}
                          {actualQuote.exonerated ? (
                            <Tag color="purple">Exonerado</Tag>
                          ) : (
                            <span className="text-sm">Inc. IVA</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex mt-2 items-center">
                      <div className="text-xs">
                        Stock: <b>{vehicle.stock}</b>
                        <br />
                        <p className="mb-0">Colores disponibles:</p>
                        <Tooltip
                          placement="left"
                          title="El color del vehículo se seleccionará al asignar un VIN"
                        >
                          <div>
                            {vehicle.color &&
                              vehicle.color.map((col, index) => (
                                <div key={index}>
                                  <Badge
                                    color="#666"
                                    text={`${col.stock} ${col.color}`}
                                  />
                                </div>
                              ))}
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    {actualQuote.reserveValue ? (
                      <div className="font-bold text-base">
                        Valor de la reserva: {actualQuote.reserveValue}{' '}
                        <Tag color="#87d068">Pagado</Tag>
                        <Reservation
                          codigo={vehicle.code!}
                          quoteId={actualQuote.id!}
                          disabledReserveButton={false}
                          reliceVehicleView={reliceVehicleView}
                          setReliceVehicleView={setReliceVehicleView}
                          setVin={setVin}
                          vin={[]}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Alert
            message="Si agregas o eliminas un accesorio o servicio debes guardar el cierre con el botón al final de esta página."
            type="info"
            showIcon
            className="my-4"
          />
          <div className="my-6">
            {actualQuote.vehiculo!.length > 0 ? (
              <>
                <TableAccesories
                  paramsToFind={{
                    code: actualQuote?.vehiculo![0].code ?? '',
                    brand: actualQuote?.vehiculo![0].brand ?? '',
                    model: actualQuote?.vehiculo![0].model ?? '',
                  }}
                  actualAccessories={actualAccessories}
                  setActualAccessories={setActualAccessories}
                />
                <br />

                {/* <TableServices
                  brand={actualQuote?.vehiculo![0].brand ?? ''}
                  actualServices={actualServices}
                  setActualServices={setActualServices}
                /> */}
              </>
            ) : null}
          </div>
          <Divider orientation="left">Parámetros del Negocio</Divider>
          <div className="m-auto">
            <Form
              {...layout}
              initialValues={{
                discount: actualQuote.discount ? actualQuote.discount : null,
                pvp: currenyFormat(vehicle.pvp!, true),
                exonerated: actualQuote.exonerated ? 'SI' : 'NO',
                exoneratedType: exoneratedTypeRender,
                exoneratedPercentage: actualQuote.exonerated
                  ? actualQuote.exonerated.percentage
                  : null,
                payType: actualQuote.type === 'credit' ? 'Crédito' : 'Contado',
                inputAmount: currenyFormat(
                  actualQuote!.inputAmount ? actualQuote!.inputAmount : 0,
                  true
                ),
                valueToFinance: currenyFormat(valueToFinance, true),
                creditMonths: actualQuote.months ? actualQuote.months : 0,
                quoteAmount: actualQuote.monthly
                  ? currenyFormat(actualQuote.monthly, true)
                  : 0,
                insuranceName: actualQuote.insuranceCarrier
                  ? actualQuote.insuranceCarrier.name
                  : '',
                insuranceMonthlyPayment: currenyFormat(
                  actualQuote.insuranceCarrier
                    ? actualQuote.insuranceCarrier.monthlyPayment
                    : '',
                  true
                ),
                insuranceYears: actualQuote.insuranceCarrier
                  ? actualQuote.insuranceCarrier.years
                  : '',
                insuranceCost: currenyFormat(
                  actualQuote.insuranceCarrier
                    ? actualQuote.insuranceCarrier.cost
                    : '',
                  true
                ),
                //carAsPayFrom: actualQuote.
                carAsPayFromBrand: actualQuote.mechanicalAppraisalQuote
                  ? actualQuote.mechanicalAppraisalQuote!.brand
                  : '',
                carAsPayFromModel: actualQuote.mechanicalAppraisalQuote
                  ? actualQuote.mechanicalAppraisalQuote!.model
                  : '',
                carAsPayFromYear: actualQuote.mechanicalAppraisalQuote
                  ? actualQuote.mechanicalAppraisalQuote!.year
                  : '',
                carAsPayFromKm: actualQuote.mechanicalAppraisalQuote
                  ? actualQuote.mechanicalAppraisalQuote!.mileage
                  : '',
                carAsPayFromDesiredPrice: actualQuote.mechanicalAppraisalQuote
                  ? currenyFormat(
                      actualQuote.mechanicalAppraisalQuote!.desiredPrice!,
                      true
                    )
                  : '',
                bussinessName: actualQuote.preOwnedSupplier
                  ? actualQuote.preOwnedSupplier.bussinessName
                  : '',
                identification: actualQuote.preOwnedSupplier
                  ? actualQuote.preOwnedSupplier.identification
                  : '',
                email: actualQuote.preOwnedSupplier
                  ? actualQuote.preOwnedSupplier.email
                  : '',
                phone: actualQuote.preOwnedSupplier
                  ? actualQuote.preOwnedSupplier.phone
                  : undefined,
                appraisalValue: actualQuote.preOwnedSupplier
                  ? actualQuote.preOwnedSupplier.appraisalValue
                  : 0,
                registrationValue: currenyFormat(
                  actualQuote.registration ? actualQuote.registration : 0,
                  true
                ),
                totalValue: currenyFormat(total, true),
                payThirdPerson: actualQuote.payThirdPerson,
                entity: actualQuote.chosenEntity?.entity,
              }}
              onFinish={async (values: any) => {
                if (entityType.entity === null) {
                  message.error('Escoja una entidad');
                  return;
                }

                const servicesType = actualServices.map((serv) => serv.type);
                //const servicesType = exampleServ.map((serv) => serv.type);
                const unicosType: string[] = [];
                servicesType.forEach((tipo: string) => {
                  const ele = unicosType.find((uni) => uni === tipo);
                  if (!ele) {
                    unicosType.push(tipo);
                  }
                });

                //hacer las categorias
                const mainJson: any = {};
                unicosType.forEach((type) => {
                  mainJson[type] = [];
                });

                //filtrar elementos
                unicosType.forEach((type) => {
                  //const filterServices = exampleServ.map((serv) => serv.type);
                  const filterServices = actualServices
                    .filter((serv) => serv.type === type)
                    .map((ser) => ({
                      brands: ser.brands,
                      code: ser.code,
                      exonerated: ser.exonerated,
                      iva: ser.iva,
                      name: ser.name,
                      quantity: ser.quantity,
                      total: ser.total,
                      value: ser.value,
                      wayToPay: ser.wayToPay,
                    }));
                  mainJson[type] = filterServices;
                });
                const orderAccesories = actualAccessories.map((acc) => {
                  const mapURL = acc.urlPhoto?.map((url) => ({
                    link: url.link,
                  }));
                  return {
                    code: acc.code,
                    name: acc.name,
                    cost: acc.cost,
                    dimension: acc.dimension,
                    id: acc.id,
                    id_Vh: acc.id_Vh,
                    brand: acc.brand,
                    model: acc.model,
                    urlPhoto: mapURL ?? [],
                    quantity: acc.quantity,
                  };
                });
                const orderServices =
                  actualServices.length > 0 ? [mainJson] : undefined;
                //console.log('Services', [mainJson]);
                const dataToSend: any = {
                  bussinessName: values.bussinessName
                    ? values.bussinessName
                    : '',
                  identification: values.identification
                    ? values.identification
                    : '',
                  phone: values.phone ? values.phone : '',
                  email: values.email ? values.email : '',
                  appraisalValue: values.appraisalValue
                    ? values.appraisalValue
                    : 0,
                  acceptedAppraisal: !!values.acceptedAppraisal,
                  closed: true,
                  discount: descuento,
                  chosenEntity: entityType,
                  payThirdPerson,
                  accesories:
                    orderAccesories.length > 0 ? orderAccesories : undefined,
                  services: orderServices,
                };

                //console.log('dataToend', dataToSend);
                setLoading(true);
                const resp = await quouteRepository.updateQuote(
                  actualQuote.id!,
                  dataToSend
                );
                setLoading(false);
                if (resp) {
                  message.success('Datos guardados');
                  return;
                }
                message.error('Error al guardar los Datos');
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Valor a pagar:"
                    name="pvp"
                    className="mr-4 mb-4"
                  >
                    <Input disabled style={{ width: 150 }} />
                  </Form.Item>
                  {actualQuote!.exonerated && (
                    <div>
                      <Form.Item
                        label="Exonerado"
                        name="exonerated"
                        className="mr-4 mb-4"
                      >
                        <Input disabled style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        label="Tipo"
                        name="exoneratedType"
                        className="mr-4 mb-4"
                      >
                        <Input disabled style={{ width: 150 }} />
                      </Form.Item>
                      {actualQuote.exonerated.percentage && (
                        <Form.Item
                          label="% de exoneración"
                          name="exoneratedPercentage"
                          className="mr-4 mb-4"
                        >
                          <Input disabled style={{ width: 150 }} />
                        </Form.Item>
                      )}
                    </div>
                  )}
                  <Form.Item
                    label="Forma de pago:"
                    name="payType"
                    className="mr-4 mb-4"
                  >
                    <Input disabled style={{ width: 150 }} />
                  </Form.Item>
                  {actualQuote!.inputAmount && (
                    <Form.Item
                      label="Entrada:"
                      name="inputAmount"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                  )}

                  {actualQuote.months && (
                    <Form.Item
                      label="Meses plazo:"
                      name="creditMonths"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                  )}

                  {actualQuote.monthly && (
                    <Form.Item
                      label="Cuota:"
                      name="quoteAmount"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                  )}
                  {/* <Form.Item label="Valor cuota sin seguro:">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Valor cuota con seguro:">
                    <Input />
                  </Form.Item> */}

                  {actualQuote.registration ? (
                    <Form.Item
                      label="Matricula"
                      name="registrationValue"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                  ) : null}
                  {valueToFinance ? (
                    <Form.Item
                      label="Saldo a financiar:"
                      name="valueToFinance"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                  ) : null}
                  <Form.Item
                    label="Total"
                    name="totalValue"
                    className="mr-4 mb-4"
                  >
                    <Input disabled style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item
                    label="Auto parte de pago"
                    name="carAsPayFrom"
                    className="mr-4 mb-4"
                  >
                    <Checkbox
                      //defaultChecked={!!actualQuote.mechanicalAppraisalQuote}
                      checked={!!actualQuote.mechanicalAppraisalQuote}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Descuento Ortogado:"
                    name="discount"
                    className="mr-4 mb-4"
                    rules={[
                      { required: true, message: 'Debes ingresar al menos 0' },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      value={descuento}
                      onChange={(value) => setDescuento(value as number)}
                      style={{ width: 150 }}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value!.replace('%', '')}
                    />
                  </Form.Item>

                  {actualQuote.insuranceCarrier && (
                    <div>
                      <Form.Item
                        label="Aseguradora:"
                        name="insuranceName"
                        className="mr-4 mb-4"
                      >
                        <Input disabled style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        label="Mensual seguro:"
                        name="insuranceMonthlyPayment"
                        className="mr-4 mb-4"
                      >
                        <Input disabled style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        label="Años:"
                        name="insuranceYears"
                        className="mr-4 mb-4"
                      >
                        <Input disabled style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        label="Total seguro:"
                        name="insuranceCost"
                        className="mr-4 mb-4"
                      >
                        <Input disabled style={{ width: 150 }} />
                      </Form.Item>
                    </div>
                  )}
                  <Form.Item
                    label="Paga tercera persona:"
                    name="payThirdPerson"
                    className="mr-4 mb-4"
                  >
                    <Switch
                      //disabled
                      disabled={!!actualQuote.payThirdPerson}
                      checked={payThirdPerson}
                      onChange={onChangeSwitch}
                    />
                  </Form.Item>
                  {/*<Form.Item label="" className="mr-4 mb-4">
                    <Radio.Group
                      defaultValue={entityType.type}
                      style={{ width: '100%' }}
                      onChange={onChange}
                    >
                      <Radio value="Financiera">Financiera</Radio>
                      <Radio value="Consorcio">Consorcio</Radio>
                    </Radio.Group>
                  </Form.Item>*/}
                  {actualQuote.type === 'credit' ? (
                    <>
                      <Form.Item
                        label="Financiera:"
                        className="mr-4 mb-4"
                        name="entity"
                        rules={[
                          {
                            required: true,
                            message: 'Debes seleccionar una financiera.',
                          },
                        ]}
                      >
                        <Select
                          onChange={onChangeEntity}
                          disabled={
                            !!actualQuote.chosenEntity || !!lead?.saleDown
                          }
                          value={entityType.entity ?? undefined}
                          placeholder="Seleccione una financiera"
                        >
                          {actualQuote.quoteFinancial &&
                            actualQuote.quoteFinancial.map((quoFi, index) => {
                              if (quoFi.responseBank === 'APPROBED') {
                                return (
                                  <Select.Option
                                    key={index}
                                    value={
                                      quoFi.financial!.nameEntityFinancial!
                                    }
                                  >
                                    {quoFi.financial?.nameEntityFinancial!}
                                  </Select.Option>
                                );
                              }
                              return null;
                            })}
                          <Select.Option value="CRM">CRM</Select.Option>
                        </Select>
                      </Form.Item>
                      <div className="my-1 p-2 flex">
                        <div className="w-1/2">
                          Solicitudes en espera o rechazadas:
                        </div>
                        <div className="mx-2">
                          {actualQuote.quoteFinancial &&
                          actualQuote.quoteFinancial.length > 0
                            ? actualQuote.quoteFinancial.map(
                                (quoFinan, index) => {
                                  if (!quoFinan.responseBank) {
                                    return (
                                      <div>
                                        <Tag
                                          icon={<ClockCircleOutlined />}
                                          style={{ marginRight: 5 }}
                                          color="warning"
                                          key={index}
                                          className="mx-1"
                                        >
                                          {
                                            quoFinan.financial!
                                              .nameEntityFinancial
                                          }
                                        </Tag>
                                      </div>
                                    );
                                  }
                                  if (
                                    !quoFinan.responseBank ||
                                    quoFinan.responseBank !== 'REJECT'
                                  ) {
                                    return (
                                      <div>
                                        <Tag
                                          icon={<CloseCircleOutlined spin />}
                                          style={{ marginRight: 5 }}
                                          color="error"
                                        >
                                          {
                                            quoFinan.financial!
                                              .nameEntityFinancial
                                          }
                                        </Tag>
                                      </div>
                                    );
                                  }
                                  return null;
                                }
                              )
                            : ' NINGUNA'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Form.Item
                      label="Consorcio:"
                      name="entity"
                      rules={[
                        {
                          required: true,
                          message: 'Debes seleccionar un consorcio.',
                        },
                      ]}
                    >
                      <Select
                        disabled={!!actualQuote.chosenEntity}
                        onChange={onChangeEntity}
                        value={entityType.entity ?? undefined}
                        placeholder="Selecione un consorcio"
                      >
                        <Select.Option value="Consorcio del Pichincha">
                          Consorcio del Pichincha
                        </Select.Option>
                        <Select.Option value="Consorcio de Quito">
                          Consorcio de Quito
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                </Col>
              </Row>
              {autoPartePago && (
                <Row gutter={24}>
                  <Col span={12}>
                    <Divider orientation="left">Avalúo Mecánico</Divider>
                    <Form.Item
                      label="Marca"
                      name="carAsPayFromBrand"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      label="Modelo"
                      name="carAsPayFromModel"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      label="Año"
                      name="carAsPayFromYear"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      label="Kilometrage"
                      name="carAsPayFromKm"
                      className="mr-4 mb-4"
                    >
                      <InputNumber
                        disabled
                        style={{ width: 150 }}
                        formatter={(value) => `${value}km`}
                        parser={(value) => value!.replace('km', '')}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Precio deseado"
                      name="carAsPayFromDesiredPrice"
                      className="mr-4 mb-4"
                    >
                      <Input disabled style={{ width: 150 }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <MechanicalAppraisal
                      disabled
                      preOwnedSupplier={{
                        appraisalValue: actualQuote.preOwnedSupplier
                          ? actualQuote.preOwnedSupplier.appraisalValue
                          : 0,
                        bussinessName: actualQuote.preOwnedSupplier
                          ? actualQuote.preOwnedSupplier!.bussinessName
                          : '',
                        email: actualQuote.preOwnedSupplier
                          ? actualQuote.preOwnedSupplier!.email
                          : '',
                        identification: actualQuote.preOwnedSupplier
                          ? actualQuote.preOwnedSupplier!.identification
                          : '',
                        phone: actualQuote.preOwnedSupplier
                          ? actualQuote.preOwnedSupplier!.phone
                          : 0,
                        acceptedAppraisal: actualQuote.acceptedAppraisal,
                      }}
                    />
                  </Col>
                </Row>
              )}
              <div className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Guardar Cierre
                </Button>
              </div>
            </Form>
            <Alert
              message="Debes guardar los parámetros del negocio y notficar a caja para obtener el monto de reserva y poder asignar un VIN que te permita pasar a prefactura."
              type="info"
              showIcon
              className="mt-4"
            />
            <div className="mt-5 mb-5 flex">
              {/*vehicle.pdf && (
                <Button
                  className="text-red-400 button-red mr-2"
                  href={`${vehicle.pdf![0].link}`}
                  target="_blank"
                >
                  Descargar PDF
                </Button>
              )*/}
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setVerSolicitud((prevState) => !prevState);
                }}
                icon={<CreditCardOutlined />}
                className="mr-2"
              >
                {verSolicitud ? 'Cerrar solicitud' : 'Solicitud de crédito'}
              </Button>
              <Box
                disabledReserveButton={!!actualQuote.reserveValue}
                data={vehicle}
                leadId={lead?.id!}
                clientCi={client?.identification!}
              />
              {actualQuote.reserveValue && (
                <Reservation
                  codigo={vehicle.code!}
                  quoteId={actualQuote.id!}
                  disabledReserveButton={false}
                  reliceVehicleView={reliceVehicleView}
                  setReliceVehicleView={setReliceVehicleView}
                  setVin={setVin}
                  vin={[]}
                />
              )}

              {vin !== '' && actualQuote.discount ? (
                <Button
                  className="ml-2"
                  type="primary"
                  danger
                  style={{
                    backgroundColor: '#fff',
                    borderColor: '#2e7d32',
                    color: '#2e7d32',
                  }}
                  onClick={() => nextStep()}
                  icon={<ArrowRightOutlined />}
                >
                  Prefacturar
                </Button>
              ) : null}
            </div>
          </div>
        </>
      )}
      <Loading visible={loading} />
    </div>
  );
};

const MechanicalAppraisal: FunctionComponent<{
  disabled?: boolean;
  preOwnedSupplier: any;
}> = ({ disabled, preOwnedSupplier }) => {
  //console.log('mechanicalAppraisalQuote >>>', preOwnedSupplier);
  return (
    <>
      <Divider orientation="left">Proveedor de seminuevos</Divider>

      <Form.Item
        label="Razon Social"
        name="bussinessName"
        rules={[
          { required: true, message: 'Por favor ingrese una razón social' },
        ]}
      >
        <Input disabled={preOwnedSupplier.bussinessName !== ''} />
      </Form.Item>

      <Form.Item
        label="Idetificación"
        name="identification"
        rules={[
          { required: true, message: 'Por favor ingrese una identificación' },
        ]}
      >
        <Input disabled={preOwnedSupplier.identification !== ''} />
      </Form.Item>
      <Form.Item
        label="Celular"
        name="phone"
        rules={[
          { required: true, message: 'Por favor ingrese un celular' },
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
        <Input disabled={preOwnedSupplier.phone !== 0} />
      </Form.Item>
      <Form.Item
        label="Mail"
        name="email"
        rules={[
          { type: 'email' },
          { required: true, message: 'Por favor ingrese un email' },
        ]}
      >
        <Input disabled={preOwnedSupplier.email !== ''} />
      </Form.Item>
      <Form.Item
        label="Valor Avalúo"
        name="appraisalValue"
        rules={[{ required: true, message: 'Por favor ingrese un valor' }]}
      >
        <InputNumber min={0} disabled={preOwnedSupplier.appraisalValue !== 0} />
      </Form.Item>
      <Form.Item label="¿Aceptó la oferta?" name="acceptedAppraisal">
        <Switch
          defaultChecked={!!preOwnedSupplier.acceptedAppraisal}
          disabled={preOwnedSupplier.acceptedAppraisal !== null}
        />
      </Form.Item>
    </>
  );
};

export default Closure;
