/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Alert, Button, Form, message, Radio, Select, Skeleton } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Loading from '../../../components/Loading';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import {
  templateQuote,
  templateQuotePublicCatalog,
} from '../../../utils/templates-html/template-new-credit';
import PublicCatalogContext from '../context/PublicCatalogContext';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
export interface IConcessionaire {
  code: string | number;
  name: string;
  city?: string;
}

export interface IDataConcessionaire {
  codigo: string;
  descripcion: string;
  id_sucursal: number;
  sucursal: string;
  ciudad?: string;
}

export interface IDataListConcessionaire {
  concessionaire: IConcessionaire;
  branchOffices: [IConcessionaire];
}

export interface IlistConcessionaire {
  branchOffices: any;
}

export interface IDataConcessionaire_BranchOfficess {
  concessionaire: IConcessionaire;
  branchOffices: IConcessionaire;
}

const initialValues: IConcessionaire = { code: '', name: '' };
const initialDataConcessionaire: IDataConcessionaire_BranchOfficess = {
  concessionaire: initialValues,
  branchOffices: initialValues,
};

const ModalSelectSucursal: FunctionComponent<{
  nextModalFinish: Function;
}> = ({ nextModalFinish }) => {
  const reRef = useRef<any>();
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listConcessionaire, setListConcessionaire] = useState<any>([]);
  const [sucursal, setSucursal] = useState<any>([]);
  const [dataConcessionaire, setDataConcessionaire] =
    useState<IDataConcessionaire_BranchOfficess>(initialDataConcessionaire);
  const [dataAdvisers, setDataAdvisers] = useState([]);
  const { setSucursalContext, clientData, quote, brand } =
    useContext(PublicCatalogContext);
  const [user, setUser] = useState<any>();
  const [recaptcha, setRecaptcha] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isErrorUser, setIsErrorUser] = useState<boolean>(false);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [isNotUser, setIsNotUser] = useState<boolean>(false);
  //-------------------------------Estados de bloqueo de select

  const onClickSeeAdvisers = async () => {
    setIsLoading(true);
    setSkeleton(true);
    const resp = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/sucursal',
      null
    );

    if (resp && !resp.ok) {
      message.error('Error al obtener sucursales');
      // setSkeleton(false);
      setIsLoading(false);
      return;
    }
    const { data } = resp;
    if (data) {
      const newListConcessionaire: any = [];
      let newListSucursales: any = [];
      if (!data.data) {
        message.warn('Ocurrió un problema Inténtelo nuevamente');
        return;
      }
      data.data.map((concessionaire: IDataConcessionaire) => {
        const exist = newListConcessionaire.every(
          (item: IDataListConcessionaire) => {
            return concessionaire.codigo !== item.concessionaire.code;
          }
        );
        if (exist) {
          data.data.forEach((item: IDataConcessionaire) => {
            if (item.codigo === concessionaire.codigo) {
              newListSucursales.push({
                code: item.id_sucursal,
                name: item.sucursal,
                city: item.ciudad,
              });
            }
          });
          const { codigo: code, descripcion: name }: IDataConcessionaire =
            concessionaire;
          newListConcessionaire.push({
            concessionaire: { code, name },
            branchOffices: newListSucursales,
          });
          newListSucursales = [];
        }
      });

      setListConcessionaire(newListConcessionaire);
    } else {
      message.error(
        'Verifique que se seleccionó un concesionario y una sucursal'
      );
    }
    setSkeleton(false);
    setIsLoading(false);
  };

  const onChangeFinal = async (sucursalUser: any, concessionaire: any) => {
    setIsLoading(true);
    const resp = await CRMRepository.getPublicCatalog(
      'POST',
      '/api/v1/public-catalog/get-user',
      {
        data: {
          sucursal: sucursalUser,
          concessionaire,
          brand,
        },
      }
    );

    if (resp.data.users.length === 0) {
      setIsNotUser(true);
    }
    setDataAdvisers(resp.data.users);
    setIsLoading(false);
  };

  const onChangeSelect = async (value: any, option: any) => {
    setIsErrorUser(false);
    setIsNotUser(false);
    if (option.name === 'concessionaire') {
      const { branchOffices } = listConcessionaire.find(
        (item: IDataListConcessionaire) => {
          return item.concessionaire.code === value;
        }
      );

      setDataConcessionaire({
        ...dataConcessionaire,
        concessionaire: { code: value, name: option.children },
        branchOffices: {
          code: branchOffices[0].code,
          name: branchOffices[0].name,
          city: branchOffices[0]?.city,
        },
      });
      setSucursal(branchOffices);
    } else if (option.name === 'sucursal') {
      setIsErrorUser(false);
      setIsNotUser(false);
      setIsLoading(true);
      const city = sucursal.find(
        (sucu: IConcessionaire) => `${sucu.code}` === `${value}`
      )?.city;
      setDataConcessionaire({
        ...dataConcessionaire,
        branchOffices: {
          code: value,
          name: option.children,
          city,
        },
      });
      onChangeFinal(value.toString(), dataConcessionaire.concessionaire.code);
      setIsLoading(false);
    }
  };

  const onChangeRadio = (value: any) => {
    setUser(value.target.value);
    setIsErrorUser(false);
  };

  const sendQuoteMail = async (
    client: any,
    dataUser: any,
    quoteData: any,
    concessionaire: any
  ): Promise<boolean> => {
    try {
      const newClient = {
        ...client,
        chanel: 'Cotizador público',
        campaign: 'Cotizador público',
      };
      const templateStringHTML = templateQuotePublicCatalog(
        newClient,
        dataUser,
        quoteData,
        true,
        concessionaire
      );
      const newEmail = await CRMRepository.getPublicCatalog(
        'POST',
        '/api/v1/public-catalog/email',
        {
          data: {
            asunto: 'Cotización de vehículo',
            template: 'FreeTemplate',
            bodyData: templateStringHTML!,
            destinatario: client.email,
            copia: '',
            cc: '',
            adjuntos: 1,
          },
        }
      );
      if (newEmail) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    onClickSeeAdvisers();
  }, []);

  const finishModal = async () => {
    if (recaptcha !== '' && user) {
      setIsLoading(true);
      setIsError(false);
      setIsErrorUser(false);
      setIsNotUser(false);
      const token = await reRef.current.getValue();
      //reRef.current.reset();
      if (setSucursalContext) setSucursalContext(dataConcessionaire);

      const newClient = await CRMRepository.getPublicCatalog(
        'POST',
        '/api/v1/public-catalog/new-client',
        {
          data: clientData,
        }
      );
      const newDataLead = {
        motive: 'Demostración',
        executionDate: moment().format(),
        openingNote: 'Nuevo cliente de catálogo público',
        idClient: newClient.data.idClient,
        idUser: user,
        idAgency: dataConcessionaire.concessionaire.code,
        concessionaire: {
          code: dataConcessionaire.concessionaire.code,
          name: dataConcessionaire.concessionaire.name,
        },
        sucursal: {
          code: dataConcessionaire.branchOffices.code.toString(),
          name: dataConcessionaire.branchOffices.name,
        },
      };
      const newLead = await CRMRepository.getPublicCatalog(
        'POST',
        '/api/v1/public-catalog/new-lead',
        {
          data: newDataLead,
        }
      );
      if (!newLead) {
        message.warning('Ocurrió un problema intente nuevamente');
        setIsLoading(false);
        return;
      }
      const newQuote = await CRMRepository.getPublicCatalog(
        'POST',
        '/api/v1/public-catalog/new-quote',
        {
          data: {
            quoteInsert: quote,
            idLead: newLead.data.idLead,
            idClient: newClient.data.idClient,
            token: recaptcha,
            idUser: user,
            identificationClient: clientData.identification,
          },
        }
      );
      if (!newQuote) {
        message.warning('Ocurrió un problema intente nuevamente');
        setIsLoading(false);
        return;
      }
      const adviser = await CRMRepository.getPublicCatalog(
        'POST',
        '/api/v1/public-catalog/adviser',
        {
          data: user,
        }
      );
      if (!adviser) {
        message.warning('Ocurrió un problema intente nuevamente adviser');
        setIsLoading(false);
        return;
      }
      const email = await sendQuoteMail(
        clientData,
        adviser.data,
        quote,
        dataConcessionaire.concessionaire.code
      );
      if (!email) {
        message.warning('Ocurrió un problema intente nuevamente mail');
        setIsLoading(false);
        return;
      }
      setRecaptcha('');
      setIsLoading(false);
      nextModalFinish();
    }
  };

  const onChangeRecaptcha = (e: any) => {
    if (e) {
      setRecaptcha(e);
      setIsError(false);
    }
  };

  const onClickError = () => {
    if (!recaptcha) {
      setIsError(true);
    }
    if (!user) {
      setIsErrorUser(true);
    }
  };
  return (
    <>
      {isLoading && <Loading visible={isLoading} />}
      {skeleton ? (
        <div style={{ marginTop: '20px', padding: 20 }}>
          <Skeleton avatar paragraph={{ rows: 2 }} active />
          <Skeleton avatar paragraph={{ rows: 2 }} active />
          <Skeleton avatar paragraph={{ rows: 2 }} active />
        </div>
      ) : (
        <div className="p-modal-left">
          <Form
            {...layout}
            layout="horizontal"
            onValuesChange={() => {}}
            onFinish={finishModal}
          >
            <div>
              <div className="">
                <Form.Item
                  label="Concesionario"
                  name="concesionario"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Seleccionar Concesionario"
                    onChange={onChangeSelect}
                  >
                    {listConcessionaire.map(
                      ({ concessionaire }: IDataListConcessionaire, i: any) => {
                        return (
                          <Select.Option
                            name="concessionaire"
                            value={concessionaire.code}
                            key={i}
                          >
                            {concessionaire.name}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label="Sucursal"
                name="sucursal"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Seleccionar la sucursal"
                  onChange={onChangeSelect}
                  //value={sucursal[0].code}
                >
                  {sucursal.map(({ code, name }: IConcessionaire, i: any) => {
                    return (
                      <Select.Option value={code} key={i} name="sucursal">
                        {name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {isNotUser && (
                <div
                  style={{
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Alert
                    message="No hay asesores disponibles para esta suscursal  "
                    type="warning"
                    showIcon
                    closable
                  />{' '}
                </div>
              )}
              {dataAdvisers.length > 0 && (
                <div className="select-user-main">
                  <div className="select-user">Asesores disponibles </div>
                  <div className=" select-user">
                    {' '}
                    <Radio.Group
                      onChange={onChangeRadio}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      {dataAdvisers.map((item: any, i: any) => {
                        return (
                          <Radio
                            style={{ marginBottom: '1rem' }}
                            value={item.id}
                            key={i}
                          >
                            {`${item.nombre} ${item.apellido}`}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </div>
                </div>
              )}

              {isErrorUser && (
                <div className="error-user mb-5 select-user">
                  {' '}
                  Por favor seleccione un usuario
                </div>
              )}
              <div className="recaptcha-modal">
                <ReCAPTCHA
                  sitekey={`${process.env.REACT_APP_KEY}`}
                  ref={reRef}
                  size="normal"
                  onChange={onChangeRecaptcha}
                />
              </div>

              {isError && (
                <div style={{ marginTop: 20 }}>
                  <span className="msg-recaptcha">
                    Por favor confirme el CAPTCHA
                  </span>
                </div>
              )}
            </div>
            <div
              style={{
                marginTop: 50,
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                onClick={onClickError}
                style={{ width: '30%' }}
              >
                Finalizar
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default ModalSelectSucursal;
