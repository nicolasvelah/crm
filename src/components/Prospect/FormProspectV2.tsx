import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { Input, Button, Select, Spin, Switch, DatePicker, message } from 'antd';
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  WarningFilled,
} from '@ant-design/icons';

import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { tryCatch } from 'rxjs/internal-compatibility';
import Client from '../../data/models/Client';
import validateIdRuc, {
  TypeDocument,
  RespValidate,
} from '../../utils/validate-id-ruc';
import graphqlRoute from '../../data/providers/api/api-graphql';
import { UserGlobal, ConsesionarioInterface } from '../../state/MenuState';
import auth from '../../utils/auth';
import validatePhone from '../../utils/validate-phone';
import Loading from '../Loading';
import { ClientLeadContext } from '../GetClientData';
import { dateFormat } from '../../pages/Follow/components/MainFollow';
import milisecondsToDate from '../../utils/milisecondsToDate';
import Leads from '../../data/models/Leads';
import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import ClientsRepository from '../../data/repositories/clients-repository';
import SettingsRepository from '../../data/repositories/settings-repository';
import Financial from '../../data/models/Settings';
import ValidarIdentificacion from '../../utils/validate-id-ruc-v2';

type TypeForm = 'create' | 'edit' | 'viewProspect' | 'update';

export interface ConsesionarioSucursal {
  name: string;
  code: string;
  disabled: boolean;
}
interface JsonForm {
  value: string | null;
  disabled: boolean;
  error?: string | null;
}
interface ValuesForm {
  typeIdentification: JsonForm;
  identification: JsonForm;
  socialRazon: JsonForm;
  name: JsonForm;
  lastName: JsonForm;
  birthdate: JsonForm;
  phone: JsonForm;
  email: JsonForm;
  chanel: JsonForm;
  campaign: JsonForm;
  isPerson?: boolean;
  lead?: number;
}

const { Option } = Select;

const thereAreErrors = (
  val: any,
  theIsSucursal: boolean,
  thereIsConsesionario: boolean
): boolean => {
  let error = false;
  if (!theIsSucursal) {
    return true;
  }
  if (!thereIsConsesionario) {
    return true;
  }
  // eslint-disable-next-line consistent-return
  Object.keys(val).forEach((key: string) => {
    //console.log('val[key]', val[key]);
    if (
      key !== 'isPerson' &&
      key !== 'birthdate' &&
      (val[key].error || val[key].error === null)
    ) {
      //console.log('Si ERror');
      error = true;
      return true;
    }
    if (key !== 'isPerson' && key !== 'birthdate' && val[key].value === '') {
      //console.log('Si ERror vacio');
      error = true;
      return true;
    }
  });

  return error;
};

const MainFormProspect: FunctionComponent<{
  type: TypeForm;
  initData?: Client;
  onCreate?: Function;
  onView?: Function;
  onUpdate?: Function;
}> = ({ type, initData, onCreate, onView, onUpdate }) => {
  //const userStore: any = useContext(GlobalMenuContext);
  //const { store }: { store: MenuGlobalState } = userStore;

  const { user } = auth;
  //console.log({ user });

  if (user && user.id !== -1) {
    return (
      <div>
        <FormProspect
          type={type}
          initData={initData}
          onCreate={onCreate}
          onView={onView}
          onUpdate={onUpdate}
          user={{
            apellido: user.apellido ?? '',
            brand: user.brand ?? '',
            codUsuario: user.codUsuario ?? '',
            concessionaire: user.concessionaire ?? '',
            dealer: user.dealer!,
            createdAt: user.createdAt ?? '',
            empresa: user.empresa ?? '',
            id: user.id ?? -1,
            CRMTransactionToken: user.CRMTransactionToken ?? '',
            nombre: user.nombre ?? '',
            role: user.role ?? '',
            timeExpiration: user.timeExpiration ?? ''!,
            updateAt: user.updateAt ?? ''!,
          }}
        />
      </div>
    );
  }
  return null;
};

