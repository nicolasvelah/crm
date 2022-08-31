/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DatePicker, Divider, Input, Table, Tag } from 'antd';
import moment from 'moment';

import milisecondsToDate from '../../../utils/milisecondsToDate';
import Loading from '../../../components/Loading';
import Get from '../../../utils/Get';
import TracingsRepository from '../../../data/repositories/tracings-repository';
import { Dependencies } from '../../../dependency-injection';
import ModalDetail from '../../../components/Follow/ModalDetail';
import ModalForm from '../../../components/Follow/ModalForm';
import auth from '../../../utils/auth';
import Tracings from '../../../data/models/Tracings';

const { Search } = Input;
const { RangePicker } = DatePicker;
export const dateFormat = 'YYYY/MM/DD';

export interface RangeDates {
  startDate: string;
  endDate: string;
}

export interface DataTracing {
  key: string;
  asesor: string;
  prospect: string;
  state: string;
  type: string;
  motive: string;
  priority: string;
  date: string;
  id: number;
  identification: string;
  email: string;
  datex: string;
  linkOffice365: { link: string }[];
}

export interface dataFilter {
  text: string;
  value: string;
}

const MainFollow: FunctionComponent = () => {
  /******************************HOOKS*****************************************/

  // DEPENDENCY INJECTION
  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  // DATA
  const [loading, setLoading] = useState<boolean>(false);
  // RANGO DE FECHAS A BUSCAR
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment().endOf('month')).format(dateFormat),
  });
  // DATA ORDENADA MOSTRAR EN TABLA
  const [data, setData] = useState<DataTracing[]>([]);
  // COUNT TRACINGS
  const [countTracings, setcountTracings] = useState<number | null>();
  const [countTracingsClosed, setcountTracingsClosed] = useState<
    number | null
  >();
  //DATOS DEL USUARIO
  const { user } = auth;
  // DATA PARA BUSCAR LOS TRACINGS
  const [dataAPI, setDataAPI] = useState<Tracings[]>([]);
  // Filtros por nombre de asesor
  const [dataNameAsesor, setDataNameAsesor] = useState<dataFilter[]>([]);
  // Filtros por nombre de prospecto
  const [dataNameProspect, setDataNameProspect] = useState<dataFilter[]>([]);

  const [allMotives, setAllMotives] = useState<dataFilter[]>([]);
  /******************************GENERALFUNCTION*******************************/

  //FUNCION QUE RETORNA LOS DATOS DE FILTRO DE LA TABLA FILTRADOS
  function filterFunction(dataInput: DataTracing[], value: number) {
    return dataInput
      .map((dataMap) => {
        if (value === 0) {
          return {
            text: dataMap.asesor,
            value: dataMap.asesor,
          };
        }
        if (value === 1) {
          return {
            text: dataMap.prospect,
            value: dataMap.prospect,
          };
        }
        return {
          text: '',
          value: '',
        };
      })
      .filter((presentValue, indexPresent, array) => {
        return (
          array.findIndex(
            (arrayValue) =>
              JSON.stringify(arrayValue) === JSON.stringify(presentValue)
          ) === indexPresent
        );
      });
  }

  // DATA DE GRAPHQL DATES
  async function getDataGraph(
    startDateGQ?: string,
    endDateGQ?: string,
    value?: string
  ) {
    setLoading(true);
    const respGQL = await tracingsRepository.getTracingsByDates(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate,
      value ?? null
    );
    // console.log('respGQL', respGQL);
    if (respGQL) {
      setDataAPI(respGQL);
      setcountTracings(respGQL?.length);
      let countCerrados = 0;
      const newDataTracingsDate: any = respGQL
        .map((items, index) => {
          const dateClosedorPending = items.closeDate ? 'Cerrado' : 'Pendiente';
          if (dateClosedorPending === 'Cerrado') {
            countCerrados += 1;
          }
          return {
            key: index.toString(),
            asesor: `${items.user?.nombre} ${items.user?.apellido}`,
            prospect: `${items.client?.name} ${items.client?.lastName}`,
            state: items.closeDate ? 'Cerrado' : 'Pendiente',
            type: items.type,
            motive: items.motive,
            priority: items.priority,
            date: milisecondsToDate(items.createdAt!, 'YYYY-MM-DD HH:mm:ss'),
            id: items.id,
            identification: items.client?.identification,
            datex: milisecondsToDate(
              items.executionDate!,
              'YYYY-MM-DD HH:mm:ss'
            ),
            email: items.client?.email,
            lead: items.leads?.id ?? null,
            createdAt: items.createdAt,
            executionDate: items.executionDate ?? items.createdAt,
            linkOffice365: items.linksOffice365 ?? [],
          };
        })
        .sort((a, b) => {
          if (parseInt(a.key) < parseInt(b.key)) {
            return 1;
          }
          if (parseInt(a.key) > parseInt(b.key)) {
            return -1;
          }
          return 0;
        });
      // DATOS DE LOS NOMBRES ASESORES FILTRO TABLA
      const dataAsesorMap: dataFilter[] = filterFunction(
        newDataTracingsDate,
        0
      );
      setDataNameAsesor(dataAsesorMap);
      const dataProspectMap: dataFilter[] = filterFunction(
        newDataTracingsDate,
        1
      );
      setDataNameProspect(dataProspectMap);
      setcountTracingsClosed(countCerrados);
      setData(newDataTracingsDate);
    }
    setLoading(false);
  }

  function searchDataFilter(valueInput: string) {
    setLoading(true);
    const searchData = dataAPI.filter((dataFilter) => {
      if (user?.role === 'ASESOR COMERCIAL') {
        return (
          dataFilter.client?.lastName?.toLocaleLowerCase() ===
            valueInput.toLocaleLowerCase() ||
          dataFilter.client?.email?.toLocaleLowerCase() ===
            valueInput.toLocaleLowerCase() ||
          dataFilter.client?.identification?.toLocaleLowerCase() ===
            valueInput.toLocaleLowerCase()
        );
      }
      return (
        dataFilter.client?.lastName?.toLocaleLowerCase() ===
          valueInput.toLocaleLowerCase() ||
        dataFilter.client?.email?.toLocaleLowerCase() ===
          valueInput.toLocaleLowerCase() ||
        dataFilter.client?.identification?.toLocaleLowerCase() ===
          valueInput.toLocaleLowerCase() ||
        dataFilter.user?.apellido?.toLocaleLowerCase() ===
          valueInput.toLocaleLowerCase()
      );
    });
    if (searchData) {
      setcountTracings(searchData?.length);
      let countCerrados = 0;
      const newDataTracingsDate: any = searchData.map((items, index) => {
        const dateClosedorPending = items.closeDate ? 'Cerrado' : 'Pendiente';
        if (dateClosedorPending === 'Cerrado') {
          countCerrados += 1;
        }
        return {
          key: index.toString(),
          asesor: `${items.user?.nombre} ${items.user?.apellido}`,
          prospect: `${items.client?.name} ${items.client?.lastName}`,
          state: items.closeDate ? 'Cerrado' : 'Pendiente',
          type: items.type,
          motive: items.motive,
          priority: items.priority,
          date: milisecondsToDate(items.createdAt!, 'YYYY-MM-DD HH:mm:ss'),
          id: items.id,
          identification: items.client?.identification,
          datex: milisecondsToDate(items.executionDate!, 'YYYY-MM-DD HH:mm:ss'),
          email: items.client?.email,
          linkOffice365: items.linksOffice365 ?? [],
        };
      });
      setcountTracingsClosed(countCerrados);
      setData(newDataTracingsDate);
    }
    setLoading(false);
  }

  const getAllMotives = (tracings: DataTracing[]): dataFilter[] => {
    const motives: dataFilter[] = [];
    tracings.forEach((item) => {
      if (!motives.find((m) => m.value === item.motive)) {
        motives.push({
          text: item.motive!,
          value: item.motive!,
        });
      }
    });
    return motives;
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await getDataGraph();
    };
    componentdidmount();
  }, []);

  useEffect(() => {
    const resp = getAllMotives(data);
    setAllMotives(resp);
  }, [data]);

  /*******************************TABLESTRUCT**********************************/

  const allColumns = [
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
      dataIndex: 'prospect',
      key: 'prospect',
      filterMultiple: false,
      filters: dataNameProspect,
      onFilter: (value: any, record: any) => {
        return record.prospect.indexOf(value) === 0;
      },
      sorter: (a: any, b: any) => a.prospect.length - b.prospect.length,
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Identificación',
      dataIndex: 'identification',
      key: 'identification',
      filterMultiple: false,
      sorter: (a: any, b: any) =>
        a.identification.length - b.identification.length,
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      filterMultiple: false,
      sorter: (a: any, b: any) => a.email.length - b.email.length,
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
      filters: [
        {
          text: 'Cerrado',
          value: 'Cerrado',
        },
        {
          text: 'Pendiente',
          value: 'Pendiente',
        },
      ],
      filterMultiple: false,
      onFilter: (value: any, record: any) => {
        return record.state.indexOf(value) === 0;
      },
      sorter: (a: any, b: any) => a.state.length - b.state.length,
      render: (value: any) => {
        if (value === 'Cerrado') {
          return (
            <div>
              <Tag color="green">{value}</Tag>
            </div>
          );
        }
        if (value === 'Pendiente') {
          return (
            <div>
              <Tag color="gold">{value}</Tag>
            </div>
          );
        }
        return (
          <div>
            <Tag color="">{value}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: 'Llamada',
          value: 'Llamada',
        },
        {
          text: 'Cita',
          value: 'Cita',
        },
        {
          text: 'Cita Virtual',
          value: 'Cita Virtual',
        },
        {
          text: 'Mail',
          value: 'Mail',
        },
      ],
      filterMultiple: true,
      onFilter: (value: any, record: any) => record.type.indexOf(value) === 0,
      sorter: (a: any, b: any) => a.type.length - b.type.length,
    },
    {
      title: 'Negocio',
      dataIndex: 'lead',
      key: 'lead',
      render: (text: any, row: any) => (
        <div className="text-right">{text !== null ? text : 'Sin negocio'}</div>
      ),
    },
    {
      title: 'Motivo',
      dataIndex: 'motive',
      key: 'motive',
      filters: allMotives,
      filterMultiple: true,
      onFilter: (value: any, record: any) => record.motive.indexOf(value) === 0,
      sorter: (a: any, b: any) => a.motive.length - b.motive.length,
      render: (value: any) => {
        if (value === 'Test Drive') {
          return (
            <div>
              <Tag color="magenta">{value}</Tag>
            </div>
          );
        }
        if (value === 'Demostracion') {
          return (
            <div>
              <Tag color="volcano">{value}</Tag>
            </div>
          );
        }
        if (value === 'Indagacion') {
          return (
            <div>
              <Tag color="purple">{value}</Tag>
            </div>
          );
        }
        if (value === 'Cotizacion') {
          return (
            <div>
              <Tag color="geekblue">{value}</Tag>
            </div>
          );
        }
        return (
          <div>
            <Tag color="">{value}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Prioridad',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        {
          text: 'Baja',
          value: 'Baja',
        },
        {
          text: 'Alta',
          value: 'Alta',
        },
      ],
      filterMultiple: true,
      onFilter: (value: any, record: any) =>
        record.priority.indexOf(value) === 0,
      sorter: (a: any, b: any) => a.priority.length - b.priority.length,
      render: (value: any) => {
        if (value === 'Alta') {
          return (
            <div>
              <Tag color="red">{value}</Tag>
            </div>
          );
        }
        if (value === 'Baja') {
          return (
            <div>
              <Tag color="blue">{value}</Tag>
            </div>
          );
        }
        return null;
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
      title: 'Fecha de ejecución',
      dataIndex: 'executionDate',
      key: 'executionDate',
      width: 180,
      sorter: (a: any, b: any) => {
        return parseInt(a.executionDate) - parseInt(b.executionDate);
      },
      render: (text: any, row: any) =>
        text ? milisecondsToDate(text) : moment().format(),
    },
    {
      title: '',
      dataIndex: 'view',
      key: 'view',
      render: (text: any, row: any) => (
        <div className="text-right">
          <ModalDetail tracing={row} optionBtn setDataTableTracings={setData} />
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
    <>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl c-black m-0 p-0 flex">
            <img
              className="mr-2"
              src="https://www.flaticon.es/svg/static/icons/svg/892/892223.svg"
              width="25"
            />{' '}
            Mis Seguimientos
          </h2>
          <ModalForm
            indetificationModal={null}
            optionBtn
            setDataTableTracings={setData}
          />
        </div>
        <Divider />
        <div className="flex justify-between content-center mt-5 mb-2">
          <div>
            <Search
              className="mr-5"
              style={{ width: 400 }}
              placeholder="Buscar Id de negocio, Nombre, Apellido, Identificación del Prospecto"
              enterButton
              onSearch={async (value: string) => {
                //searchDataFilter(value);
                await getDataGraph(undefined, undefined, value);
              }}
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
                await getDataGraph(formatString[0], formatString[1]);
              }}
            />
          </div>
        </div>

        <div className="flex justify-end content-center my-5 text-blue-600">
          <div className="pr-3">
            Abiertos:{' '}
            <strong>
              {countTracings! - countTracingsClosed!
                ? countTracings! - countTracingsClosed!
                : 0}
            </strong>
          </div>
          <div className="pr-3">
            Cerrados: <strong>{countTracingsClosed}</strong>
          </div>
          <div>
            Total: <strong>{countTracings}</strong>
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ y: window.innerHeight * 0.6 }}
          />
        </div>
      </div>
      <Loading visible={loading} />
    </>
  );
};

export default MainFollow;
