import React, {
  FunctionComponent,
  useReducer,
  useContext,
  useEffect,
  useState,
  ComponentElement,
} from 'react';
import moment from 'moment';
import {
  Input,
  DatePicker,
  InputNumber,
  Select,
  TimePicker,
  Divider,
} from 'antd';

import {
  reducer,
  initState,
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from '../pages/lead/steps/new-credit-application/new-credit-controller';
import Modal from './Modal';
import { currenyFormat } from '../utils/extras';

const { Option } = Select;

type TypeRowData =
  | 'input'
  | 'datePicker'
  | 'number'
  | 'cash'
  | 'total'
  | 'percentage';

const banks: string[] = [
  'Banco Pichincha',
  'Cooperativa Andalucia',
  'Produbanco',
  'Cooperativa JEEP',
  'Banco del Austro',
  'CRM',
];

const NewCreditApplication: FunctionComponent = () => {
  const [store, dispatch] = useReducer(reducer, initState);
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  return (
    <>
      {/* <GlobalNewCreditContext.Provider value={{ store, dispatch }}> */}

      <div>
        <h2>Nueva Solicitud de crédito</h2>
        <Divider />

        <div className="flex">
          <div className="w-1/2">
            <ApplicantDetails />
            <ApplicantActivity />
            <CurrentAddress />
            <Property />
            <Passives />
          </div>
          <div className="w-1/2">
            <VehicleData />
            <SpouseData />
            <Income />
            <PersonalReferences />
            <BankReferences />
          </div>
        </div>
        <Patrimony />
        {/* IMPRESION DE DOCUMENTOS */}
        <div className="my-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            // onClick={() => setDisplayModal(true)}
          >
            Imprimir
          </button>

          <div className="text-red-600 my-1">
            Recuerda que el cliente debe firmar una copia de la solicitud.
          </div>
        </div>

        {/* CARGA DE DOCUMENTOS */}
        <div className="my-5">
          <div>Carga aquí una foto del documento firmado</div>
          <div className="border-dashed border-2 border-gray-600 w-24 h-24 flex justify-center cursor-pointer">
            <div className="flex flex-col justify-center items-center">
              <div className="text-gray-600">+</div>
              <div className="text-gray-600">Upload</div>
            </div>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded my-4"
            //onClick={() => console.log('State', store)}
          >
            Guardar Solicitud
          </button>
        </div>
        {/* SELECCION DE BANCOS  */}
        <div className="my-5">
          <div>
            Selecciona las entidades a las que quieres enviar la solicitud de
            crédito.
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Selecciona un país"
            defaultValue={banks[0]}
            //onChange={(value) => console.log('Selected:', value)}
          >
            {banks.map((bank: string, index: number) => (
              <Option value={bank} label={bank} key={`bank_${index}`}>
                <div className="demo-option-label-item">{bank}</div>
              </Option>
            ))}
          </Select>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded my-4"
            //onClick={() => console.log('State', store)}
          >
            Enviar Entidades
          </button>
        </div>
      </div>
      <Modal display={displayModal} onClose={() => setDisplayModal(false)} />

      {/* /* </GlobalNewCreditContext.Provider> */}
    </>
  );
};

const ApplicantDetails: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;

  useEffect(() => {
    dispatch({
      type: 'set-applicant-names',
      payload: 'Juan Carlos',
    });
    dispatch({
      type: 'set-applicant-lastNames',
      payload: 'Rojas Alemán',
    });
    dispatch({
      type: 'set-applicant-identification',
      payload: '1701010101',
    });
    dispatch({
      type: 'set-applicant-dateOfBirth',
      payload: moment().format('DD-MM-YYYY'),
    });
  }, []);
  //console.log('ApplicantDetails Render', store.applicant.names);
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Datos del Solicitante
      </div>
      <div className="">
        <RowData title="Nombres" valueText={store.applicant.names} disabled />
        <RowData
          title="Apellidos"
          valueText={store.applicant.lastNames}
          disabled
        />
        <RowData
          title="Cédula"
          valueText={store.applicant.identification}
          disabled
        />
        <RowData
          title="Fecha Nacimiento"
          type="datePicker"
          valueText={store.applicant.dateOfBirth}
          onChange={(date: moment.Moment, dateString: string) => {
            //console.log({ date, dateString });
            dispatch({
              type: 'set-applicant-dateOfBirth',
              payload: dateString,
            });
          }}
        />
        <RowData
          title="Lugar Nacimiento"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-placeOfBirth',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Nacionalidad"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-nationality',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Estado Civil"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-civilStatus',
              payload: text.target.value,
            });
          }}
        />

        <RowData
          title="Concesionario"
          defaultValue="Tumbaco"
          disabled
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-concessionaire',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Asesor Comercial"
          defaultValue="Ana Yerovi"
          disabled
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicant-businessAdvisor',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Lugar y fecha"
          defaultValue={moment().format('DD-MM-YYYY')}
          type="datePicker"
          //decoration={`${moment().format('HH:mm')}, Quito`}
          viewTime
          onChange={(date: moment.Moment, dateString: string) => {
            //console.log({ date, dateString });
            dispatch({
              type: 'set-applicant-placeAndDate',
              payload: dateString,
            });
          }}
          onChangeTime={(date: moment.Moment | null, dateString: string) => {
            //console.log({ date, dateString });
            dispatch({
              type: 'set-applicant-placeAndDate',
              payload: dateString,
            });
          }}
        />
      </div>
    </div>
  );
};

