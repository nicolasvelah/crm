/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Table,
  Input,
  DatePicker,
  Button,
  Divider,
  Tag,
  Modal,
  Tooltip,
  Alert,
} from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

// @ts-ignore
import {
  CheckOutlined,
  CopyOutlined,
  SmileOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
// @ts-ignore
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import milisecondsToDate from '../../utils/milisecondsToDate';
import Menu from '../../components/Template';
import Loading from '../../components/Loading';
import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import LeadsRepository from '../../data/repositories/leads-repository';
import {
  calcTotalQuotesGenerated,
  currenyFormat,
  calcLegals,
  allValuesOfQuote,
  getStateOfLead,
} from '../../utils/extras';
import Leads from '../../data/models/Leads';
import auth from '../../utils/auth';
import User from '../../data/models/User';
import { crypt, decrypt } from '../../utils/crypto';
import CreateLead from './components/CreateLead';
import UploadExcelBusiness from './components/UploadExcelBusiness';
import VchatContext from '../Vchat/components/VchatContext';
import DownloadExcel from './components/DownloadExcel';

const { Search } = Input;
const { RangePicker } = DatePicker;

interface DataLeads {
  //key: string;
  key: number;
  names: string;
  identification: string;
  brand: string[];
  user: string;
  state: string;
  amount: number;
  date: string;
  nextFollow: {
    type: string;
    date: string;
  } | null;
}

interface RangeDates {
  startDate: string;
  endDate: string;
}

export interface FilterTable {
  text: string;
  value: string;
}

const dateFormat = 'YYYY/MM/DD';

const Business: FunctionComponent = () => {
  return (
    <Menu page="Business">
      <BusinessPage />
    </Menu>
  );
};

const BusinessPage: FunctionComponent = () => {
  const { vchatActivated, setVchatActivated } = useContext(VchatContext);
  const { user } = auth;

  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const historyRouter = useHistory();
  // Estado para gestionar modal

  const [loading, setLoading] = useState<boolean>(false);
  const [userLog, setUserLog] = useState<User | null>(null);
  /// Estos dos estados sirven para el ordenamiento de la data de la Tabla
  const [filteredInfo, setFilteredInfo] = useState<any>(null);
  const [sortedInfo, setSortedInfo] = useState<any>(null);

  /// Data ordenada para mostrar en la tabla
  const [data, setData] = useState<DataLeads[]>([]);
  /// Data que nos servira para filtrar
  const [dataFilter, setDataFilter] = useState<any[]>([]);
  const [dataLead, setDataLead] = useState<Leads[]>([]);
  /// Estado nos permite buscara por cédula, email e identificación
  const [search, setSearch] = useState<string | null>(null);
  /// Rango de fechas a buscar
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment()).format(dateFormat),
  });

  const [usersForFilter, serUsersForFilter] = useState<
    { text: string; value: string }[]
  >([]);

  const verifyAllDeliveries = (lead: Leads): boolean => {
    const allDeliverys = lead.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => quo.delivery!);

    if (allDeliverys && allDeliverys.length > 0) {
      allDeliverys.forEach((element) => {
        if (!element.deliveryFinal) {
          return false;
        }
      });
      /* const deliveries = allDeliverys.find((all) => {
        let allOk = true;
        if (all && !all.deliveryFinal) {
          allOk = false;
        }
        return allOk;
      });

      return !deliveries; */
      return true;
    }
    return false;
  };

