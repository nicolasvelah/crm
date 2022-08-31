/* eslint-disable no-unused-vars */
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, message, Modal, Tag } from 'antd';
import moment from 'moment';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import Menu from '../../components/Template';
import Client from '../../data/models/Client';
import {
  calcLegals,
  calcTotalQuotesGenerated,
  currenyFormat,
} from '../../utils/extras';
import auth from '../../utils/auth';
import Get from '../../utils/Get';
import LeadsRepository from '../../data/repositories/leads-repository';
import { Dependencies } from '../../dependency-injection';
import WalletContext from './components/WalletContext';
import milisecondsToDate from '../../utils/milisecondsToDate';
import WalletDetails from './components/WalletDetails';
import MainTable from './components/MainTable';
import INotification from '../../data/models/Notification';
import SocketClient from '../../utils/socket-client';
import { NOTIFICATION_TYPES } from '../../utils/types-notification';

const { user } = auth;

const dateFormat = 'YYYY/MM/DD';
const { RangePicker } = DatePicker;

interface RangeDates {
  startDate: string;
  endDate: string;
}
export interface Item {
  key: string;
  prospect: Client;
  product: Vehiculo;
  createdAt: Date;
  status: string;
  balance: number;
  total: number;
  booking: number;
  ids: any;
  prebill: any;
  lead: any;
}
interface Vehiculo {
  marca: string;
  model: string;
  year: number;
  value: number;
  plazo?: number;
  entrada?: number;
  tasa?: number;
  financing?: number;
  monthlyPayments?: number;
}

