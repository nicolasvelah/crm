/* eslint-disable no-plusplus */
import React, {
  FunctionComponent,
  useReducer,
  useContext,
  useEffect,
  useState,
} from 'react';
import moment from 'moment';
import {
  Input,
  DatePicker,
  InputNumber,
  Select,
  TimePicker,
  Form,
  Button,
  Upload,
  message,
  Spin,
  Divider,
  Row,
  Col,
  Tag,
  Alert,
  Popover,
} from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  PrinterOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  EditOutlined,
} from '@ant-design/icons';
/* import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer'; */

import {
  reducer,
  initState,
  GlobalNewCreditContext,
  NewCreditGlobalState,
  DispatchNewCredit,
} from './new-credit-controller';
import Modal from '../../../../components/Modal';
import validateIdRuc from '../../../../utils/validate-id-ruc';
import ApplicantDetails from './components/ApplicantDetails';
import ApplicantActivity from './components/ApplicantActivity';
import CurrentAddress from './components/CurrentAddress';
import Concessionaire from './components/Concessionaire';
import BankReferences from './components/BankReferences';
import VehicleData from './components/VehicleData';
import SpouseData from './components/SpouseData';
import Income from './components/Income';
import PersonalReferences from './components/PersonalReferences';
import Property from './components/Property';
import Passives from './components/Passives';
import Patrimony from './components/Patrimony';
import Loading from '../../../../components/Loading';

import UploadDocument from './components/UpdateDocument';
import Client from '../../../../data/models/Client';
import { Vehicle } from '../../../../data/models/Vehicle';
import { templateNewCredit } from '../../../../utils/templates-html/template-new-credit';

import {
  CreditRequestInput as CreateCreditRequestInput,
  QuoteData,
} from '../../../../data/providers/apollo/mutations/credit';
import toPrint from '../../../../utils/templates-html/toPrintTemplate';
import Get from '../../../../utils/Get';
import CreditRepository from '../../../../data/repositories/credit-repository';
import { Dependencies } from '../../../../dependency-injection';
import QuotesRepository from '../../../../data/repositories/quotes-repository';
import QuoteFinancialRepository from '../../../../data/repositories/quote-financial-repository';
import QuoteFinancial from '../../../../data/models/Quoute-Financial';
import {
  CreditRequestInput,
  EntitiesInput,
} from '../../../../data/providers/apollo/mutations/quote-financial';
import Financial from '../../../../data/models/Financial';
import FinancialRepository from '../../../../data/repositories/financial-repository';
import SelectSucursal from './components/SelectSucursal';
import auth from '../../../../utils/auth';
import UploadFile from '../../../../components/UploadFile';
import {
  getDealerData,
  calcTotal,
  allValuesOfQuote,
} from '../../../../utils/extras';
import milisecondsToDate from '../../../../utils/milisecondsToDate';
import CommercialReferences from './components/CommercialsReferences';
import ObservationsFyI from './components/ObservationsFyI';
import LeadsQuoteFinancial from '../../../../data/models/LeadsQuoteFinancial';
import Quotes from '../../../../data/models/Quotes';
import LeadQuoteFinancialRepository from '../../../../data/repositories/leads-quote-financial-repository';
import { NOTIFICATION_TYPES } from '../../../../utils/types-notification';
import INotification from '../../../../data/models/Notification';
import { Subscription } from 'rxjs';
import SocketClient from '../../../../utils/socket-client';

interface UserNewCredit {
  name: string;
  concessionaire: string;
  sucursal: string;
  place: string;
  role: string;
}

const { Option } = Select;
/* const banks: string[] = [
  'Banco Pichincha',
  'Cooperativa Andalucia',
  'Produbanco',
  'Cooperativa JEEP',
  'Banco del Austro',
  'CRM',
]; */
const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
};

const printElem = (
  data: NewCreditGlobalState,
  concesionarioCode?: string,
  typeConcessionaire?: string,
  observationsFyI?: string,
  vehicleFleets?: Vehicle[]
) => {
  toPrint(
    templateNewCredit(
      data,
      concesionarioCode,
      typeConcessionaire,
      observationsFyI,
      vehicleFleets
    )
  );
};

