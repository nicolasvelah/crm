/* eslint-disable implicit-arrow-linebreak */
import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  Table,
  Input,
  DatePicker,
  message,
  Button,
  Divider,
  Modal,
  Tag,
} from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import {
  ArrowRightOutlined,
  DownloadOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
// @ts-ignore
import ReactExport from 'react-data-export';
import columsProspect from '../../components/Prospect/ColumsTableProspect';
import milisecondsToDate from '../../utils/milisecondsToDate';
import Menu from '../../components/Template';
import Loading from '../../components/Loading';
import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import ClientsRepository from '../../data/repositories/clients-repository';
import auth from '../../utils/auth';
import Client from '../../data/models/Client';

const { Search } = Input;
const { RangePicker } = DatePicker;

interface DataProspect {
  key: string;
  names: string;
  type: string;
  id: string;
  phone: string;
  mail: string;
  canal: string;
  campaign: string;
  status: string;
  date: string;
  nextFollow: {
    type: string;
    date: string;
  } | null;
}

interface DataGQL {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  cellphone: string;
  socialRazon: string;
  email: string;
  typeIdentification: string;
  identification: string;
  chanel: string;
  campaign: string;
  createdAt: string;
  tracings: Array<Tracings>;
}

interface Tracings {
  id: number;
  type: string;
  motive: string;
  priority: string;
  executionDate: string;
  closeDate: string;
  createdAt: string;
  closeNote: string;
  openingNote: string;
}

interface RangeDates {
  startDate: string;
  endDate: string;
}

export interface FilterTable {
  text: string;
  value: string;
}

const switchTypeIdentification = (type: string): string => {
  switch (type) {
    case 'Cédula':
    case 'C':
      return 'Cédula';
    case 'R':
    case 'RUC':
      return 'RUC';
    default:
      return 'Pasaporte';
  }
};

const dateFormat = 'YYYY/MM/DD';

/* const queryGetClient = (identification: string) => `{
  getClientsByIdentification(identification: "${identification}"){
    id
    name
    lastName
    phone
    cellphone
    socialRazon
    email
    typeIdentification
    identification
    chanel
    campaign
    createdAt
    tracings {
      id
      type
      motive
      priority
      executionDate
      closeDate
      createdAt
      closeNote
      openingNote
    }
  }
}`; */

const MainProspect: FunctionComponent = () => {
  return (
    <Menu page="Prospectos">
      <MainMainProspect />
    </Menu>
  );
};

const MainMainProspect: FunctionComponent = () => {
  /******************************HOOKS*****************************************/
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  //const [store, dispatch] = useReducer(reducer, initState);
  const historyRouter = useHistory();

  const { user } = auth;

  const [loading, setLoading] = useState<boolean>(false);
  //Data original traida desde graphql
  const [dataClient, setDataClient] = useState<Client[] | null>(null);
  //Modal cuando tenga mas de un lead
  const [showModalLeads, setModalShowLeads] = useState<boolean>(false);
  //Si un prospecto tiene mas de un negocio, se guardan los ids de los negocios
  // para que el usuario pueda escoger que negocio quiere ver
  const [idsLeads, setIdsLeads] = useState<number[] | null>(null);
  const [identificationClient, setIdentificationClient] = useState<
    string | null
  >(null);

  /// Estos dos estados sirven para el ordenamiento de la data de la Tabla
  const [filteredInfo, setFilteredInfo] = useState<any>(null);
  const [sortedInfo, setSortedInfo] = useState<any>(null);

  /// Data ordenada para mostrar en la tabla
  const [data, setData] = useState<DataProspect[]>([]);
  /// Data que nos servira para filtrar
  const [dataFilter, setDataFilter] = useState<DataProspect[]>([]);
  /// Estado nos permite buscara por cédula, email e identificación
  // eslint-disable-next-line no-unused-vars
  const [search, setSearch] = useState<string | null>(null);
  /// Columnas quen os sirve para la creación de las tablas
  const [columns, setColums] = useState<any[]>([]);
  /// Rango de fechas a buscar
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment()).format(dateFormat),
  });
  const [actualChanels, setActualChanels] = useState<
    {
      text: string;
      value: string;
    }[]
  >([]);
  const [actualCampaing, setActualCampaing] = useState<
    {
      text: string;
      value: string;
    }[]
  >([]);

  // Constantes para la exportación del .xls
  const [xlsxClient, setXlsxClient] = useState<Client[]>([]);
  const { ExcelFile } = ReactExport;
  const { ExcelSheet } = ReactExport.ExcelFile;
  const { ExcelColumn } = ReactExport.ExcelFile;
  const [activeDowloading, setActiveDowloading] = useState<boolean>(true);

  /******************************GENERALFUNCTIONAPI****************************/

  const setViewProspect = (route: string, dataToSend?: any) => {
    historyRouter.push(route, dataToSend);
  };

  const setDataList = (clients: any[]) => {
    const newData = clients.map((client: DataGQL) => {
      const nextFollow: { type: string; date: string } | null = null;

      return {
        key: client.id.toString(),
        names: `${client.name} ${client.lastName}`,
        type: client.typeIdentification,
        id: client.identification,
        phone: client.cellphone,
        mail: client.email,
        canal: client.chanel,
        campaign: client.campaign,
        status: 'Aprobaciones',
        date: milisecondsToDate(client.createdAt),
        nextFollow,
      };
    });

    /// Filtro todas los canales
    const myChanels = clients
      .map((client: DataGQL) => {
        return { text: client.chanel, value: client.chanel };
      })
      .filter((presentValue, indexPresent, array) => {
        // eslint-disable-next-line max-len
        return (
          array.findIndex(
            (arrayValue) =>
              JSON.stringify(arrayValue) === JSON.stringify(presentValue)
          ) === indexPresent
        );
      });
    setActualChanels(myChanels);
    //console.log('myChanels', myChanels);

    /// Filtro todas las campañas
    const myCampaings = clients
      .map((client: DataGQL) => {
        return { text: client.campaign, value: client.campaign };
      })
      .filter((presentValue, indexPresent, array) => {
        // eslint-disable-next-line max-len
        return (
          array.findIndex(
            (arrayValue) =>
              JSON.stringify(arrayValue) === JSON.stringify(presentValue)
          ) === indexPresent
        );
      });
    setActualCampaing(myCampaings);
    //console.log('myCampaings', myCampaings);

    /// Actualizo las columnas
    const myColumns = columsProspect(
      sortedInfo,
      filteredInfo,
      setViewProspect,
      myChanels,
      myCampaings
    );
    //console.log({ myColumns });

    setColums(myColumns);
    setData(newData);
    setDataFilter(newData);
  };

  /// Llamamos a la data de graphql
  async function getDataGraph(startDateGQ?: string, endDateGQ?: string) {
    setLoading(true);
    const respGQL = await clientsRepository.getClientsByBosses(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate
    );
    //console.log('respGQL prospects', respGQL);
    /// Busco el próximo seguimiento
    if (respGQL) {
      setDataClient(respGQL);
      setDataList(respGQL);
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
      await getDataGraph();
      return;
    }
    if (valueSearch) {
      setLoading(true);
      const clientsGRAPHQL = await clientsRepository.getClientsByIdentificationOrLastName(
        valueSearch
      );
      /* const clientsGRAPHQL = await clientsRepository.getClientsByBosses(
        valueSearch
      ); */
      //console.log({ clientsGRAPHQL });
      if (clientsGRAPHQL && clientsGRAPHQL.length > 0) {
        setDataList(clientsGRAPHQL);
        setDataClient(clientsGRAPHQL);
      } else {
        message.error('Cliente no encontrado');
      }
      setLoading(false);
    }
    //console.log('result', result);
    //setDataFilter(result);
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

  const closeModalLeads = () => {
    //console.log('cerro');
    setIdsLeads(null);
    setIdentificationClient(null);
    setModalShowLeads(false);
  };

  const goToLead = (identification: string) => {
    const selectedClient = dataClient?.find(
      (dat) => dat.identification === identification
    );
    //console.log({ selectedClient });
    if (selectedClient) {
      setIdentificationClient(identification);
      if (selectedClient.leads && selectedClient.leads.length > 0) {
        if (selectedClient.leads.length === 1) {
          goToLeadHistory(selectedClient.leads[0].id!, identification);
          closeModalLeads();
        } else {
          //console.log('Existen mas leads', user);
          const ids = selectedClient.leads
            .filter((leadItem) => {
              try {
                let leadOk = false;
                if (user.role === 'CALL CENTER') {
                  leadOk = true;
                } else if (user.concesionario && user.sucursal) {
                  user.concesionario.forEach((con: string) => {
                    user.sucursal.forEach((suc: string) => {
                      if (
                        con === leadItem.concesionario?.code &&
                        suc === leadItem.sucursal?.code
                      ) {
                        leadOk = true;
                      }
                    });
                  });
                }
                return leadOk;
              } catch (error) {
                //console.log('Error en ids Leads', error.message);
                return false;
              }
            })
            .map((lds) => lds.id!);
          setIdsLeads(ids);
          setModalShowLeads(true);
        }
      } else {
        //console.log('EL PROSPECTO NO POSEE LEADS');
        closeModalLeads();
      }
      return;
    }
    //console.log('Cliente no encontrado');
    closeModalLeads();
  };

  // Llama al resolver para el ExcelProspect
  const getDataGraphToExcel = async (
    startDateGQ?: string,
    endDateGQ?: string
  ) => {
    setLoading(true);
    const respGQL = await clientsRepository.getClientsByBosses(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate
    );
    if (respGQL) {
      //Seteo la data para el excel
      const myExcel: Client[] = respGQL.map((dataMap) => {
        return {
          id: dataMap.id,
          name: dataMap.name,
          lastName: dataMap.lastName,
          birthdate: dataMap.birthdate
            ? milisecondsToDate(dataMap.birthdate, 'YYYY-MM-DD')
            : '',
          phone: dataMap.phone,
          cellphone: dataMap.cellphone,
          socialRazon: dataMap.socialRazon,
          email: dataMap.email,
          typeIdentification: dataMap.typeIdentification,
          identification: dataMap.identification,
          chanel: dataMap.chanel,
          campaign: dataMap.campaign,
          city: dataMap.city,
        };
      });
      //console.log('dataExcel', myExcel);
      setXlsxClient(myExcel);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await getDataGraph();
    };
    componentdidmount();
    /// Nos servirá par el manejo de pantallas
    // eslint-disable-next-line
  }, []);

  /*******************************RETURN***************************************/

  return (
    <div>
      <div className="flex justify-between items-end mt-2">
        <h2 className="text-2xl c-black m-0 p-0 flex">
          <img
            className="mr-2"
            src="https://www.flaticon.es/svg/static/icons/svg/748/748004.svg"
            width="25"
          />{' '}
          Prospectos
        </h2>
        <div>
          {activeDowloading ? (
            <Button
              style={{ marginRight: 5 }}
              type="default"
              size="large"
              onClick={async () => {
                const dowloading = await getDataGraphToExcel();
                if (dowloading) {
                  setActiveDowloading(false);
                } else {
                  setActiveDowloading(true);
                }
              }}
              icon={<FileSearchOutlined />}
            >
              Info
            </Button>
          ) : (
            <ExcelFile
              element={
                <Button
                  style={{ marginRight: 5 }}
                  type="default"
                  size="large"
                  icon={<DownloadOutlined />}
                >
                  .xlsx
                </Button>
              }
            >
              <ExcelSheet data={xlsxClient} name="Prospecto">
                <ExcelColumn label="id" value="id" />
                <ExcelColumn label="name" value="name" />
                <ExcelColumn label="lastName" value="lastName" />
                <ExcelColumn label="birthdate" value="birthdate" />
                <ExcelColumn label="phone" value="phone" />
                <ExcelColumn label="cellphone" value="cellphone" />
                <ExcelColumn label="socialRazon" value="socialRazon" />
                <ExcelColumn label="email" value="email" />
                <ExcelColumn
                  label="typeIdentification"
                  value="typeIdentification"
                />
                <ExcelColumn label="identification" value="identification" />
                <ExcelColumn label="chanel" value="chanel" />
                <ExcelColumn label="campaign" value="campaign" />
              </ExcelSheet>
            </ExcelFile>
          )}
          {user.role !== 'CALL CENTER' && (
            <Button
              type="primary"
              className="px-5"
              size="large"
              onClick={() => setViewProspect('/prospect/form')}
            >
              + Crear
            </Button>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex justify-between items-end">
        <div>
          <Search
            placeholder="Buscar por identificación, nombre o apellido "
            enterButton
            onSearch={(val: string) => {
              //console.log(val);
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
              //console.log({ dates, formatString });
              setRangeDate({
                startDate: formatString[0],
                endDate: formatString[1],
              });
              await getDataGraph(formatString[0], formatString[1]);
            }}
          />
        </div>

        <div className="flex justify-end">
          <div className="mx-2">Total: {dataFilter.length}</div>
        </div>
      </div>
      <div className="w-full my-3">
        <Table
          //columns={columns}
          pagination={{ position: ['bottomRight'] }}
          columns={[
            {
              title: 'Nombres',
              dataIndex: 'names',
              key: 'names',
              render: (text: string, row: DataProspect, index: number) => {
                return (
                  <span
                    className="regular c-black cursor-pointer"
                    onClick={() => {
                      goToLead(row.id);
                      /* setViewProspect('/prospect/details', {
                        identification: row.id,
                      }); */
                    }}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {text.toLowerCase()}
                  </span>
                );
              },
            },
            {
              title: 'Fecha',
              dataIndex: 'date',
              key: 'date',
              width: 180,
              sorter: (a: DataProspect, b: DataProspect) => {
                const date1 = moment(a.date, 'DD/MM/YYYY HH:mm:ss').valueOf();
                const date2 = moment(b.date, 'DD/MM/YYYY HH:mm:ss').valueOf();
                const diff = date1 - date2;
                return diff;
              },
              sortOrder:
                sortedInfo &&
                sortedInfo.columnKey === 'date' &&
                sortedInfo.order,
            },
            {
              title: 'Tipos',
              dataIndex: 'type',
              key: 'type',
              width: 120,
              filters: [
                { text: 'Cédula', value: 'CEDULA' },
                { text: 'RUC', value: 'RUC' },
                { text: 'Pasaporte', value: 'PASAPORTE' },
              ],
              filteredValue: filteredInfo ? filteredInfo.type : null,
              onFilter: (val: any, record: any) => {
                //console.log({ val, record });
                if (record.type) {
                  return record.type.includes(val);
                }
                return false;
              },
              /* sorter: (a: DataProspect, b: DataProspect) => {
                ////console.log('a:', a, 'b:', b);
                return a.type.length - b.type.length;
              }, */
              sortOrder:
                sortedInfo &&
                sortedInfo.columnKey === 'type' &&
                sortedInfo.order,
              ellipsis: true,
            },
            {
              title: 'Identificación',
              dataIndex: 'id',
              key: 'id',
              width: 160,
              /* sorter: (a: DataProspect, b: DataProspect) =>
                a.id.length - b.id.length, */
              sortOrder:
                sortedInfo && sortedInfo.columnKey === 'id' && sortedInfo.order,
            },
            {
              title: 'Celular',
              width: 120,
              dataIndex: 'phone',
              key: 'phone',
              /* sorter: (a: DataProspect, b: DataProspect) =>
                a.phone.length - b.phone.length, */
              sortOrder:
                sortedInfo &&
                sortedInfo.columnKey === 'phone' &&
                sortedInfo.order,
            },
            {
              title: 'Correo',
              dataIndex: 'mail',
              key: 'mail',
              /* sorter: (a: DataProspect, b: DataProspect) =>
                a.mail.length - b.mail.length, */
              sortOrder:
                sortedInfo &&
                sortedInfo.columnKey === 'mail' &&
                sortedInfo.order,
            },
            {
              title: 'Canal',
              dataIndex: 'canal',
              key: 'canal',
              filters: actualChanels,
              filteredValue: filteredInfo ? filteredInfo.canal : null,
              onFilter: (val: any, record: any) => {
                //console.log({ val, record });
                if (record.canal) {
                  return record.canal.includes(val);
                }
                return false;
              },
              /* sorter: (a: DataProspect, b: DataProspect) => {
                ////console.log('a:', a, 'b:', b);
                return a.canal.length - b.canal.length;
              }, */
              sortOrder:
                sortedInfo &&
                sortedInfo.columnKey === 'canal' &&
                sortedInfo.order,
              ellipsis: true,
            },
            {
              title: 'Campaña',
              dataIndex: 'campaign',
              key: 'campaign',
              /* filters: [
                { text: 'No', value: 'No' },
                { text: 'Día de la madre', value: 'Día de la madre' },
                { text: 'Día de la padre', value: 'Día de la padre' },
              ], */
              filters: actualCampaing,
              filteredValue: filteredInfo ? filteredInfo.campaign : null,
              onFilter: (val: any, record: any) => {
                ////console.log({ value, record });
                if (record.campaign) {
                  return record.campaign.includes(val);
                }
                return false;
              },
              /* sorter: (a: DataProspect, b: DataProspect) => {
                ////console.log('a:', a, 'b:', b);
                return a.campaign.length - b.campaign.length;
              }, */
              sortOrder:
                sortedInfo &&
                sortedInfo.columnKey === 'campaign' &&
                sortedInfo.order,
              ellipsis: true,
            },
            {
              title: '',
              dataIndex: 'view',
              key: 'view',
              fixed: 'right',
              render: (text: any, row: any) => (
                <div className="text-right">
                  <Button
                    onClick={() => {
                      goToLead(row.id);
                      /* setViewProspect('/prospect/details', {
                        identification: row.id,
                      }); */
                    }}
                    type="primary"
                    shape="round"
                  >
                    <span className="leading-none">Ver</span>
                  </Button>
                </div>
              ),
            },
          ]}
          dataSource={dataFilter}
          onChange={onChangeTable}
          scroll={{ y: window.innerHeight * 0.55 }}
        />
      </div>
      <Modal
        title="Escoge un negocio"
        visible={showModalLeads}
        width={300}
        onCancel={closeModalLeads}
        footer={[
          <Button key="back" onClick={closeModalLeads}>
            Regresar
          </Button>,
        ]}
      >
        {showModalLeads && idsLeads && (
          <div>
            {idsLeads.map((idLead, index) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 4,
                }}
                key={index}
              >
                <span>
                  Negocio: <Tag color="#108ee9">No: {idLead}</Tag>
                </span>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<ArrowRightOutlined />}
                  onClick={() => {
                    if (identificationClient) {
                      goToLeadHistory(idLead, identificationClient);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
      <Loading visible={loading} />
    </div>
  );
};

export default MainProspect;