const Wallet: FunctionComponent<{ dataNotification: any }> = ({
  dataNotification,
}) => {
  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const [dataSource, setDataSource] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month'))
      .startOf('day')
      .format(dateFormat),
    endDate: moment(moment()).format(dateFormat),
  });
  const [item, setItem] = useState<any>();
  const [idQuote, setIdQuote] = useState<any>();
  const [viewModal, setViewModal] = useState<boolean>(false);
  const { dataTable, setDataTable } = useContext(WalletContext);
  const historyRouter = useHistory();
  const calcOtros = (record: any) => {
    if (record) {
      return (
        (record.registration ?? 0) +
        (record.type === 'credit'
          ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
          : 0) +
        (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
      );
    }
    return 0;
  };

  const load = async () => {
    setFetching(true);

    const concesionario = {
      code: user.dealer[0].codigo,
      name: user.dealer[0].descripcion,
    };

    const suscursal = {
      code: user.dealer[0].sucursal[0].id_sucursal?.toString(),
      name: user.dealer[0].sucursal[0].sucursal,
    };

    const leads = await leadsRepository.getLeadsToWallet({
      identificationClient: null,
      concessionaireInput: null,
      firstDate: rangeDate.startDate,
      secondDate: rangeDate.endDate,
      sucursalInput: null,
    });
    if (!leads) {
      message.error('No se pudo obtener la información!');
      return;
    }

    if (dataNotification && dataNotification.idLead) {
      const existLeads = leads.some(
        (data: any) => data.id === parseInt(dataNotification.idLead)
      );
      if (!existLeads) {
        const leadById = await leadsRepository.getLeadById(
          parseInt(dataNotification.idLead)
        );

        if (leadById) {
          leads.push(leadById);
        }
      }
    }

    const dataW: Array<any> = [];
    let totalVeh = 0;
    let totalAcc = 0;
    let totalSer = 0;
    let totalOtros = 0;
    let legalValue = 0;
    let desc = 0;
    let exonerated = false;

    //console.log('Lead🟡', leads)
    if (leads) {
      leads.map((data: any) => {
        let reserveValue = 0;
        let pvp = 0;
        const quotes: Array<any> = [];
        data.quotes.map((dataQuotes: any, i: number) => {
          //console.log('dataQuotes', dataQuotes);

          if (dataQuotes.reserveValue) {
            reserveValue += dataQuotes.reserveValue;
          }

          if (dataQuotes.closed === true) {
            quotes.push(dataQuotes);
            const cal = calcTotalQuotesGenerated(dataQuotes);
            const a = dataQuotes.vehiculo[0].pvp;
            const amount = calcLegals(a, true);
            const totalAmount = cal * 1.12 + amount;
            pvp += totalAmount;
            totalVeh += dataQuotes.vehiculo[0].pvp;
            totalSer += dataQuotes.servicesValue;
            totalAcc += dataQuotes.accesoriesValue;
            totalOtros += calcOtros(dataQuotes);
            legalValue +=
              dataQuotes.inputAmount !== null
                ? calcLegals(dataQuotes.vehiculo![0].pvp!, true)
                : 0;

            exonerated = dataQuotes.exonerated !== null;
          }

          return true;
        });

        desc = totalVeh * 0.01 * data.discount;
        const valueDesc = totalVeh + totalSer + totalAcc + totalOtros - desc;
        const iva =
          (totalVeh + totalSer + totalAcc + totalOtros + -desc) * 0.12;

        const ivaExonerated = (totalSer + totalAcc + totalOtros) * 0.12;
        const ivaValueFinal = exonerated === true ? ivaExonerated : iva;
        const actualPrebill = data?.prebill
          ? data.prebill[data.prebill.length - 1]
          : undefined;
        dataW.push({
          key: data.id,
          prospect: data.client,
          product: quotes,
          status: data.state,
          booking: reserveValue || 0,
          balance: valueDesc + ivaValueFinal - reserveValue || 0,
          total: valueDesc + ivaValueFinal,
          ids: 14,
          createdAt: milisecondsToDate(actualPrebill?.createdAt, 'YYYY-MM-DD'),
          prebill: actualPrebill,
          lead: data,
        });
        totalVeh = 0;
        totalSer = 0;
        totalAcc = 0;
        totalOtros = 0;
        legalValue = 0;
        desc = 0;
        exonerated = false;
        return true;
      });
    }
    //console.log('dataW --->', dataW);
    setDataSource(dataW);
    setDataTable!(dataW);
    setFetching(false);
    return dataW;
  };
  const showDetail = (itemModal: Item, idQuoteModal?: number) => {
    setFetching(true);
    setItem(itemModal);
    setIdQuote(idQuoteModal);
    setViewModal(true);
    setFetching(false);
  };
  useEffect(() => {
    const loadData = async () => {
      const loadDataMain = await load();

      if (dataNotification.idLead) {
        const result = loadDataMain?.find(
          (dS: any) => dS.key === dataNotification.idLead
        );
        if (!result) {
          message.error('Negocio no encontrado');
          return;
        }

        showDetail(
          result,
          dataNotification.quoteData ? dataNotification.quoteData.id : null
        );
      }
    };
    loadData();
  }, []);

  const updateDataTable = async (values: {
    value?: string;
    formatString?: [string, string];
  }) => {
    setFetching(true);
    const suscursal = {
      code: user.dealer[0].sucursal[0].id_sucursal?.toString(),
      name: user.dealer[0].sucursal[0].sucursal,
    };
    /* const firstDate = values.formatString
      ? values.formatString[0]
      : rangeDate.startDate;

    const secondDate = values.formatString
      ? values.formatString[1]
      : rangeDate.endDate; */
    const firstDate = values.formatString ? values.formatString[0] : null;

    const secondDate = values.formatString ? values.formatString[1] : null;

    //console.log('DATES', { firstDate, secondDate });
    const leads = await leadsRepository.getLeadsToWallet({
      identificationClient: values.value ?? null,
      concessionaireInput: null,
      firstDate,
      secondDate,
      sucursalInput: null,
    });

    const dataW: Array<any> = [];
    let totalVeh = 0;
    let totalAcc = 0;
    let totalSer = 0;
    let totalOtros = 0;
    let legalValue = 0;
    let desc = 0;
    let exonerated = false;
    if (leads) {
      leads.map((data: any) => {
        let reserveValue = 0;
        let pvp = 0;
        const quotes: Array<any> = [];
        data.quotes.map((dataQuotes: any, i: number) => {
          //console.log('dataQuotes', dataQuotes);

          if (dataQuotes.reserveValue) {
            reserveValue += dataQuotes.reserveValue;
          }

          if (dataQuotes.closed === true) {
            quotes.push(dataQuotes);
            const cal = calcTotalQuotesGenerated(dataQuotes);
            const a = dataQuotes.vehiculo[0].pvp;
            const amount = calcLegals(a, true);
            const totalAmount = cal * 1.12 + amount;
            pvp += totalAmount;
            totalVeh += dataQuotes.vehiculo[0].pvp;
            totalSer += dataQuotes.servicesValue;
            totalAcc += dataQuotes.accesoriesValue;
            totalOtros += calcOtros(dataQuotes);
            legalValue +=
              dataQuotes.inputAmount !== null
                ? calcLegals(dataQuotes.vehiculo![0].pvp!, true)
                : 0;

            exonerated = dataQuotes.exonerated !== null;
          }

          return true;
        });

        desc = totalVeh * 0.01 * data.discount;
        const valueDesc = totalVeh + totalSer + totalAcc + totalOtros - desc;

        const iva =
          (totalVeh + totalSer + totalAcc + totalOtros + -desc) * 0.12;
        const ivaExonerated = (totalSer + totalAcc + totalOtros) * 0.12;
        const ivaValueFinal = exonerated === true ? ivaExonerated : iva;
        const actualPrebill = data?.prebill
          ? data.prebill[data.prebill.length - 1]
          : undefined;
        dataW.push({
          key: data.id,
          prospect: data.client,
          product: quotes,
          status: data.state,
          booking: reserveValue || 0,
          balance: valueDesc + ivaValueFinal - reserveValue || 0,
          total: valueDesc + ivaValueFinal,
          ids: 14,
          createdAt: milisecondsToDate(actualPrebill?.createdAt, 'YYYY-MM-DD'),
          prebill: actualPrebill,
          lead: data,
        });
        totalVeh = 0;
        totalSer = 0;
        totalAcc = 0;
        totalOtros = 0;
        legalValue = 0;
        desc = 0;
        exonerated = false;
        return true;
      });
    }
    //console.log('dataW --->', dataW);
    setDataSource(dataW);
    setDataTable!(dataW);
    const range = {
      startDate: values.formatString
        ? values.formatString[0]
        : rangeDate.startDate,
      endDate: values.formatString ? values.formatString[1] : rangeDate.endDate,
    };
    setRangeDate(range);
    setFetching(false);
  };

  const onSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const onSearch = async (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    await updateDataTable({
      value,
    });
  };

  const onDateChange = async (dates: any, formatString: [string, string]) => {
    setFetching(true);
    const concesionario = {
      code: user.dealer[0].codigo,
      name: user.dealer[0].descripcion,
    };

    const suscursal = {
      code: user.dealer[0].sucursal[0].id_sucursal?.toString(),
      name: user.dealer[0].sucursal[0].sucursal,
    };
    const leads = await leadsRepository.getLeadsToWallet({
      identificationClient: null,
      concessionaireInput: JSON.stringify(concesionario!),
      firstDate: formatString[0] ?? null,
      secondDate: formatString[1] ?? null,
      sucursalInput: JSON.stringify(suscursal!),
    });

    const dataW: Array<any> = [];
    let totalVeh = 0;
    let totalAcc = 0;
    let totalSer = 0;
    let totalOtros = 0;
    let legalValue = 0;
    let desc = 0;
    let exonerated = false;
    if (leads) {
      leads.map((data: any) => {
        let reserveValue = 0;
        let pvp = 0;
        const quotes: Array<any> = [];
        data.quotes.map((dataQuotes: any, i: number) => {
          //console.log('dataQuotes', dataQuotes);

          if (dataQuotes.reserveValue) {
            reserveValue += dataQuotes.reserveValue;
          }

          if (dataQuotes.closed === true) {
            quotes.push(dataQuotes);
            const cal = calcTotalQuotesGenerated(dataQuotes);
            const a = dataQuotes.vehiculo[0].pvp;
            const amount = calcLegals(a, true);
            const totalAmount = cal * 1.12 + amount;
            pvp += totalAmount;
            totalVeh += dataQuotes.vehiculo[0].pvp;
            totalSer += dataQuotes.servicesValue;
            totalAcc += dataQuotes.accesoriesValue;
            totalOtros += calcOtros(dataQuotes);
            legalValue +=
              dataQuotes.inputAmount !== null
                ? calcLegals(dataQuotes.vehiculo![0].pvp!, true)
                : 0;

            exonerated = dataQuotes.exonerated !== null;
          }

          return true;
        });

        desc = totalVeh * 0.01 * data.discount;
        const valueDesc = totalVeh + totalSer + totalAcc + totalOtros - desc;

        const iva =
          (totalVeh + totalSer + totalAcc + totalOtros + -desc) * 0.12;
        const ivaExonerated = (totalSer + totalAcc + totalOtros) * 0.12;
        const ivaValueFinal = exonerated === true ? ivaExonerated : iva;
        const actualPrebill = data?.prebill
          ? data.prebill[data.prebill.length - 1]
          : undefined;
        dataW.push({
          key: data.id,
          prospect: data.client,
          product: quotes,
          status: data.state,
          booking: reserveValue || 0,
          balance: valueDesc + ivaValueFinal - reserveValue || 0,
          total: valueDesc + ivaValueFinal,
          ids: 14,
          createdAt: milisecondsToDate(actualPrebill?.createdAt, 'YYYY-MM-DD'),
          prebill: actualPrebill,
          lead: data,
        });
        totalVeh = 0;
        totalSer = 0;
        totalAcc = 0;
        totalOtros = 0;
        legalValue = 0;
        desc = 0;
        exonerated = false;
        return true;
      });
    }
    //console.log('dataW --->', dataW);
    setDataSource(dataW);
    setDataTable!(dataW);
    const range = { startDate: formatString[0], endDate: formatString[1] };
    setRangeDate(range);
    setFetching(false);
  };

  const columns = [
    {
      title: 'Id negocio',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Prospecto',
      dataIndex: 'prospect',
      key: 'prospect',

      render: (v: Client) => (
        <div>
          {v.name} {v.lastName}
          <br />
          {v.identification}
        </div>
      ),
      sorter: (a: Item, b: Item) => {
        return a.prospect.name!.localeCompare(b.prospect.name!);
      },
    },
    {
      title: 'Producto',
      dataIndex: 'product',
      key: 'product',
      render: (v: any) => {
        const dataW: Array<any> = [];

        v.map((m: any) => {
          const brandN = m.vehiculo[0].brand;
          dataW.push(brandN);

          return true;
        });
        return (
          <div>
            {dataW.map((e: any, i: number) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Fecha de la solicitud',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Item, b: Item) => a.total - b.total,
      render: (v: Date) => moment(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Solicitado', value: 'Solicitado' },
        { text: 'Verificado', value: 'Verificado' },
      ],
      filterMultiple: true,
      onFilter: (val: any, record: any) => {
        return record.status.indexOf(val) === 0;
      },
      sorter: (a: any, b: any) => {
        return a.status.length - b.status.length;
      },
      render: (v: string) => {
        let color = 'gold';
        if (v === 'Solicitado') {
          color = 'gold';
        }
        if (v === 'Verificado') {
          color = 'green';
        }

        return (
          <div>
            <Tag color={color}>{v}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a: Item, b: Item) => a.total - b.total,
      render: (v: number) => currenyFormat(v).replace('$', ''),
    },
    {
      title: 'Reserva',
      dataIndex: 'booking',
      key: 'booking',
      sorter: (a: Item, b: Item) => a.booking,
      render: (v: number) => currenyFormat(v).replace('$', ''),
    },
    {
      title: 'Saldo',
      dataIndex: 'balance',
      key: 'balance',
      sorter: (a: Item, b: Item) => a.balance - b.balance,
      render: (v: number) => currenyFormat(v).replace('$', ''),
    },
    {
      title: '',
      key: 'action',

      render: (_: any) => (
        <Button
          onClick={() => {
            // showDetail(_);
            setItem(_);

            setViewModal(true);
          }}
          type="primary"
          shape="round"
        >
          Ver
        </Button>
      ),
    },
  ];

  /* const dataSourceFilter = dataTable.filter((e: any) => {
    return `${e.prospect.name} ${e.prospect.lastName} ${e.prospect.identification}`
      .toLowerCase()
      .includes(searchText.toLowerCase());
  }); */

  return (
    <div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl c-black m-0 p-0 flex">
            <img
              className="mr-2"
              src="https://www.flaticon.es/svg/static/icons/svg/892/892213.svg"
              width="25"
            />
            Administrador de cartera
          </h2>
        </div>
        <Divider />
        <div className="flex items-center">
          <Input.Search
            placeholder="Buscar Nombre, Identificaión"
            onChange={onSearchChange}
            onSearch={onSearch}
            enterButton
            style={{ width: 300 }}
          />
          {/* <Input
            placeholder="Buscar Nombre, Identificaión"
            suffix={<SearchOutlined />}
            onC
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 300 }}
          /> */}
          <RangePicker
            className="ml-5"
            defaultValue={[
              moment(rangeDate.startDate, dateFormat),
              moment(rangeDate.endDate, dateFormat),
            ]}
            format={dateFormat}
            onChange={async (dates: any, formatString: [string, string]) => {
              //console.log('formatString -->', formatString);
              onDateChange(dates, formatString);
            }}
          />
        </div>

        <MainTable
          columns={columns}
          //dataSourceFilter={dataSourceFilter}
          dataSourceFilter={dataSource}
        />

        {viewModal && (
          <Modal
            title=""
            visible={viewModal}
            onOk={() => {
              setViewModal(false);
            }}
            onCancel={() => {
              setViewModal(false);
              //historyRouter.push('/wallet');
              setIdQuote(null);
              setItem(null);
            }}
            width={1000}
            footer={false}
          >
            {item && (
              <WalletDetails
                client={item?.prospect}
                vehicle={item?.product}
                prebill={item?.prebill}
                lead={item?.lead}
                idNotificationQuote={idQuote}
                stateLead={item.status === 'Verificado'}
                setDataSource={setDataSource}
              />
            )}
          </Modal>
        )}

        <Loading visible={fetching} />
      </div>
    </div>
  );
};

const ProviderWallet: FunctionComponent<{}> = () => {
  const historyRouter = useHistory();
  const [data, setData] = useState<any | null>(null);
  const [dataTable, setDataTable] = useState<any>([]);
  const myParams = useParams();

  const updateStatusTableLeadRequest = (idLead: number) => {
    const returnDataChange: any = [];
    setDataTable((prevState: any) => {
      const dataPrevState = prevState!;
      //console.log('DATA🌎1', dataPrevState);
      if (dataPrevState) {
        const dataNew: any = dataPrevState.map((dataGeneral: any) => {
          //console.log('DATA🌎2', dataGeneral);
          const restructuredData = {
            ...dataGeneral,
            product: dataGeneral.product.map((dataProduct: any) => {
              const dataUpdateProduct = {
                ...dataProduct,
                delivery: {
                  ...dataProduct.delivery,
                  authorizathionStatus:
                    dataProduct.id === 116
                      ? 'Solicitado'
                      : dataProduct.delivery.authorizathionStatus,
                },
              };

              return dataUpdateProduct;
            }),
          };
          return restructuredData;
          //returnDataChange.push(restructuredData);
        });
        //console.log('DATA🌎3', dataNew);
        return dataNew;
      }
      return prevState;
    });
  };

  const onNotificationListener = (noti: INotification) => {
    // noti es una notificacion desde el ws
    if (noti.type === NOTIFICATION_TYPES.WALLET_APROVED_REQUESTED) {
      //console.log('Notificación Wallet🔴', noti.content.idLead);
      /* updateStatusTableLeadRequest(noti.content.idLead); */
    }
  };
  useEffect(() => {
    const stateVal: any = historyRouter.location.state;
    setData(stateVal !== undefined ? stateVal : {});
    SocketClient.instance.onNotificationStream.subscribe(
      onNotificationListener
    );
  }, []);

  const updateStatusTable = (QuoteEdit: any) => {
    const returnDataChange: any = [];

    dataTable.map((dataGeneral: any) => {
      const returnData: any = [];

      dataGeneral.product.map((d: any) => {
        if (d.id === QuoteEdit.id) {
          returnData.push(QuoteEdit);
        } else {
          returnData.push(d);
        }
        return true;
      });

      const restructuredData = {
        balance: dataGeneral.balance,
        booking: dataGeneral.booking,
        createdAt: dataGeneral.createdAt,
        ids: dataGeneral.ids,
        key: dataGeneral.key,
        lead: dataGeneral.lead,
        prebill: dataGeneral.prebill,
        prospect: dataGeneral.prospect,
        status: dataGeneral.status,
        total: dataGeneral.total,
        product: returnData,
      };
      returnDataChange.push(restructuredData);
      return true;
    });

    setDataTable(returnDataChange);
  };

  const updateStatusTableLead = (idLead: number) => {
    const returnDataChange: any = [];
    dataTable.map((dataGeneral: any) => {
      const restructuredData = {
        balance: dataGeneral.balance,
        booking: dataGeneral.booking,
        createdAt: dataGeneral.createdAt,
        ids: dataGeneral.ids,
        key: dataGeneral.key,
        lead: dataGeneral.lead,
        prebill: dataGeneral.prebill,
        prospect: dataGeneral.prospect,
        status: dataGeneral.key === idLead ? 'Verificado' : dataGeneral.status,
        total: dataGeneral.total,
        product: dataGeneral.product,
      };
      returnDataChange.push(restructuredData);
      return true;
    });
    setDataTable(returnDataChange);
  };
  //console.log('Status🟡', dataTable);
  return (
    <WalletContext.Provider
      value={{
        dataTable,
        setDataTable,
        updateStatusTable,
        updateStatusTableLead,
      }}
    >
      {data && <Wallet dataNotification={data} />}
    </WalletContext.Provider>
  );
};

const MainWalletpage = () => {
  return (
    <Menu page="Wallet">
      <ProviderWallet />
    </Menu>
  );
};

export default MainWalletpage;