const NewCreditApplication: FunctionComponent<{
  client: Client;
  vehicle?: Vehicle;
  user: UserNewCredit;
  idQuoute?: number;
  nextStep: Function;
  quoteFinan?: QuoteFinancial[];
  concesionarioCode?: string;
  idLeadsQuoteFinancial?: number;
  isFleetCreditApplication?: boolean;
  vehicles?: Vehicle[];
}> = ({
  client,
  vehicle,
  user,
  idQuoute,
  nextStep,
  quoteFinan,
  concesionarioCode,
  idLeadsQuoteFinancial,
  isFleetCreditApplication,
  vehicles,
}) => {
  const creditRepository = Get.find<CreditRepository>(Dependencies.credit);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const financialRepository = Get.find<FinancialRepository>(
    Dependencies.financial
  );
  const quouteFinancialRepository = Get.find<QuoteFinancialRepository>(
    Dependencies.quoteFinancial
  );

  const leadsQuouteFinancialRepository = Get.find<LeadQuoteFinancialRepository>(
    Dependencies.leadQuoteFinancial
  );

  const [store, dispatch] = useReducer(reducer, initState);
  const [forceRender, setForceRender] = useState<boolean>(false);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [documentFile, setDocumentFile] = useState<string | null>(null);
  const [financialEntities, setFinancialEntities] = useState<EntitiesInput[]>(
    []
  );
  const [entitiesToSend, setEntitiesToSend] = useState<EntitiesInput[]>([]);
  const [quotesFinancial, setQuoteFinancial] = useState<QuoteFinancial[]>([]);
  const [banks, setBanks] = useState<string[]>([]);
  const [sucursal, setSucursal] = useState<string | null>(null);
  const [dealer, setDealer] = useState<any | null>(null);
  /* VERSION V2 */
  const [initData, setInitData] = useState<any>({});
  const [sendToFyI, setSendToFyI] = useState<boolean>(false);

  //typo de consecionario
  const [typeCon, setTypeCon] = useState<string | undefined>(undefined);
  const [observationsFyI, setObservationsFyI] = useState<string>('');

  /// STATES OF FLEETS
  const [quotesFleet, setQuotesFleet] = useState<Quotes[] | undefined>(
    undefined
  );
  const [vehiclesFleet, setVehiclesFleet] = useState<Vehicle[] | undefined>(
    undefined
  );
  /// Suscripcion a WS
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const userAuth = auth.user;

  const getCreditGQL = async (clientId: string) => {
    //console.log('user getCreditGQL', { user, userAuth });
    //console.log('CLIENTTT --->', client);
    setLoading(true);
    const resp = await creditRepository.getCreditByClientId(clientId);
    setLoading(false);
    //console.log('respGQL Credit', resp, vehicle);
    const firtDealer = await auth.user;
    const userFromLs = getDealerData(
      firtDealer.concesionario[0],
      Number(firtDealer.sucursal[0])
    );
    setDealer(userFromLs);
    //console.log('userFromLs', userFromLs);
    if (resp) {
      const respGQL = resp.credit;
      const item: any = respGQL.personalReferences;
      const initDataForm = {
        /* APPLICANT */
        civilStatus: respGQL.applicant?.civilStatus,
        dateOfBirth: respGQL.applicant
          ? moment(
              milisecondsToDate(resp.birthdate, 'DD/MM/YYYY'),
              'DD/MM/YYYY'
            )
          : undefined,
        nationality: respGQL.applicant?.nationality,
        placeOfBirth: respGQL.applicant?.placeOfBirth,
        /* APPLICANT ACTIVITY */
        company: respGQL.applicantActivity?.company,
        employmentRelationship:
          respGQL.applicantActivity?.employmentRelationship,
        workAddress: respGQL.applicantActivity?.workAddress,
        workPhone: respGQL.applicantActivity?.workPhone,
        workPosition: respGQL.applicantActivity?.workPosition,
        yearsOfWork: respGQL.applicantActivity?.yearsOfWork,
        /* SPOUSE */
        spouseDateOfBirth: respGQL.spouseData?.dateOfBirth
          ? moment(respGQL.spouseData?.dateOfBirth, 'YYYY-MM-DD')
          : undefined,
        spouseIdentification: respGQL.spouseData?.identification,
        spouseLastNames: respGQL.spouseData?.lastNames,
        spouseNames: respGQL.spouseData?.names,
        spousePlaceOfBirth: respGQL.spouseData?.placeOfBirth,
        /* CURRENT ADDRESS */
        cellPhone: client.cellphone ?? respGQL.currentAddress?.cellPhone,
        homePhone: respGQL.currentAddress?.homePhone,
        houseAddress: respGQL.currentAddress?.houseAddress,
        neighborhood: respGQL.currentAddress?.neighborhood,
        parish: respGQL.currentAddress?.parish,
        typeOfHousing: respGQL.currentAddress?.typeOfHousing,
        province: respGQL.currentAddress?.province,
        canton: respGQL.currentAddress?.canton,
        /* INCOME */
        monthlySalary: respGQL.income?.monthlySalary,
        monthlySpouseSalary: respGQL.income?.monthlySpouseSalary,
        otherIncome: respGQL.income?.otherIncome,
        otherSpouseIncome: respGQL.income?.otherSpouseIncome,
        /* BANK REFERENCES */
        accountNumber: respGQL.bankReferences?.accountNumber,
        accountType: respGQL.bankReferences?.accountType,
        bank: respGQL.bankReferences?.bank,
        /* REFERENCES */
        personalReferencesNames: item ? item[0].names : undefined,
        personalReferencesLastName: item ? item[0].lastNames : undefined,
        personalReferencesPhone: item ? item[0].phone : undefined,
        personalReferencesRelation: item ? item[0].relationship : undefined,
        /* ACTIVOS */
        vehicle: respGQL.goods?.goodVehicle,
        house: respGQL.goods?.goodHouse,
        othersProperty: respGQL.goods?.goodOthers,
        /* PASSIVES */
        creditCards: respGQL.passives?.creditCards,
        debtsToPay: respGQL.passives?.debtsToPay,
        othersPassives: respGQL.passives?.passivesOthers,
        /* COMERCIAL REFERENCES */
        companyComercialReference: respGQL.commercialReferences?.company,
        phone: respGQL.commercialReferences?.phone,
        placeCompany: respGQL.commercialReferences?.placeCompany,
        position: respGQL.commercialReferences?.position,
        referenceName: respGQL.commercialReferences?.referenceName,
        sector: respGQL.commercialReferences?.sector,
      };
      setInitData(initDataForm);
      //console.log('user--------', user);
      const initDataStore: NewCreditGlobalState = {
        applicant: {
          names: client!.name!,
          lastNames: client!.lastName!,
          identification: client!.identification!,
          concessionaire: user ? user.concessionaire : '',
          sucursal: user ? user.sucursal : '',
          businessAdvisor: user.name,
          placeAndDate: `${user.place} ${moment().format('DD-MM-YYYY HH:mm')}`,
          dateOfBirth: milisecondsToDate(resp.birthdate, 'DD/MM/YYYY'),
          ...respGQL.applicant!,
        },
        bankReferences: respGQL.bankReferences!,
        applicantActivity: respGQL.applicantActivity!,
        currentAddress: respGQL.currentAddress!,
        income: respGQL.income!,
        passives: {
          creditCards: respGQL.passives!.creditCards ?? 0,
          debtsToPay: respGQL.passives!.debtsToPay ?? 0,
          others: respGQL.passives!.passivesOthers ?? 0,
        },
        personalReferences: item[0],
        property: {
          house: respGQL.goods!.goodHouse,
          others: respGQL.goods!.goodOthers,
          vehicle: respGQL.goods!.goodVehicle,
        },
        spouseData: respGQL.spouseData!,
        vehicleData: {
          brand: vehicle?.brand ?? null,
          entrada: vehicle?.entrada ?? 0,
          description: vehicle?.description ?? null,
          financing: vehicle?.financing ?? 0,
          model: vehicle?.model ?? null,
          monthlyPayments: vehicle?.monthlyPayments ?? 0,
          plazo: vehicle?.plazo ?? 0,
          tasa: vehicle?.tasa ?? 0,
          value: vehicle?.value ?? 0,
          totalServices: vehicle?.totalServices ?? 0,
          totalAccesories: vehicle?.totalAccesories ?? 0,
          year: vehicle?.year ?? null,
          valueExtraEsKit: vehicle?.valueExtraEsKit ?? 0,
        },
        commercialReferences: {
          company: respGQL.commercialReferences!.company!,
          sector: respGQL.commercialReferences!.sector!,
          phone: respGQL.commercialReferences!.phone!,
          placeCompany: respGQL.commercialReferences!.placeCompany!,
          referenceName: respGQL.commercialReferences!.referenceName!,
          position: respGQL.commercialReferences!.position!,
        },
      };
      dispatch({
        type: 'set-initState',
        payload: initDataStore,
      });
      return true;
    }
    setEdit(true);
    return false;
  };

  /// NOTIFICATION
  const onNotificationListener = (noti: INotification) => {
    //console.log('noti', noti);
    // noti es una notificacion desde el ws
    if (noti.type === NOTIFICATION_TYPES.RESPONSE_CREDIT_APPLICATION) {
      try {
        //console.log('noti', noti);
        //console.log('lead', lead);
        if (noti.content.idQuoteFinancial) {
          setQuoteFinancial((prevState) => {
            //console.log('prevState -->', prevState)
            const indexQF = prevState.findIndex(
              (qf) => qf.id === noti.content.idQuoteFinancial
            );
            //console.log('indexQF -->', indexQF);
            if (indexQF > -1) {
              const copy = [...prevState];
              copy[indexQF].opinion = noti?.content?.opinion ?? null;
              copy[indexQF].responseBank = noti?.content?.responseBank ?? null;
              return copy;
            }
            return prevState;
          });
        }
      } catch (error) {
        console.log('Error notificacion', error.message);
      }
    }
  };

  const getActualQuote = async () => {
    let quoOrFleetAct: Quotes | LeadsQuoteFinancial | null = null;
    if (!isFleetCreditApplication && idQuoute) {
      quoOrFleetAct = await quouteRepository.getQuoteById(idQuoute);
      //const quoAct = client.leads[0].quotes.find((quo) => quo.id === idQuoute);
      //console.log({ quoAct });
    } else if (isFleetCreditApplication && idLeadsQuoteFinancial) {
      quoOrFleetAct =
        await leadsQuouteFinancialRepository.getLeadsQuoteFinancialById(
          idLeadsQuoteFinancial
        );
    }
    /* console.log('quoOrFleetAct --->', {
      quoOrFleetAct,
      isFleetCreditApplication,
    }); */
    //console.log('--->', {quoOrFleetAct, isFleetCreditApplication });
    if (quoOrFleetAct) {
      if (quoOrFleetAct.sendToFyI) {
        setSendToFyI(true);
      }
      if (quoOrFleetAct.quoteFinancial) {
        //console.log('SETTEO 394 -->', quoOrFleetAct.quoteFinancial);
        setQuoteFinancial(quoOrFleetAct.quoteFinancial);
      }

      if (
        !isFleetCreditApplication &&
        (quoOrFleetAct as Quotes).documentCredit
      ) {
        /* console.log(
          'Entro !isFleetCreditApplication -->',
          (quoOrFleetAct as LeadsQuoteFinancial).quotes
        ); */
        setDocumentFile((quoOrFleetAct as Quotes).documentCredit!);
      } else if (
        isFleetCreditApplication &&
        (quoOrFleetAct as LeadsQuoteFinancial).documents
      ) {
        /* console.log(
          'Entro isFleetCreditApplication',
          (quoOrFleetAct as LeadsQuoteFinancial).quotes
        ); */
        setDocumentFile((quoOrFleetAct as LeadsQuoteFinancial).documents!);
      }

      if (isFleetCreditApplication) {
        setQuotesFleet(
          (quoOrFleetAct as LeadsQuoteFinancial).quotes ?? undefined
        );
        if ((quoOrFleetAct as LeadsQuoteFinancial).quotes) {
          const vehiclesF: Vehicle[] =
            (quoOrFleetAct as LeadsQuoteFinancial)!.quotes!.map((quo) => {
              const dataVal = allValuesOfQuote(quo);
              return {
                brand: dataVal.brand,
                description: dataVal.version,
                model: dataVal.model,
                value: dataVal.pvp!,
                totalServices: dataVal.servicesValue,
                totalAccesories: dataVal.accesoriesValue,
                year: dataVal.year,
                entrada: dataVal.entry,
                financing: dataVal.financingValue,
                monthlyPayments: dataVal.monthly,
                plazo: dataVal.months,
                tasa: dataVal.rate,
                valueExtraEsKit: dataVal.valueEsKit,
              };
            });
          setVehiclesFleet(vehiclesF.length > 0 ? vehiclesF : undefined);
        }
      }

      if (quoOrFleetAct.leads) {
        setSucursal(quoOrFleetAct.leads.sucursal?.code ?? null);
        //console.log('ActualSucursal', quoOrFleetAct.leads.sucursal?.code);
      }
      setTypeCon(quoOrFleetAct.leads?.user?.typeConcessionaire?.type);
      setObservationsFyI(
        quoOrFleetAct.observationsFyI
          ? quoOrFleetAct.observationsFyI
          : observationsFyI
      );
    }

    if (quoteFinan) {
      //console.log('SETTEO 512 -->', quoteFinan);
      setQuoteFinancial(quoteFinan);
    }
    setSubscription(
      SocketClient.instance.onNotificationStream.subscribe(
        onNotificationListener
      )
    );
  };

  useEffect(() => {
    const getData = async () => {
      const resp = await getCreditGQL(client.identification!);
      if (!resp) {
        dispatch({
          type: 'set-applicant',
          payload: {
            names: client.name,
            lastNames: client.lastName,
            identification: client.identification,
            concessionaire: user.concessionaire,
            sucursal: user.sucursal,
            businessAdvisor: user.name,
            placeAndDate: `${user.place} ${moment().format(
              'DD-MM-YYYY HH:mm'
            )}`,
            cellPhone: client.cellphone,
          },
        });
        dispatch({
          type: 'set-vehicleData',
          payload: vehicle,
        });
      }
      await getActualQuote();
      if (!resp) {
        setInitData({ cellPhone: client.cellphone });
      }
      setForceRender((prevState) => !prevState);
      //console.log('QF GET DATA -->', quotesFinancial);
    };
    getData();
  }, []);

  const getBanks = async () => {
    if (sucursal) {
      setLoading(true);
      const respEntities = await financialRepository.getFinancialsBySucursal(
        sucursal as string,
        'FINANCIAL'
      );
      //console.log('rrespEntities', respEntities);
      if (respEntities) {
        /* const filterRespEntities = respEntities.filter(
          (entity) => entity.typeEntity === 'FINANCIAL'
        ); */
        //console.log({ respEntities });
        const newBanks: string[] = respEntities.map(
          (bank) => bank.nameEntityFinancial!
        );
        const finEntities: EntitiesInput[] = respEntities.map((bank) => ({
          nameEntityFinancial: bank.nameEntityFinancial!,
          idSucursal: bank.idSucursal!,
          email: bank.emailcontact!,
        }));
        setFinancialEntities(finEntities);
        //console.log(newBanks);
        setBanks(newBanks);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAuth && userAuth.role === 'F&I') {
      getBanks();
    }
  }, [sucursal]);

  const sendToFyIForReview = async () => {
    //console.log({ documentFile });
    //return;
    try {
      setLoading(true);
      let respDoc: { ok: boolean; message: string } = {
        ok: false,
        message: '',
      };
      if (!isFleetCreditApplication && idQuoute) {
        respDoc = await quouteRepository.sendToFyI(idQuoute);
      } else if (isFleetCreditApplication && idLeadsQuoteFinancial) {
        respDoc = await quouteRepository.sendToFyI(
          idLeadsQuoteFinancial,
          isFleetCreditApplication
        );
      }

      setLoading(false);
      if (respDoc.ok) {
        message.success('Solicitud enviada para revisión');
        setSendToFyI(true);
      } else {
        message.error(`Error al enviar solicitud. ${respDoc.message}`);
      }
    } catch (error) {
      //console.log('Error en:', error.message);
      message.error('Error al enviar solicitud');
      setLoading(false);
    }
  };

  const onFinish = async (valueForm: any) => {
    //const onFinish = async (valueForm: NewCreditGlobalState) => {
    //console.log('valueForm', valueForm);
    //return;
    try {
      setLoading(true);
      const dataToSend: CreateCreditRequestInput = {
        clientId: client!.identification!,
        applicant: {
          civilStatus: valueForm.civilStatus,
          dateOfBirth: valueForm.dateOfBirth.format('YYYY-MM-DD'),
          nationality: valueForm.nationality,
          placeOfBirth: valueForm.placeOfBirth!,
        },
        applicantActivity: {
          company: valueForm.company,
          employmentRelationship: valueForm.employmentRelationship,
          workAddress: valueForm.workAddress,
          workPhone: valueForm.workPhone,
          workPosition: valueForm.workPosition,
          yearsOfWork: valueForm.yearsOfWork,
        },
        currentAddress: {
          cellPhone: valueForm.cellPhone,
          homePhone: valueForm.homePhone,
          houseAddress: valueForm.houseAddress,
          neighborhood: valueForm.neighborhood,
          parish: valueForm.parish!,
          typeOfHousing: valueForm.typeOfHousing,
          province: valueForm.province,
          canton: valueForm.canton,
        },
        bankReferences: {
          accountNumber: valueForm.accountNumber,
          accountType: valueForm.accountType,
          bank: valueForm.bank,
        },
        spouseData: {
          dateOfBirth:
            valueForm.civilStatus === 'Casado/a'
              ? valueForm.spouseDateOfBirth.format('YYYY-MM-DD')
              : null,
          identification:
            valueForm.civilStatus === 'Casado/a'
              ? valueForm.spouseIdentification
              : null,
          lastNames:
            valueForm.civilStatus === 'Casado/a'
              ? valueForm.spouseLastNames
              : null,
          names:
            valueForm.civilStatus === 'Casado/a' ? valueForm.spouseNames : null,
          placeOfBirth:
            valueForm.civilStatus === 'Casado/a'
              ? valueForm.spousePlaceOfBirth
              : null,
        },
        income: {
          monthlySalary: valueForm.monthlySalary,
          monthlySpouseSalary:
            valueForm.civilStatus === 'Casado/a'
              ? valueForm.monthlySpouseSalary
              : null,
          otherIncome: valueForm.otherIncome,
          otherSpouseIncome:
            valueForm.civilStatus === 'Casado/a'
              ? valueForm.otherSpouseIncome
              : null,
        },
        personalReferences: {
          lastNames: valueForm.personalReferencesLastName,
          names: valueForm.personalReferencesNames,
          phone: valueForm.personalReferencesPhone,
          relationship: valueForm.personalReferencesRelation,
        },
        goods: {
          goodHouse: valueForm.house,
          goodOthers: valueForm.othersProperty,
          goodVehicle: valueForm.vehicle,
        },
        passives: {
          creditCards: valueForm.creditCards ?? 0,
          debtsToPay: valueForm.debtsToPay ?? 0,
          passivesOthers: valueForm.othersPassives ?? 0,
        },
        commercialReferences: {
          company: valueForm.companyComercialReference ?? null,
          phone: valueForm.phone ?? null,
          placeCompany: valueForm.placeCompany ?? null,
          position: valueForm.position ?? null,
          referenceName: valueForm.referenceName ?? null,
          sector: valueForm.sector ?? null,
        },
      };
      //console.log('dataToSend', dataToSend);
      ////// AQUI FLEET ERROR
      const quoteData: QuoteData = {
        id: idQuoute ?? idLeadsQuoteFinancial ?? 0,
        observationsFyI,
      };
      console.log('quoteData --->', quoteData);
      const respGQL = await creditRepository.insertOrUpdateCredit(
        dataToSend,
        quoteData,
        isFleetCreditApplication
      );

      //const respGQL:any = false;
      //console.log('respGQL', respGQL);
      if (respGQL) {
        if (sendToFyI) {
          message.success('Crédito actualizado');
        }

        const newStore: NewCreditGlobalState = {
          applicant: {
            civilStatus: dataToSend.applicant.civilStatus,
            dateOfBirth: dataToSend.applicant.dateOfBirth,
            nationality: dataToSend.applicant.nationality,
            placeOfBirth: dataToSend.applicant.placeOfBirth,
            businessAdvisor: store.applicant.businessAdvisor,
            concessionaire: user.concessionaire,
            sucursal: user.sucursal,
            identification: store.applicant.identification,
            lastNames: store.applicant.lastNames,
            names: store.applicant.names,
            placeAndDate: store.applicant.placeAndDate,
          },
          applicantActivity: dataToSend.applicantActivity,
          //currentAddress: dataToSend.currentAddress,
          currentAddress: dataToSend.currentAddress,
          bankReferences: dataToSend.bankReferences,
          spouseData: dataToSend.spouseData,
          income: dataToSend.income,
          personalReferences: dataToSend.personalReferences,
          property: {
            house: dataToSend.goods.goodHouse,
            others: dataToSend.goods.goodOthers,
            vehicle: dataToSend.goods.goodVehicle,
          },
          passives: {
            creditCards: dataToSend.passives.creditCards,
            debtsToPay: dataToSend.passives.debtsToPay,
            others: dataToSend.passives.passivesOthers,
          },
          commercialReferences: dataToSend.commercialReferences,
          vehicleData: store.vehicleData,
        };
        //console.log({ newStore });
        dispatch({
          type: 'set-initState',
          payload: newStore,
        });
        if (!sendToFyI) {
          await sendToFyIForReview();
        }

        setEdit(false);
      } else {
        message.error('Error al guardar Crédito');
      }
      setLoading(false);

      //printElem(store);
    } catch (error) {
      //console.log('Error creditRepository.insertOrUpdateCredit', error.message);
      setLoading(false);
      message.error('Error al guardar Crédito');
    }
  };

  const saveDocument = async (document?: string): Promise<boolean> => {
    //console.log({ documentFile });
    //return;
    try {
      setLoading(true);
      console.log({
        doc: document ?? documentFile!,
        id: idQuoute ?? idLeadsQuoteFinancial ?? -1,
        isFleetCreditApplication,
      });
      ////// AQUI FLEET ERROR
      const respDoc = await quouteRepository.saveDocument(
        document ?? documentFile!,
        idQuoute ?? idLeadsQuoteFinancial ?? -1,
        isFleetCreditApplication
      );
      setLoading(false);
      if (respDoc) {
        message.success('Documento guardado');
        return true;
      }
      message.error('Error al guardar documento');
      return false;
    } catch (error) {
      //console.log('Error en:', error.message);
      message.error('Error al guardar documento');
      setLoading(false);
      return false;
    }
  };

  const sendToEntities = async (data: NewCreditGlobalState) => {
    try {
      setLoading(true);
      const creditRequest: CreditRequestInput = {
        clientId: client!.identification!,
        applicant: {
          civilStatus: data.applicant.civilStatus!,
          dateOfBirth: data.applicant.dateOfBirth!,
          nationality: data.applicant.nationality!,
          placeOfBirth: data.applicant.placeOfBirth!,
          placeAndDate: data.applicant.placeAndDate!,
          concessionaire: user ? user.concessionaire : '',
          sucursal: user ? user.sucursal : '',
        },
        applicantActivity: {
          company: data.applicantActivity.company!,
          employmentRelationship:
            data.applicantActivity.employmentRelationship!,
          workAddress: data.applicantActivity.workAddress!,
          workPhone: data.applicantActivity.workPhone!,
          workPosition: data.applicantActivity.workPosition!,
          yearsOfWork: data.applicantActivity.yearsOfWork!,
        },
        currentAddress: {
          cellPhone: data.currentAddress.cellPhone!,
          homePhone: data.currentAddress.homePhone!,
          houseAddress: data.currentAddress.houseAddress!,
          neighborhood: data.currentAddress.neighborhood!,
          parish: data.currentAddress.parish!,
          typeOfHousing: data.currentAddress.typeOfHousing!,
          province: data.currentAddress.province!,
          canton: data.currentAddress.canton!,
        },
        bankReferences: {
          accountNumber: data.bankReferences.accountNumber!,
          accountType: data.bankReferences.accountType!,
          bank: data.bankReferences.bank!,
        },
        spouseData: {
          dateOfBirth: data.spouseData.dateOfBirth!,
          identification: data.spouseData.identification!,
          lastNames: data.spouseData.lastNames!,
          names: data.spouseData.names!,
          placeOfBirth: data.spouseData.placeOfBirth!,
        },
        income: {
          monthlySalary: data.income.monthlySalary!,
          monthlySpouseSalary: data.income.monthlySpouseSalary!,
          otherIncome: data.income.otherIncome!,
          otherSpouseIncome: data.income.otherSpouseIncome!,
        },
        personalReferences: {
          lastNames: data.personalReferences.lastNames!,
          names: data.personalReferences.names!,
          phone: data.personalReferences.phone!,
          relationship: data.personalReferences.relationship!,
        },
        goods: {
          goodHouse: data.property.house,
          goodOthers: data.property.others,
          goodVehicle: data.property.vehicle,
        },
        passives: {
          creditCards: data.passives.creditCards,
          debtsToPay: data.passives.debtsToPay,
          passivesOthers: data.passives.others,
        },
        commercialReferences: data.commercialReferences,
        vehicleData: {
          entrada: data.vehicleData.entrada as number,
          financing: data.vehicleData.financing as number,
          model: data.vehicleData.model!,
          brand: data.vehicleData.brand!,
          description: data.vehicleData.description!,
          monthlyPayments: data.vehicleData.monthlyPayments as number,
          plazo: data.vehicleData.plazo as number,
          tasa: data.vehicleData.tasa as number,
          totalServices: data.vehicleData.totalServices as number,
          totalAccesories: data.vehicleData.totalAccesories as number,
          value: data.vehicleData.value as number,
          year: data.vehicleData.year!,
          valueExtraEsKit: vehicle?.valueExtraEsKit ?? 0,
        },
      };
      //console.log('creditRequest', { creditRequest, data });
      /* if (data) {
        setLoading(false);
        return;
      } */

      ////// AQUI FLEET ERROR
      const respFinancial =
        await quouteFinancialRepository.sendCreditToEntities(
          //financialEntities,
          entitiesToSend,
          idLeadsQuoteFinancial ?? idQuoute ?? 0,
          creditRequest,
          isFleetCreditApplication ?? null,
          vehiclesFleet ?? null
        );
      //console.log('respFinancial', respFinancial);
      if (respFinancial) {
        const qF = [...quotesFinancial];
        respFinancial.forEach((element) => {
          if (element.sendOk && element.quoteFinancial) {
            message.success(
              `Solicitud enviada a la financiera ${element.quoteFinancial?.financial?.nameEntityFinancial}`
            );
            qF.push(element.quoteFinancial!);
          } else if (!element.sendOk && element.quoteFinancial) {
            message.warning(element.message, 10);
          } else if (!element.sendOk && element.quoteFinancial) {
            message.error(element.message);
          }
        });
        setQuoteFinancial(qF);
      } else {
        message.error('Error al enviar solicitudes');
      }
      setLoading(false);
    } catch (error) {
      message.error('Error al enviar solicitudes');
      setLoading(false);
    }
  };

  const isOkForm = (data: NewCreditGlobalState): boolean => {
    //console.log('Datos', data);
    const keysNewCredit = Object.keys(data);
    //console.log({ keysNewCredit });
    const dataReser: any = data;
    for (let index = 0; index < keysNewCredit.length; index++) {
      const categoryString: any = keysNewCredit[index];
      const jsonCategory = dataReser[categoryString];

      const keysCategory = Object.keys(jsonCategory);
      //console.log({ categoryString, jsonCategory, keysCategory });

      if (
        data.applicant.civilStatus !== 'Casado/a' &&
        categoryString === 'spouseData'
      ) {
        break;
      }
      if (categoryString === 'commercialReferences') {
        break;
      }

      if (!!vehiclesFleet && categoryString === 'vehicleData') {
        break;
      }

      for (let index2 = 0; index2 < keysCategory.length; index2++) {
        const paramCategory = keysCategory[index2];
        const element = jsonCategory[paramCategory];
        //console.log({ paramCategory, element });
        if (
          data.applicant.civilStatus !== 'Casado/a' &&
          (paramCategory === 'monthlySpouseSalary' ||
            paramCategory === 'otherSpouseIncome')
        ) {
          break;
        }
        //console.log(categoryString, paramCategory, element);
        if (element === null) {
          return false;
        }
      }
    }
    return true;
  };

  const sendQuoteFinancialsAgain = async () => {
    setLoading(true);
    const okForm = isOkForm(store);
    const data = store;
    if (okForm) {
      const creditRequest: CreditRequestInput = {
        clientId: client!.identification!,
        applicant: {
          civilStatus: data.applicant.civilStatus!,
          dateOfBirth: data.applicant.dateOfBirth!,
          nationality: data.applicant.nationality!,
          placeOfBirth: data.applicant.placeOfBirth!,
          placeAndDate: data.applicant.placeAndDate!,
          concessionaire: user ? user.concessionaire : '',
          sucursal: user ? user.sucursal : '',
        },
        applicantActivity: {
          company: data.applicantActivity.company!,
          employmentRelationship:
            data.applicantActivity.employmentRelationship!,
          workAddress: data.applicantActivity.workAddress!,
          workPhone: data.applicantActivity.workPhone!,
          workPosition: data.applicantActivity.workPosition!,
          yearsOfWork: data.applicantActivity.yearsOfWork!,
        },
        currentAddress: {
          cellPhone: data.currentAddress.cellPhone!,
          homePhone: data.currentAddress.homePhone!,
          houseAddress: data.currentAddress.houseAddress!,
          neighborhood: data.currentAddress.neighborhood!,
          parish: data.currentAddress.parish!,
          typeOfHousing: data.currentAddress.typeOfHousing!,
          province: data.currentAddress.province!,
          canton: data.currentAddress.canton!,
        },
        bankReferences: {
          accountNumber: data.bankReferences.accountNumber!,
          accountType: data.bankReferences.accountType!,
          bank: data.bankReferences.bank!,
        },
        spouseData: {
          dateOfBirth: data.spouseData.dateOfBirth!,
          identification: data.spouseData.identification!,
          lastNames: data.spouseData.lastNames!,
          names: data.spouseData.names!,
          placeOfBirth: data.spouseData.placeOfBirth!,
        },
        income: {
          monthlySalary: data.income.monthlySalary!,
          monthlySpouseSalary: data.income.monthlySpouseSalary!,
          otherIncome: data.income.otherIncome!,
          otherSpouseIncome: data.income.otherSpouseIncome!,
        },
        personalReferences: {
          lastNames: data.personalReferences.lastNames!,
          names: data.personalReferences.names!,
          phone: data.personalReferences.phone!,
          relationship: data.personalReferences.relationship!,
        },
        goods: {
          goodHouse: data.property.house,
          goodOthers: data.property.others,
          goodVehicle: data.property.vehicle,
        },
        passives: {
          creditCards: data.passives.creditCards,
          debtsToPay: data.passives.debtsToPay,
          passivesOthers: data.passives.others,
        },
        commercialReferences: data.commercialReferences,
        vehicleData: {
          entrada: data.vehicleData.entrada as number,
          financing: data.vehicleData.financing as number,
          model: data.vehicleData.model!,
          brand: data.vehicleData.brand!,
          description: data.vehicleData.description!,
          monthlyPayments: data.vehicleData.monthlyPayments as number,
          plazo: data.vehicleData.plazo as number,
          tasa: data.vehicleData.tasa as number,
          totalServices: data.vehicleData.totalServices as number,
          totalAccesories: data.vehicleData.totalAccesories as number,
          value: data.vehicleData.value as number,
          year: data.vehicleData.year!,
          valueExtraEsKit: data.vehicleData.valueExtraEsKit,
        },
      };

      const idsQuoteFinancials = quotesFinancial
        .filter((qF) => !qF.withFile && !qF.responseBank)
        .map((qFinan) => qFinan.id!);
      const respFinancial = await quouteFinancialRepository.sendQuoteFinalcials(
        idsQuoteFinancials,
        creditRequest
      );
      //console.log('respFinancial', respFinancial);
      if (respFinancial) {
        respFinancial
          .filter((res) => !res.ok)
          .forEach((element) => {
            const actualQF = quotesFinancial.find(
              (qF) => qF.id === element.idQuoteFinancial
            );
            if (actualQF) {
              message.error(
                `La solicitud a la financiera ${actualQF.financial?.nameEntityFinancial} no pudo ser enviada`
              );
            }
          });
        setQuoteFinancial((prevState) => {
          const copia = [...prevState];
          respFinancial.forEach((res) => {
            const index = copia.findIndex(
              (qF) => qF.id === res.idQuoteFinancial && res.ok
            );
            if (index > -1) {
              message.success(
                `La solicitud a la financiera ${copia[index].financial?.nameEntityFinancial} enviada correctamente`
              );
              copia[index].withFile = true;
            }
          });
          return copia;
        });
      }
    } else {
      //console.log('Fallo OK');
      message.error('Formulario incompleto');
    }
    setLoading(false);
  };

  if (!client) {
    return <div>Cliente No existente</div>;
  }
  if (!forceRender) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(255, 255, 255, 0.6)',
        }}
      >
        <Spin />
      </div>
    );
  }

  const qfSentWithoutDocument = quotesFinancial.filter(
    (qF) => !qF.withFile && !qF.responseBank
  );

  return (
    <GlobalNewCreditContext.Provider
      value={{
        store,
        dispatch,
        documentFile,
        setDocumentFile,
        financialEntities,
        setFinancialEntities,
        edit,
        setEdit,
      }}
    >
      <div style={{ position: 'relative' }}>
        {forceRender && (
          <Form
            initialValues={initData}
            onFinish={onFinish}
            onFinishFailed={(errorInfo) => {
              //console.log('errorInfo', errorInfo);
            }}
          >
            <div>
              <DocumentToPrint
                quotesFinancial={quotesFinancial}
                sendToFyI={sendToFyI}
                observationsFyI={observationsFyI}
                setObservationsFyI={setObservationsFyI}
                client={client}
                quotesFleet={quotesFleet}
                vehiclesFleet={vehiclesFleet}
              />
              {/* IMPRESION DE DOCUMENTOS */}
              <div className="my-5">
                {!edit ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                ) : (
                  <>
                    {!sendToFyI && (
                      <Alert
                        message="Debes llenar los datos del cliente para poder imprimir la solicitud y notificar a F&I"
                        type="info"
                        showIcon
                        className="my-4"
                      />
                    )}
                  </>
                )}
                {!sendToFyI && (
                  <Form.Item className="text-center">
                    <Button
                      style={{ backgroundColor: '#1890ff' }}
                      htmlType="submit"
                      type="primary"
                      size="large"
                    >
                      Notificar a F&I
                    </Button>
                  </Form.Item>
                )}
                {edit && sendToFyI && (
                  <div style={{ display: 'flex', margin: 'auto' }}>
                    <div style={{ display: 'flex', margin: 'auto' }}>
                      <Form.Item className="text-center">
                        <Button
                          style={{ backgroundColor: '#1890ff' }}
                          htmlType="submit"
                          type="primary"
                        >
                          Guardar
                        </Button>
                      </Form.Item>
                      <Button
                        style={{ marginLeft: 5 }}
                        danger
                        onClick={() => setEdit(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
                <Divider />

                <div>
                  <Button
                    type="primary"
                    disabled={edit}
                    onClick={() => {
                      //console.log('Print Store', store);
                      printElem(
                        store,
                        concesionarioCode,
                        typeCon,
                        observationsFyI,
                        vehiclesFleet
                      );
                    }}
                    icon={<PrinterOutlined />}
                  >
                    Imprimir
                  </Button>

                  <Tag className="ml-2" color="warning">
                    Recuerda que el cliente debe firmar una copia de la
                    solicitud.
                  </Tag>
                </div>
              </div>
              <Divider />
              {/* CARGA DE DOCUMENTOS */}
              <div className="my-6">
                <div>Carga aquí una foto del documento firmado</div>
                <Tag className="mb-1" color="warning">
                  Puedes subir imagenes PNG o JPEG y documentos PDF no mayores a
                  3MB
                </Tag>

                {qfSentWithoutDocument.length > 0 && !documentFile && (
                  <>
                    <br />
                    <Tag icon={<ExclamationCircleOutlined />} color="error">
                      Existen Solicitudes que han sido enviadas sin el documento
                      firmado. Sube el documento firmado.
                    </Tag>
                  </>
                )}

                <div className="flex justify-start mb-4">
                  <UploadFile
                    id="document-credit-application"
                    label={user.role === 'F&I' ? 'Solicitud de Crédito  ' : ''}
                    onFileUploaded={async (url) => {
                      //console.log(url);
                      const resp = await saveDocument(url!);
                      if (resp) {
                        setDocumentFile(url);
                      }
                    }}
                    uploadedFile={documentFile}
                  />
                </div>

                {userAuth && userAuth.role !== 'F&I' && sendToFyI && (
                  <Alert
                    message="Esta solicitud ya ha sido notificada a F&I"
                    type="info"
                    showIcon
                    className="my-4"
                  />
                )}
              </div>

              {/*userAuth && userAuth.dealer && (
                <SelectSucursal
                  setSucursal={setSucursal}
                  dealer={userAuth.dealer}
                />
              )*/}
              {/* <Button onClick={() => //console.log({ sucursal })}>CLICK ME</Button> */}

              {/* SOLICITUDES ENVIADAS SIN DOCUMENTO */}
              {userAuth &&
                userAuth.role === 'F&I' &&
                documentFile &&
                qfSentWithoutDocument.length > 0 && (
                  <>
                    <Divider />
                    <div className="my-5 p-5">
                      <Alert
                        message="Estas solicitudes fueron enviadas sin el documento firmado. ¿Deseas enviar estas solicitudes con el documento nuevamente?"
                        type="info"
                        showIcon
                        className="my-4"
                      />
                      <div>
                        {qfSentWithoutDocument.map((qFinan, index) => (
                          <Tag
                            key={index}
                            icon={<CloseCircleOutlined />}
                            style={{ marginRight: 5 }}
                            color="warning"
                          >
                            {qFinan.financial!.nameEntityFinancial} No:
                            {qFinan.id}
                          </Tag>
                        ))}
                      </div>
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Button
                          style={{ marginTop: 10 }}
                          onClick={() => sendQuoteFinancialsAgain()}
                        >
                          Enviar Nuevamente
                        </Button>
                      </div>
                    </div>
                  </>
                )}

              <Divider />
              {/* SELECCION DE BANCOS  */}
              {userAuth && userAuth.role === 'F&I' && (
                <div className="my-5 p-5 rounded-md shadow-lg">
                  <div>
                    Selecciona las entidades a las que quieres enviar la
                    solicitud de crédito.
                  </div>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Selecciona una entidad financiera"
                    //defaultValue={financialEntities.map((fi)=>(fi.nameEntityFinancial))}
                    onChange={(value: string[]) => {
                      //console.log({ value });
                      const switchEntities: EntitiesInput[] = [];
                      value.forEach((valBank) => {
                        const entityFin = financialEntities.find(
                          (entity) => entity.nameEntityFinancial === valBank
                        );
                        if (entityFin) {
                          switchEntities.push(entityFin);
                        }
                      });
                      //console.log('switchEntities', switchEntities);
                      setEntitiesToSend(switchEntities);
                      //setFinancialEntities(value)
                    }}
                    disabled={!sucursal}
                  >
                    {banks.map((bank: string, index: number) => (
                      <Option value={bank} label={bank} key={`bank_${index}`}>
                        <div className="demo-option-label-item">{bank}</div>
                      </Option>
                    ))}
                  </Select>
                  <br />
                  <Button
                    disabled={
                      financialEntities.length === 0 ||
                      !sucursal ||
                      entitiesToSend.length === 0
                    }
                    style={{ marginTop: 10 }}
                    type="primary"
                    onClick={async () => {
                      const okForm = isOkForm(store);
                      //console.log('okForm -->', okForm);
                      if (okForm) {
                        //console.log('TODO OK');
                        await sendToEntities(store);
                      } else {
                        //console.log('Fallo OK');
                        message.error('Formulario incompleto');
                      }
                    }}
                  >
                    Enviar a Entidades
                  </Button>
                </div>
              )}
            </div>
          </Form>
        )}
        {/* <Loading visible={loading} /> */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',

              backgroundColor: 'rgb(255, 255, 255, 0.6)',
            }}
          >
            <Spin />
          </div>
        )}
      </div>
      <Modal display={displayModal} onClose={() => setDisplayModal(false)} />
    </GlobalNewCreditContext.Provider>
  );
};

