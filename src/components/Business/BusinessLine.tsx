/* eslint-disable camelcase */
import React, {
  FunctionComponent,
  ReactChild,
  useState,
  useContext,
  useEffect,
} from 'react';
import {
  Button,
  Col,
  Row,
  Steps,
  Divider,
  Avatar,
  Select,
  Drawer,
  message,
  Modal,
  Tag,
  notification,
  Input,
  Alert,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  AlertOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import TimeLine from '../Follow/TimeLine';
import Client from '../../data/models/Client';
import FormProspectV2 from '../Prospect/FormProspectV2';
import milisecondsToDate from '../../utils/milisecondsToDate';
import { Dependencies } from '../../dependency-injection';
import Get from '../../utils/Get';
import ClientsRepository from '../../data/repositories/clients-repository';
//import Modal from 'antd/lib/modal/Modal';
import auth from '../../utils/auth';
import User from '../../data/models/User';
import UserRepository from '../../data/repositories/user-repository';
import { ClientLeadContext } from '../GetClientData';
import LeadsRepository from '../../data/repositories/leads-repository';
import ReAsignModal from '../../pages/lead/components/ReAsignModal';
import { UserReassignedInput } from '../../data/providers/apollo/mutations/reassigned';
import ReassignedRepository from '../../data/repositories/reassigned-repository';
import Leads from '../../data/models/Leads';
import Loading from '../Loading';
import SelectVehicleInquiry from '../Inquiry/components/SelectVehicleInquiry';
import VchatContext from '../../pages/Vchat/components/VchatContext';
import CRMRepository from '../../data/repositories/CRM-repository';
import SurveyReturn from './ SurveyReturn';
import SettingsRepository from '../../data/repositories/settings-repository';
import Financial from '../../data/models/Settings';
import { UserGlobal } from '../../state/MenuState';

export interface DataSurvey {
  [key: string]: string;
  ContactId: string;
  ContactListName: string;
  ConversationId: string;
  LastDate: string;
  LastWrapupCode: string;
  Phone: string;
}

const { Step } = Steps;
const { Option } = Select;

const { TextArea } = Input;

const viewButton = (stepLead: number, actualStep: number): boolean => {
  if (actualStep <= stepLead) return true;
  return false;
};

const delay = (time: number) => {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const BusinessLine: FunctionComponent<{
  children: ReactChild;
  stepLead: number;
  identification: string;
  idLead: number;
  isCredit: boolean;
  go?: boolean;
  progressDot?: boolean;
  vertical?: boolean;
  rightChild?: React.ReactNode;
  prospectData?: Client;
  temperatureDefect?: string;
  campaignDefect?: string;
  //user?: UserGlobal;
}> = ({
  children,
  stepLead,
  identification,
  idLead,
  isCredit,
  go = false,
  progressDot = true,
  vertical = false,
  rightChild,
  prospectData,
  temperatureDefect,
  campaignDefect,
  //user
}) => {
  //console.log('BUSINESS');
  const historyRouter = useHistory();
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const { vchatActivated } = useContext(VchatContext);
  //const id = user!.dealer[0].sucursal[0].id_sucursal;
  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const usersRepository = Get.find<UserRepository>(Dependencies.users);
  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const reassignedRepository = Get.find<ReassignedRepository>(
    Dependencies.reassigned
  );
  const [actualClient, setActualClient] = useState<Client | null>(null);
  const [showDrawerEditProspect, setShowDrawerEditProspect] =
    useState<boolean>(false);
  const [userLog, setUserLog] = useState<User | null>(null);
  const [loadSaleDown, setLoadSaleDown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSaleDown, setLoadingSaleDown] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<string[] | null>(null);

  const [temperature, setTemperature] = useState<any>(
    temperatureDefect || null
  );
  const [campaign, setCampaign] = useState<any>(campaignDefect || null);
  const [isDelivery, setIsDelivery] = useState<boolean>(false);
  const [viewButtonSaleDown, setViewButtonSaleDown] = useState<boolean>(true);

  const [visibleSelectVehicle, setVisibleSelectVehicle] =
    useState<boolean>(false);

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  //Muestra modal de venta caida
  const [saleDownModal, setSaleDownModal] = useState<boolean>(false);
  //Setea comentario de venta caida
  const [commentRepo, setCommentRepo] = useState<string>('');

  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );
  const handleClick = (idStep: number, fromDelivery?: boolean) => {
    historyRouter.push(
      `/lead/id-lead=${idLead}/identification=${identification}`,
      {
        step: idStep,
        id: identification,
        idLead,
        fromDelivery: fromDelivery ?? false,
      }
    );
  };
  const [activeFollows, setActiveFollows] = useState<boolean>(false);

  /// SURVEY
  const [activeSurvey, setActiveSurvey] = useState<boolean>(false);
  const [dataSurvey, setDataSurvey] = useState<DataSurvey[]>([]);
  const [stateSurvey, setStateSurvey] = useState<'inquiry' | 'testDrive'>(
    'inquiry'
  );
  const getData = async (camp: string) => {
    console.log('LLAMANDO /RecordCampaignResult -->', {
      clientPhone: client?.cellphone,
      camp,
    });
    setLoading(true);
    const respApi = await CRMRepository.apiCall(
      'POST',
      '/RecordCampaignResult',
      {
        number: client!.cellphone,
        camp,
        //number: '0998363745',
        //camp: 'LISTAHUBSPOT-MarcasTradicionales'
      }
    );
    //console.log('data', { respApi });
    if (respApi && respApi.data?.Data) {
      setDataSurvey(respApi.data.Data);
      setActiveSurvey(true);
    }
    setLoading(false);
  };

  const getCampaigns = async () => {
    const id = Number(lead?.sucursal?.code);
    const dataCampaigns = await settingsRepository.getAllSettings(id);
    //console.log('CAMPANAS', dataCampaigns);
    if (dataCampaigns) {
      const mapCampaigns: any[] = [];
      dataCampaigns.map((dm: Financial, index: number) => {
        let nombre = null;
        if (dm.settingType === 'campaign') {
          const dataJson = JSON.parse(dm.settingValue);
          nombre = dataJson.nombre;
          mapCampaigns.push(nombre);
        }
        return nombre;
      });
      //console.log('STRING CAMPA', mapCampaigns);
      setCampaigns(mapCampaigns);
    }
  };

  const logicSurvey = async () => {
    //console.log('ENTRO LOGIC');
    if (lead?.quotes?.length === 0 && !lead?.inquiry) {
      console.log('  ENTRO LISTAGUC_ENCUESTAVISITASHOWROOM');
      await getData('LISTAGUC_ENCUESTAVISITASHOWROOM');
      setStateSurvey('inquiry');
    } else if (
      lead?.testDriver &&
      lead?.testDriver.length > 0 &&
      stateSurvey !== 'testDrive'
    ) {
      console.log('  ENTRO LISTAGUC_TESTDRIVE');
      await getData('LISTAGUC_TESTDRIVE');
      setStateSurvey('testDrive');
    }

    if (dataSurvey.length > 0 && stateSurvey === 'inquiry' && lead?.quotes) {
      console.log('  ENTRO DESACTIVATE SURVEY');
      setActiveSurvey(false);
    }
  };

  useEffect(() => {
    // Muestra ventana de seguimiento cuando se abre la notificación
    const viewTracingState: any = historyRouter;
    const locationViewTrancingState = viewTracingState.location.state;

    if (locationViewTrancingState?.viewTracing) {
      if (locationViewTrancingState?.viewTracing === true) {
        setActiveFollows(true);
      }
    }

    //prospectData Es el cliente. Se lo puede obtener por context
    if (prospectData) {
      //console.log('prospectData -->', prospectData);
      setActualClient(prospectData);
      if (prospectData?.leads) {
        setTemperature(prospectData.leads[0].temperature);
      }
    }
    const componentdidmount = async () => {
      const { user } = auth;
      setUserLog(user);
      //const actualPath = historyRouter.location.pathname;
      /* const isDel = actualPath.includes('delivery');
      if (isDel) {
        setViewButtonSaleDown(false);
      } */
      const allDeliverys = lead?.quotes
        ?.filter((quo) => !!quo.delivery)
        .map((quo) => quo.delivery)
        .find((del) => !del?.deliveryFinal);
      //console.log('allDeliverys LINE', !!allDeliverys);
      if (allDeliverys) {
        //setIsDelivery(isDel);
        setIsDelivery(false);
      }
      //llamada a campañas
      getCampaigns();
    };
    componentdidmount();
  }, []);

  useEffect(() => {
    const actualPath = historyRouter.location.pathname;
    const isDel = actualPath.includes('delivery');
    const allDeliverys = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => quo.delivery)
      .find((del) => !del?.deliveryFinal);
    //console.log('allDeliverys LINE', !!allDeliverys);
    if (allDeliverys) {
      setIsDelivery(isDel);
    }
    logicSurvey();
  }, [lead]);

  useEffect(() => {
    if (vchatActivated) {
      setActiveFollows(false);
    }
  }, [vchatActivated]);

  const steps = (
    <>
      <Steps
        direction={vertical ? 'vertical' : 'horizontal'}
        progressDot={progressDot}
        current={stepLead}
        size="small"
      >
        <Step
          title="Indagación"
          description={
            go && viewButton(stepLead, 0) ? (
              <Button
                type="primary"
                shape="round"
                size="small"
                ghost
                className="mt-3"
                onClick={() => handleClick(0)}
              >
                Entrar
              </Button>
            ) : undefined
          }
        />
        <Step
          title="Demostración"
          description={
            go && viewButton(stepLead, 1) ? (
              <Button
                type="primary"
                shape="round"
                size="small"
                ghost
                className="mt-3"
                onClick={() => handleClick(1)}
              >
                Entrar
              </Button>
            ) : undefined
          }
        />
        <Step
          title="Cotización"
          description={
            go && viewButton(stepLead, 1) ? (
              <Button
                type="primary"
                shape="round"
                size="small"
                ghost
                className="mt-3"
                onClick={() => handleClick(1)}
              >
                Entrar
              </Button>
            ) : undefined
          }
        />

        <Step
          title="Cierre"
          description={
            go && viewButton(stepLead, 3) ? (
              <Button
                type="primary"
                shape="round"
                size="small"
                ghost
                className="mt-3"
                onClick={() => handleClick(3)}
              >
                Entrar
              </Button>
            ) : undefined
          }
        />
        <Step
          title="Prefactura"
          description={
            go && viewButton(stepLead, 4) ? (
              <Button
                type="primary"
                shape="round"
                size="small"
                ghost
                className="mt-3"
                onClick={() => handleClick(4)}
              >
                Entrar
              </Button>
            ) : undefined
          }
        />
        <Step
          title="Entrega"
          description={
            go && viewButton(stepLead, 5) ? (
              <Button
                type="primary"
                shape="round"
                size="small"
                ghost
                className="mt-3"
                onClick={() => handleClick(5)}
              >
                Entrar
              </Button>
            ) : undefined
          }
        />
      </Steps>
      {isDelivery && (
        <div>
          <Button type="primary" onClick={() => handleClick(0, true)}>
            Ir a negocio
          </Button>
        </div>
      )}
    </>
  );

  if (!vertical) {
    return (
      <div>
        <div>{steps}</div>
        {children}
      </div>
    );
  }

  const dropSale = () => {
    let commentRepo1 = '';
    Modal.confirm({
      title: '¿Estás seguro de que quieres reportar esta venta como caída?',
      icon: <ExclamationCircleOutlined />,
      className: 'modal-without-icon',
      width: '50%',

      content: (
        <div>
          <Divider />
          {lead?.quotes?.length === 0 && (
            <div style={{ marginTop: 30 }}>
              <SelectVehicleInquiry setSelectedVehicle={setSelectedVehicle} />
            </div>
          )}

          <TextArea
            placeholder="Motivo de solicitud de venta caída"
            allowClear
            //onChange={onChangeSaleDown}
            onChange={(e) => {
              commentRepo1 = e.target.value;
            }}
          />
        </div>
      ),
      async onOk() {
        setLoadSaleDown(true);
        if (actualClient && lead) {
          /* //console.log('Userlog', userLog?.id);
          //console.log('uSERLEAD', lead.user.id);
          //console.log('Client', actualClient.identification); */
          //console.log('commentSaleDow', commentRepo1);

          const saleDownExtra: any = {
            idModelo: 1,
            marca: 'prueba',
          };
          const resp = await leadsRepository.notifySaleDown(
            lead.user.id!,
            actualClient.identification!,
            lead.id!,
            commentRepo1,
            null
          );
          if (!resp) {
            message.error('Algo salió mal, vuelve a intentarlo');
          } else {
            message.success('Venta caída');
            if (setLead) {
              setLead((prevState: Leads) => ({
                ...prevState,
                statusSaleDown: 'solicitada',
              }));
            }
          }
          setLoadSaleDown(false);
        }
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  const setNotifySaleDown = async () => {
    setLoadSaleDown(true);
    if (actualClient && lead) {
      /* //console.log('Userlog', userLog?.id);
          //console.log('uSERLEAD', lead.user.id);
          //console.log('Client', actualClient.identification); */
      const saleDownExtra: any = selectedVehicle
        ? {
            idModelo: selectedVehicle.id_modelo,
            marca: selectedVehicle.marca,
          }
        : null;
      const resp = await leadsRepository.notifySaleDown(
        lead.user.id!,
        actualClient.identification!,
        lead.id!,
        commentRepo,
        saleDownExtra
      );
      if (!resp) {
        message.error('Algo salió mal, vuelve a intentarlo');
      } else {
        message.success('Venta caída');
        if (setLead) {
          setLead((prevState: Leads) => ({
            ...prevState,
            statusSaleDown: 'solicitada',
          }));
          setSaleDownModal(false);
        }
      }
      setLoadSaleDown(false);
    }
  };
  const onChangeCampaignSelect = async (campaign: string) => {
    const id = lead?.id!;
    setLoading(true);
    const resp = await leadsRepository.updateLeadToCampaign(id, campaign);
    setLoading(false);
    if (resp) {
      setCampaign(campaign);
      if (setLead) {
        setLead((prevState: Leads) => ({
          ...prevState!,
          campaign,
        }));
      }
      notification.success({
        message: 'Se actualizó la campaña',
      });
    } else {
      notification.error({
        message: 'No se pudo actualizar la campaña',
      });
    }
  };
  const acceptOrDeclineSaleDown = async (
    accepted: boolean,
    dataVehicle?: {
      id_modelo: number;
      marca: string;
    },
    comment?: string
  ): Promise<{ ok: boolean; goTo?: 'lead' | 'bussines' }> => {
    if (lead && lead.id) {
      setLoadSaleDown(true);
      const resp = await leadsRepository.saleDown(
        lead.id,
        accepted,
        dataVehicle ?? null,
        comment ?? null
      );
      if (resp.ok) {
        if (
          resp.data &&
          resp.data.idsQuotesNOLiberatedVIN &&
          resp.data.idsQuotesNOLiberatedVIN.length > 0
        ) {
          const string = resp.data?.idsQuotesNOLiberatedVIN.reduce(
            (accu, current) => {
              return `${accu} "${current}" `;
            },
            ''
          );
          message.warning(
            `No se pudo reportar la venta como caída. Las cotizaciones ${string} no puderon liberar su VIN`,
            20
          );
        } else {
          message.success(
            `Se ${accepted ? 'aceptó' : 'rechazó'} la venta como caída`
          );
        }

        if (setLead) {
          setLead((prevState: Leads) => {
            const copia = prevState;

            if (
              resp.data &&
              resp.data.idsQuotesNOLiberatedVIN &&
              resp.data.idsQuotesNOLiberatedVIN.length === 0
            ) {
              copia.saleDown = accepted;
              copia.statusSaleDown = accepted ? 'aceptada' : 'rechazada';
              copia.commentSaleDown = comment ?? comment;
              copia.saleDownExtra = dataVehicle
                ? {
                    idModelo: dataVehicle.id_modelo,
                    marca: dataVehicle.marca,
                  }
                : undefined;
            }

            if (accepted) {
              const { idsQuotesLiberatedVIN } = resp.data!;
              /// Only if prebill has deleted
              let prebillDeleted = false;

              const newQuotes = copia.quotes?.map((quo) => {
                const copiaQuo = quo;

                if (idsQuotesLiberatedVIN.length > 0) {
                  /// delete the prebill
                  if (!prebillDeleted) {
                    copia.prebill = [];
                    prebillDeleted = true;
                  }
                  /// delete all deliveries
                  copiaQuo.delivery = undefined;
                  const thereIs = idsQuotesLiberatedVIN.find(
                    (idQuo) => idQuo === quo.id
                  );
                  if (thereIs) {
                    copiaQuo.vimVehiculo = null;
                    copiaQuo.vimVehiculoData = null;
                  }
                }
                return copiaQuo;
              });
              copia.quotes = newQuotes;
            }
            return {
              ...copia,
            };
          });
        }
        setLoadSaleDown(false);
        if (
          resp.data &&
          resp.data.idsQuotesNOLiberatedVIN &&
          resp.data.idsQuotesNOLiberatedVIN.length > 0
        ) {
          return { ok: true, goTo: 'lead' };
        }

        return { ok: true, goTo: 'bussines' };
      }
      message.error(
        `Fallo al ${accepted ? 'aceptar' : 'rechazar'} venta como caída. ${
          accepted ? resp.message : ''
        }`
      );
      setLoadSaleDown(false);
      return { ok: false };
    }
    return { ok: false };
  };

  const showReAsign = async () => {
    const empl = await usersRepository.getEmployeesByBoss();
    const modal = Modal.info({
      className: 'modal-without-icon modal-without-btns',
      width: 992,
      centered: true,
      maskClosable: true,
      content: (
        <ReAsignModal
          onSelected={async (user, reason) => {
            if (lead && lead.id && lead.client.identification) {
              const previousUser: UserReassignedInput = {
                id: lead.user.id,
                apellido: lead.user.apellido,
                codUsuario: lead.user.codUsuario,
                nombre: lead.user.nombre,
              };
              const newUser: UserReassignedInput = {
                id: user.id,
                apellido: user.apellido,
                codUsuario: user.codUsuario,
                nombre: user.nombre,
              };
              const okReasing = await leadsRepository.reasignUser(
                newUser,
                previousUser,
                [lead.id]
              );
              if (okReasing) {
                const newReassigned =
                  await reassignedRepository.createReassigned(
                    previousUser,
                    reason,
                    newUser,
                    [lead.id!]
                  );
                //console.log('newReassigned', newReassigned);

                if (newReassigned) {
                  message.success('Se ha reasignado la venta');
                  historyRouter.push('/prospect');
                } else {
                  message.error(
                    'No se pudo reasignar la venta. Vuelve a intentarlo.'
                  );
                  return;
                }
              } else {
                message.error(
                  'No se pudo reasignar la venta. Vuelve a intentarlo.'
                );
              }
            }
            modal.destroy();
          }}
          data={empl}
          lead={lead!}
        />
      ),
    });
  };

  const onChangeSelect = async (e: string) => {
    const id = lead?.id!;
    const temperatureInsert = e;
    setLoading(true);
    const resp = await leadsRepository.updateTemperature(id, temperatureInsert);
    setLoading(false);
    if (resp) {
      setTemperature(e);
      notification.open({
        message: 'Se actualizó la temperatura',
      });
    } else {
      notification.error({
        message: 'No se pudo actualizar la temperatura',
      });
    }
  };
  /*
  const onChangeCampaignSelect = async (e: string) => {
    const id = lead?.id!;
    const campaign = e;
    setLoading(true);
    const resp = await leadsRepository.updateLeadToCampaign(id, campaign);
    setLoading(false);
    if (resp) {
      setCampaign(e);
    
      notification.open({
        message: 'Se actualizó la campaña',
      });
    } else {
      notification.error({
        message: 'No se pudo actualizar la campaña',
      });
    }
  };
*/
  const verifyAllDeliveries = (): boolean => {
    const allDeliverys = lead?.quotes
      ?.filter((quo) => !!quo.delivery)
      .map((quo) => quo.delivery);

    if (allDeliverys && allDeliverys.length > 0) {
      //console.log('venta caida', allDeliverys);
      //Existen deliveries a completar
      const deliveries = allDeliverys.find((all) => {
        if (all && !all.deliveryFinal) {
          return true;
        }
        return false;
      });
      //console.log('venta caida', deliveries, !!deliveries);
      //Si existen deliveries a completar es TRUE sino es FALSE
      return !!deliveries;
    }
    //si no existen deliveries o es un array vacio pues falta completar TRUE
    return true;
  };

  const openModal = () => setVisibleSelectVehicle(true);
  const closeModal = () => setVisibleSelectVehicle(false);

  const acceptedSaleDown = async (
    dataVehicle?: {
      id_modelo: number;
      marca: string;
    },
    comment?: string
  ) => {
    const resp = await acceptOrDeclineSaleDown(true, dataVehicle, comment);
    if (resp.ok && resp.goTo) {
      if (resp.goTo === 'bussines') {
        historyRouter.push('/business');
      } else if (resp.goTo === 'lead') {
        historyRouter.push(
          `/lead/id-lead=${idLead}/identification=${identification}`,
          {
            step: 0,
            id: identification,
            idLead,
            fromDelivery: false,
          }
        );
      }
    }
  };

  const acceptedVehicleFunction = async () => {
    //console.log('log accepted ok', selectedVehicle);
    /* setLoadingSaleDown(true);
    await delay(2000);
    setLoadingSaleDown(false);
    //console.log('log accepted ok', selectedVehicle); */
    const vehicle = selectedVehicle
      ? {
          id_modelo: selectedVehicle.id_modelo,
          marca: selectedVehicle.marca,
        }
      : undefined;
    const commentToSend = commentRepo === '' ? undefined : commentRepo;
    console.log({ vehicle, commentToSend });

    await acceptedSaleDown(vehicle, commentToSend);
    //setSaleDownModal(false);
    //setVisibleSelectVehicle(false);
  };

  const acceptedOnClick = async () => {
    /*  //console.log('log accepted', lead);
    if (!lead?.quotes || lead?.quotes.length === 0) {
      //console.log('log accepted Esta en Indagación o Demostración');
      setVisibleSelectVehicle(true);
    } else {
      //console.log('log accepted Tiene una cotizacion');
      await acceptedSaleDown();
    } */
    //console.log('lead?.saleDownExtra -->', lead?.saleDownExtra);
    //console.log('lead -->', lead);
    if (lead?.saleDownExtra) {
      await acceptedSaleDown({
        id_modelo: lead!.saleDownExtra!.idModelo,
        marca: lead!.saleDownExtra!.marca,
      });
    } else {
      //console.log('log accepted Tiene una cotizacion');
      await acceptedSaleDown();
    }
  };

  //existen cotizaciones por completar True si existen False si no existe
  const noComplete = verifyAllDeliveries();

  //Habilita el botton de envio de venta caida
  // 1. Completar al selección del vehiculo
  // 2. Al cotizar un vehiculo

  const verifyButton = () => {
    if (lead!.quotes!.length > 0) {
      return true;
    }
    if (selectedVehicle) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Row gutter={8}>
        <Col md={19} className="px-4 py-4">
          {children}
        </Col>
        <Col md={5}>
          <div>
            <div style={{}}>
              <div>
                <div style={{ textAlign: 'center' }}>
                  <Avatar
                    style={{ backgroundColor: '#87d068' }}
                    icon={<UserOutlined />}
                    size={64}
                  />
                  <p style={{ margin: 0 }}>
                    {actualClient?.name} {actualClient?.lastName}
                  </p>
                  <p style={{ margin: 0 }}>
                    {' '}
                    <Button
                      type="link"
                      onClick={() => setShowDrawerEditProspect(true)}
                    >
                      Ver perfil
                    </Button>
                  </p>

                  <Select
                    placeholder="Seleccione"
                    defaultValue={temperature}
                    style={{ width: 160 }}
                    size="small"
                    onChange={onChangeSelect}
                    loading={loading}
                  >
                    <Option value="Caliente A: - 30 días">Caliente A</Option>
                    <Option value="Caliente B: 30 a 60 días">Caliente B</Option>
                    <Option value="Tibio: + 90 días">Tibio</Option>
                    <Option value="Inmediato">Inmediato</Option>
                  </Select>
                  <br />

                  <div style={{ margin: '20px 0px' }}>
                    <b>Campañas</b>
                    <br />
                    <Select
                      placeholder="Seleccione"
                      value={lead?.campaign}
                      style={{ width: 160 }}
                      size="small"
                      loading={loading}
                      onChange={onChangeCampaignSelect}
                    >
                      {campaigns &&
                        campaigns.map((el, index: number) => (
                          <Option value={el} key={index}>
                            {el}
                          </Option>
                        ))}
                    </Select>
                    <br />
                    {lead?.chanel && (
                      <p style={{ marginTop: 5 }}>
                        <b>Canal</b>
                        <br />
                        <span>{lead.chanel}</span>
                      </p>
                    )}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    {/* {console.log('venta caida', {
                      role: userLog?.role,
                      saleDown: lead!.saleDown,
                      saleDownStatus: lead!.statusSaleDown,
                      viewButtonSaleDown,
                      noComplete,
                    })} */}
                    {userLog?.role === 'ASESOR COMERCIAL' &&
                      !lead!.saleDown &&
                      (!lead!.statusSaleDown ||
                        lead!.statusSaleDown === 'rechazada') &&
                      viewButtonSaleDown &&
                      noComplete && (
                        <Button
                          type="primary"
                          danger
                          size="small"
                          style={{ background: '#FF4D4F' }}
                          className="ml-2"
                          onClick={() => {
                            setSaleDownModal(true);
                          }}
                        >
                          Reportar venta caída
                        </Button>
                      )}

                    {(userLog?.role === 'JEFE DE VENTAS' ||
                      userLog?.role === 'GERENTE DE MARCA') &&
                      !lead!.saleDown &&
                      lead!.statusSaleDown !== 'solicitada' && (
                        <Button
                          type="primary"
                          danger
                          size="small"
                          style={{ background: '#FF4D4F' }}
                          className="ml-2"
                          onClick={() => {
                            setSaleDownModal(true);
                          }}
                        >
                          Reportar venta caída
                        </Button>
                      )}

                    {userLog?.role === 'ASESOR COMERCIAL' &&
                      !lead!.saleDown &&
                      lead!.statusSaleDown === 'solicitada' && (
                        <Tag color="warning">Reportado</Tag>
                      )}

                    {lead &&
                      lead!.statusSaleDown === 'solicitada' &&
                      userLog &&
                      (userLog.role === 'JEFE DE VENTAS' ||
                        userLog.role === 'GERENTE DE MARCA') &&
                      noComplete && (
                        <div>
                          <h4>Solicitud de venta caída</h4>
                          <Button
                            type="primary"
                            size="small"
                            loading={loadSaleDown}
                            style={{ background: '#52C41A', marginRight: 10 }}
                            onClick={acceptedOnClick}
                          >
                            Aceptar
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            style={{ background: '#FF4D4F' }}
                            onClick={async () => {
                              await acceptOrDeclineSaleDown(false);
                            }}
                          >
                            Rechazar
                          </Button>
                        </div>
                      )}
                    {userLog?.role === 'ASESOR COMERCIAL' &&
                      lead!.statusSaleDown === 'rechazada' && (
                        <div
                          style={{
                            fontSize: 9,
                            lineHeight: '12px',
                            marginTop: 5,
                          }}
                        >
                          Esta venta ya ha sido rechazada como caída con
                          anterioridad
                        </div>
                      )}
                    {lead &&
                      lead.commentSaleDown &&
                      userLog &&
                      (userLog.role === 'JEFE DE VENTAS' ||
                        userLog.role === 'GERENTE DE MARCA' ||
                        userLog.role === 'CALL CENTER') && (
                        <div
                          style={{
                            fontSize: 9,
                            lineHeight: '12px',
                            marginTop: 5,
                            fontStyle: 'italic',
                            marginBottom: 5,
                          }}
                        >
                          <b>Comentario venta caída:</b> {lead.commentSaleDown}
                        </div>
                      )}

                    {userLog && lead && lead.saleDown === true && (
                      <Tag
                        color="#f50"
                        icon={<AlertOutlined />}
                        //style={{ width: '150px', height: '100px' }}
                      >
                        Esta venta se reportó como caída
                      </Tag>
                    )}
                    {lead &&
                      userLog &&
                      (userLog.role === 'JEFE DE VENTAS' ||
                        userLog.role === 'GERENTE DE MARCA') && (
                        <div>
                          <Button
                            type="primary"
                            size="small"
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              showReAsign();
                            }}
                          >
                            Reasignar venta
                          </Button>
                        </div>
                      )}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 11 }}>
                    <Divider style={{ margin: '15px 0px' }} />
                    <p style={{ margin: 0, textAlign: 'center' }}>
                      {' '}
                      <Button
                        type="link"
                        onClick={() => setActiveFollows(true)}
                      >
                        Seguimientos
                      </Button>
                    </p>
                    <p style={{ margin: 0 }}>
                      Cédula:{' '}
                      {actualClient
                        ? actualClient.identification
                        : prospectData!.identification}
                    </p>
                    <p style={{ margin: 0 }}>
                      Teléfono:{' '}
                      {actualClient
                        ? actualClient.cellphone
                        : prospectData!.cellphone}
                    </p>
                    <p style={{ margin: 0 }}>
                      Email:{' '}
                      {actualClient ? actualClient.email : prospectData!.email}
                    </p>
                    <p style={{ margin: 0 }}>
                      Fecha:{' '}
                      {milisecondsToDate(
                        actualClient
                          ? actualClient.createdAt!
                          : prospectData!.createdAt!
                      )}
                    </p>
                  </div>
                  {activeSurvey && dataSurvey.length !== 0 && (
                    <div style={{ textAlign: 'center', fontSize: 11 }}>
                      <Divider style={{ margin: '15px 0px' }} />
                      <SurveyReturn dataSurvey={dataSurvey} />
                    </div>
                  )}
                </div>
                <Divider style={{ margin: '20px 0px' }} />
                {steps}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Drawer
        placement="left"
        closable
        onClose={() => setActiveFollows(false)}
        visible={activeFollows}
        key="Seguimientos"
        drawerStyle={{
          backgroundColor: 'rgba(255,255,255,1)',
          height: '100%',
        }}
        headerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        bodyStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        mask={false}
        width={350}
      >
        <TimeLine
          identification={identification}
          idLead={idLead}
          block={!noComplete}
        />
      </Drawer>

      <Modal
        visible={showDrawerEditProspect}
        footer={false}
        onCancel={() => setShowDrawerEditProspect(false)}
        bodyStyle={{ padding: 60 }}
        width={600}
      >
        <FormProspectV2
          type="edit"
          initData={actualClient!}
          onUpdate={async (newClient: any) => {
            const clientUpdate: Client = {
              typeIdentification: newClient.type,
              identification: newClient.identification,
              name: newClient.name,
              lastName: newClient.lastName,
              birthdate: null,
              cellphone: newClient.phone,
              email: newClient.email,
              chanel: newClient.canal,
              campaign: newClient.campaign,
            };
            setLoading(true);
            const isOk = await clientsRepository.updateClient(
              actualClient!.identification!,
              clientUpdate
            );

            setLoading(false);
            if (isOk) {
              message.success('Prospecto actualizado');
              setActualClient((prevState) => ({
                ...prevState,
                identification: clientUpdate.identification,
                typeIdentification: clientUpdate.typeIdentification,
                name: clientUpdate.name,
                lastName: clientUpdate.lastName,
                birthdate: newClient.birthdate,
                cellphone: clientUpdate.cellphone,
                email: clientUpdate.email,
                chanel: clientUpdate.chanel,
                campaign: clientUpdate.campaign,
              }));
              return true;
            }
            message.error('No se pudo actualizar los datos del Prospecto');
            return false;
          }}
        />
      </Modal>
      <Modal
        title="Selección de vehículo de interés"
        visible={visibleSelectVehicle}
        width={800}
        onOk={acceptedVehicleFunction}
        onCancel={closeModal}
        okButtonProps={{ disabled: !selectedVehicle }}
        //cancelButtonProps={{ disabled: true }}
      >
        <SelectVehicleInquiry setSelectedVehicle={setSelectedVehicle} />
      </Modal>

      <Modal
        title="¿Estás seguro de que quieres reportar esta venta como caída?"
        visible={saleDownModal}
        width={800}
        onOk={() => {
          if (userLog?.role === 'ASESOR COMERCIAL') {
            setNotifySaleDown();
          } else if (
            userLog?.role === 'JEFE DE VENTAS' ||
            userLog?.role === 'GERENTE DE MARCA'
          ) {
            acceptedVehicleFunction();
          }
        }}
        confirmLoading={loadSaleDown}
        onCancel={() => {
          setSaleDownModal(false);
        }}
        okButtonProps={{
          disabled: !verifyButton(),
        }}
      >
        <div>
          {lead?.quotes?.length === 0 && (
            <div>
              <Alert
                message="Seleccione un vehículo para poder solicitar una venta caída"
                type="warning"
                showIcon
                closable
              />
              <div style={{ marginTop: 30, marginBottom: 30 }}>
                <SelectVehicleInquiry setSelectedVehicle={setSelectedVehicle} />
              </div>
            </div>
          )}
          <TextArea
            placeholder="Motivo de solicitud de venta caída"
            allowClear
            //onChange={onChangeSaleDown}
            onChange={(e) => {
              setCommentRepo(e.target.value);
            }}
          />
        </div>
      </Modal>

      <Loading visible={loadingSaleDown} />
    </>
  );
};

export default BusinessLine;
