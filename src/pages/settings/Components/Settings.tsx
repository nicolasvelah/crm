/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { FunctionComponent, useEffect, useState } from 'react';
import '../css/formRateTerm.css';
import '../css/settings.scss';
import {
  DeleteOutlined,
  EyeOutlined,
  CaretRightOutlined,
  SaveOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Divider,
  Table,
  Button,
  Modal,
  Collapse,
  Popconfirm,
  message,
  Input,
  Form,
  InputNumber,
  Alert,
  Row,
  Col,
  Tabs,
} from 'antd';
import auth from '../../../utils/auth';
import Get from '../../../utils/Get';
import FinancialRepository from '../../../data/repositories/financial-repository';
import { Dependencies } from '../../../dependency-injection';
import Financial from '../../../data/models/Financial';
import SettingsRepo from '../../../data/models/Settings';
import ModalSettings from './ModalSettings';
import SettingsEmail from './SettingsEmail';
import Loading from '../../../components/Loading';
import milisecondsToDate from '../../../utils/milisecondsToDate';
import SettingsRepository from '../../../data/repositories/settings-repository';
import { dataFilter } from '../../Follow/components/MainFollow';
import { currenyFormat } from '../../../utils/extras';
import SelectVehicleInquiry from '../../../components/Inquiry/components/SelectVehicleInquiry';
import DeliveryDocuments from './DeliveryDocuments';
import ObjectivesTable from './objectives/ObjectivesTable';
import ObjectivesAccesoriesTable from './objectives/ObjectivesAccesoriesTable';
import ObjectivesFunnelTable from './objectives/ObjectivesFunnelTable';
import ObjectivesAlliesTable from './objectives/ObjectivesAlliesTable';
import {
  Documents,
  DeliveryDocumentsCase,
} from '../../lead/steps/delivery/utils/delivery_documents';
import SelectSucursal from '../../lead/steps/new-credit-application/components/SelectSucursal';
import CRMRepository from '../../../data/repositories/CRM-repository';
import UploadExcelObjectives from './UploadExcelObjectives';
import UploadExcelObjectivesAcces from './UploadExcelObjectivesAcces';
import UploadExcelObjectivesAllies from './UploadExcelObjectivesAllies';
import { IDataConcessionaire } from '../../contactar/interfaces/iContactar';
import { ucs2 } from 'punycode';
import SettingsRatesMonths from './SettingsRatesMonths';

const { user } = auth;

const { Panel } = Collapse;

const { TabPane } = Tabs;
export interface TableEntity {
  key: number;
  entity?: string;
  typeEntity?: string;
  contact: string;
  createdAt: any;
  phoneEntityFinancial?: string;
  emailcontact?: string;
  nameContact?: string;
  lastNameContact?: string;
  idFinancial?: number;
  idSucursal?: string;
}
export interface TableEntityRoute {
  key?: number;
  nombre: string;
  descripcion: string;
  distancia: number;
  idRoute?: number;
  idSucursal?: string;
}

export interface DocumentsTable {
  name: string;
  invoice?: boolean;
  when: DeliveryDocumentsCase[] | 'all'; // if is 'all' apply for all cases, if is 'optional' all cases are optional
  optional: DeliveryDocumentsCase[] | 'all' | null;
  key: string;
}