const ApplicantActivity: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Empleo / Actividad del Solicitante
      </div>
      <div className="">
        <RowData
          title="Empresa"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-company',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Teléfono trabajo"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-workPhone',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          valueText={store.applicantActivity.yearsOfWork}
          title="Años trabajando"
          type="number"
          onChange={(text: number) => {
            dispatch({
              type: 'set-applicantActivity-yearsOfWork',
              payload: text,
            });
          }}
        />
        <RowData
          title="Cargo"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-workPosition',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Dirección"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-workAddress',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Tipo de relación laboral"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-applicantActivity-employmentRelationship',
              payload: text.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const CurrentAddress: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Domicilio Actual
      </div>
      <div className="mt-2">
        <RowData
          title="Tipo de vivienda"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-typeOfHousing',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Dirección"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-houseAddress',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Barrio"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-neighborhood',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Parroquia"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-parish',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Teléfono domicilio"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-homePhone',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Teléfono celular"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-currentAddress-cellPhone',
              payload: text.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const BankReferences: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Referencias Bancarias
      </div>
      <div className="mt-2">
        <RowData
          title="Banco"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-bankReferences-bank',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Número cuenta"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-bankReferences-accountNumber',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Tipo cuenta"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-bankReferences-accountType',
              payload: text.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const Property: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  // console.log('render Property');
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Activos</div>
      <div className="mt-2">
        <RowData
          valueText={store.property.house}
          title="Casa"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-property-house',
              payload: v,
            });
          }}
        />

        <RowData
          valueText={store.property.vehicle}
          title="Vehículo"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-property-vehicle',
              payload: v,
            });
          }}
        />
        <RowData
          valueText={store.property.others}
          title="Otros"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-property-others',
              payload: v,
            });
          }}
        />
        <RowData
          title="Total"
          type="total"
          total={
            store.property.house +
            store.property.others +
            store.property.vehicle
          }
        />
      </div>
    </div>
  );
};

