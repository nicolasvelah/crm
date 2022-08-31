/* eslint-disable implicit-arrow-linebreak */
import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  DatePicker,
  Divider,
  Button,
  Modal,
  notification,
  Tag,
} from 'antd';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
// @ts-ignore
import ReactExport from 'react-data-export';
import Get from '../../utils/Get';
import Loading from '../../components/Loading';
import { Dependencies } from '../../dependency-injection';
import QuotesRepository from '../../data/repositories/quotes-repository';
import ModalMechanicalContent from './components/ModalMechanicalContent';
import ClientsRepository from '../../data/repositories/clients-repository';
import milisecondsToDate from '../../utils/milisecondsToDate';
import { dataFilter } from '../Follow/components/MainFollow';
import Quotes, { PreOwnedSupplier } from '../../data/models/Quotes';

const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
interface RangeDates {
  startDate: string;
  endDate: string;
}

interface DataTable {
  key: string | number;
  adviser?: string;
  prospect?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  desiredPrice?: number;
  identification?: string;
  email?: string;
  phone?: string;
  stateMechanicAppraisal?: string;
  idLead?: number;
  idQuote?: number;
  type?: string;
  vehiculo?: any;
  createdAt?: string;
  createdAtConvert?: string;
  dataFormOwnedSupplier: PreOwnedSupplier | null;
  providerBussinessName?: string;
  providerIdentification?: string;
  providerPhone?: string;
  providerEmail?: string;
  providerAppraisalValue?: number;
  providerAcceptedAppraisal?: boolean;
}