const Settings: FunctionComponent<{}> = () => {
  //const id = user.dealer[0].sucursal[0].id_sucursal;
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const financialRepository = Get.find<FinancialRepository>(
    Dependencies.financial
  );
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );
  const [data, setData] = useState<TableEntity[]>([]);
  const [dataRoute, setDataRoute] = useState<TableEntityRoute[]>([]);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [viewModalRutas, setViewModalRutas] = useState<boolean>(false);
  const [viewPanelBox, setViewPanelBox] = useState<boolean>(false);
  const [viewPanelRegistration, setViewPanelRegistration] =
    useState<boolean>(false);
  const [viewConfig, setViewConfig] = useState<boolean>(false);
  const [viewPanelRutas, setviewPanelRutas] = useState<boolean>(false);
  const [viewPanelCampaigns, setViewPanelCampaigns] = useState<boolean>(false);
  const [viewObjectives, setViewObjectives] = useState<boolean>(false);
  const [viewObjectivesAccesories, setViewObjectivesAccesories] =
    useState<boolean>(false);
  const [viewObjectivesAllies, setViewObjectivesAllies] =
    useState<boolean>(false);
  const [dataTableObjectives, setdataTableObjectives] = useState<Object[]>([]);
  const [dataTableObjectivesAccesories, setdataTableObjectivesAccesories] =
    useState<Object[]>([]);
  const [dataTableObjectivesAllies, setdataTableObjectivesAllies] = useState<
    Object[]
  >([]);
  const [sucursal, setSucursal] = useState<string>('');
  const [dealer, setDealer] = useState<[]>([]);
  const [dataCampaign, setDataCampaign] = useState<any[]>([]);
  const [viewModalCampaigns, setViewModalCampaigns] = useState<boolean>(false);
  const [dataObjective, setDataObjective] = useState<any[]>([]);
  const [viewPanelObjectives, setViewPanelObjectives] =
    useState<boolean>(false);
  const [viewModalObjectives, setViewModalObjectives] =
    useState<boolean>(false);
  const [viewPanelDocuments, setViewPanelDocuments] = useState<boolean>(false);

  const [dataModal, setDataModel] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [viewPanelIfi, setviewPanelIfi] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<any>('');
  const [dataSettingEmailReserve, setDataSettingEmailReserve] = useState<any>();
  const [dataSettingEmailLogistic, setDataSettingEmailLogistic] =
    useState<any>();

  const [dataSettingEmailRegistration, setDataSettingEmailRegistration] =
    useState<any>();
  const [dataRouteRow, setDataRouteRow] = useState<TableEntityRoute>();
  const [dataCampaignRow, setDataCampaignRow] = useState<any>();
  const [dataObjectivesRow, setDataObjectivesRow] = useState<any>(null);
  const [dataIdSF, setDataIdSF] = useState<dataFilter[]>([]);
  const [dataIdSR, setDataIdSR] = useState<dataFilter[]>([]);
  const [editData, setEditData] = useState<boolean>(false);
  const [dataRateTerm, setDataRateTerm] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  /// Documentos Delivery
  const [dataDocumentsDelivery, setDataDocumentsDelivery] = useState<
    DocumentsTable[] | null
  >([]);
  const [idSettingDocument, setIdSettingDocument] = useState<number | null>(
    null
  );

  //FUNCION QUE RETORNA LOS DATOS DE FILTRO DE LA TABLA FILTRADOS
  function filterFunction(dataInput: any[]) {
    return dataInput
      .map((dataMap) => {
        return {
          text: dataMap.idSucursal,
          value: dataMap.idSucursal,
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

  const getAllFinancial = async (idSucursal: number) => {
    setLoading(true);
    const respEntities: any = await financialRepository.getAllFinancials(
      idSucursal
    );
    const respSettings = await settingsRepository.getAllSettings(idSucursal);
    if (!respSettings) {
      message.error('No se pudo obtener las configuraciones');
      return;
    }
    //console.log('respSettings', respSettings);
    const dataLogistic: any = [];
    const dataReserve: any = [];
    const dataRegistration: any = [];
    const dataRoutes: any = [];
    const dataCampaigns: any = [];
    const dataRateTerms: any = [];
    const dataObjectives: any = [];

    const settingDocument = respSettings.find(
      (sD) => sD.settingType === 'documents-delivery'
    );

    if (settingDocument && settingDocument.settingValue) {
      //console.log('log documents dataDocuments', settingDocument);
      const dataJson = JSON.parse(settingDocument.settingValue);
      setDataDocumentsDelivery(
        dataJson.map((itm: any, index: number) => ({
          ...itm,
          key: index.toString(),
        }))
      );
      setIdSettingDocument(settingDocument.id);
    }

    respSettings.map((setting: SettingsRepo, index: number) => {
      if (setting.settingType === 'email-logistic') {
        dataLogistic.push(setting);
      }
      if (setting.settingType === 'email-reserve') {
        dataReserve.push(setting);
      }
      if (setting.settingType === 'email-registration') {
        dataRegistration.push(setting);
      }
      if (setting.settingType === 'testdrive-Route') {
        dataRoutes.push(setting);
      }
      if (setting.settingType === 'campaign') {
        dataCampaigns.push(setting);
      }
      if (setting.settingType === 'rateTerm') {
        dataRateTerms.push(setting);
      }
      if (setting.settingType === 'objective') {
        dataObjectives.push(setting);
      }
      return true;
    });
    setDataSettingEmailLogistic(dataLogistic);
    setDataSettingEmailReserve(dataReserve);
    setDataSettingEmailRegistration(dataRegistration);
    //console.log('ANTES RATE', dataRateTerms);
    setDataRateTerm(dataRateTerms);
    const mapDataRoute: TableEntityRoute[] = dataRoutes
      .filter((dr: any) => dr.settingValue)
      .map((dm: any, index: number) => {
        const dataJson = JSON.parse(dm.settingValue);
        return {
          key: index,
          nombre: dataJson.nombre,
          descripcion: dataJson.descripcion,
          distancia: dataJson.distancia,
          idRoute: dm.id,
          idSucursal: dm.idSucursal.toString(),
        };
      });
    const dataIDRMap: dataFilter[] = filterFunction(mapDataRoute);
    setDataIdSR(dataIDRMap);
    setDataRoute(mapDataRoute);
    const mapDataCampaign: any[] = dataCampaigns
      .filter((dr: any) => dr.settingValue)
      .map((dm: any, index: number) => {
        const dataJson = JSON.parse(dm.settingValue);
        return {
          key: index,
          nombre: dataJson.nombre,
          descripcion: dataJson.descripcion,
          duracion: dataJson.duracion,
          createdAt: milisecondsToDate(dm.createdAt, 'YYYY-MM-DD'),
          idCampaign: dm.id,
          idSucursal: dm.idSucursal.toString(),
        };
      });
    //console.log('campain', mapDataCampaign);
    setDataCampaign(mapDataCampaign);
    const mapDataObjectives: any[] = dataObjectives.map(
      (dm: any, index: number) => {
        const dataJson = JSON.parse(dm.settingValue);
        return {
          key: index,
          idObjective: dm.id,
          type: dm.settingName,
          months: dataJson.months,
          amount: dataJson.amount,
          nameVehicle: dataJson.nameVehicle,
          vehicleAmount: dataJson.vehicleAmount,
          createdAt: milisecondsToDate(dm.createdAt, 'YYYY-MM-DD'),
          idSucursal: dm.idSucursal.toString(),
        };
      }
    );
    setDataObjective(mapDataObjectives);
    const dataEntityFinancial: Array<TableEntity> = [];
    respEntities.map((a: Financial, i: number) => {
      const structureData: TableEntity = {
        key: i,
        entity: a.nameEntityFinancial,
        typeEntity: a.typeEntity,
        nameContact: a.nameContact,
        lastNameContact: a.lastNameContact,
        contact: `${a.nameContact} ${a.lastNameContact}`,
        createdAt: milisecondsToDate(
          a.createdAt ? a.createdAt : '',
          'YYYY-MM-DD'
        ),
        phoneEntityFinancial: a.phoneEntityFinancial,
        emailcontact: a.emailcontact,
        idFinancial: a.id,
        idSucursal: a.idSucursal,
      };
      dataEntityFinancial.push(structureData);
      return true;
    });
    const dataIDFMap: dataFilter[] = filterFunction(dataEntityFinancial);
    setDataIdSF(dataIDFMap);
    setData(dataEntityFinancial);

    /* setDataDocumentsDelivery([
      {
        name: 'Documentos UAFE',
        when: 'all',
        optional: null,
      },
      {
        name: 'Documentos negocios a crédito',
        when: [1, 3, 5, 6, 7],
        optional: null,
      },
      {
        name: 'Documentos forma de pago usados',
        when: 'all',
        optional: 'all',
      },
      {
        name: 'Documentos negocio exonerados',
        when: [9, 10],
        optional: null,
      },
      {
        name: 'Documentos servicios de prepago Postventa',
        when: 'all',
        optional: 'all',
      },
      {
        name: 'Documentos adicionales al negocio',
        when: 'all',
        optional: 'all',
      },
      {
        name: 'Documentos previo entrega del vehículo',
        when: 'all',
        optional: null,
      },
      ///Ejemplo
      {
        name: 'Ejemplo',
        when: 'all',
        optional: [6, 6, 6],
      },
    ]); */

    //setDataDocumentsDelivery(mapDataDocuments);

    setLoading(false);
  };

  const dealersAdmin = async () => {
    const resp = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/sucursal',
      null
    );
    if (!resp.ok) {
      message.error('Error al traer concesionarios y sucursales');
      return;
    }
    //const { data } = resp;
    if (resp.data.data) {
      let newListConcessionaire: any = [];
      let newListSucursales: any = [];
      resp.data.data.map((concessionaire: IDataConcessionaire) => {
        const exist = newListConcessionaire.every(
          (item: IDataConcessionaire) => {
            return concessionaire.codigo !== item.codigo;
          }
        );
        if (exist) {
          resp.data.data.forEach((item: IDataConcessionaire) => {
            if (item.codigo === concessionaire.codigo) {
              newListSucursales.push({
                id_sucursal: item.id_sucursal,
                sucursal: item.sucursal,
                ciudad: item.ciudad,
              });
            }
          });
          const { codigo, descripcion }: IDataConcessionaire = concessionaire;
          newListConcessionaire.push({
            codigo,
            descripcion,
            sucursal: newListSucursales,
          });
          newListSucursales = [];
        }
      });
      setDealer(newListConcessionaire);
    }
  };

  useEffect(() => {
    if (user.role === 'ADMINISTRADOR') {
      dealersAdmin();
    } else {
      setDealer(user.dealer);
    }
    if (viewConfig) {
      if (user.role === 'JEFE DE VENTAS' || user.role === 'GERENTE DE MARCA') {
        setviewPanelRutas(true);
        setViewPanelCampaigns(true);
        setViewPanelObjectives(true);
        setViewPanelBox(true);
        setViewPanelRegistration(true);
      }
      if (user.role === 'F&I' || user.role === 'ADMINISTRADOR') {
        setviewPanelIfi(true);
      }
      if (user.role === 'ADMINISTRADOR') {
        setViewPanelDocuments(true);
        setviewPanelRutas(true);
        setViewPanelCampaigns(true);
        setViewPanelObjectives(true);
        setViewPanelBox(true);
        setViewPanelRegistration(true);
      }
    }
  }, [viewConfig]);

  useEffect(() => {
    if (sucursal.length !== 0) getAllFinancial(parseInt(sucursal));
  }, [sucursal]);

  const tailLayout = {
    wrapperCol: { offset: 14 },
  };

  const tableFinancieras = [
    {
      title: 'Sucursal',
      dataIndex: 'idSucursal',
      key: 'idSucursal',
      filters: dataIdSF,
      onFilter: (value: any, record: any) => {
        return record.idSucursal.indexOf(value) === 0;
      },
      sorter: (a: any, b: any) => a.idSucursal.length - b.idSucursal.length,
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Entidad',
      dataIndex: 'entity',
      key: 'entity',
    },
    {
      title: 'Tipo de entidad',
      dataIndex: 'typeEntity',
      key: 'typeEntity',
    },
    {
      title: 'Contacto',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, row: any) => (
        <div className="">
          <Button
            onClick={() => {
              setViewModal(true);
              setDataModel(row);
              setTypeModal('view');
            }}
            type="link"
            shape="round"
            icon={<EyeOutlined />}
          >
            <span className="leading-none">Ver</span>
          </Button>

          <Popconfirm
            placement="rightTop"
            title={`Esta seguro de eliminar la entidad financiera ${row.entity}`}
            onConfirm={async () => {
              const respEntities: any =
                await financialRepository.deleteFinancialEntity(
                  row.idFinancial
                );
              if (respEntities) {
                message.success(
                  `Se elimino la entidad finaciera ${row.entity}`
                );
                getAllFinancial(parseInt(sucursal));
              } else {
                message.error(
                  `No se pudo eliminar la entidad financiera ${row.entity}`
                );
                getAllFinancial(parseInt(sucursal));
              }
            }}
            okText="Si"
            cancelText="No"
          >
            <Button
              shape="round"
              icon={<DeleteOutlined />}
              danger
              style={{ marginLeft: 10 }}
              type="link"
            >
              <span className="leading-none">Eliminar</span>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const tableRoute = [
    {
      title: 'Sucursal',
      dataIndex: 'idSucursal',
      key: 'idSucursal',
      filters: dataIdSR,
      onFilter: (value: any, record: any) => {
        return record.idSucursal.indexOf(value) === 0;
      },
      sorter: (a: any, b: any) => a.idSucursal.length - b.idSucursal.length,
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Distancia',
      dataIndex: 'distancia',
      key: 'distancia',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, row: any) => (
        <div className="">
          <Button
            onClick={() => {
              setViewModalRutas(true);
              setTypeModal('edit');
              setDataRouteRow(row);
            }}
            type="link"
            shape="round"
            icon={<EyeOutlined />}
          >
            <span className="leading-none">Ver</span>
          </Button>

          <Popconfirm
            placement="rightTop"
            title={`Esta seguro de eliminar la RUTA ${row.nombre}`}
            onConfirm={async () => {
              const respEntities: any = await settingsRepository.deleteSetting(
                row.idRoute
              );
              if (respEntities) {
                getAllFinancial(parseInt(sucursal));
                message.success(`Se elimino la ruta ${row.nombre}`);
              } else {
                message.error(`No se pudo eliminar la ruta ${row.nombre}`);
              }
            }}
            okText="Si"
            cancelText="No"
          >
            <Button
              shape="round"
              icon={<DeleteOutlined />}
              danger
              style={{ marginLeft: 10 }}
              type="link"
            >
              <span className="leading-none">Eliminar</span>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const tableCampaigns = [
    {
      title: 'Sucursal',
      dataIndex: 'idSucursal',
      key: 'idSucursal',
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Duración (días)',
      dataIndex: 'duracion',
      key: 'duracion',
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, row: any) => (
        <div className="">
          <Button
            onClick={() => {
              setViewModalCampaigns(true);
              setTypeModal('edit');
              setDataCampaignRow(row);
            }}
            type="link"
            shape="round"
            icon={<EyeOutlined />}
          >
            <span className="leading-none">Ver</span>
          </Button>

          <Popconfirm
            placement="rightTop"
            title={`Esta seguro de eliminar la Campaña ${row.nombre}`}
            onConfirm={async () => {
              const respEntities: any = await settingsRepository.deleteSetting(
                row.idCampaign
              );
              if (respEntities) {
                getAllFinancial(parseInt(sucursal));
                message.success(`Se elimino la campaña ${row.nombre}`);
              } else {
                message.error(`No se pudo eliminar la campaña ${row.nombre}`);
              }
            }}
            okText="Si"
            cancelText="No"
          >
            <Button
              shape="round"
              icon={<DeleteOutlined />}
              danger
              style={{ marginLeft: 10 }}
              type="link"
            >
              <span className="leading-none">Eliminar</span>
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const tableObjectives = [
    {
      title: 'Tipo de meta',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, row: any) => {
        let send: any = null;
        if (text === 'GERENTE DE MARCA') {
          send = <span className="leading-none">Marca</span>;
        }
        if (text === 'JEFE DE VENTAS') {
          send = <span className="leading-none">Sucursal</span>;
        }
        return send;
      },
    },
    {
      title: 'Monto de la meta',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any, row: any) => (
        <span className="leading-none">{currenyFormat(text, true)}</span>
      ),
    },
    {
      title: 'Meses para la meta',
      dataIndex: 'months',
      key: 'months',
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, row: any) => {
        if (row.type === user.role) {
          return (
            <div className="">
              <Button
                onClick={() => {
                  setViewModalObjectives(true);
                  setTypeModal('edit');
                  setDataObjectivesRow(row);
                }}
                type="link"
                shape="round"
                icon={<EyeOutlined />}
              >
                <span className="leading-none">Ver</span>
              </Button>

              <Popconfirm
                placement="rightTop"
                title={`Esta seguro de eliminar la Meta ${row.nombre}`}
                onConfirm={async () => {
                  const respEntities: any =
                    await settingsRepository.deleteSetting(row.idObjective);
                  if (respEntities) {
                    getAllFinancial(parseInt(sucursal));
                    message.success('Se elimino la meta');
                  } else {
                    message.error('No se pudo eliminar la meta');
                  }
                }}
                okText="Si"
                cancelText="No"
              >
                <Button
                  shape="round"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ marginLeft: 10 }}
                  type="link"
                >
                  <span className="leading-none">Eliminar</span>
                </Button>
              </Popconfirm>
            </div>
          );
        }
        return '';
      },
    },
  ];
  let columns: any;
  let columnsRoute: any;
  let columnsCampaign: any;
  let columnsObjectives: any;
  if (user?.role !== 'ADMINISTRADOR') {
    columns = tableFinancieras;
    //columns = tableFinancieras.slice(1, tableFinancieras.length);
    columnsRoute = tableRoute.slice(1, tableRoute.length);
    columnsCampaign = tableCampaigns;
    columnsObjectives = tableObjectives;
  } else {
    columns = tableFinancieras;
    columnsRoute = tableRoute;
    columnsCampaign = tableCampaigns;
    columnsObjectives = tableObjectives;
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <>
      <div className="flex justify-between items-end mt-2">
        <h2 className="text-2xl c-black m-0 p-0 flex">
          <img
            className="mr-2"
            src="https://www.flaticon.es/svg/static/icons/svg/126/126472.svg"
            width="25"
          />
          Configuraciones
        </h2>
      </div>
      <Divider />
      <div className="config-select">
        <p className="config-select-info">
          <InfoCircleOutlined className="config-select-icon" />
          Importante, para realizar las configuraciones primero debe
          <br />
          seleccionar un concesionario y una sucursal
        </p>
        <div className="config-select-dealer">
          {dealer.length !== 0 ? (
            <SelectSucursal
              dealer={dealer}
              setSucursal={setSucursal}
              setViewConfig={setViewConfig}
            />
          ) : (
            <Loading visible />
          )}
        </div>
      </div>
      {viewConfig && (
        <>
          <Divider />
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            className="site-collapse-custom-collapse"
          >
            {viewConfig && (
              <Panel header="Entidades financieras" key="1">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        setViewModal(true);
                        setDataModel(null);
                        setTypeModal('new');
                      }}
                    >
                      Agregar
                    </Button>
                  </div>

                  <Table dataSource={data} columns={columns} />
                </div>
              </Panel>
            )}

            {viewPanelBox && (
              <Panel header="Caja" key="2">
                {dataSettingEmailReserve && (
                  <SettingsEmail
                    data={dataSettingEmailReserve}
                    type="email-reserve"
                    idSucursal={sucursal}
                  />
                )}
              </Panel>
            )}

            {/*  <Panel header="Logistica" key="3">
          {dataSettingEmailLogistic && (
            <SettingsEmail
              data={dataSettingEmailLogistic}
              type="email-logistic"
            />
          )}
        </Panel> */}

            {viewPanelRegistration && (
              <Panel header="Matriculación" key="4">
                {dataSettingEmailRegistration && (
                  <SettingsEmail
                    data={dataSettingEmailRegistration}
                    type="email-registration"
                    idSucursal={sucursal}
                  />
                )}
              </Panel>
            )}

            {/*Inicio de rutas*/}
            {viewPanelRutas && (
              <Panel header="Rutas" key="5">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        setViewModalRutas(true);
                        setTypeModal('new');
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  <Table dataSource={dataRoute} columns={columnsRoute} />
                </div>
              </Panel>
            )}
            {/*Fin de rutas*/}
            {viewPanelCampaigns && (
              <Panel header="Campañas" key="6">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        setViewModalCampaigns(true);
                        setTypeModal('new');
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  <Table dataSource={dataCampaign} columns={columnsCampaign} />
                </div>
              </Panel>
            )}

            {dataDocumentsDelivery && viewPanelDocuments && (
              <Panel header="Documentos Entrega" key="7">
                <DeliveryDocuments
                  dataDocumentsDelivery={dataDocumentsDelivery}
                  setDataDocumentsDelivery={setDataDocumentsDelivery}
                  idSettingDocument={idSettingDocument}
                  setIdSettingDocument={setIdSettingDocument}
                />
              </Panel>
            )}
            {viewConfig && (
              <Panel header="Tasas y Meses plazo" key="8">
                <SettingsRatesMonths
                  dataRateTerm={dataRateTerm}
                  idSucursal={sucursal}
                  settingsRepository={settingsRepository}
                />
              </Panel>
            )}
            {viewConfig && (
              <Panel header="Objetivos" key="9">
                <div className="mt-5">
                  <Tabs defaultActiveKey="1" size="middle">
                    <TabPane tab="Objetivos para ventas" key="1">
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            type="primary"
                            onClick={() => {
                              setViewObjectives(true);
                            }}
                          >
                            Subir objetivos
                          </Button>
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <ObjectivesTable dataTable={dataTableObjectives} />
                      </div>
                    </TabPane>
                    <TabPane tab="Objetivos para accesorios" key="2">
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            type="primary"
                            onClick={() => {
                              setViewObjectivesAccesories(true);
                            }}
                          >
                            Subir objetivos
                          </Button>
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <ObjectivesAccesoriesTable
                          dataTable={dataTableObjectivesAccesories}
                        />
                      </div>
                    </TabPane>
                    <TabPane tab="Objetivos para aliados" key="3">
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            type="primary"
                            onClick={() => {
                              setViewObjectivesAllies(true);
                            }}
                          >
                            Subir objetivos
                          </Button>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <ObjectivesAlliesTable
                            dataTable={dataTableObjectivesAllies}
                          />
                        </div>
                      </div>
                    </TabPane>
                    {/* <TabPane tab="Objetivos para embudo" key="4">
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            type="primary"
                            onClick={() => {
                              setViewObjectivesAccesories(true);
                            }}
                          >
                            Subir objetivos
                          </Button>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <ObjectivesFunnelTable />
                        </div>
                      </div>
                    </TabPane> */}
                  </Tabs>
                </div>
              </Panel>
            )}
          </Collapse>
          {viewModalRutas && (
            <Modal
              title="Ruta"
              footer={false}
              visible={viewModalRutas}
              onOk={() => {
                setViewModalRutas(false);
              }}
              onCancel={() => {
                setViewModalRutas(false);
              }}
              width={600}
            >
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                name="basic"
                initialValues={
                  typeModal === 'edit'
                    ? {
                        nombre: dataRouteRow?.nombre,
                        descripcion: dataRouteRow?.descripcion,
                        distancia: dataRouteRow?.distancia,
                      }
                    : {}
                }
                onFinish={async (values) => {
                  if (typeModal === 'new') {
                    const dataCreate = {
                      settingName: 'Route',
                      settingType: 'testdrive-Route',
                      settingValue: JSON.stringify(values),
                      idSucursal: parseInt(sucursal),
                    };
                    setLoading(true);
                    const respSettings: any =
                      await settingsRepository.createSetting(dataCreate);
                    if (respSettings) {
                      setLoading(false);
                      setViewModalRutas(false);
                      getAllFinancial(parseInt(sucursal));
                      message.success('Se guardó la ruta correctamente');
                    } else {
                      setLoading(false);
                      message.error('Error al guardar la ruta');
                    }
                  }
                  if (typeModal === 'edit') {
                    const dataCreate = {
                      settingName: 'Route',
                      settingType: 'testdrive-Route',
                      settingValue: JSON.stringify(values),
                    };
                    setLoading(true);
                    const respSettings: any =
                      await settingsRepository.updateSetting(
                        dataRouteRow?.idRoute!,
                        dataCreate
                      );
                    if (respSettings) {
                      setLoading(false);
                      setViewModalRutas(false);
                      getAllFinancial(parseInt(sucursal));
                      message.success('Se actualizó la ruta correctamente');
                    } else {
                      setLoading(false);
                      message.error('Error al actualizar la ruta');
                    }
                  }
                }}
                onFinishFailed={(errorInfo) => {
                  //console.log('Failed:', errorInfo);
                }}
              >
                <Form.Item
                  label="Nombre"
                  name="nombre"
                  rules={[{ required: true, message: 'Ingrese nombre!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Descripción"
                  name="descripcion"
                  rules={[{ required: true, message: 'Ingrese descripcion!' }]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  label="Distancia"
                  name="distancia"
                  rules={[{ required: true, message: 'Ingrese distancia!' }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <div className="flex flex-row">
                    <Button
                      style={{ marginTop: 10, marginRight: 10 }}
                      onClick={() => {
                        setViewModalRutas(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginTop: 10 }}
                      icon={<SaveOutlined />}
                    >
                      Guardar
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          )}
          {viewModalCampaigns && (
            <Modal
              title="Nueva Campaña"
              footer={false}
              visible={viewModalCampaigns}
              onOk={() => {
                setViewModalCampaigns(false);
              }}
              onCancel={() => {
                setViewModalCampaigns(false);
              }}
              width={600}
            >
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                name="basic"
                initialValues={
                  typeModal === 'edit'
                    ? {
                        nombre: dataCampaignRow?.nombre,
                        descripcion: dataCampaignRow?.descripcion,
                        duracion: dataCampaignRow?.duracion,
                      }
                    : {}
                }
                onFinish={async (values) => {
                  if (typeModal === 'new') {
                    const dataCreate = {
                      settingName: 'Campaign',
                      settingType: 'campaign',
                      settingValue: JSON.stringify(values),
                      idSucursal: parseInt(sucursal),
                    };
                    setLoading(true);
                    const respSettings: any =
                      await settingsRepository.createSetting(dataCreate);
                    if (respSettings) {
                      setLoading(false);
                      setViewModalCampaigns(false);
                      getAllFinancial(parseInt(sucursal));
                      message.success('Se guardó la campaña correctamente');
                    } else {
                      setLoading(false);
                      message.error('Error al guardar la campaña');
                    }
                  }
                  if (typeModal === 'edit') {
                    const dataCreate = {
                      settingName: 'Campaign',
                      settingType: 'campaign',
                      settingValue: JSON.stringify(values),
                    };
                    setLoading(true);
                    const respSettings: any =
                      await settingsRepository.updateSetting(
                        dataCampaignRow?.idCampaign!,
                        dataCreate
                      );
                    if (respSettings) {
                      setLoading(false);
                      setViewModalCampaigns(false);
                      getAllFinancial(parseInt(sucursal));
                      message.success('Se actualizó la campaña correctamente');
                    } else {
                      setLoading(false);
                      message.error('Error al actualizar la campaña');
                    }
                  }
                }}
                onFinishFailed={(errorInfo) => {
                  //console.log('Failed:', errorInfo);
                }}
              >
                <Form.Item
                  label="Nombre"
                  name="nombre"
                  rules={[
                    {
                      required: true,
                      message: 'Ingrese el nombre de la campaña!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Descripción"
                  name="descripcion"
                  rules={[{ required: true, message: 'Ingrese descripcion!' }]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  label="Duración (Días)"
                  name="duracion"
                  rules={[{ required: true, message: 'Ingrese la duración!' }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <div className="flex flex-row">
                    <Button
                      style={{ marginTop: 10, marginRight: 10 }}
                      onClick={() => {
                        setViewModalCampaigns(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginTop: 10 }}
                      icon={<SaveOutlined />}
                    >
                      Guardar
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          )}
          {viewModal && (
            <Modal
              title="Entidad financiera"
              footer={false}
              visible={viewModal}
              onOk={() => {
                setViewModal(false);
              }}
              onCancel={() => {
                setViewModal(false);
              }}
              width={700}
            >
              <>
                <ModalSettings
                  dataModal={dataModal}
                  viewModal={(v: boolean) => {
                    setViewModal(v);
                  }}
                  typeModal={typeModal}
                  update={() => {
                    getAllFinancial(parseInt(sucursal));
                  }}
                  idSucursal={sucursal}
                />
              </>
            </Modal>
          )}
          {viewObjectives && (
            <Modal
              title="Objetivos"
              footer={false}
              visible={viewObjectives}
              onOk={() => {
                setViewObjectives(false);
              }}
              onCancel={() => {
                setViewObjectives(false);
              }}
              width={700}
            >
              <>
                <UploadExcelObjectives data={setdataTableObjectives} />
              </>
            </Modal>
          )}
          {viewObjectivesAccesories && (
            <Modal
              title="Objetivos accesorios"
              footer={false}
              visible={viewObjectivesAccesories}
              onOk={() => {
                setViewObjectivesAccesories(false);
              }}
              onCancel={() => {
                setViewObjectivesAccesories(false);
              }}
              width={700}
            >
              <>
                <UploadExcelObjectivesAcces
                  data={setdataTableObjectivesAccesories}
                />
              </>
            </Modal>
          )}
          {viewObjectivesAllies && (
            <Modal
              title="Objetivos aliados"
              footer={false}
              visible={viewObjectivesAllies}
              onOk={() => {
                setViewObjectivesAllies(false);
              }}
              onCancel={() => {
                setViewObjectivesAllies(false);
              }}
              width={700}
            >
              <>
                <UploadExcelObjectivesAllies
                  data={setdataTableObjectivesAllies}
                />
              </>
            </Modal>
          )}
          <Loading visible={loading} />
        </>
      )}
    </>
  );
};

export default Settings;