const VehicleData: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  useEffect(() => {
    dispatch({
      type: 'set-vehicleData-model',
      payload: 'JEEP CHEROKEE LONGITUDE 2.4L',
    });
    dispatch({
      type: 'set-vehicleData-year',
      payload: 2020,
    });
    dispatch({
      type: 'set-vehicleData-value',
      payload: 50000,
    });
    dispatch({
      type: 'set-vehicleData-plazo',
      payload: 60,
    });
    dispatch({
      type: 'set-vehicleData-entrada',
      payload: 2000,
    });
    dispatch({
      type: 'set-vehicleData-tasa',
      payload: 12,
    });
    dispatch({
      type: 'set-vehicleData-financing',
      payload: 30000,
    });
    dispatch({
      type: 'set-vehicleData-monthlyPayments',
      payload: 300,
    });
  }, []);
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Datos del Vehículo
      </div>
      <div className="mt-2">
        <RowData title="Modelo" valueText={store.vehicleData.model} disabled />
        <RowData
          title="Año"
          type="number"
          valueText={store.vehicleData.year}
          disabled
        />
        <RowData
          title="Precio"
          type="cash"
          valueText={currenyFormat(store.vehicleData.value!)}
          disabled
        />
        <RowData
          title="PVP"
          type="cash"
          valueText={`${currenyFormat(store.vehicleData.value!)} inc. IVA`}
          disabled
        />
        <RowData
          title="Plazo"
          type="number"
          valueText={store.vehicleData.plazo}
          decoration="MESES"
          disabled
        />
        <RowData
          title="Entrada"
          type="cash"
          valueText={currenyFormat(Number(store.vehicleData.entrada!), true)}
          disabled
        />
        <RowData
          title="Tasa"
          type="percentage"
          valueText={store.vehicleData.tasa}
          disabled
        />
        <RowData
          title="Monto a financiar"
          type="cash"
          valueText={currenyFormat(Number(store.vehicleData.financing!), true)}
          disabled
        />
        <RowData
          title="Cuota mensual"
          type="cash"
          valueText={currenyFormat(
            Number(store.vehicleData.monthlyPayments),
            true
          )}
          disabled
        />
      </div>
    </div>
  );
};

const SpouseData: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Datos del Cónyuge
      </div>
      <div className="">
        <RowData
          title="Nombres"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-names',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Apellidos"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-lastNames',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Cédula"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-identification',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Fecha nacimiento"
          type="datePicker"
          onChange={(date: moment.Moment, dateString: string) => {
            //console.log({ date, dateString });
            dispatch({
              type: 'set-spouseData-dateOfBirth',
              payload: dateString,
            });
          }}
        />
        <RowData
          title="Lugar nacimiento"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-spouseData-placeOfBirth',
              payload: text.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const Income: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Ingresos</div>
      <div className="">
        <RowData
          valueText={store.income.monthlySalary}
          title="Sueldo mensual"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-income-monthlySalary',
              payload: v,
            });
          }}
        />
        <RowData
          valueText={store.income.otherIncome}
          title="Otros ingresos"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-income-otherIncome',
              payload: v,
            });
          }}
        />
        <RowData
          valueText={store.income.monthlySpouseSalary}
          title="Sueldo mensual cónyuge"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-income-monthlySpouseSalary',
              payload: v,
            });
          }}
        />
        <RowData
          valueText={store.income.otherSpouseIncome}
          title="Otros ingresos cónyuge"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-income-otherSpouseIncome',
              payload: v,
            });
          }}
        />
      </div>
    </div>
  );
};

const PersonalReferences: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">
        Referencias Personales
      </div>
      <div className="">
        <RowData
          title="Nombres"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-names',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Apellidos"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-lastNames',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Parentesco"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-relationship',
              payload: text.target.value,
            });
          }}
        />
        <RowData
          title="Teléfono"
          onChange={(text: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: 'set-personalReferences-phone',
              payload: text.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const Passives: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3">
      <div className="font-black text-xl text-gray-900 my-2">Pasivos</div>
      <div className="mt-2">
        <RowData
          valueText={store.passives.debtsToPay}
          title="Cuentas por pagar"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-passives-debtsToPay',
              payload: v,
            });
          }}
        />
        <RowData
          valueText={store.passives.creditCards}
          title="Tarjetas de crédito"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-passives-creditCards',
              payload: v,
            });
          }}
        />
        <RowData
          valueText={store.passives.others}
          title="Otros"
          type="cash"
          onChange={(v: number) => {
            dispatch({
              type: 'set-passives-others',
              payload: v,
            });
          }}
        />
        <RowData
          title="Total"
          type="total"
          total={
            store.passives.debtsToPay +
            store.passives.others +
            store.passives.creditCards
          }
        />
      </div>
    </div>
  );
};

