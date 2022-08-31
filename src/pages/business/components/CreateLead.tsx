import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  Button,
  Modal,
  Table,
  Alert,
  Card,
  Avatar,
  Row,
  Col,
  message,
  Select,
} from 'antd';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import Get from '../../../utils/Get';
import LeadsRepository from '../../../data/repositories/leads-repository';
import { Dependencies } from '../../../dependency-injection';
import ClientsRepository from '../../../data/repositories/clients-repository';
import Client from '../../../data/models/Client';
import User from '../../../data/models/User';
import auth from '../../../utils/auth';
import { LeadInsertInput } from '../../../data/providers/apollo/mutations/clients';
import Loading from '../../../components/Loading';
import DealerPicker from '../../../components/Prospect/DealerPicker';
import UserRepository from '../../../data/repositories/user-repository';
import Leads from '../../../data/models/Leads';
import SelectCampaign from '../../../components/SelectCampaign';

const { Meta } = Card;

const CreateLead: FunctionComponent<{
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  viewModal: boolean;
  actualClient?: Client;
  goLead?: (idLead: number, identification: string) => void;
  listTable?: { list: any[]; setList: (leads: Leads[]) => void };
}> = ({ setViewModal, viewModal, actualClient, goLead, listTable }) => {
  const userRepository = Get.find<UserRepository>(Dependencies.users);
  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const clientRepository = Get.find<ClientsRepository>(Dependencies.clients);
  //const [viewModal, setViewModal] = useState<boolean>(false);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [myClient, setMyClient] = useState<Client | null>(null);
  const [allUser, setAllUser] = useState<User[] | null>(null);
  const [myUser, setMyUser] = useState<User | null>(null);
  const { user } = auth;
  const [loading, setLoading] = useState<boolean>(false);
  // Datos para el metodo inserlead
  const [leadInput, setLeadInput] = useState<LeadInsertInput | null>(null);
  const [concesionariosucursalView, setConcesionariosucursalView] = useState<
    boolean
  >(false);
  const [nameConcessionaire, setNameConcessionaire] = useState<string>();
  const [nameSucursal, setNameSucursal] = useState<string>();
  const [codeConcessionaire, setCodeConcessionaire] = useState<string>();
  const [idSubsidiary, setidSubsidiary] = useState<number>();
  const [campaign, setCampaign] = useState<string | null>(null);
  const [channel, setChannel] = useState<string>('Showroom');

  //FUNCION QUE ME TRAE LOS DATOS
  const getDataDealerPicker = async (dataDP: any, label: any) => {
    try {
      //console.log('dataDP -->', dataDP);
      setLoading(true);
      const employeeDataApi = await userRepository.getEmployeesByBoss();
      console.log('employeeDataApi -->', employeeDataApi);
      setNameConcessionaire(label[0].label);
      setNameSucursal(label[0].children[0].label);
      setCodeConcessionaire(dataDP[0]);
      setidSubsidiary(dataDP[1]);
      if (employeeDataApi) {
        //console.log('employeeDataApi', employeeDataApi);
        const employeeDataApiFilter = employeeDataApi.filter((userApi) => {
          const okSucu = userApi.sucursal?.find(
            (suc) => suc === dataDP[1].toString()
          );
          return !!okSucu;
        });
        console.log('employeeDataApiFilter -->', employeeDataApiFilter);
        if (employeeDataApiFilter.length === 0) {
          message.warning('No se econtraron asesores para esta sucursal');
        }
        setAllUser(employeeDataApiFilter);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (e) {
      message.error('funnelByConsesionaireAndSucursal', e.message);
      setLoading(false);
      return false;
    }
  };

  const insertLead = async (
    leadInsertInput: LeadInsertInput,
    clientIdentificationInput: string,
    campaignInput: string | null,
    channelInput: string
  ) => {
    setLoading(true);
    try {
      const resp = await leadsRepository.insertLead(
        leadInsertInput,
        clientIdentificationInput,
        campaignInput,
        channelInput
      );

      if (resp) {
        //console.log('resp create Leads', resp.id);
        setLoading(false);
        message.success('Negocio creado con éxito');
        if (listTable) {
          //console.log('resp id', resp.id, { myUser });
          //console.log('before list', listTable.list);
          const d = new Date();
          const date = d.getTime().toString();
          const newItem = {
            key: `${resp.id}`,
            names: `${myClient?.name} ${myClient?.lastName}`,
            identification: myClient?.identification ?? 'No indentificación',
            brand: [],
            user: `${myUser ? myUser.nombre : user.nombre} ${
              myUser ? myUser.apellido : user.apellido
            }`,
            sucursal: leadInsertInput.sucursal?.name,
            concesionario: leadInsertInput.concesionario?.name,
            canal: channelInput,
            state: 'Indagación',
            quotes: null,
            amount: 0,
            date,
            campaign,
            nextFollow: null,
          };
          //console.log('newItem', newItem);
          listTable.setList(
            [...listTable.list, newItem].sort((a, b) => {
              if (parseInt(a.key) < parseInt(b.key)) {
                return 1;
              }
              if (parseInt(a.key) > parseInt(b.key)) {
                return -1;
              }
              return 0;
            })
          );
        }
        if (goLead) {
          goLead(resp.id!, clientIdentificationInput);
        }

        return;
      }
      setLoading(false);
      message.error('Error al crear el Negocio');
      return;
    } catch (e) {
      setLoading(false);
      //console.log('Error crear lead', e.message);
      message.error('Error al crear el Negocio');
    }
  };

  const componentdidmout = async () => {
    if (actualClient) {
      setAllClients([actualClient]);
      setMyClient(actualClient);
    } else {
      const clients = await clientRepository.getAllClients();
      if (clients) {
        setAllClients(clients);
      }
    }

    if (user!.role === 'ASESOR COMERCIAL') {
      // EL LEAD SE CREA AL ASESOR COMERCIAL
      let namec: string = '';
      let codec: string = '';
      let names: string = '';
      let codes: number = -1;
      let citys: string = '';
      // eslint-disable-next-line no-unused-expressions
      user.dealer?.map((dm: any) => {
        namec = dm.descripcion;
        codec = dm.codigo;
        // eslint-disable-next-line array-callback-return
        dm.sucursal.map((dms: any) => {
          names = dms.sucursal;
          codes = dms.id_sucursal;
          citys = dms.ciudad;
        });
      });
      /* const leadInsert: LeadInsertInput = {
        idAgency: codec,
        city: citys,
        codeUser: user.codUsuario,
        roleUser: user.role,
        concesionario: {
          name: namec!,
          code: codec!,
        },
        sucursal: {
          name: names!,
          code: codes!,
        },
      };
      setLeadInput(leadInsert); */
      setMyUser({ codUsuario: user.codUsuario, role: user.role });

      /// set concessionario
      setCodeConcessionaire(codec!);
      setNameConcessionaire(namec!);

      /// set sucursal
      setidSubsidiary(codes);
      setNameSucursal(names);
    } else {
      // TRAE A LOS EMPLEADOS A CARGO
      setConcesionariosucursalView(true);
      // EL LEAD SE CREA AL USUARIO SELECCIONADO
      /* if (myUser) {
        const leadInsert: LeadInsertInput = {
          idAgency: codeConcessionaire!,
          city: '',
          codeUser: myUser.codUsuario!,
          roleUser: myUser.role!,
          concesionario: {
            name: nameConcessionaire!,
            code: codeConcessionaire!,
          },
          sucursal: {
            name: nameSucursal!,
            code: idSubsidiary!.toString(),
          },
        };
        setLeadInput(leadInsert);
      } */
    }
  };

  useEffect(() => {
    componentdidmout();
  }, []);

  const disabledButton = (usuario: User | null, cliente: Client | null) => {
    if (
      nameConcessionaire &&
      codeConcessionaire &&
      nameSucursal &&
      typeof idSubsidiary === 'number' &&
      usuario &&
      cliente
    ) {
      return false;
    }
    return true;
  };

  const addLead = (usuario: User | null, cliente: Client | null) => {
    //console.log('log_1', {
    //   usuario,
    //   cliente,
    //   nameConcessionaire,
    //   codeConcessionaire,
    //   nameSucursal,
    //   idSubsidiary,
    //   user,
    // });
    if (!disabledButton(usuario, cliente)) {
      const city = user?.dealer
        ?.find((dl: any) => {
          return (
            dl.codigo && codeConcessionaire && dl.codigo === codeConcessionaire
          );
        })
        ?.sucursal?.find(
          (sucu: any) => idSubsidiary && idSubsidiary === sucu?.id_sucursal
        )?.ciudad;
      //console.log('city addLead', city);
      const leadInsert: LeadInsertInput = {
        idAgency: codeConcessionaire!,
        city: city ?? '',
        codeUser: usuario!.codUsuario!,
        roleUser: usuario!.role!,
        concesionario: {
          name: nameConcessionaire!,
          code: codeConcessionaire!,
        },
        sucursal: {
          name: nameSucursal!,
          code: idSubsidiary!.toString(),
        },
      };
      setLeadInput(leadInsert);
    }
  };

  useEffect(() => {
    addLead(myUser, myClient);
  }, [myUser, myClient]);

  return (
    <div>
      {/* <Button
        size="large"
        type="primary"
        onClick={() => {
          setViewModal(true);
        }}
      >
        + Crear
      </Button> */}
      <Modal
        title="Crear negocio"
        visible={viewModal!}
        onOk={() => {
          setViewModal(false);
        }}
        onCancel={() => {
          setViewModal(false);
        }}
        footer={false}
        width={800}
      >
        <div>
          {concesionariosucursalView && (
            <div>
              <div style={{ marginBottom: 10 }}>
                <Alert
                  message="Seleccione Concesionario/Sucursal para asignar un asesor al negocio"
                  type="info"
                />
              </div>
              <div
                style={{
                  textAlign: 'right',
                  marginBottom: 10,
                }}
              >
                <DealerPicker
                  widthInput={400}
                  placeholderInput="Concesionario / Sucursal"
                  getDataDealerPicker={getDataDealerPicker}
                />
              </div>
              {myUser && (
                <Card
                  hoverable
                  style={{ width: 240, marginBottom: 10 }}
                  cover={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        style={{ marginTop: 5 }}
                      />
                    </div>
                  }
                >
                  <Meta
                    title="Usuario"
                    description={`${myUser.nombre} ${myUser.apellido}`}
                  />
                </Card>
              )}

              {allUser && (
                <TableUsers allUser={allUser!} setMyUser={setMyUser} />
              )}
            </div>
          )}
          {!myClient && (
            <div style={{ marginBottom: 10 }}>
              <Alert
                message="Seleccione al cliente al cual asignará un negocio"
                type="info"
              />
            </div>
          )}

          <div>
            <Row gutter={[16, 16]}>
              {!concesionariosucursalView ? (
                <Col span={12} className="text-right">
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          size={64}
                          icon={<UserOutlined />}
                          style={{ marginTop: 5 }}
                        />
                      </div>
                    }
                  >
                    <Meta
                      title="Usuario"
                      description={`${user.nombre} ${user.apellido}`}
                    />
                  </Card>
                </Col>
              ) : null}

              <Col span={12}>
                {myClient && (
                  <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          size={64}
                          icon={<UserOutlined />}
                          style={{ marginTop: 5 }}
                        />
                      </div>
                    }
                  >
                    <Meta
                      title="Cliente"
                      description={`${myClient.name} ${myClient.lastName}`}
                    />
                  </Card>
                )}
              </Col>
            </Row>
          </div>
          {allClients && !actualClient && (
            <div>
              <TableClients allClients={allClients} setMyClient={setMyClient} />
            </div>
          )}
          {/* <Button onClick={() => //console.log({ myClient, myUser, leadInput })}>
            Prueba
          </Button> */}
          {leadInput?.sucursal?.code && (
            <>
              <SelectCampaign
                idSucursal={parseInt(leadInput.sucursal.code)}
                setCampaign={setCampaign}
              />
              <div
                style={{
                  margin: '5px 0px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <b style={{ marginRight: 5, minWidth: 260 }}>
                  Seleccione un canal para el negocio
                </b>
                <Select
                  placeholder="Selecciona un canal"
                  value={channel}
                  onChange={(value) => setChannel(value)}
                  style={{ marginTop: 5, width: 140 }}
                >
                  <Select.Option value="Showroom">Showroom</Select.Option>
                  <Select.Option value="Referidos">Referidos</Select.Option>
                  <Select.Option value="Gestión externa">
                    Gestión externa
                  </Select.Option>
                  <Select.Option value="Recompra">Recompra</Select.Option>
                </Select>
              </div>
            </>
          )}

          <Button
            //disabled={!myClient || !myUser || !leadInput}
            disabled={disabledButton(myUser, myClient) || !leadInput}
            onClick={async () => {
              await insertLead(leadInput!, myClient?.identification!, campaign, channel);
              //console.log('creando...', leadInput);
            }}
          >
            Crear negocio
          </Button>
        </div>
      </Modal>
      <Loading visible={loading} />
    </div>
  );
};

const TableUsers: FunctionComponent<{
  allUser: User[];
  setMyUser: React.Dispatch<React.SetStateAction<User | null>>;
}> = ({ allUser, setMyUser }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function loadingData(allUserInput: User[]) {
    const dataUser = allUserInput.map((usermap, index) => ({
      name: `${usermap.nombre} ${usermap.apellido}`,
      codUsuario: usermap.codUsuario!,
      id: usermap.id!,
      key: index,
    }));
    setData(dataUser);
  }
  useEffect(() => {
    loadingData(allUser);
  }, [allUser]);

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      //console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows
      // );
      if (selectedRows && selectedRows.length === 1) {
        const user = allUser.find(
          (userfind) => userfind.codUsuario === selectedRows[0].codUsuario
        );
        //console.log('User seleccionado', user);
        if (user) {
          setMyUser(user);
        }
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  function searchDataFilter(valueInput: string) {
    setLoading(true);
    const searchData = allUser.filter((dataFilter) => {
      return (
        dataFilter.apellido?.toLowerCase().includes(valueInput.toLowerCase()) ||
        dataFilter.nombre?.toLowerCase().includes(valueInput.toLowerCase())
      );
    });
    if (searchData && searchData.length > 0) {
      loadingData(searchData);
    } else {
      message.warning('No se encontró resultados');
      loadingData(allUser);
    }
    setLoading(false);
  }

  return (
    <>
      <Search
        name="ci"
        placeholder="Buscar por nombre o apellido"
        enterButton
        style={{ width: 250, marginBottom: 10 }}
        onSearch={(valueSearch: string) => {
          searchDataFilter(valueSearch);
        }}
      />
      <Table
        pagination={{ position: ['bottomRight'], defaultPageSize: 5 }}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        columns={[
          {
            title: 'Nombre',
            dataIndex: 'name',
          },
          {
            title: 'Código',
            dataIndex: 'codUsuario',
          },
          {
            title: 'Id',
            dataIndex: 'id',
          },
        ]}
        dataSource={data}
      />
      <Loading visible={loading} />
    </>
  );
};

const TableClients: FunctionComponent<{
  allClients: Client[];
  setMyClient: React.Dispatch<React.SetStateAction<Client | null>>;
}> = ({ allClients, setMyClient }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function loadingData(allClientsInput: Client[]) {
    const dataClients = allClientsInput.map((cli, index) => ({
      name: `${cli.name} ${cli.lastName}`,
      type: cli.typeIdentification!,
      identification: cli.identification!,
      key: index,
    }));
    setData(dataClients);
  }

  useEffect(() => {
    loadingData(allClients);
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      //console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows
      // );
      if (selectedRows && selectedRows.length === 1) {
        const client = allClients.find(
          (cli) => cli.identification === selectedRows[0].identification
        );
        //console.log('Cliente seleccionado', client);
        if (client) {
          setMyClient(client);
        }
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  function searchDataFilter(valueInput: string) {
    setLoading(true);
    const searchData = allClients.filter((dataFilter) => {
      //console.log(
      //   'Cliente',
      //   dataFilter.identification,
      //   '-',
      //   dataFilter.name,
      //   '-',
      //   dataFilter.lastName
      // );
      return (
        dataFilter.identification
          ?.toLowerCase()
          .includes(valueInput.toLowerCase()) ||
        dataFilter.name?.toLowerCase().includes(valueInput.toLowerCase()) ||
        dataFilter.lastName?.toLowerCase().includes(valueInput.toLowerCase())
      );
    });
    if (searchData && searchData.length > 0) {
      loadingData(searchData);
    } else {
      message.warning('No se encontró resultados');
      loadingData(allClients);
    }
    setLoading(false);
  }

  return (
    <>
      <Search
        name="ci"
        allowClear
        placeholder="Buscar por identificación, nombre o apellido"
        enterButton
        style={{ width: 250, marginBottom: 10 }}
        onSearch={(valueSearch: string) => {
          searchDataFilter(valueSearch);
        }}
      />
      <Table
        pagination={{ position: ['bottomRight'], defaultPageSize: 5 }}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        columns={[
          {
            title: 'Nombre',
            dataIndex: 'name',
          },
          {
            title: 'Tipo de identificación',
            dataIndex: 'type',
          },
          {
            title: 'Identificación',
            dataIndex: 'identification',
          },
        ]}
        dataSource={data}
      />
      <Loading visible={loading} />
    </>
  );
};

export default CreateLead;
