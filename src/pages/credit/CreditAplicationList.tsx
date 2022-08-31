import React, { useEffect, useState, FunctionComponent } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Tag,
  Button,
  Divider,
  message,
  Popover,
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
// @ts-ignore
import ReactExport from 'react-data-export';
import Menu from '../../components/Template';
import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import QuotesRepository from '../../data/repositories/quotes-repository';
import milisecondsToDate from '../../utils/milisecondsToDate';
import Loading from '../../components/Loading';
import {
  dateFormat,
  RangeDates,
  dataFilter,
} from '../Follow/components/MainFollow';
import DealerPicker from '../../components/Prospect/DealerPicker';
import auth from '../../utils/auth';
import Client from '../../data/models/Client';
import LeadQuoteFinancialRepository from '../../data/repositories/leads-quote-financial-repository';
import INotification from '../../data/models/Notification';
import SocketClient from '../../utils/socket-client';
import { Subscription } from 'rxjs';
import { NOTIFICATION_TYPES } from '../../utils/types-notification';
import Quotes from '../../data/models/Quotes';
import LeadsQuoteFinancial from '../../data/models/LeadsQuoteFinancial';

interface DataTable {
  key: string;
  asesor: string;
  prospecto: string;
  solicitudes: {
    bank: string;
    state: string;
    idQuoteFinancial: number;
    opinion: string | null;
  }[];
  fecha: string;
  idQuote?: number;
  createdAt?: string;
  asesorApellido?: string;
  prospectoApellido?: string;
  isFleetCredit?: boolean;
  idLead: number;
}

const { Search } = Input;
const { RangePicker } = DatePicker;

const CreditAplicationList = () => {
  return (
    <Menu page="CreditAplicationList">
      <MainCredit />
    </Menu>
  );
};