const Patrimony: FunctionComponent = () => {
  const value: any = useContext(GlobalNewCreditContext);
  const {
    store,
    dispatch,
  }: { store: NewCreditGlobalState; dispatch: DispatchNewCredit } = value;
  return (
    <div className="my-8 mx-3 w-1/2">
      <div className="font-black text-xl text-gray-900 my-2">Patrimonio</div>
      <div className="mt-2 flex">
        <RowData
          total={
            store.property.house +
            store.property.others +
            store.property.vehicle
          }
          title="Activos"
          type="total"
        />
        <RowData
          total={
            store.passives.debtsToPay +
            store.passives.others +
            store.passives.creditCards
          }
          title="Pasivos"
          type="total"
        />
      </div>
      <div className="w-1/2">
        <RowData
          total={
            store.property.house +
            store.property.others +
            store.property.vehicle +
            store.passives.debtsToPay +
            store.passives.others +
            store.passives.creditCards
          }
          title="Total"
          type="total"
        />
      </div>
    </div>
  );
};

const RowData: FunctionComponent<{
  title: string;
  //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: any;
  type?: TypeRowData;
  total?: number;
  defaultValue?: number | string;
  disabled?: boolean;
  onChangeTime?: (date: moment.Moment | null, dateString: string) => void;
  decoration?: string | null;
  viewTime?: boolean;
  valueText?: string | number | null;
}> = ({
  title,
  onChange = () => {},
  type = 'input',
  total,
  defaultValue,
  disabled = false,
  decoration = null,
  onChangeTime,
  viewTime,
  valueText = null,
}) => {
  // console.log('defaultValue', defaultValue);
  return (
    <div className="flex items-center w-full my-1">
      <div className="font-bold w-2/5">{title}:</div>
      {type === 'input' && (
        <div className="flex w-full items-center">
          <Input
            value={valueText ?? undefined}
            placeholder={title}
            className="w-2/5"
            onChange={onChange}
            disabled={disabled}
            defaultValue={defaultValue ? (defaultValue as string) : ''}
          />
          {decoration && <span className="m-2">{decoration}</span>}
        </div>
      )}
      {type === 'datePicker' && (
        <div className="flex w-full items-center">
          <DatePicker
            //defaultValue={moment(moment(), 'DD-MM-YYYY')}
            defaultValue={
              defaultValue
                ? moment(defaultValue as string, 'DD-MM-YYYY')
                : moment(moment(), 'DD-MM-YYYY')
            }
            placeholder={title}
            format="DD-MM-YYYY"
            className="w-2/5"
            disabled={disabled}
            onChange={onChange}
            value={
              valueText ? moment(valueText as string, 'DD-MM-YYYY') : undefined
            }
          />
          {decoration && <span className="m-2">{decoration}</span>}
          {viewTime && (
            <TimePicker
              style={{ marginLeft: 10 }}
              defaultValue={moment(moment().format('HH:mm'), 'HH:mm')}
              format="HH:mm"
              onChange={onChangeTime!}
            />
          )}
        </div>
      )}

      {type === 'number' && (
        <div className="flex w-full items-center">
          <InputNumber
            value={(valueText as number) ?? undefined}
            min={0}
            max={3000}
            defaultValue={defaultValue as number}
            className="w-2/5"
            disabled={disabled}
            onChange={onChange}
          />
          {decoration && <span className="m-2">{decoration}</span>}
        </div>
      )}
      {type === 'cash' && (
        <div className="flex w-full items-center">
          <InputNumber
            value={(valueText as number) ?? undefined}
            defaultValue={defaultValue ? (defaultValue as number) : 0}
            formatter={
              (value) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              // eslint-disable-next-line react/jsx-curly-newline
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            disabled={disabled}
            onChange={onChange}
          />
          {decoration && <span>{decoration}</span>}
        </div>
      )}
      {type === 'total' && (
        <div className="flex w-full my-4">{`$ ${total}`}</div>
      )}
      {type === 'percentage' && (
        <div className="flex w-full items-center">
          <InputNumber
            value={(valueText as number) ?? undefined}
            defaultValue={defaultValue ? (defaultValue as number) : 0}
            formatter={(value) => `${value}%`}
            parser={(value) => value!.replace('%', '')}
            disabled={disabled}
            onChange={onChange}
          />
          {decoration && <span>{decoration}</span>}
        </div>
      )}
    </div>
  );
};

/* const Test = (data: any) => {
  return (
    <table
      width="600"
      border="0"
      style="
      width: 600px;
      margin: 0 auto 40px;
      font-family: Arial, Helvetica, sans-serif;
    "
      cellpadding="0"
      cellspacing="0"
    >
      <tr>
        <td colspan="3">
          <p
            style="
            text-align: center;
            padding-left: 20px;
            margin: 20px 0px 10px;
          "
          >
            <img
              src="http://corpCRM.com.ec/wp-content/uploads/2018/08/01-logo-CRM-2.png"
              width="170"
              alt="CRM"
            />
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <p
            style="
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: #f89829;
          "
          >
            Solicitud de crédito
          </p>
        </td>
      </tr>
      <tr>
        <td width="50"></td>
        <td>
          <p
            style="
            text-align: left;
            font-size: 14px;
            font-weight: normal;
            padding-left: 20px;
            margin: 0;
            color: black;
          "
          >
            Por favor responda a la solicitud al final de este email.
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Concesionario:</b>{' '}
            <span>${data.applicant.concessionaire ?? ''}</span>
            <br />
            <b>Asesor Comercial:</b>{' '}
            <span>${data.applicant.businessAdvisor ?? ''}</span>
            <br />
            <b>Lugar y Fecha:</b>{' '}
            <span>${moment().format('DD-MM-YYYY HH:mm') ?? ''}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Datos del Solicitante
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Nombres:</b> <span>${data.applicant.names ?? ''}</span>
            <br />
            <b>Apellidos:</b> <span>${data.applicant.lastNames ?? ''}</span>
            <br />
            <b>cédula:</b> <span>${data.applicant.identification ?? ''}</span>
            <br />
            <b>Fecha de nacimiento:</b>{' '}
            <span>${data.applicant.dateOfBirth ?? ''}</span>
            <br />
            <b>Lugar de nacimiento:</b>{' '}
            <span>${data.applicant.placeOfBirth ?? ''}</span>
            <br />
            <b>Nacionalidad:</b>{' '}
            <span>${data.applicant.nationality ?? ''}</span>
            <br />
            <b>Estado civil:</b>{' '}
            <span>${data.applicant.civilStatus ?? ''}</span>
          </p>
        </td>
        <td>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Datos del Vehículo
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Modelo:</b> <span>${data.vehicleData.model ?? ''}</span>
            <br />
            <b>Año:</b> <span>${data.vehicleData.year ?? ''}</span>
            <br />
            <b>Valor:</b> <span>${data.vehicleData.value ?? ''}</span>
            <br />
            <b>Plazo:</b> <span>${data.vehicleData.plazo ?? ''}</span>
            <br />
            <b>Entrada:</b> <span>${data.vehicleData.entrada ?? ''}</span>
            <br />
            <b>Tasa:</b> <span>${data.vehicleData.tasa ?? ''}</span>
            <br />
            <b>Monto a financiar:</b>{' '}
            <span>${data.vehicleData.financing ?? ''}</span>
            <br />
            <b>Cuota mensual:</b>{' '}
            <span>${data.vehicleData.monthlyPayments ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Empleo / Actividad del Solicitante
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Empresa:</b> <span>${data.applicantActivity.company ?? ''}</span>
            <br />
            <b>Telefono Trabajo:</b>{' '}
            <span>${data.applicantActivity.workPhone ?? ''}</span>
            <br />
            <b>Años trabajando:</b>{' '}
            <span>${data.applicantActivity.yearsOfWork ?? ''}</span>
            <br />
            <b>Cargo:</b>{' '}
            <span>${data.applicantActivity.workPosition ?? ''}</span>
            <br />
            <b>Dirección:</b>{' '}
            <span>${data.applicantActivity.workAddress ?? ''}</span>
            <br />
            <b>Tipo de relación laboral:</b>{' '}
            <span>${data.applicantActivity.employmentRelationship ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Datos del Cónyuge
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Nombres:</b> <span>${data.spouseData.names ?? ''}</span>
            <br />
            <b>Apellidos:</b> <span>${data.spouseData.lastNames ?? ''}</span>
            <br />
            <b>Cédula:</b> <span>${data.spouseData.identification ?? ''}</span>
            <br />
            <b>Fecha de nacimiento:</b>{' '}
            <span>${data.spouseData.dateOfBirth ?? ''}</span>
            <br />
            <b>Lugar de nacimiento:</b>{' '}
            <span>${data.spouseData.placeOfBirth ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Domicilio actual
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Tipo de vivienda:</b>{' '}
            <span>${data.currentAddress.typeOfHousing ?? ''}</span>
            <br />
            <b>Dirección:</b>{' '}
            <span>${data.currentAddress.houseAddress ?? ''}</span>
            <br />
            <b>Barrio:</b>{' '}
            <span>${data.currentAddress.neighborhood ?? ''}</span>
            <br />
            <b>Parroquia:</b> <span>${data.currentAddress.parish ?? ''}</span>
            <br />
            <b>Teléfono:</b> <span>${data.currentAddress.homePhone ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Ingresos
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Sueldo mensual:</b>{' '}
            <span>${data.income.monthlySalary ?? ''}</span>
            <br />
            <b>Otros ingresos:</b> <span>${data.income.otherIncome ?? ''}</span>
            <br />
            <b>Sueldo mensual cónyugue:</b>{' '}
            <span>${data.income.monthlySpouseSalary ?? ''}</span>
            <br />
            <b>Otros ingresos cónyugue:</b>{' '}
            <span>${data.income.otherSpouseIncome ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Referencias Bancarias
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Banco:</b> <span>${data.bankReferences.bank ?? ''}</span>
            <br />
            <b>Nro de cuenta:</b>{' '}
            <span>${data.bankReferences.accountNumber ?? ''}</span>
            <br />
            <b>Tipo de cuenta:</b>{' '}
            <span>${data.bankReferences.accountType ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Referencias Personales
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Nombre:</b> <span>${data.personalReferences.names ?? ''}</span>
            <br />
            <b>Apellidos:</b>{' '}
            <span>${data.personalReferences.lastNames ?? ''}</span>
            <br />
            <b>Parentesco:</b>{' '}
            <span>${data.personalReferences.relationship ?? ''}</span>
            <br />
            <b>Teléfono:</b> <span>${data.personalReferences.phone ?? ''}</span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Activos
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Casa:</b> <span>${data.property.house ?? ''}</span>
            <br />
            <b>Vehículo:</b> <span>${data.property.vehicle ?? ''}</span>
            <br />
            <b>Otros:</b> <span>${data.property.others ?? ''}</span>
            <br />
            <b>Total:</b>{' '}
            <span>
              $
              {data.property.house +
                data.property.vehicle +
                data.property.others}
            </span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Pasivos
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Cuentas por pagar:</b>{' '}
            <span>${data.passives.debtsToPay ?? ''}</span>
            <br />
            <b>Tarjetas de crédito:</b>{' '}
            <span>${data.passives.creditCards ?? ''}</span>
            <br />
            <b>Otros:</b> <span>${data.passives.others ?? ''}</span>
            <br />
            <b>Total:</b>{' '}
            <span>
              $
              {data.passives.others +
                data.passives.debtsToPay +
                data.passives.creditCards}
            </span>
          </p>
          <p
            style="
            text-align: left;
            font-size: 15px;
            font-weight: bold;
            padding-left: 20px;
            margin: 20px 0px 10px;
            color: black;
            line-height: 20px;
          "
          >
            Patrimonio
          </p>
          <p
            style="
            text-align: left;
            font-size: 13px;
            font-weight: normal;
            padding-left: 20px;
            margin: 10px 0px 10px;
            color: gray;
            line-height: 20px;
          "
          >
            <b>Activos:</b>{' '}
            <span>
              $
              {data.property.house +
                data.property.vehicle +
                data.property.others}
            </span>
            <br />
            <b>Total:</b>{' '}
            <span>
              $
              {data.property.house +
                data.property.vehicle +
                data.property.others -
                (data.passives.others +
                  data.passives.debtsToPay +
                  data.passives.creditCards)}
            </span>
            <br />
            <b>Pasivos:</b>{' '}
            <span>
              $
              {data.passives.others +
                data.passives.debtsToPay +
                data.passives.creditCards}
            </span>
          </p>
        </td>
        <td width="50"></td>
      </tr>
    </table>
  );
}; */

export default NewCreditApplication;