const FormProspect: FunctionComponent<{
  type: TypeForm;
  initData?: Client;
  onCreate?: Function;
  onView?: Function;
  onUpdate?: Function;
  user: UserGlobal;
}> = ({ type, initData, onCreate, onView, onUpdate, user }) => {
  /******************************HOOKS*****************************************/
  const id =
    user.dealer.length > 0
      ? user.dealer[0].sucursal.length > 0
        ? user.dealer[0].sucursal[0].id_sucursal ?? -1
        : -1
      : -1;
  const [loadId, setLoadId] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<RespValidate | null>(null);
  const [consesionario, setConsesionario] =
    useState<ConsesionarioSucursal | null>(null);
  const [sucursal, setSucursal] = useState<ConsesionarioSucursal | null>(null);
  const [totalConsesionario, setTotalConsesionario] =
    useState<ConsesionarioInterface | null>(null);

  const [typeIdentification, setTypeId] = useState<string>('CEDULA');
  const [identification, setIdentification] = useState<string | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const historyRouter = useHistory();
  const setViewProspect = (route: string, dataToSend?: any) => {
    historyRouter.push(route, dataToSend);
  };
  const [valuesForm, setValuesForm] = useState<ValuesForm>({
    typeIdentification: {
      value: 'CEDULA',
      disabled: false,
    },
    identification: {
      value: null,
      disabled: false,
      error: null,
    },
    name: {
      value: null,
      disabled: true,
      error: null,
    },
    lastName: {
      value: null,
      disabled: true,
      error: null,
    },
    birthdate: {
      value: null,
      disabled: true,
      error: null,
    },
    socialRazon: {
      value: null,
      disabled: true,
      error: null,
    },
    phone: {
      value: null,
      disabled: true,
      error: null,
    },
    email: {
      value: null,
      disabled: true,
      error: null,
    },
    chanel: {
      value: null,
      disabled: true,
      error: null,
    },
    campaign: {
      value: null,
      disabled: true,
      error: null,
    },
    isPerson: undefined,
  });
  const [leads, setLeads] = useState<Leads[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [campaigns, setCampaigns] = useState<string[] | null>(null);

  const clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );

  const validarIdentificacion = new ValidarIdentificacion();

  const getCampaigns = async () => {
    const dataCampaigns = await settingsRepository.getAllSettings(id ?? -1);
    //console.log('CAMPANAS', dataCampaigns);
    if (dataCampaigns) {
      const mapCampaigns = dataCampaigns
        .filter((dC) => dC.settingType === 'campaign')
        .map((dC) => {
          const dataJson = JSON.parse(dC.settingValue);
          return dataJson.nombre;
        });
      setCampaigns(mapCampaigns);
    }
  };

  useEffect(() => {
    if (initData) {
      //console.log('INIT DATA >>', initData);
      setValuesForm({
        typeIdentification: {
          value: initData.typeIdentification
            ? initData.typeIdentification
            : null,
          disabled: true,
        },
        identification: {
          value: initData.identification ?? null,
          disabled: true,
        },
        name: {
          value: initData.name ?? null,
          disabled: true,
        },
        lastName: {
          value: initData.lastName ?? null,
          disabled: true,
        },
        birthdate: {
          value: null,
          disabled: true,
        },
        socialRazon: {
          value: initData.socialRazon ?? null,
          disabled: true,
        },
        phone: {
          value: initData.cellphone ?? null,
          disabled: true,
        },
        email: {
          value: initData.email ?? null,
          disabled: true,
        },
        chanel: {
          value: initData.chanel ?? null,
          disabled: true,
        },
        campaign: {
          value: initData.campaign ?? null,
          disabled: true,
        },
        isPerson: !!initData.isPerson,
      });
      setTypeId(initData.typeIdentification ?? typeIdentification);

      /* if (initData.leads && initData.leads.length > 0) {
        initData.leads.forEach((lead) => {
          if (lead.consesionario) {
            setConsesionario({
              cod: lead.consesionario!,
              value: '',
              disabled: true,
            });
            if (lead.sucursal) {
              setConsesionario({
                cod: lead.consesionario!,
                value: '',
                disabled: true,
              });
            }
            return;
          }
        });
      } */
    }
    //console.log(user);
    if (user.dealer && user.dealer.length === 1) {
      //console.log('Entro 1');
      setConsesionario({
        name: user.dealer[0].descripcion,
        code: user.dealer[0].codigo,
        disabled: true,
      });
      if (user.dealer[0].sucursal.length === 1) {
        //console.log('Entro 2');
        setSucursal({
          name: user.dealer[0].sucursal[0].sucursal,
          code: user.dealer[0].sucursal[0].id_sucursal.toString(),
          disabled: true,
        });
      } else {
        setTotalConsesionario(user.dealer[0]);
      }
    }
    getCampaigns();

    // eslint-disable-next-line
  }, []);

  const validateIdentification = async (valId: string) => {
    setValuesForm((prevState) => ({
      ...prevState,
      identification: {
        value: valId,
        disabled: false,
        error: null,
      },
    }));
    setIdentification(valId);
    /* const val = validateIdRuc(
      valuesForm.typeIdentification.value as TypeDocument,
      valId
    ); */
    let val = {
      isValidate: false,
      message: 'Test',
    };
    if ((valuesForm.typeIdentification.value as TypeDocument) === 'CEDULA') {
      val = validarIdentificacion.validarCedula(valId);
    } else if (
      (valuesForm.typeIdentification.value as TypeDocument) === 'RUC'
    ) {
      val = validarIdentificacion.validarRucPersonaNatural(valId);
      if (!val.isValidate) {
        val = validarIdentificacion.validarRucSociedadPrivada(valId);
        if (!val.isValidate) {
          val = validarIdentificacion.validarRucSociedadPublica(valId);
        }
      }
    } else if (
      (valuesForm.typeIdentification.value as TypeDocument) === 'PASAPORTE'
    ) {
      val = {
        isValidate: true,
        message: 'Pasaporte válido',
      };
    }
    //console.log('val >>', val);
    setMessageId(val);
    if (val.isValidate) {
      setLoadId(true);
      const clientsGQL = await clientsRepository.getOneClientByIdentification(
        valId
      );
      //const resp = await graphqlRoute(queryGetClient(valId));
      //const clientsGQL: Client[] = resp.data.getClientsByIdentification;
      if (clientsGQL) {
        //console.log('Prospectos:', clientsGQL);
        setMessageId({
          isValidate: true,
          message: 'Prospecto encontrado',
          isClient: true,
        });
        setValuesForm((prevState) => ({
          ...prevState,
          identification: {
            value: valId,
            disabled: false,
            error: undefined,
          },
          socialRazon: {
            value: clientsGQL.socialRazon!,
            disabled: true,
          },
          name: {
            value: clientsGQL.name!,
            disabled: true,
          },
          lastName: {
            value: clientsGQL.lastName!,
            disabled: true,
          },
          birthdate: {
            value: clientsGQL.birthdate!,
            disabled: true,
          },
          phone: {
            value: clientsGQL.cellphone!,
            disabled: true,
          },
          email: {
            value: clientsGQL.email!,
            disabled: true,
          },
          chanel: {
            value: clientsGQL.chanel!,
            disabled: true,
          },
          campaign: {
            value: clientsGQL.campaign!,
            disabled: true,
          },
          isPerson: clientsGQL.isPerson!,
        }));

        //console.log('USUARIO ACTUAL', user);
        const leadsOk: Leads[] = [];
        if (user.role === 'ASESOR COMERCIAL') {
          const leadFind = clientsGQL.leads?.filter((lds) => {
            if (lds.user.codUsuario === user.codUsuario) {
              return true;
            }
            return false;
          });
          if (leadFind) {
            leadsOk.push(...leadFind);
          }
        } else if (user.role === 'JEFE DE VENTAS') {
          user.dealer.forEach((dea) => {
            const leadFind = clientsGQL.leads?.filter(
              (lds) => lds.concesionario?.code === dea.codigo
            );
            if (leadFind) {
              leadsOk.push(...leadFind);
            }
          });
        }

        /* user.dealer.forEach((dea) => {
          const leadFind = clientsGQL.leads?.filter(
            (lds) => lds.concesionario?.code === dea.codigo
          );
          if (leadFind) {
            leadsOk.push(...leadFind);
          }
        }); */
        //console.log('leadsOk', leadsOk);

        if (leadsOk) {
          if (leadsOk.length === 0) {
            message.warning(
              'Este prospecto no cuenta con un negocio para esta sucursal'
            );
          }
          setLeads(leadsOk);
        }
      } else {
        setMessageId({
          isValidate: true,
          message: 'Ingrese el nuevo prospecto',
          isClient: false,
        });
        setValuesForm((prevState) => ({
          ...prevState,
          identification: {
            value: valId,
            disabled: false,
            error: undefined,
          },
          socialRazon: {
            value: null,
            disabled: false,
            error:
              prevState.typeIdentification.value === 'RUC' ? null : undefined,
          },
          name: {
            value: null,
            disabled: false,
            error: null,
          },
          lastName: {
            value: null,
            disabled: false,
            error: null,
          },
          birthdate: {
            value: null,
            disabled: false,
            error: null,
          },
          phone: {
            value: null,
            disabled: false,
            error: null,
          },
          email: {
            value: null,
            disabled: false,
            error: null,
          },
          chanel: {
            value: null,
            disabled: false,
            error: null,
          },
          campaign: {
            value: null,
            disabled: false,
            error: null,
          },
          isPerson:
            prevState.typeIdentification.value === 'RUC' ? false : undefined,
        }));
      }
      //setIdentification(valId);
    } else {
      setValuesForm((prevState) => ({
        ...prevState,
        identification: {
          value: valId,
          disabled: false,
          error: val.message,
        },
        socialRazon: {
          value: null,
          disabled: true,
        },
        name: {
          value: null,
          disabled: true,
        },
        lastName: {
          value: null,
          disabled: true,
        },
        birthdate: {
          value: null,
          disabled: true,
        },
        phone: {
          value: null,
          disabled: true,
        },
        email: {
          value: null,
          disabled: true,
        },
        chanel: {
          value: null,
          disabled: true,
        },
        campaign: {
          value: null,
          disabled: true,
        },
      }));
    }

    setLoadId(false);
  };

  useEffect(() => {
    const myFunc = async () => {
      if (edit && identification) {
        //console.log(
        //   'valuesForm.typeIdentification.value',
        //   valuesForm.typeIdentification.value
        // );
        const val = validateIdRuc(
          valuesForm.typeIdentification.value as TypeDocument,
          identification
        );
        //console.log('val >>', val);
        setMessageId(val.message === 'ok' ? null : val);
        setValuesForm((prevState) => ({
          ...prevState,
          identification: {
            value: identification,
            disabled: false,
            error: val.message === 'ok' ? undefined : val.message,
          },
        }));
        setIdentification(identification);

        return;
      }
      if (identification) {
        await validateIdentification(identification);
      }
    };
    myFunc();
    // eslint-disable-next-line
  }, [typeIdentification]);

  const onChangeId = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valId = e.target.value;
    if (edit) {
      const val = validateIdRuc(
        valuesForm.typeIdentification.value as TypeDocument,
        valId
      );
      //console.log('val >>', val);
      setMessageId(val.message === 'ok' ? null : val);
      setValuesForm((prevState) => ({
        ...prevState,
        identification: {
          value: valId,
          disabled: false,
          error: val.message === 'ok' ? undefined : val.message,
        },
      }));
      setIdentification(valId);

      return;
    }
    await validateIdentification(valId);
  };

  const disabledButton = () => {
    const newDataForm: any = {};
    const valForm: any = valuesForm;
    //console.log('valuesForm', valuesForm);
    Object.keys(valuesForm).forEach((key: string) => {
      if (key !== 'isPerson') {
        const newObject = valForm[key] as JsonForm;
        newObject.disabled = edit;
        newDataForm[key] = newObject;
      }
    });
    //console.log('newDataForm', newDataForm);
    setValuesForm(newDataForm);

    setEdit((prevState: boolean) => !prevState);
  };
  //console.log('render Form', valuesForm.typeIdentification.value);
  /*******************************RETURN***************************************/

  return (
    <div className="flex flex-col w-full">
      {/* Tipo */}
      <div className="flex items-center w-full my-1">
        <div className="w-1/3 flex justify-end mx-2">
          <b>Tipo:</b>
        </div>
        <div className="w-2/3">
          <Select
            defaultValue="CEDULA"
            value={valuesForm.typeIdentification.value ?? undefined}
            disabled={valuesForm.typeIdentification.disabled}
            style={{ width: '100%' }}
            onChange={(value: string) => {
              setValuesForm({
                ...valuesForm,
                typeIdentification: {
                  value,
                  disabled: false,
                },
                isPerson: value === 'RUC' ? false : undefined,
              });
              setTypeId(value);
              //console.log('select value', value);
            }}
          >
            <Option value="CEDULA">Cédula</Option>
            <Option value="RUC">RUC</Option>
            <Option value="PASAPORTE">Pasaporte</Option>
          </Select>
        </div>
      </div>

      {/* Nro identificación */}
      <div className="flex items-center w-full my-1">
        <div className="w-1/3 flex justify-end mx-2">
          <b>Nro Identificación:</b>
        </div>
        <div className="w-2/3 relative">
          <Input
            placeholder="Identificación"
            onChange={onChangeId}
            disabled={valuesForm.identification.disabled}
            value={valuesForm.identification.value ?? undefined}
          />
          <CheckIdentification load={loadId} val={messageId ?? undefined} />
        </div>
      </div>
      {/* ES PERSONA JURIDICA */}
      {valuesForm.typeIdentification.value === 'RUC' && (
        <div className="flex items-center w-full my-1">
          <div className="w-1/3 flex justify-end mx-2">
            {/* <b onClick={() => console.log('isP', valuesForm.isPerson)}> */}
            <b>¿Es persona jurídica?:</b>
          </div>
          <div className="w-2/3">
            <Switch
              disabled={valuesForm.socialRazon.disabled}
              checked={valuesForm.isPerson}
              onChange={(checked) => {
                //console.log('isPerson', valuesForm.isPerson, checked);
                setValuesForm({
                  ...valuesForm,
                  isPerson: checked,
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Razon Social */}
      {console.log({
        typeIdentification,
        typeIdentificationVF: valuesForm.typeIdentification.value,
      })}
      {typeIdentification === 'RUC' &&
        valuesForm.typeIdentification.value === 'RUC' && (
          <div className="flex items-center w-full my-1">
            <div className="w-1/3 flex justify-end mx-2">
              <b>Razón Social:</b>
            </div>
            <div className="w-2/3">
              <Input
                placeholder="Razón Social"
                disabled={valuesForm.socialRazon.disabled}
                value={valuesForm.socialRazon.value ?? undefined}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  //setName(e.target.value);
                  setValuesForm({
                    ...valuesForm,
                    socialRazon: {
                      value: e.target.value,
                      disabled: false,
                    },
                  });
                }}
              />
            </div>
          </div>
        )}
      {/* Nombre */}
      <div className="flex items-center w-full my-1">
        <div className="w-1/3 flex justify-end mx-2">
          <b>Nombre del contacto:</b>
        </div>
        <div className="w-2/3">
          <Input
            placeholder="Nombre"
            disabled={valuesForm.name.disabled}
            value={valuesForm.name.value ?? undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              //setName(e.target.value);
              setValuesForm({
                ...valuesForm,
                name: {
                  value: e.target.value,
                  disabled: false,
                },
              });
            }}
          />
        </div>
      </div>

      {/* Apellido */}
      <div className="flex items-center w-full my-1">
        <div className="w-1/3 flex justify-end mx-2">
          <b>Apellido del contacto:</b>
        </div>
        <div className="w-2/3">
          <Input
            placeholder="Apellido"
            disabled={valuesForm.lastName.disabled}
            value={valuesForm.lastName.value ?? undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              //setName(e.target.value);
              setValuesForm({
                ...valuesForm,
                lastName: {
                  value: e.target.value,
                  disabled: false,
                },
              });
            }}
          />
        </div>
      </div>

      {/* Celular */}
      <div className="flex items-center w-full my-1">
        <div className="w-1/3 flex justify-end mx-2">
          <b>Celular:</b>
        </div>
        <div className="w-2/3">
          <Input
            placeholder="Celular"
            disabled={valuesForm.phone.disabled}
            value={valuesForm.phone.value ?? undefined}
            pattern="[0-9] {3} - [0-9] {3} - [0-9] {3}"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              const newVal: ValuesForm = {
                ...valuesForm,
                phone: {
                  value: val,
                  disabled: false,
                },
              };
              const isvalid = validatePhone(val);
              if (!isvalid) {
                newVal.phone.error = 'NÚMERO CELULAR NO VÁLIDO';
              } else {
                newVal.phone.error = undefined;
              }
              setValuesForm(newVal);
            }}
          />
          {valuesForm.phone.error && (
            <div className="text-red-500 text-xs my-1">
              {valuesForm.phone.error}
            </div>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center w-full my-1">
        <div className="w-1/3 flex justify-end mx-2">
          <b>E-mail:</b>
        </div>
        <div className="w-2/3">
          <Input
            placeholder="E-mail"
            disabled={valuesForm.email.disabled}
            value={valuesForm.email.value ?? undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              const newVal: ValuesForm = {
                ...valuesForm,
                email: {
                  value: val,
                  disabled: false,
                },
              };
              const isOk = /\S+@\S+\.\S+/.test(val);
              //console.log('isOk', isOk);
              if (!isOk) {
                newVal.email.error = 'E-MAIL NO VÁLIDO';
              } else {
                newVal.email.error = undefined;
              }
              setValuesForm(newVal);
            }}
          />
          {valuesForm.email.error && (
            <div className="text-red-500 text-xs my-1">
              {valuesForm.email.error}
            </div>
          )}
        </div>
      </div>

      {/* Canal */}
      {!initData && (
        <div className="flex items-center w-full my-1">
          <div className="w-1/3 flex justify-end mx-2">
            <b>Canal:</b>
          </div>
          <div className="w-2/3">
            <Select
              style={{ width: '100%' }}
              value={valuesForm.chanel.value ?? undefined}
              disabled={valuesForm.chanel.disabled}
              onChange={(value: string) => {
                setValuesForm({
                  ...valuesForm,
                  chanel: {
                    value,
                    disabled: false,
                  },
                });
              }}
            >
              <Option value="Showroom">Showroom</Option>
              <Option value="Referidos">Referidos</Option>
              <Option value="Gestión externa">Gestión externa</Option>
              <Option value="Recompra">Recompra</Option>
              <Option value="Otro">Otro</Option>
            </Select>
          </div>
        </div>
      )}

      {/* Campaña */}
      {!initData && (
        <div className="flex items-center w-full my-1">
          <div className="w-1/3 flex justify-end mx-2">
            <b>Campaña:</b>
          </div>
          <div className="w-2/3">
            <Select
              style={{ width: '100%' }}
              value={valuesForm.campaign.value ?? undefined}
              disabled={valuesForm.campaign.disabled}
              onChange={(value: string) => {
                setValuesForm({
                  ...valuesForm,
                  campaign: {
                    value,
                    disabled: false,
                  },
                });
              }}
            >
              {campaigns &&
                campaigns.map((el: any, index: number) => (
                  <Option value={el} key={index}>
                    {el}
                  </Option>
                ))}
              <Option value="Ninguna">Ninguna</Option>
            </Select>
          </div>
        </div>
      )}

      {messageId?.isValidate &&
        !messageId?.isClient &&
        !loadId &&
        user.dealer.length > 0 && (
          <>
            <br />
            <br />
            {/* Consesionario */}
            <div className="flex items-center w-full my-1">
              <div className="w-1/3 flex justify-end mx-2">
                <b>Consesionario:</b>
              </div>
              <div className="w-2/3">
                <Select
                  style={{ width: '100%' }}
                  value={consesionario?.name ?? undefined}
                  disabled={consesionario?.disabled}
                  onChange={(value: string) => {
                    const actualConse = user.dealer.find(
                      (cons) => cons.codigo === value
                    );
                    if (actualConse) {
                      setConsesionario({
                        name: actualConse.descripcion,
                        code: actualConse.codigo,
                        disabled: false,
                      });
                      setTotalConsesionario(actualConse);
                      setSucursal(null);
                    }
                    //console.log('VALUE CONSE', value);
                  }}
                >
                  {user.dealer.map((cons, index) => (
                    <Option key={index} value={cons.codigo}>
                      {cons.descripcion}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Sucursal */}
            <div className="flex items-center w-full my-1">
              <div className="w-1/3 flex justify-end mx-2">
                <b>Sucursal:</b>
              </div>
              <div className="w-2/3">
                <Select
                  style={{ width: '100%' }}
                  value={sucursal?.name ?? undefined}
                  disabled={sucursal?.disabled}
                  onChange={(value: string) => {
                    //console.log('value sucu', value);
                    const actualSucu = totalConsesionario?.sucursal.find(
                      (sucu) => {
                        //console.log(
                        //   'sucu.id_sucursal.toString()',
                        //   sucu.id_sucursal.toString()
                        // );
                        return sucu.id_sucursal.toString() === value.toString();
                      }
                    );
                    //console.log('actualSucu sucu', actualSucu);
                    if (actualSucu) {
                      setSucursal({
                        name: actualSucu.sucursal,
                        code: actualSucu.id_sucursal.toString(),
                        disabled: false,
                      });
                    }
                  }}
                >
                  {totalConsesionario?.sucursal.map((sucu, index) => (
                    <Option key={index} value={sucu.id_sucursal}>
                      {sucu.sucursal}
                    </Option>
                  ))}
                </Select>
              </div>
              {/* <Button onClick={() => //console.log({ sucursal, consesionario })}>
              CLIK ME
            </Button> */}
            </div>
          </>
        )}

      {/* Boton */}
      <div className="flex items-center w-full my-1">
        {/* <Button
          type="primary"
          onClick={async () => {
            //console.log(valuesForm);
          }}
        >
          CLICK
        </Button> */}
        {initData ? (
          <div className="flex justify-end w-full">
            {edit ? (
              <div className="flex">
                <Button
                  danger
                  className="mr-2"
                  onClick={() => {
                    if (initData) {
                      //disabledButton();
                      /* setIdentification(initData.identification ?? '');
                      setTypeId(
                        initData.typeIdentification
                          ? typeId(initData.typeIdentification)
                          : ''
                      ); */
                      setMessageId(null);
                      setIdentification(initData.identification ?? null);
                      setValuesForm({
                        typeIdentification: {
                          value: initData.typeIdentification
                            ? initData.typeIdentification
                            : null,
                          disabled: true,
                          error: undefined,
                        },
                        identification: {
                          value: initData.identification ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        name: {
                          value: initData.name ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        lastName: {
                          value: initData.lastName ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        birthdate: {
                          value: initData.birthdate ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        socialRazon: {
                          value: initData.socialRazon ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        phone: {
                          value: initData.cellphone ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        email: {
                          value: initData.email ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        chanel: {
                          value: initData.chanel ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        campaign: {
                          value: initData.campaign ?? null,
                          disabled: true,
                          error: undefined,
                        },
                        isPerson: !!initData.isPerson,
                      });
                      setEdit((prevState: boolean) => !prevState);
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  disabled={thereAreErrors(
                    valuesForm,
                    !!sucursal,
                    !!consesionario
                  )}
                  onClick={() => {
                    let ok = false;
                    if (onUpdate) {
                      ok = onUpdate({
                        type: valuesForm.typeIdentification.value,
                        identification: valuesForm.identification.value,
                        name: valuesForm.name.value,
                        lastName: valuesForm.lastName.value,
                        birthdate: valuesForm.birthdate.value,
                        phone: valuesForm.phone.value,
                        email: valuesForm.email.value,
                        canal: valuesForm.chanel.value,
                        campaign: valuesForm.campaign.value,
                        leads: undefined,
                        tracings: undefined,
                      });
                    }
                    if (ok) disabledButton();
                  }}
                >
                  Actualizar
                </Button>
              </div>
            ) : (
              <Button type="link" onClick={() => disabledButton()}>
                Editar datos del prospecto
              </Button>
            )}
          </div>
        ) : (
          <div className="flex justify-end w-full">
            <Button
              type="primary"
              disabled={thereAreErrors(
                valuesForm,
                messageId?.isClient ? true : !!consesionario,
                messageId?.isClient ? true : !!sucursal
              )}
              onClick={async () => {
                setLoading(true);
                if (messageId && !messageId.isClient && onCreate) {
                  await onCreate(
                    {
                      id: valuesForm.identification.value,

                      type: valuesForm.typeIdentification.value!,
                      socialReason: valuesForm.socialRazon.value,
                      name: valuesForm.name.value,
                      lastName: valuesForm.lastName.value,
                      //birthdate: valuesForm.birthdate.value,
                      birthdate: null,
                      phone: valuesForm.phone.value,
                      email: valuesForm.email.value,
                      canal: valuesForm.chanel.value,
                      campaign: valuesForm.campaign.value,
                      isPerson: !!valuesForm.isPerson,
                    },
                    sucursal,
                    consesionario
                  );
                } else if (messageId && messageId.isClient && onView) {
                  await onView(
                    {
                      id: valuesForm.identification.value,
                      //type: idType(valuesForm.typeIdentification.value!),
                      type: valuesForm.typeIdentification.value!,
                      socialReason: valuesForm.socialRazon.value,
                      name: valuesForm.name.value,
                      lastName: valuesForm.lastName.value,
                      birthdate: valuesForm.birthdate.value,
                      phone: valuesForm.phone.value,
                      email: valuesForm.email.value,
                      canal: valuesForm.chanel.value,
                      campaign: valuesForm.campaign.value,
                    },
                    leads ?? []
                  );
                }
                setLoading(false);
                //console.log(valuesForm);
              }}
            >
              {messageId && messageId.isClient
                ? leads && leads.length > 0
                  ? 'Siguiente'
                  : 'Crear negocio'
                : 'Crear prospecto'}
            </Button>
          </div>
        )}
      </div>
      <Loading visible={loading} />
    </div>
  );
};

/*******************************COMPONENT**************************************/
const CheckIdentification: FunctionComponent<{
  load?: boolean;
  val?: RespValidate;
}> = ({ load, val }) => {
  return (
    <div
      className="absolute"
      style={{
        right:
          val && val.isClient !== undefined && val.isClient === true
            ? -270
            : val && val.isClient !== undefined && val.isClient === false
            ? -270
            : load
            ? -270
            : -270,
        top: 0,
        width: 260,
        lineHeight: 1,
      }}
    >
      {load && <Spin style={{ marginLeft: 10 }} />}
      {val && !load && (
        <div className="flex items-center">
          {val.isClient !== undefined && val.isClient === true && (
            <CheckCircleFilled style={{ color: '#4E9A06', fontSize: 25 }} />
          )}

          {val.isClient !== undefined && val.isClient === false && (
            <ExclamationCircleFilled
              style={{ color: '#F3AC15', fontSize: 25 }}
            />
          )}
          {!val.isValidate && (
            <WarningFilled style={{ color: '#ED4B50', fontSize: 25 }} />
          )}

          <div
            className={`${
              val.isValidate
                ? val.isClient !== undefined && val.isClient === true
                  ? 'text-green-500'
                  : 'text-yellow-500'
                : 'text-red-500'
            } mx-1`}
          >
            {val.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFormProspect;
