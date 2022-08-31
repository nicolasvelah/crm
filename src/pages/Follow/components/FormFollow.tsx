import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  message,
  Tag,
  Radio,
  DatePicker,
  Divider,
  TimePicker,
} from 'antd';
import Item from 'antd/es/list/Item';
import moment, { Moment } from 'moment';
import Search from 'antd/es/input/Search';
import { Dependencies } from '../../../dependency-injection';
import Loading from '../../../components/Loading';
import Client from '../../../data/models/Client';
import User from '../../../data/models/User';
import Get from '../../../utils/Get';
import TracingsRepository from '../../../data/repositories/tracings-repository';
import UserRepository from '../../../data/repositories/user-repository';
import ClientsRepository from '../../../data/repositories/clients-repository';
import auth from '../../../utils/auth';
import { DataTracing } from './MainFollow';
import Tracings from '../../../data/models/Tracings';
import { ClientLeadContext } from '../../../components/GetClientData';

const { Option } = Select;

// Valores para alinear los elementos del Formulario
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const tailLayout = {
  wrapperCol: { offset: 21 },
};

const FormFollow: FunctionComponent<{
  identificationInput: string | null;
  reloadingPage?: Function;
  idLead?: number;
  preData?: {
    client: Client;
    userGUC: User;
  };
  setDataTableTracings?: React.Dispatch<React.SetStateAction<DataTracing[]>>;
  setDataTimeLine?: React.Dispatch<React.SetStateAction<Tracings[]>>;
}> = ({
  identificationInput,
  reloadingPage,
  idLead,
  preData,
  setDataTableTracings,
  setDataTimeLine,
}) => {
  /******************************HOOKS*****************************************/

  // DEPENDENCY INJECTION
  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  const clientRepository = Get.find<ClientsRepository>(Dependencies.clients);
  const userRepository = Get.find<UserRepository>(Dependencies.users);

  // CLEAN FORMULARIO
  const [form] = Form.useForm();

  // DATOS DEL USUARIO
  const { user } = auth;
  //console.log('user-->', user);
  //console.log('preData-->', preData);

  // ESTADO PARA ACTIVAR EL LOADING SCREEN MIENTRAS OPERA
  const [loading, setLoading] = useState<boolean>(false);

  // RADIO
  const [stateCheck, setStateCheck] = useState<number>(0);
  const [stateCheckUser, setStateCheckUser] = useState<number>(0);

  // CEDULA PARA EL NUEVO SEGUIMIENTO
  const [CI, setCi] = useState<string>();

  // ids de los negocios
  const [idsLeads, setIdsLeads] = useState<number[]>([]);

  // ID DEL EMPLEADO ASIGNADO POR JEFE
  const [idEmployee, setidEmployee] = useState<number>();

  // DATA ID BOSS
  const [dataBoss, setDataBoss] = useState<User[]>();
  // ESTADO PARA SELECCIONAR PROSPECTO PARA NUEVO SEGUIMIENTO
  const [selectProspect, setselectProspect] = useState<Client[]>();

  //ACTIVE FORM
  const [visible, setvisible] = useState<boolean>(true);
  //BTN DE REGRESAR
  const [btnReturnModal, setbtnReturnModal] = useState<boolean>(false);
  //CARGO DEL ANFITRION NO MUESTRA EMPLEADOS A CARGO
  const [anfitrion, setAnfitrion] = useState<boolean>();
  // ESTADO ACTIVAR LAS HORAS AL CREAR SEGUIMIENTO
  const [activeHours, setActiveHours] = useState<boolean>(true);
  // ESTADO ACTIVAR LOS MINUTOS AL CREAR SEGUIMIENTO
  const [activeMin, setAactiveMin] = useState<boolean>(false);
  //
  const [momentCustom, setMomentCustom] = useState<Moment | null>();
  //
  const [momentCustomMin, setMomentCustomMin] = useState<Moment | null>();

  const nameCallCenter =
    user?.role === 'CALL CENTER'
      ? `${user.nombre} ${user.apellido}`
      : undefined;

  const { lead } = useContext(ClientLeadContext);

  /******************************GENERALFUNCTION*******************************/

  //EL EMPLEADO JEFE OBTIENE A SUS EMPLEADOS
  const getDataGraphIdBoss = async (idBoos: number) => {
    setLoading(true);
    const respGQlIdBoss = await userRepository.getEmployeesByBoss();
    // console.log('respGQlIdBoss', respGQlIdBoss, idBoos);
    if (respGQlIdBoss) {
      const newDataByIdBoss: User[] = respGQlIdBoss.map((dataUser) => {
        return {
          nombre: dataUser.nombre,
          apellido: dataUser.apellido,
          role: dataUser.role,
          id: dataUser.id,
        };
      });
      //console.log('debbug_-1:', newDataByIdBoss);

      //console.log('debbug_0:', newDataByIdBoss);
      if (user?.role === 'CALL CENTER') {
        if (lead?.user) {
          // console.log('lead?.user -->', lead?.user);
          newDataByIdBoss.push({
            apellido: lead?.user?.apellido,
            id: lead?.user?.id,
            nombre: lead?.user?.nombre,
            role: lead?.user?.role,
          });
        } else {
          newDataByIdBoss.unshift({
            apellido: user?.apellido,
            id: user?.id,
            nombre: user?.nombre,
            role: user?.role,
          });
        }
      } else {
        newDataByIdBoss.push({
          nombre: user.nombre,
          apellido: user.apellido,
          role: user.role,
          id: user.id,
        });
      }
      console.log('debbug_1:', newDataByIdBoss);
      // SETEA LA INFORMACION DE LOS EMPLEADOS QUE TIENE A CARGO EL EMPLEADO JEFE
      setDataBoss(newDataByIdBoss);
      if (newDataByIdBoss.length > 0) {
        //SETEA POR DEFECTO AL PRIMER EMPLEADO AL EMPELADO JEFE
        setidEmployee(newDataByIdBoss![0].id);
        //console.log('debbug_4:', newDataByIdBoss![0].id);
      } else {
        //SETEA POR DEFECTO A SI MISMO
        //console.log('debbug_5:', user!.id);
        setidEmployee(user!.id);
        setLoading(false);
        return 'El empleado jefe no tiene empleados';
      }
      setLoading(false);
      return 'ok';
    }
    setLoading(false);
    return 'El empleado jefe no tiene empleados';
  };

  //BUSCA A LOS CLIENTES O CLIENTE POR CI. LASTNAME , EMAIL
  const getDataGraphOptions = async (nameSearchGQ: string) => {
    setLoading(true);
    const respGQlDB = await clientRepository.getClientsByOptions(nameSearchGQ);
    //console.log('log tracing', respGQlDB);

    if (respGQlDB) {
      const newDataClientByCiEmailLastName: Client[] = respGQlDB.map(
        (mydata) => {
          return {
            name: mydata.name,
            lastName: mydata.lastName,
            identification: mydata.identification,
            email: mydata.email,
            cellphone: mydata.cellphone,
            leads: mydata.leads,
          };
        }
      );
      //console.log('debbug_6:', newDataClientByCiEmailLastName);
      // SETEA LA INFORMACION DE LOS PROSPECTOS ENCONTRADOS
      setselectProspect(newDataClientByCiEmailLastName);
      if (newDataClientByCiEmailLastName.length > 0) {
        // OBLIGACION DE UN USUARIO APRA LLENAR FORMULARIO
        setvisible(false);
        //SETEA POR DEFECTO AL PRIMER PROSPECTO
        setCi(newDataClientByCiEmailLastName[0].identification!);

        //console.log(
        //   'debbug_7:',
        //   newDataClientByCiEmailLastName![0].identification
        // );

        if (idLead !== undefined) {
          setIdsLeads([idLead]);
        } else {
          const idsNegocio = respGQlDB
            .find((cli) => {
              return (
                newDataClientByCiEmailLastName[0].identification ===
                cli.identification
              );
            })
            ?.leads?.map((leadItem) => leadItem.id!);

          setIdsLeads(idsNegocio ?? []);
        }
      } else {
        // OBLIGACION DE UN USUARIO APRA LLENAR FORMULARIO
        setvisible(true);
        setLoading(false);
        return 'No se encontro al cliente';
      }
      setLoading(false);
      return 'ok';
    }
    setLoading(false);
    return 'No se encontro al cliente';
  };

  //GUARDA EL NUEVO SEGUIMIENTO
  const formSuccess = async (dataForm: any) => {
    try {
      //console.log('log tracing dataForm', dataForm);
      //throw new Error('Test');
      setLoading(true);
      if (!momentCustom) {
        message.error('Ingrese Hora para continuar');
        setLoading(false);
        return;
      }
      if (!momentCustomMin) {
        message.error('Ingrese Minutos para continuar');
        setLoading(false);
        return;
      }
      const dataToSend = {
        type: `${
          dataForm.customizeTipo ? dataForm.customizeTipo : dataForm.tipo
        }`,
        motive: `${
          dataForm.customizeMotivo ? dataForm.customizeMotivo : dataForm.motivo
        }`,
        priority: dataForm.prioridad,
        executionDate: `${dataForm.fecha.format(
          'YYYY-MM-DD'
        )} ${momentCustom?.format('HH')}:${momentCustomMin.format('mm')}`,
        closeDate: null,
        openingNote: nameCallCenter
          ? `Seguimiento creado por: ${nameCallCenter}${
              dataForm.nota && dataForm.nota !== '' ? `. ${dataForm.nota}` : ''
            }`
          : dataForm.nota,
        closeNote: null,
      };
      //console.log('dataToSend -->', dataToSend);
      /* const newTracingRespond: any = {
        ok: false,
        message: 'test',
        respTracing: null,
      }; */
      const newTracingRespond = await tracingsRepository.creatTracing(
        dataToSend,
        CI!,
        idEmployee!,
        idLead !== undefined ? idLead : dataForm.idLead
      );
      setLoading(false);
      if (newTracingRespond.ok) {
        message.success('Seguimiento guardado');
        setMomentCustom(null);
        setMomentCustomMin(null);

        const acualAsesor = dataBoss?.find(
          (asesor) => asesor.id && asesor.id === idEmployee
        );
        const acualClient = selectProspect?.find(
          (prospect) => CI && prospect.identification === CI
        );
        if (setDataTableTracings) {
          setDataTableTracings((prevState) => [
            {
              key: prevState.length.toString(),
              asesor: `${acualAsesor?.nombre} ${acualAsesor?.apellido}`,
              prospect: `${acualClient?.name} ${acualClient?.lastName}`,
              state: 'Pendiente',
              type: dataToSend.type,
              motive: dataToSend.motive,
              priority: dataToSend.priority,
              date: moment().format('YYYY-MM-DD HH:mm:ss'),
              id: parseInt(
                newTracingRespond.respTracing?.idTracing.toString() ?? ''
              ),
              identification: acualClient!.identification!,
              datex: dataToSend.executionDate,
              email: acualClient!.email!,
              lead: idLead !== undefined ? idLead : dataForm.idLead,
              createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
              executionDate: `${new Date(dataToSend.executionDate).getTime()}`,
              linkOffice365:
                newTracingRespond.respTracing?.linksOffice365 ?? [],
            },
            ...prevState,
          ]);
        }
        if (setDataTimeLine) {
          let dataSaveTracings: Tracings[] = [];
          setDataTimeLine((prevState) => {
            dataSaveTracings = prevState;
            return [];
          });
          setDataTimeLine((prevState) => {
            return [
              ...dataSaveTracings,
              {
                id: newTracingRespond.respTracing?.idTracing ?? 0,
                closeDate: undefined,
                executionDate: `${new Date(
                  dataToSend.executionDate
                ).getTime()}`,
                motive: dataToSend.motive,
                client: acualClient,
                user: acualAsesor,
              },
            ];
          });
        }
        // para cerrar el modal recargando la paguina
        if (reloadingPage) {
          reloadingPage(true);
        }

        form.resetFields();
        return;
      }
      message.error(`Error al crear seguimiento. ${newTracingRespond.message}`);
      return;
    } catch (e) {
      setLoading(false);
      //console.log(e.message);
      message.error(`Error al crear seguimiento. ${e.message}`);
    }
  };

  const formFail = (errorForm: any) => {
    //console.log('Formulario Fail', errorForm);
  };

  // eslint-disable-next-line no-shadow
  function range(start: number, end: number) {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      //// Si se tiene un cliente y usuario previo
      //console.log('DATOS DEL USUARIO:', user);
      if (user!.role!.toLocaleUpperCase() === 'ASESOR COMERCIAL') {
        // SI ES ANFITRION DESACTIVO LOS EMPELADOS A CARGO, NO TIENE
        setAnfitrion(true);
        //console.log('debbug_10');
        setidEmployee(user!.id);
        // SI SE CREA DESDE DETALLE DEL PROSPECTO
        setbtnReturnModal(true);

        const users = [
          {
            apellido: user?.apellido,
            id: user?.id,
            nombre: user?.nombre,
            role: user?.role,
          },
        ];
        //console.log('users seguimientos-->', users);
        setDataBoss(users);
      } else {
        // SI NO ES ANFITRION ACTIVO LOS EMPELADOS A CARGO, SI TIENE
        setAnfitrion(true);
        //console.log('debbug_0:', 'jefe de ventas');
        // SI SE CREA DESDE DETALLE DEL PROSPECTO
        setbtnReturnModal(true);
        if (!preData) {
          await getDataGraphIdBoss(user!.id!);
        }
      }
      if (preData) {
        setselectProspect([preData.client]);
        setCi(preData.client.identification ?? undefined);

        let users = [preData.userGUC];
        if (user?.role === 'CALL CENTER' || user?.role === 'JEFE DE VENTAS') {
          users.unshift({
            apellido: user?.apellido,
            id: user?.id,
            nombre: user?.nombre,
            role: user?.role,
          });
          const usersFilter: User[] = [];
          users.forEach((item) => {
            const isThere = !!usersFilter.find(
              (itemUser) => itemUser.id === item.id
            );
            if (!isThere) usersFilter.push(item);
          });
          users = usersFilter;
        }
        //console.log('users seguimientos-->', users);
        setDataBoss(users);
        setAnfitrion(true);
        setidEmployee(preData.userGUC.id);

        setvisible(false);
        if (idLead) {
          setIdsLeads([idLead]);
        }
        return;
      }

      if (identificationInput) {
        // SI SE CREA DESDE DETALLE DEL PROSPECTO
        setbtnReturnModal(false);
        await getDataGraphOptions(identificationInput!);
      }
    };
    componentdidmount();
  }, []);

  /********************************RETURN**************************************/

  return (
    <>
      <h2 className="text-2xl c-black m-0 p-0 flex">
        <img
          className="mr-2"
          src="https://www.flaticon.es/svg/static/icons/svg/892/892223.svg"
          width="25"
        />{' '}
        Crear Seguimiento
      </h2>
      <Divider />

      <div className="flex flex-col justify-center">
        {anfitrion ? (
          <div>
            {/*MUESTRA LOS EMPLEADOS DEL EMPLEADO JEFE*/}
            <div className="mb-3">
              <h2 className="text-xl">
                Usuario(s) a disposición: {dataBoss?.length}
              </h2>
              {dataBoss && dataBoss?.length > 0 ? (
                <Tag color="gold">Confirmar Empleado</Tag>
              ) : (
                <Tag color="gold">
                  El seguimiento se asignará automaticamente
                </Tag>
              )}
              <div className="flex flex-wrap">
                {dataBoss &&
                  dataBoss.map((data, index) => (
                    <div
                      key={`index_${index}`}
                      className="border border-gray-400  mr-4 p-5 mb-5 "
                      style={{ width: 200 }}
                    >
                      <span>
                        <Radio.Group
                          onChange={(e: any) => {
                            //console.log('debbug_2:', e.target.value);
                            setStateCheckUser(e.target.value);
                            //console.log(
                            //   'debbug_3:',
                            //   dataBoss![e.target.value].id
                            // );
                            setidEmployee(dataBoss![e.target.value].id);
                          }}
                          value={stateCheckUser}
                        >
                          <Radio value={index} />
                        </Radio.Group>
                      </span>
                      <br />
                      <span>
                        <strong className="text-black">Nombre: </strong>
                      </span>
                      <span>{data.nombre}</span>
                      <br />
                      <span>
                        <strong className="text-black">Apellido: </strong>
                      </span>
                      <span>{data.apellido}</span>
                      <br />
                      <span>
                        <strong className="text-black">Id: </strong>
                      </span>
                      <span>{data.id}</span>
                      <br />
                      <span>
                        <strong className="text-black">Rol: </strong>
                      </span>
                      <span>{data.role}</span>
                    </div>
                  ))}
              </div>
            </div>
            {/*FIN LOS EMPLEADOS DEL EMPLEADO JEFE*/}
          </div>
        ) : (
          ''
        )}

        {/*BUSCADOR DEL PROSPECTO*/}
        <div className="">
          {btnReturnModal && !preData && (
            <Item>
              <Search
                name="prospecto"
                className="ml-32"
                placeholder="CI, Email o Apellido(s)"
                enterButton
                style={{ width: 400 }}
                onSearch={async (valueSearch: string) => {
                  //console.log('debug_7', valueSearch);
                  await getDataGraphOptions(valueSearch);
                }}
              />
            </Item>
          )}
          {/*FIN BUSCADOR DEL PROSPECTO*/}

          {/*INFORMACION DEL PROSPECTO*/}
          <div className="mt-10 mb-5">
            <h2 className="text-xl">
              Prospecto(s) encontrado(s): {selectProspect?.length}
            </h2>
            {selectProspect && selectProspect?.length > 0 ? (
              <Tag color="gold">Confirmar Prospecto</Tag>
            ) : (
              <Tag color="gold">No se encontró ningun resultado</Tag>
            )}
            <div className="flex flex-wrap">
              {selectProspect &&
                selectProspect.map((data, index) => (
                  <div
                    key={`index_${index}`}
                    className="border border-gray-400  mr-4 p-5 mb-5 "
                    style={{ width: 200 }}
                  >
                    <span>
                      <Radio.Group
                        onChange={(e: any) => {
                          setStateCheck(e.target.value);
                          //console.log('debug_8', e.target.value);
                          setCi(selectProspect[e.target.value].identification!);
                          //console.log(
                          //   'debug_9',
                          //   selectProspect[e.target.value]
                          // );

                          ///Recupero el negocio del lead
                          const idsAllLeads = selectProspect[
                            e.target.value
                          ].leads?.map((lds) => lds.id!);

                          //console.log('debug_10', idsAllLeads);

                          if (idsAllLeads) {
                            setIdsLeads(idsAllLeads);
                          }
                        }}
                        value={stateCheck}
                      >
                        <Radio value={index} />
                      </Radio.Group>
                    </span>
                    <br />
                    <span>
                      <strong className="text-black">Nombre: </strong>
                    </span>
                    <span>{data.name}</span>
                    <br />
                    <span>
                      <strong className="text-black">Apellido: </strong>
                    </span>
                    <span>{data.lastName}</span>
                    <br />
                    <span>
                      <strong className="text-black">Cédula: </strong>
                    </span>
                    <span>{data.identification}</span>
                    <br />
                    <span>
                      <strong className="text-black">Email: </strong>
                    </span>
                    <span>{data.email}</span>
                    <br />
                    <span>
                      <strong className="text-black">Celular: </strong>
                    </span>
                    <span>{data.cellphone}</span>
                  </div>
                ))}
            </div>
          </div>
          {/*FIN INFORMACION DEL PROSPECTO*/}

          {/*FORM*/}
          <Form
            {...layout}
            className="pt-5"
            form={form}
            initialValues={{ remember: true }}
            onFinish={formSuccess}
            onFinishFailed={formFail}
          >
            {/*
            <Form.Item
              label="Asesor"
              name="asesor"
              rules={[{
                required: true,
                message: 'Ingrese Asesor'
              }]}
            >
              <Select>
                <Select.Option value="demo">Todo</Select.Option>
              </Select>
            </Form.Item>
            */}
            <Form.Item
              label="Prioridad"
              name="prioridad"
              rules={[
                {
                  required: true,
                  message: 'Ingrese Prioridad',
                },
              ]}
            >
              <Select disabled={visible} placeholder="Seleccione Prioridad">
                <Option value="Alta">Alta</Option>
                <Option value="Baja">Baja</Option>
              </Select>
            </Form.Item>

            <span className="flex">
              <Form.Item
                style={{ marginLeft: 85 }}
                label="Día: "
                name="fecha"
                rules={[
                  {
                    required: true,
                    message: 'Ingrese Fecha',
                  },
                ]}
              >
                <DatePicker
                  style={{ marginLeft: 7 }}
                  placeholder="Día"
                  disabled={visible}
                  disabledDate={(current: any) => {
                    return (
                      current && current < moment().add(-1, 'day').endOf('day')
                    );
                  }}
                  format="YYYY-MM-DD"
                  onChange={(date, dateString) => {
                    try {
                      setMomentCustomMin(null);
                      setMomentCustom(null);
                      if (
                        date!.format('YYYY/MM/DD') !==
                        moment().format('YYYY/MM/DD')
                      ) {
                        setActiveHours(false);
                      } else {
                        setActiveHours(true);
                      }
                    } catch (e) {
                      //console.log('esperando...');
                    }
                  }}
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }} shouldUpdate>
                {() => {
                  return (
                    <Form.Item style={{ margin: 0 }}>
                      <TimePicker
                        disabled={visible}
                        style={{ margin: 0 }}
                        placeholder="Hora"
                        value={momentCustom}
                        format="HH"
                        showNow={false}
                        disabledHours={() => {
                          if (activeHours) {
                            return range(0, parseInt(moment().format('HH')));
                          }
                          return range(0, 0);
                        }}
                        onChange={(value) => {
                          try {
                            setMomentCustom(value);
                            if (
                              activeHours &&
                              value?.format('HH') === moment().format('HH')
                            ) {
                              setAactiveMin(true);
                            } else {
                              setAactiveMin(false);
                            }
                          } catch (e) {
                            //console.log('esperando...');
                          }
                        }}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              <Form.Item style={{ margin: 0 }} shouldUpdate>
                {() => {
                  return (
                    <Form.Item style={{ margin: 0 }}>
                      <TimePicker
                        disabled={visible}
                        style={{ margin: 0 }}
                        placeholder="Minuto"
                        format="mm"
                        value={momentCustomMin}
                        showNow={false}
                        disabledMinutes={() => {
                          if (activeMin) {
                            return range(
                              0,
                              parseInt(moment().add(1, 'minutes').format('mm'))
                            );
                          }
                          return range(0, 0);
                        }}
                        onChange={(value) => {
                          try {
                            setMomentCustomMin(value);
                          } catch (e) {
                            //console.log('esperando...');
                          }
                        }}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </span>

            <Form.Item
              label="Tipo"
              name="tipo"
              rules={[
                {
                  required: true,
                  message: 'Ingrese Tipo',
                },
              ]}
            >
              <Select disabled={visible} placeholder="Seleccione Tipo">
                <Option value="Llamada">Llamada</Option>
                <Option value="Mail">Mail</Option>
                <Option value="Cita">Cita</Option>
                <Option value="Cita Virtual">Cita Virtual</Option>
                <Option value="Otro">Otro</Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => {
                return prevValues.tipo !== currentValues.tipo;
              }}
            >
              {({ getFieldValue }) => {
                return getFieldValue('tipo') === 'Otro' ? (
                  <Form.Item
                    name="customizeTipo"
                    label="Ingrese Tipo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>

            <Form.Item
              label="Motivo"
              name="motivo"
              rules={[
                {
                  required: true,
                  message: 'Ingrese Motivo',
                },
              ]}
            >
              <Select disabled={visible} placeholder="Seleccione Motivo">
                <Select.Option value="Indagacion">Indagación</Select.Option>
                <Select.Option value="Test Drive">Test Drive</Select.Option>
                <Select.Option value="Demostracion">Demostración</Select.Option>
                <Select.Option value="Cotizacion">Cotización</Select.Option>
                <Select.Option value="Call Center">Call Center</Select.Option>
                <Select.Option value="Otro">Otro</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => {
                return prevValues.motivo !== currentValues.motivo;
              }}
            >
              {({ getFieldValue }) => {
                return getFieldValue('motivo') === 'Otro' ? (
                  <Form.Item
                    name="customizeMotivo"
                    label="Ingrese Motivo"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            {idLead === undefined && (
              <Form.Item
                label="Negocio"
                name="idLead"
                rules={[
                  {
                    required: true,
                    message: 'Seleccione un negocio',
                  },
                ]}
              >
                <Select
                  disabled={visible}
                  placeholder="Seleccione un negocio"
                  //onChange={(val) =>console.log('log tracing', val)}
                >
                  {idsLeads.map((ids) => (
                    <Select.Option key={ids} value={ids}>
                      Negocio {ids}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label="Nota"
              name="nota"
              help={
                nameCallCenter
                  ? `Al comentario se le antepondrá su nombre: ${nameCallCenter}`
                  : undefined
              }
            >
              <Input.TextArea disabled={visible} />
            </Form.Item>

            <Form.Item {...tailLayout} label="">
              <Button disabled={visible} type="primary" htmlType="submit" ghost>
                Crear
              </Button>
            </Form.Item>
          </Form>
          {/*FIN FORM*/}
        </div>
      </div>

      <Loading visible={loading} />
    </>
  );
};

export default FormFollow;