const DocumentToPrint: FunctionComponent<{
  quotesFinancial: QuoteFinancial[];
  sendToFyI: boolean;
  observationsFyI: string;
  setObservationsFyI: Function;
  client: Client;
  quotesFleet?: Quotes[];
  vehiclesFleet?: Vehicle[];
}> = ({
  quotesFinancial,
  sendToFyI,
  observationsFyI,
  setObservationsFyI,
  client,
  quotesFleet,
  vehiclesFleet,
}) => {
  const value: any = useContext(GlobalNewCreditContext);
  const storeCredit: NewCreditGlobalState = value.store;

  return (
    <div id="document-to-print" style={{ position: 'relative' }}>
      {quotesFinancial.length > 0 && (
        <div>
          <Divider />
          <h3>Solitudes enviadas a entidades Financieras</h3>
          {quotesFinancial.map((qFinan, index) => {
            if (qFinan.opinion) {
              return (
                <Popover
                  content={<div>{qFinan.opinion}</div>}
                  trigger="hover"
                  key={index}
                >
                  <Tag
                    icon={
                      !qFinan.responseBank ? (
                        <ClockCircleOutlined />
                      ) : qFinan.responseBank &&
                        (qFinan.responseBank === 'APPROBED' ||
                          qFinan.responseBank === 'PREAPPROBED') ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                    style={{ marginRight: 5 }}
                    color={
                      !qFinan.responseBank
                        ? 'warning'
                        : qFinan.responseBank &&
                          qFinan.responseBank === 'APPROBED'
                        ? 'success'
                        : qFinan.responseBank === 'PREAPPROBED'
                        ? 'processing'
                        : 'error'
                    }
                  >
                    {qFinan.financial!.nameEntityFinancial} No:{qFinan.id}
                    <MessageOutlined style={{ marginLeft: 10 }} />
                  </Tag>
                </Popover>
              );
            }
            return (
              <Tag
                key={index}
                icon={
                  !qFinan.responseBank ? (
                    <ClockCircleOutlined />
                  ) : qFinan.responseBank &&
                    (qFinan.responseBank === 'APPROBED' ||
                      qFinan.responseBank === 'PREAPPROBED') ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )
                }
                style={{ marginRight: 5 }}
                color={
                  !qFinan.responseBank
                    ? 'warning'
                    : qFinan.responseBank && qFinan.responseBank === 'APPROBED'
                    ? 'success'
                    : qFinan.responseBank === 'PREAPPROBED'
                    ? 'processing'
                    : 'error'
                }
              >
                {qFinan.financial!.nameEntityFinancial} No:{qFinan.id}
              </Tag>
            );
          })}
        </div>
      )}
      <Row>
        <Col md={24}>
          <Concessionaire
            clientPhone={client?.cellphone ?? undefined}
            isFleet={!!quotesFleet}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ApplicantDetails />
        </Col>
        <Col md={12}>
          <VehicleData vehiclesFleet={vehiclesFleet} />
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <ApplicantActivity />
        </Col>
        <Col md={12}>
          {storeCredit.applicant.civilStatus === 'Casado/a' && <SpouseData />}
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <CurrentAddress />
        </Col>
        <Col md={12}>
          <Income />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <CommercialReferences />
        </Col>
        <Col md={12} />
      </Row>

      <Row>
        <Col md={12}>
          <BankReferences />
        </Col>
        <Col md={12}>
          <PersonalReferences />
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Property />
        </Col>
        <Col md={12}>
          <Passives />
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Patrimony />
        </Col>
        <Col md={12}>
          <ObservationsFyI
            edit={!value.edit}
            observationsFyI={observationsFyI}
            setObservationsFyI={setObservationsFyI}
          />
        </Col>
      </Row>
    </div>
  );
};

/* const CreditApplicationsSent: FunctionComponent<{
  quotesFinancial: QuoteFinancial[];
}> = ({ quotesFinancial }) => {
  const approbed = [];
  const preApprobed = [];
  const reject = [];
  const onHold = [];

  return (
    <table>
      <thead>
        <tr>
          {approbed.length && <th>Month</th>}
          {preApprobed.length && <th>Month</th>}
          {reject.length && <th>Month</th>}
          {onHold.length && <th>Month</th>}
        </tr>
      </thead>
      <tbody>
        <tr>{approbed.length && <td>Month</td>}</tr>
      </tbody>
    </table>
  );
}; */

export default NewCreditApplication;