/*   const getStateOfLead = (myLead: Leads): string => {
    //console.log('lead getActualStep', {
    //   id: myLead.id,
    //   prebill: myLead.prebill,
    //   leadActual: myLead,
    // });
    if (myLead.saleDown && myLead.statusSaleDown === 'aprobada') {
      return 'Venta caída';
    }
    if (myLead.statusSaleDown === 'solicitada') {
      return 'Solicitud Venta caída';
    }
    if (
      myLead.prebill &&
      myLead.prebill.length > 0 &&
      myLead.prebill[0].accepted
    ) {
      return 'Entrega';
    }
    const noVim = myLead.quotes?.filter((quo) => {
      if (quo.type === 'credit') {
        const selectedBank = quo.quoteFinancial?.find((qf) => qf.selected);
        if (selectedBank && quo.vimVehiculo) {
          return true;
        }
      } else if (quo.type === 'counted' && quo.vimVehiculo) {
        return true;
      }
      return false;
    }).length;
    const noClosed = myLead.quotes?.filter((quo) => quo.closed === true).length;
    //console.log({ noVim, noClosed });
    if (
      typeof noVim === 'number' &&
      typeof noClosed === 'number' &&
      noVim !== 0 &&
      noVim === noClosed
    ) {
      return 'Prefactura';
    }

    if (
      myLead.quotes &&
      myLead.quotes.length > 0 &&
      myLead.quotes.find((q) => q.closed === true)
    ) {
      return 'Cierre';
    }
    if (myLead.quotes && myLead.quotes.length > 0) {
      return 'Cotización';
    }

    if (myLead.inquiry && myLead.inquiry.length > 0 && myLead.workPage) {
      return 'Demostración';
    }

    return 'Indagación';
  }; */

  const [viewModalCreateLead, setViewModalCreateLead] = useState<boolean>(
    false
  );
  const [viewModalUpload, setViewModalUpload] = useState<boolean>(false);

  const setDataList = (leads: Leads[]) => {
    const newData = leads
      .map((lead: Leads, index: number) => {
        const nextFollow: { type: string; date: string } | null = null;
        /* let amount = 0;
        lead.quotes!.forEach((el: any) => {
          amount += calcTotalQuotesGenerated(el);
        }); */
        const amount = lead.quotes?.reduce((accum, current) => {
          const valuesTotal = allValuesOfQuote(current).pvp;
          return valuesTotal + accum;
        }, 0);
        //console.log('amount -->', amount);
        ///Estado actual del Lead
        const status = getStateOfLead(lead, true);

        /* const noComplete = verifyAllDeliveries(lead);
        //console.log('COMPLETE', noComplete);
        if (noComplete) {
          status = 'Finalizado';
        } */

        let brand: string[] = [];
        if (lead.quotes && lead.quotes.length > 0) {
          brand = lead.quotes
            .filter((q) => q.vehiculo && q.vehiculo.length > 0 && q.closed)
            .map((q) => q?.vehiculo![0]?.brand ?? '')
            .filter((b) => b !== '');
          if (brand.length === 0) {
            brand = lead.quotes
              .filter((q) => q.vehiculo && q.vehiculo.length > 0)
              .map((q) => q?.vehiculo![0]?.brand ?? '')
              .filter((b) => b !== '');
          }
        }
        const uniqueBrands: string[] = [];
        brand.forEach((element) => {
          if (!uniqueBrands.includes(element)) uniqueBrands.push(element);
        });

        //console.log('brand -->', uniqueBrands);

        return {
          key: lead.id!,
          names: `${lead.client.name} ${lead.client.lastName}`,
          identification: lead.client.identification ?? 'No indentificación',
          brand: uniqueBrands,
          user: lead.toReasign ? 'Sin asesor' : `${lead.user.nombre} ${lead.user.apellido}`, // Los que se van a reasignar no los tomo en cuenta
          sucursal: lead.sucursal?.name,
          concesionario: lead.concesionario?.name,
          canal: lead.client.chanel,
          state: status,
          quotes: lead.quotes!.length >= 1 ? lead.quotes : null,
          amount: amount ?? 0,
          /* date: lead.createdAt
            ? milisecondsToDate(lead.createdAt)
            : moment().format(), */
          date: lead.createdAt!,
          nextFollow,
          temperature: lead.temperature,
          campaign: lead.campaign,
        };
      })
      .sort((a, b) => {
        /* if (parseInt(a.key) < parseInt(b.key)) {
          return 1;
        }
        if (parseInt(a.key) > parseInt(b.key)) {
          return -1;
        } */
        if (a.key < b.key) {
          return 1;
        }
        if (a.key > b.key) {
          return -1;
        }
        return 0;
      });
    console.log('newData', newData);
    setData(newData);
    setDataFilter(newData);

    /*  const dataReply = [newData[0]];
    console.log('newData FILTERED', dataReply);
    setData(dataReply);
    setDataFilter(dataReply); */

    const usersFilter: {
      text: string;
      value: string;
    }[] = [];

    newData.forEach((element) => {
      if (!usersFilter.find((userF) => element.user === userF.value)) {
        usersFilter.push({ text: element.user, value: element.user });
      }
    });
    console.log('usersFilter -->', usersFilter);
    serUsersForFilter(usersFilter);
  };

  /// Llamamos a la data de graphql
  async function getDataGraph(
    value: string,
    startDateGQ: string | null,
    endDateGQ: string | null
  ) {
    setLoading(true);
    const respGQL = await leadsRepository.getLeadsForUser(
      !startDateGQ ? null : startDateGQ || rangeDate.startDate,
      !endDateGQ ? null : endDateGQ || rangeDate.endDate,
      value
    );
    console.log('LeadsUser', respGQL);
    /// Busco el próximo seguimiento
    if (respGQL) {
      setDataList(respGQL);
      setDataLead(respGQL);
    }
    setLoading(false);
  }

  /// Configuración de la tabla
  const onChangeTable = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const filterSearch = async (valueSearch: string | null) => {
    //console.log('valueSearch', valueSearch);
    if (valueSearch === '' || valueSearch === null) {
      await getDataGraph('', rangeDate.startDate, rangeDate.endDate);
    } else {
      await getDataGraph(valueSearch, null, null);
    }
  };

  const goToLeadHistory = (idLead: number, identification: string) => {
    historyRouter.push(
      `/lead/id-lead=${idLead}/identification=${identification}`,
      {
        step: 0,
        id: identification,
        idLead,
      }
    );
  };

  const goToLead = (key: string) => {
    const selectedLead = dataFilter.find((dat) => dat.key === key);
    if (selectedLead) {
      goToLeadHistory(parseInt(key), selectedLead.identification);
    }
    //console.log('Lead no encontrado');
  };

  useEffect(() => {
    const componentdidmount = async () => {
      setUserLog(user);
      await getDataGraph('', rangeDate.startDate, rangeDate.endDate);
    };
    componentdidmount();
  }, []);

  useEffect(() => {
    const usersFilter: {
      text: string;
      value: string;
    }[] = [];

    dataFilter.forEach((element) => {
      if (!usersFilter.find((userF) => element.user === userF.value)) {
        usersFilter.push({ text: element.user, value: element.user });
      }
    });
    serUsersForFilter(usersFilter);
  }, [dataFilter]);

  const tagStatus = (value: string) => {
    let color = 'purple';
    if (value === 'Indagación') {
      color = 'gold';
    } else if (value === 'Demostración') {
      color = 'lime';
    } else if (value === 'Cotización') {
      color = 'cyan';
    } else if (value === 'Cierre') {
      color = 'geekblue';
    } else if (value === 'Prefactura') {
      color = 'magenta';
    } else if (value === 'Entrega') {
      color = 'volcano';
    } else if (value === 'Finalizado') {
      color = 'green';
    }
    return (
      <div>
        <Tag color={color}>{value}</Tag>
      </div>
    );
  };

  const columns = [
    {
      title: 'Id del negocio',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => {
        return parseInt(a.date) - parseInt(b.date);
      },
      render: (text: any, row: any) => {
        return text ? milisecondsToDate(text) : moment().format();
      },
    },
    {
      title: 'Marca',
      dataIndex: 'brand',
      key: 'brand',
      render: (text: any, row: any) => {
        return (
          <>
            {row.brand?.length > 0
              ? row.brand.map((r: any, index: number) => (
                <div key={index}>{r}</div>
                ))
              : 'Sin cotizaciones'}
          </>
        );
      },
    },
    {
      title: 'Prospecto',
      dataIndex: 'names',
      key: 'names',
      render: (text: any, row: any) => {
        return (
          <span
            className="regular c-black cursor-pointer"
            onClick={() => {
              goToLead(row.key);
            }}
            style={{ textTransform: 'capitalize' }}
          >
            {text.toLowerCase()}
          </span>
        );
      },
    },
    {
      title: 'Identificación',
      dataIndex: 'identification',
      key: 'identification',
    },
    {
      title: 'Sucursal',
      dataIndex: 'sucursal',
      key: 'sucursal',
    },
    {
      title: 'Concesionario',
      dataIndex: 'concesionario',
      key: 'concesionario',
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
      filters: [
        { text: 'Indagación', value: 'Indagación' },
        { text: 'Demostración', value: 'Demostración' },
        { text: 'Cotización', value: 'Cotización' },
        { text: 'Cierre', value: 'Cierre' },
        { text: 'Prefactura', value: 'Prefactura' },
        { text: 'Entrega', value: 'Entrega' },
        { text: 'Finalizado', value: 'Finalizado' },
        { text: 'Solicitud Venta caída', value: 'Solicitud Venta caída' },
        { text: 'Venta caída', value: 'Venta caída' },
      ],
      filterMultiple: false,
      onFilter: (val: any, record: any) => {
        return record.state.indexOf(val) === 0;
      },
      sorter: (a: any, b: any) => {
        return a.state.length - b.state.length;
      },
      render: (value: any) => {
        return tagStatus(value);
      },
      ellipsis: true,
    },
    {
      title: 'Temperatura',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (text: any, row: any) => <b>{text ?? 'Ninguna'}</b>,
    },
    {
      title: 'Campaña',
      dataIndex: 'campaign',
      key: 'campaign',
      render: (text: any, row: any) => <b>{text ?? 'Ninguna'}</b>,
    },
    {
      title: 'Monto total',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any, row: any) => (
        <span className="leading-none">{currenyFormat(text, true)}</span>
      ),
    },
    {
      title: '',
      dataIndex: 'view',
      key: 'view',
      render: (text: any, row: any) => (
        <div className="text-center">
          <Button
            onClick={() => {
              goToLead(row.key);
            }}
            type="primary"
            shape="round"
          >
            <span className="leading-none">Ver</span>
          </Button>
        </div>
      ),
    },
  ];

  if (
    userLog?.role === 'JEFE DE VENTAS' ||
    userLog?.role === 'GERENTE DE MARCA' ||
    userLog?.role === 'CALL CENTER' 
  ) {
    columns.unshift({
      title: 'Usuario',
      dataIndex: 'user',
      key: 'user',
      filters: usersForFilter,
      filterMultiple: true,
      onFilter: (val: any, record: any) => {
        return record.user === val;
      },
      ellipsis: true,
    } as any);
  }

  const calcTotal = (record: any) => {
    if (record) {
      return (
        (record.vehiculo ? record.vehiculo[0].pvp : 0) +
        (record.servicesValue ?? 0) +
        (record.accesoriesValue ?? 0) +
        (record.registration ?? 0) +
        (record.type === 'credit'
          ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
          : 0) +
        (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
      );
    }
    return 0;
  };

  return (
    <div>
      <div className="flex justify-between items-end mt-2">
        <h2 className="text-2xl c-black m-0 p-0 flex">
          <img
            className="mr-2"
            src="https://www.flaticon.es/svg/static/icons/svg/2313/2313955.svg"
            width="25"
          />{' '}
          Negocios
        </h2>
        <div style={{ display: 'flex' }}>
          <Button
            style={{ marginRight: 30, background: '#2ab258', border: 'none' }}
            icon={<UploadOutlined />}
            size="large"
            type="primary"
            shape="round"
            onClick={() => setViewModalUpload(true)}
          >
            Subir negocios
          </Button>
          <div style={{ marginRight: 5 }}>
            <DownloadExcel dataExcel={dataLead} />
          </div>
          {user.role !== 'CALL CENTER' && (
            <Button
              size="large"
              type="primary"
              onClick={() => {
                setViewModalCreateLead(true);
              }}
            >
              + Crear
            </Button>
          )}
        </div>
      </div>
      <Divider />
      <CreateLead
        setViewModal={setViewModalCreateLead}
        viewModal={viewModalCreateLead}
        listTable={{ list: dataFilter, setList: setDataFilter }}
      />

      <div className="flex justify-between items-end">
        <div>
          <Search
            placeholder="Buscar Id de negocio, Nombre, Apellido, Identificación del Prospecto"
            enterButton
            //value={search ?? undefined}
            onSearch={(val: string) => {
              filterSearch(val);
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value !== '') {
                setSearch(event.target.value);
                return;
              }
              setSearch(null);
            }}
            style={{ width: 400, marginRight: 20 }}
          />
          <RangePicker
            defaultValue={[
              moment(rangeDate.startDate, dateFormat),
              moment(rangeDate.endDate, dateFormat),
            ]}
            format={dateFormat}
            onChange={async (dates: any, formatString: [string, string]) => {
              setRangeDate({
                startDate: formatString[0],
                endDate: formatString[1],
              });
              await getDataGraph(
                search ?? '',
                formatString[0],
                formatString[1]
              );
            }}
          />
        </div>

        <div className="flex justify-end">
          <div className="mx-2">Total: {dataFilter.length}</div>
        </div>
      </div>
      <div className="w-full my-3">
        <Table
          pagination={{ position: ['bottomRight'] }}
          columns={columns}
          dataSource={dataFilter}
          onChange={onChangeTable}
          scroll={{ y: window.innerHeight * 0.55 }}
          rowKey="id"
        />
      </div>
      <Modal
        visible={viewModalUpload}
        footer={false}
        onCancel={() => setViewModalUpload(false)}
        width={600}
      >
        <UploadExcelBusiness />
      </Modal>

      <Loading visible={loading} />
    </div>
  );
};

export default Business;