const MainCredit = () => {
  /******************************HOOKS*****************************************/

  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const leadsQuoteFinancialRepository = Get.find<LeadQuoteFinancialRepository>(
    Dependencies.leadQuoteFinancial
  );
  const [dataTableCredit, setDataTableCredit] = useState<DataTable[]>([]);
  const historyRouter = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  // RANGO DE FECHAS A BUSCAR
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment().endOf('month')).format(dateFormat),
  });
  //DATOS DEL USUARIO
  const { user } = auth;
  //DATOS DEL DEALERPICKER
  const [valueInput, setValueInput] = useState<string | null>(null);
  const [codeConcessionaire, setCodeConcessionaire] = useState<string>();
  const [idSubsidiary, setidSubsidiary] = useState<number>();
  //VISIBLE SEARCH
  const [visible, setvisible] = useState<boolean>(true);
  const [nameConcessionaire, setNameConcessionaire] = useState<string>();
  const [nameSucursal, setNameSucursal] = useState<string>();

  // Constantes para la exportación del .xls
  const { ExcelFile } = ReactExport;
  const { ExcelSheet } = ReactExport.ExcelFile;
  const { ExcelColumn } = ReactExport.ExcelFile;
  const [activeDowloading, setActiveDowloading] = useState<boolean>(true);

  const [concesionaroJson, setConcesionarioJson] = useState<{
    code?: string;
    name?: string;
  } | null>();
  const [sucursalJson, setSucursalJson] = useState<any>();
  const [dataExcel, setDataExcel] = useState<any[]>([]);
  /// Suscripcion a WS
  // eslint-disable-next-line no-unused-vars
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Filtros por nombre de asesor
  const [dataNameAsesor, setDataNameAsesor] = useState<dataFilter[]>([]);
  /******************************GENERALFUNCTION*******************************/

  /// NOTIFICATION
  const onNotificationListener = (noti: INotification) => {
    //console.log('noti', noti);
    // noti es una notificacion desde el ws
    if (noti.type === NOTIFICATION_TYPES.RESPONSE_CREDIT_APPLICATION) {
      try {
        //console.log('noti', noti);
        //console.log('lead', lead);
        if (noti.content.id && noti.content.idQuoteFinancial) {
          console.log('Entro Noty QF -->');
          setDataTableCredit((prevState) => {
            const copy = [...prevState];
            const indexRow = prevState.findIndex(
              (row) => row.idQuote === noti.content.id
            );
            if (indexRow > -1) {
              const indexQF = copy[indexRow].solicitudes.findIndex(
                (sol) => sol.idQuoteFinancial === noti.content.idQuoteFinancial
              );
              if (indexQF > -1) {
                copy[indexRow].solicitudes[indexQF].state =
                  noti?.content?.responseBank === 'APPROBED'
                    ? 'APPROBED'
                    : noti?.content?.responseBank === 'PREAPPROBED'
                    ? 'PREAPPROBED'
                    : noti?.content?.responseBank === null
                    ? 'EN ESPERA'
                    : 'DENEGADO';

                copy[indexRow].solicitudes[indexQF].opinion =
                  noti?.content?.opinion ?? null;
              }
            }
            return copy;
          });
        }
      } catch (error) {
        console.log('Error notificacion', error.message);
      }
    }
  };

  const dataToReturn = (data: Quotes | LeadsQuoteFinancial) => {
    return {
      name: data.leads?.client.name,
      lastname: data.leads?.client.lastName,
      civilStatus: data.leads?.client?.credits?.applicant?.civilStatus,
      nationality: data.leads?.client?.credits?.applicant?.nationality,
      placeOfBirth: data.leads?.client?.credits?.applicant?.placeOfBirth,
      dateOfBirth: data.leads?.client?.birthdate
        ? milisecondsToDate(data.leads?.client?.birthdate, 'DD/MM/YYYY')
        : null,
      identification: data.leads?.client?.identification,
      company: data.leads?.client?.credits?.applicantActivity?.company,
      employmentRelationship:
        data.leads?.client?.credits?.applicantActivity?.employmentRelationship,
      workAddress: data.leads?.client?.credits?.applicantActivity?.workAddress,
      workPhone: data.leads?.client?.credits?.applicantActivity?.workPhone,
      workPosition:
        data.leads?.client?.credits?.applicantActivity?.workPosition,
      yearsOfWork: data.leads?.client?.credits?.applicantActivity?.yearsOfWork,
      accountNumber: data.leads?.client?.credits?.bankReferences?.accountNumber,
      accountType: data.leads?.client?.credits?.bankReferences?.accountType,
      bank: data.leads?.client?.credits?.bankReferences?.bank,
      commercialReferencescompany:
        data.leads?.client?.credits?.commercialReferences?.company,
      phone: data.leads?.client?.credits?.commercialReferences?.phone,
      placeCompany:
        data.leads?.client?.credits?.commercialReferences?.placeCompany,
      position: data.leads?.client?.credits?.commercialReferences?.position,
      referenceName:
        data.leads?.client?.credits?.commercialReferences?.referenceName,
      sector: data.leads?.client?.credits?.commercialReferences?.sector,
      canton: data.leads?.client?.credits?.currentAddress?.canton,
      cellPhone: data.leads?.client?.credits?.currentAddress?.cellPhone,
      homePhone: data.leads?.client?.credits?.currentAddress?.homePhone,
      houseAddress: data.leads?.client?.credits?.currentAddress?.houseAddress,
      neighborhood: data.leads?.client?.credits?.currentAddress?.neighborhood,
      parish: data.leads?.client?.credits?.currentAddress?.parish,
      province: data.leads?.client?.credits?.currentAddress?.province,
      typeOfHousing: data.leads?.client?.credits?.currentAddress?.typeOfHousing,
      goodHouse: data.leads?.client?.credits?.goods?.goodHouse,
      goodOthers: data.leads?.client?.credits?.goods?.goodOthers,
      goodVehicle: data.leads?.client?.credits?.goods?.goodVehicle,
      monthlySalary: data.leads?.client?.credits?.income?.monthlySalary,
      monthlySpouseSalary:
        data.leads?.client?.credits?.income?.monthlySpouseSalary,
      otherIncome: data.leads?.client?.credits?.income?.otherIncome,
      otherSpouseIncome: data.leads?.client?.credits?.income?.otherSpouseIncome,
      creditCards: data.leads?.client?.credits?.passives?.creditCards,
      debtsToPay: data.leads?.client?.credits?.passives?.debtsToPay,
      passivesOthers: data.leads?.client?.credits?.passives?.passivesOthers,
      spouseDateOfBirth: data.leads?.client?.credits?.spouseData?.dateOfBirth,
      spouseIdentification:
        data.leads?.client?.credits?.spouseData?.identification,
      spouseName: data.leads?.client?.credits?.spouseData?.names,
      spouseLastName: data.leads?.client?.credits?.spouseData?.lastNames,
      placeOfBirthSpouseData:
        data.leads?.client?.credits?.spouseData?.placeOfBirth,
      quoteFinan: data.quoteFinancial?.reduce((accumulator, currentValue) => {
        const stringConvert = `${
          currentValue.financial?.nameEntityFinancial
        }: ${
          currentValue.responseBank === 'APPROBED'
            ? 'APROBADO'
            : currentValue.responseBank === 'PREAPPROBED'
            ? 'PRE-APROBADO'
            : currentValue.responseBank === null
            ? 'EN ESPERA'
            : 'DENEGADO'
        } - ${milisecondsToDate(
          currentValue.createdAt ?? new Date().getTime().toString(),
          'DD/MM/YYYY'
        )}; `;
        return accumulator + stringConvert;
      }, ''),
    };
  };

  const makeDataExcel = (
    dataCreditQ: Quotes[] | null,
    dataCreditLQF: LeadsQuoteFinancial[] | null
  ) => {
    console.log('Data GQL -->', { dataCreditQ, dataCreditLQF });
    const myCredits = dataCreditQ?.map((data) => {
      return dataToReturn(data);
    });

    const myCreditsLQF = dataCreditLQF?.map((data) => {
      return dataToReturn(data);
    });
    let newData = myCredits ?? [];

    if (myCreditsLQF) {
      newData = [...newData, ...myCreditsLQF];
    }
    setDataExcel(newData);
  };

  // GET QUOTES CREDIT BY DATES
  const getQuotesCreditByDates = async (
    startDateGQ?: string,
    endDateGQ?: string,
    codeConcessionaireInput?: string,
    idSubsidiaryInput?: string,
    value?: string
  ) => {
    /* console.log('getQuotesCreditByDates -->', {
      codeConcessionaireInput,
      idSubsidiaryInput,
    }); */
    setLoading(true);
    const dataCredit = await quouteRepository.getQuotesCredits({
      identificationClient: value ?? null,
      concessionaireInput: codeConcessionaireInput!,
      firstDate: startDateGQ ?? null,
      secondDate: endDateGQ ?? null,
      sucursalInput: idSubsidiaryInput!,
    });

    const dataCreditLeadsQuotesFinancial = await leadsQuoteFinancialRepository.getLeadsQuotesFinancialCredits(
      {
        identificationClient: value ?? null,
        concessionaireInput: codeConcessionaireInput!,
        firstDate: startDateGQ ?? null,
        secondDate: endDateGQ ?? null,
        sucursalInput: idSubsidiaryInput!,
      }
    );
    //console.log('getQuotesCredits', dataCredit);
    makeDataExcel(dataCredit, dataCreditLeadsQuotesFinancial);
    if (dataCredit) {
      let newDataTableLeadsQuoteFinancial: DataTable[] = [];
      if (dataCreditLeadsQuotesFinancial) {
        newDataTableLeadsQuoteFinancial = dataCreditLeadsQuotesFinancial.map(
          (item, index) => {
            //console.log('DATES', milisecondsToDate(item.createdAt!));
            const newItem: DataTable = {
              asesorApellido: item.leads?.user.apellido,
              prospectoApellido: item.leads?.client.lastName!,
              asesor: `${item.leads!.user.nombre} ${item.leads!.user.apellido}`,
              prospecto: `${item.leads!.client.name} ${
                item.leads!.client.lastName
              }`,
              fecha: milisecondsToDate(item.createdAt!),
              key: `leadQuoteFinancial_${index}`,
              solicitudes:
                item.quoteFinancial?.length === 0
                  ? [
                      {
                        bank: 'NINGUNO',
                        state: 'EN ESPERA',
                        idQuoteFinancial: -1,
                        opinion: null,
                      },
                    ]
                  : item.quoteFinancial!.map((qFi) => ({
                      bank: qFi.financial!.nameEntityFinancial!,
                      state:
                        qFi.responseBank === 'APPROBED'
                          ? 'APPROBED'
                          : qFi.responseBank === 'PREAPPROBED'
                          ? 'PREAPPROBED'
                          : qFi.responseBank === null
                          ? 'EN ESPERA'
                          : 'DENEGADO',
                      opinion: qFi.opinion ?? null,
                      idQuoteFinancial: qFi.id!,
                    })),
              createdAt: item.createdAt!,
              idQuote: item.id!,
              isFleetCredit: true,
              idLead: item!.leads!.id!,
            };
            return newItem;
          }
        );
      }

      const newDataTable = dataCredit.map((item, index) => {
        //console.log('DATES', milisecondsToDate(item.createdAt!));
        const newItem: DataTable = {
          asesorApellido: item.leads?.user.apellido,
          prospectoApellido: item.leads?.client.lastName!,
          asesor: `${item.leads!.user.nombre} ${item.leads!.user.apellido}`,
          prospecto: `${item.leads!.client.name} ${
            item.leads!.client.lastName
          }`,
          fecha: milisecondsToDate(item.createdAt!),
          key: index.toString(),
          solicitudes:
            item.quoteFinancial?.length === 0
              ? [
                  {
                    bank: 'NINGUNO',
                    state: 'EN ESPERA',
                    idQuoteFinancial: -1,
                    opinion: null,
                  },
                ]
              : item.quoteFinancial!.map((qFi) => ({
                  bank: qFi.financial!.nameEntityFinancial!,
                  state:
                    qFi.responseBank === 'APPROBED'
                      ? 'APPROBED'
                      : qFi.responseBank === 'PREAPPROBED'
                      ? 'PREAPPROBED'
                      : qFi.responseBank === null
                      ? 'EN ESPERA'
                      : 'DENEGADO',
                  opinion: qFi.opinion ?? null,
                  idQuoteFinancial: qFi.id!,
                })),
          createdAt: item.createdAt!,
          idQuote: item.id!,
          idLead: item!.leads!.id!,
        };
        return newItem;
      });
      const joinData = [
        ...newDataTable,
        ...newDataTableLeadsQuoteFinancial,
      ].sort((a, b) => {
        return moment(
          milisecondsToDate(b.createdAt!, 'YYYY/MM/DD HH:mm:ss')
        ).diff(milisecondsToDate(a.createdAt!, 'YYYY/MM/DD HH:mm:ss'));
      });
      //console.log('newDataTable', newDataTable);
      setDataTableCredit(joinData);
    }

    setLoading(false);
  };

  useEffect(() => {
    const asesores: dataFilter[] = [];
    dataTableCredit.forEach((element) => {
      const indexAsesor = asesores.findIndex(
        (as) => as.value === element.asesor
      );
      if (indexAsesor === -1) {
        asesores.push({
          text: element.asesor,
          value: element.asesor,
        });
      }
    });
    setDataNameAsesor(asesores);
  }, [dataTableCredit]);

  // GET QUOTES BY PROSPECT OR ASESOR LAST NAME AND Concessionaire AND Subsidiary VALIDATION
  const getQuotesByLastNamesConcessionaireSubsidiary = async (
    lastname: string
  ) => {
    setLoading(true);
    const dataCredit = dataTableCredit.filter((dataFilter) => {
      if (user?.role === 'ASESOR COMERCIAL') {
        return (
          dataFilter.prospectoApellido?.toLocaleLowerCase() ===
          lastname.toLocaleLowerCase()
        );
      }
      return (
        dataFilter.prospectoApellido?.toLocaleLowerCase() ===
          lastname.toLocaleLowerCase() ||
        dataFilter.asesorApellido?.toLocaleLowerCase() ===
          lastname.toLocaleLowerCase()
      );
    });
    if (dataCredit.length > 0) {
      setDataTableCredit(dataCredit);
    } else {
      message.warning(
        `No se encontró resultados con el apellido ${lastname.toUpperCase()}`
      );
      setDataTableCredit(dataTableCredit);
    }
    setLoading(false);
  };

  const getDataValue = async (value: string) => {
    //console.log('conSuc', {
    //   con: codeConcessionaire,
    //   suc: idSubsidiary,
    //   value,
    // });

    if (codeConcessionaire && typeof idSubsidiary === 'number') {
      setValueInput(value);
      await getQuotesCreditByDates(
        undefined,
        undefined,
        codeConcessionaire,
        idSubsidiary.toString(),
        value
      );
    }
  };

  //FUNCION QUE ME TRAE LOS DATOS
  const getDataDealerPicker = (dataDP: any, label: any) => {
    if (dataDP.length < 1) {
      message.warning('No existe valores para la busqueda');
      setValueInput(null);
      return;
    }
    setNameConcessionaire(label[0].label);
    setNameSucursal(label[0].children[0].label);
    setCodeConcessionaire(dataDP[0]);
    setidSubsidiary(dataDP[1]);
    setvisible(false);
    const concesionario = {
      code: label[0].value,
      name: label[0].label,
    };
    setConcesionarioJson(concesionaroJson);
    const suscursal = {
      code: dataDP[1].toString(),
      name: label[1].label,
    };
    setSucursalJson(sucursalJson);
    getQuotesCreditByDates(
      rangeDate.startDate,
      rangeDate.endDate,
      JSON.stringify(concesionario.code),
      JSON.stringify(suscursal.code)
    );
    setValueInput(null);
  };

  // Llama al resolver para el ExcelProspect
  const getDataGraphToExcel = async (
    startDateGQ?: string,
    endDateGQ?: string,
    codeConcessionaireInput?: string,
    idSubsidiaryInput?: string
  ) => {
    setLoading(true);
    const dataCredit = await quouteRepository.getQuotesCredits({
      identificationClient: null,
      concessionaireInput: codeConcessionaireInput!,
      firstDate: startDateGQ ?? rangeDate.startDate,
      secondDate: endDateGQ ?? rangeDate.endDate,
      sucursalInput: idSubsidiaryInput!,
    });
    //console.log('dataCreditdataCredit', dataCredit);
    if (dataCredit) {
      const myCredits = dataCredit.map((data: any) => {
        return {
          name: data.leads?.client.name,
          lastname: data.leads?.client.lastName,
          civilStatus: data.leads?.client.credits.applicant.civilStatus,
          nationality: data.leads?.client.credits.applicant.nationality,
          placeOfBirth: data.leads?.client.credits.applicant.placeOfBirth,
          company: data.leads?.client.credits.applicantActivity.company,
          employmentRelationship:
            data.leads?.client.credits.applicantActivity.employmentRelationship,
          workAddress: data.leads?.client.credits.applicantActivity.workAddress,
          workPhone: data.leads?.client.credits.applicantActivity.workPhone,
          workPosition:
            data.leads?.client.credits.applicantActivity.workPosition,
          yearsOfWork: data.leads?.client.credits.applicantActivity.yearsOfWork,
          accountNumber:
            data.leads?.client.credits.bankReferences.accountNumber,
          accountType: data.leads?.client.credits.bankReferences.accountType,
          bank: data.leads?.client.credits.bankReferences.bank,
          commercialReferencescompany:
            data.leads?.client.credits.commercialReferences.company,
          phone: data.leads?.client.credits.commercialReferences.phone,
          placeCompany:
            data.leads?.client.credits.commercialReferences.placeCompany,
          position: data.leads?.client.credits.commercialReferences.position,
          referenceName:
            data.leads?.client.credits.commercialReferences.referenceName,
          sector: data.leads?.client.credits.commercialReferences.sector,
          canton: data.leads?.client.credits.currentAddress.canton,
          cellPhone: data.leads?.client.credits.currentAddress.cellPhone,
          homePhone: data.leads?.client.credits.currentAddress.homePhone,
          houseAddress: data.leads?.client.credits.currentAddress.houseAddress,
          neighborhood: data.leads?.client.credits.currentAddress.neighborhood,
          parish: data.leads?.client.credits.currentAddress.parish,
          province: data.leads?.client.credits.currentAddress.province,
          typeOfHousing:
            data.leads?.client.credits.currentAddress.typeOfHousing,
          goodHouse: data.leads?.client.credits.goods.parish,
          goodOthers: data.leads?.client.credits.goods.goodOthers,
          goodVehicle: data.leads?.client.credits.goods.goodVehicle,
          monthlySalary: data.leads?.client.credits.income.monthlySalary,
          monthlySpouseSalary:
            data.leads?.client.credits.income.monthlySpouseSalary,
          otherIncome: data.leads?.client.credits.income.otherIncome,
          otherSpouseIncome:
            data.leads?.client.credits.income.otherSpouseIncome,
          creditCards: data.leads?.client.credits.passives.creditCards,
          debtsToPay: data.leads?.client.credits.passives.debtsToPay,
          passivesOthers: data.leads?.client.credits.passives.passivesOthers,
          dateOfBirth: data.leads?.client.credits.spouseData.dateOfBirth,
          otherSpouseIncomespouseData:
            data.leads?.client.credits.spouseData.otherSpouseIncome,
          identification: data.leads?.client.credits.spouseData.identification,
          lastNames: data.leads?.client.credits.spouseData.lastNames,
          placeOfBirthspouseData:
            data.leads?.client.credits.spouseData.placeOfBirth,
        };
      });
      setDataExcel(myCredits);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const concesionario = {
      code: user.dealer[0].codigo,
      name: user.dealer[0].descripcion,
    };
    const suscursal = {
      code: user.dealer[0].sucursal[0].id_sucursal?.toString(),
      name: user.dealer[0].sucursal[0].sucursal,
    };
    /* console.log('con sucu -->', {
      concesionario,
      suscursal,
      dealer: user.dealer,
    }); */
    /* getQuotesCreditByDates(
      rangeDate.startDate,
      rangeDate.endDate,
      JSON.stringify(concesionario!),
      JSON.stringify(suscursal!)
    ); */
    getQuotesCreditByDates(
      rangeDate.startDate,
      rangeDate.endDate,
      JSON.stringify(concesionario.code),
      JSON.stringify(suscursal.code)
    );
    setSubscription(
      SocketClient.instance.onNotificationStream.subscribe(
        onNotificationListener
      )
    );
  }, []);

  /*******************************TABLESTRUCT**********************************/

  const allColumns = [
    {
      title: 'Negocio',
      dataIndex: 'idLead',
      key: 'idLead',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Tipo',
      dataIndex: 'isFleetCredit',
      key: 'isFleetCredit',
      render: (text: any) => (
        <span className="regular c-black">{text ? 'FLOTA' : 'COTIZACIÓN'}</span>
      ),
    },
    {
      title: 'Asesor',
      dataIndex: 'asesor',
      key: 'asesor',
      filterMultiple: true,
      filters: dataNameAsesor,
      onFilter: (value: any, record: any) => {
        return record.asesor.indexOf(value) === 0;
      },
      sorter: (a: any, b: any) => a.asesor.length - b.asesor.length,
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Prospecto',
      dataIndex: 'prospecto',
      key: 'prospecto',
      filterMultiple: false,
      sorter: (a: any, b: any) => a.prospecto.length - b.prospecto.length,
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Solicitudes enviadas',
      dataIndex: 'solicitudes',
      key: 'solicitudes',
      render: (
        solicitudes: {
          bank: string;
          state: string;
          opinion?: string;
        }[]
      ) => {
        const espera = solicitudes.filter((sol) => sol.state === 'EN ESPERA');
        const aprobadas = solicitudes.filter((sol) => sol.state === 'APPROBED');
        const preAprobadas = solicitudes.filter(
          (sol) => sol.state === 'PREAPPROBED'
        );
        const rechazadas = solicitudes.filter(
          (sol) => sol.state === 'DENEGADO'
        );
        return (
          <div className="m-1">
            {aprobadas.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 5,
                }}
              >
                <b>Aprobadas:</b>
                <div style={{ marginLeft: 5 }}>
                  {aprobadas.map((soli, index) => (
                    <CustomTag
                      state={soli.state}
                      bank={soli.bank}
                      comment={soli.opinion}
                      key={`aprobadas_${index}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {preAprobadas.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 5,
                }}
              >
                <b>Pre-Aprobadas:</b>
                <div style={{ marginLeft: 5 }}>
                  {preAprobadas.map((soli, index) => (
                    <CustomTag
                      state={soli.state}
                      bank={soli.bank}
                      comment={soli.opinion}
                      key={`preAprobadas_${index}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {rechazadas.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 5,
                }}
              >
                <b>Rechazadas:</b>
                <div style={{ marginLeft: 5 }}>
                  {rechazadas.map((soli, index) => (
                    <CustomTag
                      state={soli.state}
                      bank={soli.bank}
                      comment={soli.opinion}
                      key={`rechazadas_${index}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {espera.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 5,
                }}
              >
                <b>En espera:</b>
                <div style={{ marginLeft: 5 }}>
                  {espera.map((soli, index) => (
                    <CustomTag
                      state={soli.state}
                      bank={soli.bank}
                      comment={soli.opinion}
                      key={`espera_${index}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a: any, b: any) => {
        return parseInt(a.createdAt) - parseInt(b.createdAt);
      },
      render: (text: any, row: any) =>
        text ? milisecondsToDate(text) : moment().format(),
    },
    {
      title: '',
      dataIndex: 'accion',
      key: 'accion',
      render: (text: any, row: any) => (
        <div className="">
          <Button
            onClick={() => {
              //setViewFollow(`/tracing/details/id=${row.id}`);
              //console.log('Ver solicitud', row);
              historyRouter.push(
                `/credit/list/${row.idQuote}/${
                  row.isFleetCredit ? 'FLOTA' : 'COTIZACION'
                }`
              );
            }}
            type="primary"
            shape="round"
          >
            <span className="leading-none">Ver solicitud de crédito</span>
          </Button>
        </div>
      ),
    },
  ];

  let columns: any;
  if (user?.role === 'ASESOR COMERCIAL') {
    columns = allColumns.slice(1, allColumns.length);
  } else {
    columns = allColumns;
  }

  /********************************RETURN**************************************/

  return (
    //max-w-screen-lg m-auto
    <div className="">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl c-black m-0 p-0 flex">
          <img
            className="mr-2"
            src="https://www.flaticon.es/svg/static/icons/svg/892/892213.svg"
            width="25"
          />{' '}
          Solicitudes de Crédito
        </h2>
        <div>
          <ExcelFile
            element={
              <Button
                style={{ marginRight: 5 }}
                type="default"
                size="large"
                icon={<DownloadOutlined />}
                disabled={dataExcel.length === 0}
                onClick={async () => {
                  console.log('dataExcel -->', dataExcel);
                  //setActiveDowloading(true);
                }}
              >
                .xlsx
              </Button>
            }
          >
            <ExcelSheet data={dataExcel} name="Creditos">
              <ExcelColumn label="Nombre" value="name" />
              <ExcelColumn label="Apellido" value="lastname" />
              <ExcelColumn label="Identificación" value="identification" />
              <ExcelColumn label="Fecha de nacimiento" value="dateOfBirth" />
              <ExcelColumn label="Estado civil" value="civilStatus" />
              <ExcelColumn label="Nacionalidad" value="nationality" />
              <ExcelColumn label="Lugar de nacimiento" value="placeOfBirth" />
              <ExcelColumn label="Compania" value="company" />
              <ExcelColumn
                label="Relacion laboral"
                value="employmentRelationship"
              />
              <ExcelColumn label="Dirección del trabajo" value="workAddress" />
              <ExcelColumn label="Teléfono del trabajo" value="workPhone" />
              <ExcelColumn label="Posición de trabajo" value="workPosition" />
              <ExcelColumn label="Años de trabajo" value="yearsOfWork" />
              <ExcelColumn
                label="Referencia de empresas comerciales"
                value="commercialReferencescompany"
              />
              <ExcelColumn label="Teléfono" value="phone" />
              <ExcelColumn label="Lugar de Empresa" value="placeCompany" />
              <ExcelColumn label="Posición" value="position" />
              <ExcelColumn label="Nombre de referencia" value="referenceName" />
              <ExcelColumn label="Sector" value="sector" />
              <ExcelColumn label="Cantón" value="canton" />
              <ExcelColumn label="Teléfono" value="cellPhone" />
              <ExcelColumn label="Teléfono de casa" value="homePhone" />
              <ExcelColumn
                label="Dirección domiciliaria"
                value="houseAddress"
              />
              <ExcelColumn label="Barrio" value="neighborhood" />
              <ExcelColumn label="Parroquia" value="parish" />
              <ExcelColumn label="Provincia" value="province" />
              <ExcelColumn label="Tipo de vivienda" value="typeOfHousing" />
              <ExcelColumn label="Activo Casa" value="goodHouse" />
              <ExcelColumn label="Activo Otros" value="goodOthers" />
              <ExcelColumn label="Activo Vehículo" value="goodVehicle" />
              <ExcelColumn label="Salario mensual" value="monthlySalary" />
              <ExcelColumn label="Ingresos Otros" value="otherIncome" />
              {/* <ExcelColumn
                label="Información extra del cónyuge"
                value="otherSpouseIncomespouseData"
              /> 
              spouseDateOfBirth: data.leads?.client?.credits?.spouseData?.dateOfBirth,
      spouseIdentification: data.leads?.client?.credits?.spouseData?.identification,
      spouseName: data.leads?.client?.credits?.spouseData?.names,
      spouseLastName: data.leads?.client?.credits?.spouseData?.lastNames,
      placeOfBirthSpouseData:
              
              */}
              <ExcelColumn label="Nombre del cónyugue" value="spouseName" />
              <ExcelColumn
                label="Apellido del cónyugue"
                value="spouseLastName"
              />
              <ExcelColumn
                label="Identificación del cónyugue"
                value="spouseIdentification"
              />
              <ExcelColumn
                label="Fecha de nacimiento del cónyugue"
                value="spouseDateOfBirth"
              />
              <ExcelColumn
                label="Lugar de nacimiento del cónyugue"
                value="placeOfBirthSpouseData"
              />
              <ExcelColumn
                label="Salario mensual del cónyuge"
                value="monthlySpouseSalary"
              />
              <ExcelColumn
                label="Otros ingresos del cónyuge"
                value="otherSpouseIncome"
              />
              <ExcelColumn label="Solicitudes enviadas" value="quoteFinan" />
            </ExcelSheet>
          </ExcelFile>
        </div>
      </div>
      <Divider />
      <div>
        <DealerPicker
          widthInput={400}
          placeholderInput="Seleccione concesionario antes de realizar la busqueda"
          getDataDealerPicker={getDataDealerPicker}
        />

        <br />

        <div className="flex items-center">
          <Search
            disabled={visible}
            className="mt-2 mr-8"
            style={{ width: 400 }}
            placeholder="Apellido(s)"
            enterButton
            onSearch={async (val: string) => {
              //await getQuotesByLastNamesConcessionaireSubsidiary(val);
              await getDataValue(val);
            }}
            onChange={(ev) => setValueInput(ev.target.value)}
            value={valueInput ?? undefined}
          />

          <RangePicker
            defaultValue={[
              moment(rangeDate.startDate, dateFormat),
              moment(rangeDate.endDate, dateFormat),
            ]}
            disabled={visible}
            className="mt-2"
            format={dateFormat}
            onChange={async (dates: any, formatString: [string, string]) => {
              const concesionario = {
                code: codeConcessionaire,
                name: nameConcessionaire,
              };
              setConcesionarioJson(concesionario);
              const suscursal = {
                code: idSubsidiary?.toString(),
                name: nameSucursal,
              };
              setSucursalJson(suscursal);
              setRangeDate({
                startDate: formatString[0],
                endDate: formatString[1],
              });
              await getQuotesCreditByDates(
                formatString[0],
                formatString[1],
                JSON.stringify(concesionario.code),
                JSON.stringify(suscursal.code)
              );
              setValueInput(null);
              setActiveDowloading(true);
            }}
          />
        </div>
      </div>
      <div className="w-full my-3">
        <Table
          pagination={{ position: ['bottomRight'] }}
          columns={columns}
          dataSource={dataTableCredit}
          scroll={{ y: window.innerHeight * 0.55 }}
        />
      </div>
      <Loading visible={loading} />
    </div>
  );
};

const CustomTag: FunctionComponent<{
  state: string;
  bank: string;
  comment?: string;
}> = ({ state, bank, comment }) => {
  //console.log('comment-->', comment);
  const tag = (
    <Tag
      icon={
        state === 'EN ESPERA' ? (
          <ClockCircleOutlined />
        ) : state && (state === 'APPROBED' || state === 'PREAPPROBED') ? (
          <CheckCircleOutlined />
        ) : (
          <CloseCircleOutlined />
        )
      }
      style={{ marginRight: 5 }}
      color={
        state === 'EN ESPERA'
          ? 'warning'
          : state && state === 'APPROBED'
          ? 'success'
          : state === 'PREAPPROBED'
          ? 'processing'
          : 'error'
      }
    >
      {bank}
      {comment && <MessageOutlined style={{ marginLeft: 10 }} />}
    </Tag>
  );

  if (comment) {
    return (
      <Popover content={<div>{comment}</div>} trigger="hover">
        {tag}
      </Popover>
    );
  }
  return tag;
};

export default CreditAplicationList;
