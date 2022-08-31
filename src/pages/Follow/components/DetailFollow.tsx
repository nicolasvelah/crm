import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Tag,
  Modal,
} from 'antd';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Tracings from '../../../data/models/Tracings';
import milisecondsToDate from '../../../utils/milisecondsToDate';
import Loading from '../../../components/Loading';
import Get from '../../../utils/Get';
import TracingsRepository from '../../../data/repositories/tracings-repository';
import { Dependencies } from '../../../dependency-injection';
import { outTime } from '../../../components/Follow/TimeLine';
import VchatContext from '../../Vchat/components/VchatContext';
import { decrypt } from '../../../utils/crypto';
import FormFollow from './FormFollow';
import { DataTracing } from './MainFollow';

const tailLayout = {
  wrapperCol: { offset: 17 },
};

const DetailFollow: FunctionComponent<{
  idInputModal: number | null;
  reloadingPage?: Function;
  setDataTableTracings?: React.Dispatch<React.SetStateAction<DataTracing[]>>;
  setDataTimeLine?: React.Dispatch<React.SetStateAction<Tracings[]>>;
}> = ({
  idInputModal,
  reloadingPage,
  setDataTableTracings,
  setDataTimeLine,
}) => {
  /******************************HOOKS*****************************************/
  // DEPENDENCY INJECTION
  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  // DETAILS TRACING
  const [detailTracing, setdetailTracing] = useState<Tracings | null>(null);
  // FORM CERRAR FORM
  const [seeForm, setSeeForm] = useState<boolean | null>(false);
  // BTN CERRAR
  const [btnClose, setbtnClose] = useState<boolean | null>(true);
  // ESTADO PARA ACTIVAR EL LOADING SCREEN MIENTRAS OPERA
  const [loading, setLoading] = useState<boolean>(false);
  // ESTADO DE CIERRE
  const [closeDataInformation, setCloseDataInformation] = useState<boolean>(
    false
  );

  const [linkVchat, setLinkVchat] = useState<{
    code: string;
    inTracing: number;
  } | null>(null);

  const [isPageLead, setIsPageLead] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);

  const { setCode, setVchatActivated } = useContext(VchatContext);

  const historyRouter = useHistory();

  /******************************GENERALFUNCTION*******************************/

  const getCodeFromLink = (link: string) => {
    try {
      const dataLink = decrypt(link, true);
      //console.log('DESCRYP🟡', dataLink);
      setLinkVchat(dataLink);
    } catch (error) {
      //console.log('Error en getCodeFromLink', error.message);
    }
  };

  //DATA DE GRAPHQL BY ID
  const getDataGraphId = async (idTracing?: number) => {
    setLoading(true);
    const respGQlID: Tracings | null = await tracingsRepository.getTracingsById(
      idTracing!
    );
    //console.log('respGQlID', respGQlID);
    if (respGQlID) {
      const dateClosedorPending = respGQlID.closeDate ? 'Cerrado' : 'Pendiente';
      if (dateClosedorPending === 'Cerrado') {
        setbtnClose(false);
      }
      setdetailTracing({
        id: respGQlID.id,
        type: respGQlID.type,
        motive: respGQlID.motive,
        priority: respGQlID.priority,
        executionDate: respGQlID.executionDate,
        closeDate: respGQlID.closeDate,
        openingNote: respGQlID.openingNote,
        closeNote: respGQlID.closeNote,
        createdAt: respGQlID.createdAt,
        client: respGQlID.client,
        linkVchat: respGQlID.linkVchat,
        leads: respGQlID.leads,
        user: respGQlID.user,
        linksOffice365: respGQlID.linksOffice365,
      });
      if (respGQlID.linkVchat) {
        getCodeFromLink(respGQlID.linkVchat);
      }
    }
    setLoading(false);
  };

  //CIERRA SEGUIMIENTO
  const formSuccess = async (dataForm: any) => {
    try {
      setLoading(true);
      const closeTracingRespond = await tracingsRepository.closeTracing(
        idInputModal!,
        { closeDate: moment().toString(), closeNote: dataForm.nota }
      );

      setLoading(false);
      if (closeTracingRespond) {
        message.success('Seguimiento Cerrado');
        setCloseDataInformation(true);
        setSeeForm(false);
        // para cerrar el modal recargando la paguina
        reloadingPage!(true);
        if (setDataTableTracings) {
          setDataTableTracings((prevState) => {
            const copy: DataTracing[] = [...prevState];
            const index = copy.findIndex((cp) => cp.id === idInputModal);
            if (index > 0) {
              copy[index].state = 'Cerrado';
            }
            return copy;
          });
        }
        return;
      }
      message.error('Error al cerrar seguimiento');
    } catch (e) {
      setLoading(false);
      //console.log(e.message);
      message.error('Error al cerrar seguimiento');
    }
  };
  const formFail = (errorForm: any) => {
    //console.log('Error al cerrar seguimiento', errorForm);
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      //console.log('debbug_0');
      await getDataGraphId(idInputModal!);
      const url = window.location.href;
      if (
        (url.includes('lead') &&
          url.includes('id-lead') &&
          url.includes('identification')) ||
        url.includes('delivery')
      ) {
        setIsPageLead(true);
      }
    };
    componentdidmount();
  }, []);

  /********************************RETURN**************************************/

  return (
    <>
      <h2 className="text-2xl c-black m-0 p-0 flex">
        <img
          alt="not-found"
          className="mr-2"
          src="https://www.flaticon.es/svg/static/icons/svg/892/892223.svg"
          width="25"
        />{' '}
        Detalle del Seguimiento
      </h2>
      <Divider />
      {detailTracing && (
        <div className="mt-5">
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Nombre
              </Col>
              <Col span={12}>
                <span className="text-black">{detailTracing.client?.name}</span>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Apellido
              </Col>
              <Col span={12}>
                <span className="text-black">
                  {detailTracing.client?.lastName}
                </span>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Teléfono
              </Col>
              <Col span={12}>{detailTracing.client?.cellphone}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Fecha de creación
              </Col>
              <Col span={12}>
                {milisecondsToDate(
                  detailTracing.createdAt!,
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Estado
              </Col>
              <Col span={12}>
                {closeDataInformation ? (
                  <Tag color="green">Cerrado</Tag>
                ) : detailTracing.closeDate ? (
                  <Tag color="green">Cerrado</Tag>
                ) : (
                  <Tag color="gold">Pendiente</Tag>
                )}
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Fecha de ejecución
              </Col>
              <Col
                className={
                  closeDataInformation
                    ? 'text-blue-600'
                    : detailTracing.closeDate
                    ? 'text-blue-600'
                    : outTime(detailTracing.executionDate!)
                    ? 'text-red-600'
                    : 'text-green-600'
                }
                span={12}
              >
                {milisecondsToDate(
                  detailTracing.executionDate!,
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Prioridad
              </Col>
              <Col span={12}>
                <Tag
                  color={`${
                    detailTracing.priority === 'Alta'
                      ? 'red'
                      : detailTracing.priority === 'Baja'
                      ? 'blue'
                      : ''
                  }`}
                >
                  {detailTracing.priority}
                </Tag>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Tipo
              </Col>
              <Col span={12}>{detailTracing.type}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Motivo
              </Col>
              <Col span={12}>
                <Tag
                  color={`${
                    detailTracing.motive === 'Test Drive'
                      ? 'magenta'
                      : detailTracing.motive === 'Demostracion'
                      ? 'volcano'
                      : detailTracing.motive === 'Indagacion'
                      ? 'purple'
                      : detailTracing.motive === 'Cotizacion'
                      ? 'geekblue'
                      : ''
                  }`}
                >
                  {detailTracing.motive}
                </Tag>
              </Col>
            </Row>
            {detailTracing.linksOffice365 &&
              detailTracing.linksOffice365.length > 0 && (
                <Row gutter={[16, 16]}>
                  <Col span={12} className="text-right">
                    Links office 365
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {detailTracing.linksOffice365?.map((link, index) => (
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noreferrer"
                          key={index}
                        >
                          {link.link}
                        </a>
                      ))}
                    </div>
                  </Col>
                </Row>
              )}
            {detailTracing.openingNote ? (
              <Row gutter={[16, 16]}>
                <Col span={12} className="text-right">
                  Nota de apertura
                </Col>
                <Col span={12}>{detailTracing.openingNote}</Col>
              </Row>
            ) : (
              ''
            )}
            {detailTracing.closeNote ? (
              <Row gutter={[16, 16]}>
                <Col span={12} className="text-right">
                  Nota de cierre
                </Col>
                <Col span={12}>{detailTracing.closeNote}</Col>
              </Row>
            ) : (
              ''
            )}

            {detailTracing.type?.toUpperCase() === 'CITA VIRTUAL' && (
              <Row gutter={[16, 16]}>
                <Col span={12} className="text-right">
                  Cita Virtual
                </Col>
                <Col span={12}>
                  {/*  <Link
                    to="/excel/Template_excel.xlsx"
                    target="_blank"
                    style={{ marginTop: 5 }}
                  >
                    Descargar excel base
                  </Link> */}
                  {!isPageLead ? (
                    <Button
                      type="link"
                      onClick={() => {
                        //console.log('linkVchat', linkVchat);
                        if (linkVchat) {
                          historyRouter.push(
                            `/lead/id-lead=${detailTracing?.leads?.id}/identification=${detailTracing?.client?.identification}`,
                            {
                              step: 0,
                              id: detailTracing?.client?.identification,
                              idLead: detailTracing?.leads?.id,
                              vchat: linkVchat,
                            }
                          );
                        }
                      }}
                    >
                      Ir a cita virtual
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        if (linkVchat) {
                          if (setCode) {
                            setCode(linkVchat.code);
                          }
                          if (setVchatActivated) setVchatActivated(true);
                        }
                      }}
                    >
                      Iniciar Llamada
                    </Button>
                  )}
                </Col>
              </Row>
            )}
          </div>

          <div className="flex justify-center mt-5">
            {btnClose && (
              <div className="">
                <Button
                  type="primary"
                  htmlType="submit"
                  ghost
                  onClick={() => {
                    setSeeForm(true);
                    setbtnClose(false);
                  }}
                >
                  Cerrar
                </Button>
              </div>
            )}
            <div style={{ marginLeft: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                ghost
                onClick={() => {
                  setViewModal(true);
                }}
              >
                Añadir
              </Button>
            </div>
          </div>
        </div>
      )}

      {seeForm && (
        <div>
          <h2 className="text-center  text-xl font-bold mt-3">
            {' '}
            ¿Estás seguro que quieres cerrar este seguimiento?{' '}
          </h2>
          <Form onFinish={formSuccess} onFinishFailed={formFail}>
            <Form.Item
              label="Nota de cierre"
              name="nota"
              className="px-5 my-10"
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                onClick={() => {
                  setSeeForm(false);
                  setbtnClose(true);
                }}
                danger
                className="mr-1"
              >
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" onClick={() => {}} ghost>
                Cerrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      <Modal
        title=""
        width={800}
        visible={viewModal}
        onOk={() => {
          setViewModal(false);
        }}
        onCancel={() => {
          setViewModal(false);
        }}
        footer={[
          <Button
            type="primary"
            key="back"
            onClick={() => {
              setViewModal(false);
            }}
          >
            Regresar
          </Button>,
        ]}
      >
        {detailTracing && (
          <FormFollow
            identificationInput={null}
            preData={{
              client: detailTracing.client!,
              userGUC: detailTracing.user!,
            }}
            idLead={detailTracing.leads!.id!}
            setDataTableTracings={setDataTableTracings}
            setDataTimeLine={setDataTimeLine}
          />
        )}
      </Modal>
      <Loading visible={loading} />
    </>
  );
};

export default DetailFollow;