const MechanicalAppraisalList = () => {
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const clientRepository = Get.find<ClientsRepository>(Dependencies.clients);

  const [loading, setLoading] = useState<boolean>(false);
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment()).format(dateFormat),
  });

  const [viewModal, setViewModal] = useState<boolean>(false);
  const [dataStateMechanical, setDataStateMechanical] = useState<DataTable[]>(
    []
  );
  const [dataS, setDataS] = useState<any>([]);
  const [selectedRowData, setSelectedRowData] = useState<object>({});

  // Filtros por nombre de asesor
  const [dataNameAsesor, setDataNameAsesor] = useState<dataFilter[]>([]);

  // Constantes para la exportación del .xls
  const { ExcelFile } = ReactExport;
  const { ExcelSheet } = ReactExport.ExcelFile;
  const { ExcelColumn } = ReactExport.ExcelFile;

  const dataGetMechanicalAppraisal = async (
    value: any,
    formatString: [string | null, string | null]
  ) => {
    setLoading(true);
    const getMechanical = await quouteRepository.getAppraisal({
      identificationClient: value ?? null,
      concessionaireInput: null,
      firstDate: formatString[0] ?? null,
      secondDate: formatString[1] ?? null,
      sucursalInput: null,
    });
    /* console.log(
      'getMechanical',
      getMechanical.filter((ap: any) => ap.mechanicalAppraisalQuote !== null)
    ); */

    const data: Array<DataTable> = [];
    const asesores: dataFilter[] = [];

    if (getMechanical) {
      getMechanical.map((dataMechanical: Quotes, index: number) => {
        if (dataMechanical.mechanicalAppraisalQuote !== null) {
          const asesor = {
            text: `${dataMechanical?.leads?.user?.nombre} ${dataMechanical?.leads?.user?.apellido}`,
            value: `${dataMechanical?.leads?.user?.nombre} ${dataMechanical?.leads?.user?.apellido}`,
          };
          const isNotNew = !!asesores.find((as) => as.text === asesor.text);
          if (!isNotNew) asesores.push(asesor);

          data.push({
            key: index,
            adviser: `${dataMechanical?.leads?.user.nombre} ${dataMechanical?.leads?.user?.apellido}`,
            prospect: `${dataMechanical?.leads?.client?.name} ${dataMechanical?.leads?.client?.lastName}`,
            createdAt:
              dataMechanical.createdAt ?? new Date().getTime().toString(),

            createdAtConvert: dataMechanical.createdAt
              ? milisecondsToDate(dataMechanical.createdAt)
              : moment().format(),

            identification:
              dataMechanical?.leads?.client?.identification ?? undefined,
            stateMechanicAppraisal:
              dataMechanical.acceptedAppraisal === null
                ? 'Pendiente'
                : dataMechanical.acceptedAppraisal === true
                ? 'Aceptado'
                : 'Rechazado',
            brand: dataMechanical?.mechanicalAppraisalQuote?.brand,
            model: dataMechanical?.mechanicalAppraisalQuote?.model,

            year: dataMechanical?.mechanicalAppraisalQuote?.year,
            mileage: dataMechanical?.mechanicalAppraisalQuote?.mileage,
            desiredPrice:
              dataMechanical?.mechanicalAppraisalQuote?.desiredPrice,

            email: dataMechanical?.leads?.client?.email ?? undefined,
            phone: dataMechanical?.leads?.client?.cellphone ?? undefined,
            idLead: dataMechanical.leads?.id,
            idQuote: dataMechanical.id,
            type: dataMechanical.type,
            vehiculo:
              dataMechanical?.vehiculo && dataMechanical?.vehiculo?.length > 0
                ? dataMechanical.vehiculo[0]
                : undefined,

            providerBussinessName:
              dataMechanical.preOwnedSupplier?.bussinessName ?? undefined,
            providerIdentification:
              dataMechanical.preOwnedSupplier?.identification ?? undefined,
            providerPhone: dataMechanical.preOwnedSupplier?.phone ?? undefined,
            providerEmail: dataMechanical.preOwnedSupplier?.email ?? undefined,
            providerAppraisalValue:
              dataMechanical.preOwnedSupplier?.appraisalValue ?? undefined,
            providerAcceptedAppraisal:
              dataMechanical.acceptedAppraisal ?? undefined,

            dataFormOwnedSupplier: dataMechanical.preOwnedSupplier ?? null,
          });
        }

        return true;
      });
    }

    setDataNameAsesor(asesores);
    setDataStateMechanical(data);
    setDataS(data);
    setLoading(false);
  };

  const getDataChemicalOptions = async (option: string) => {
    setLoading(true);
    const dataSource = dataS.filter((e: any) => {
      return `${e.prospect} ${e.identification} `
        .toLowerCase()
        .includes(option.toLowerCase());
    });

    if (dataSource.length === 0) {
      setLoading(false);
      notification.error({
        message: `No se pudo encontrar ${option}`,
      });
      return;
    }
    setDataStateMechanical(dataSource);
    setLoading(false);
  };

  useEffect(() => {
    const componentdidmount = async () => {
      await dataGetMechanicalAppraisal(null, [null, null]);
    };
    componentdidmount();
  }, []);

  const columns = [
    {
      title: 'Negocio',
      dataIndex: 'idLead',
      key: 'idLead',
    },
    {
      title: 'Asesor',
      dataIndex: 'adviser',
      key: 'adviser',
      filterMultiple: true,
      filters: dataNameAsesor,
      onFilter: (value: any, record: any) => {
        return record.adviser.indexOf(value) === 0;
      },
      sorter: (a: any, b: any) => a.adviser.length - b.adviser.length,
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Prospecto',
      dataIndex: 'prospect',
      key: 'prospect',
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
      title: 'Identificación',
      dataIndex: 'identification',
      key: 'identification',
    },
    {
      title: 'Estado',
      dataIndex: 'stateMechanicAppraisal',
      key: 'stateMechanicAppraisal',
      render: (value: any) => {
        return (
          <div>
            <Tag
              color={
                value === 'Pendiente'
                  ? 'gold'
                  : value === 'Aceptado'
                  ? 'green'
                  : 'red'
              }
            >
              {value}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Marca',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: 'Modelos',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Accion',
      dataIndex: 'accion',
      key: 'accion',
      render: (text: any, record: any) => (
        <div className="">
          <Button
            onClick={() => {
              setViewModal(true);
              setSelectedRowData(record);
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
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl c-black m-0 p-0 flex">
            <img
              className="mr-2"
              src="https://www.flaticon.es/svg/static/icons/svg/1831/1831357.svg"
              width="25"
            />
            Avalúos mecánicos
          </h2>
          <div>
            <ExcelFile
              element={
                <Button
                  style={{ marginRight: 5 }}
                  type="default"
                  size="large"
                  onClick={() => {
                    console.log('dataStateMechanical -->', dataStateMechanical);
                  }}
                  icon={<DownloadOutlined />}
                >
                  .xlsx
                </Button>
              }
            >
              <ExcelSheet data={dataStateMechanical} name="Avalúo Mecánico">
                <ExcelColumn label="Usuario" value="adviser" />
                <ExcelColumn label="Negocio" value="idLead" />
                <ExcelColumn label="Cotización" value="idQuote" />
                <ExcelColumn label="Prospecto" value="prospect" />
                <ExcelColumn
                  label="Identificación del Prospecto"
                  value="identification"
                />
                <ExcelColumn label="Email del Prospecto" value="email" />
                <ExcelColumn label="Celular del Prospecto" value="phone" />
                <ExcelColumn label="Marca" value="brand" />
                <ExcelColumn label="Modelo" value="model" />
                <ExcelColumn label="Año" value="year" />
                <ExcelColumn label="Kilometraje" value="mileage" />
                <ExcelColumn label="Precio deseado" value="desiredPrice" />

                <ExcelColumn
                  label="Razón Social"
                  value="providerBussinessName"
                />
                <ExcelColumn
                  label="Identificación del Proveedor"
                  value="providerIdentification"
                />
                <ExcelColumn
                  label="Calular del Proveedor"
                  value="providerPhone"
                />
                <ExcelColumn
                  label="Email del Proveedor"
                  value="providerEmail"
                />
                <ExcelColumn
                  label="Valor avalúo"
                  value="providerAppraisalValue"
                />
              </ExcelSheet>
            </ExcelFile>
          </div>
        </div>
        <Divider />
        <div className="mt-5 mb-2">
          <Search
            placeholder="Buscar Apellido, identificación"
            enterButton
            onSearch={async (val: string) => {
              await dataGetMechanicalAppraisal(val, [null, null]);
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value !== '') {
                return true;
              }
              return true;
            }}
            style={{ width: 400, marginRight: 20 }}
          />
          <RangePicker
            format="YYYY-MM-DD"
            defaultValue={[
              moment(rangeDate.startDate, dateFormat),
              moment(rangeDate.endDate, dateFormat),
            ]}
            onChange={async (dates: any, formatString: [string, string]) => {
              setRangeDate({
                startDate: formatString[0],
                endDate: formatString[1],
              });
              await dataGetMechanicalAppraisal(null, formatString);
            }}
          />
        </div>
      </div>
      <div className="mt-10">
        {dataStateMechanical && (
          <Table
            //columns={columns}
            pagination={{ position: ['bottomRight'] }}
            columns={columns}
            dataSource={dataStateMechanical}
            scroll={{ y: window.innerHeight * 0.55 }}
          />
        )}
      </div>
      {viewModal && (
        <Modal
          title="Detalles del avalúo mecánico"
          visible={viewModal}
          onOk={() => {
            setViewModal(false);
          }}
          onCancel={() => {
            setViewModal(false);
          }}
          width={800}
          footer={false}
        >
          <ModalMechanicalContent
            dataClientModalMechanical={selectedRowData}
            load={async () => {
              await dataGetMechanicalAppraisal(null, [null, null]);
            }}
            viewModal={() => {
              setViewModal(false);
            }}
          />
        </Modal>
      )}
      <Loading visible={loading} />
    </>
  );
};

export default MechanicalAppraisalList;
