/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/no-unknown-property */
/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/state-in-constructor */
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Menu,
  Layout,
  Divider,
  Switch,
  Popover,
  Modal,
  message,
  Row,
  Col,
} from 'antd';
import { Subscription } from 'rxjs';
import { useHistory } from 'react-router-dom';

import usersSettings from '../utils/json/json-users';
import graphqlRoute from '../data/providers/api/api-graphql';

// import Notification from './Notification';
import AvoidReRender from './AvoidReRender';
import User, { ConsesionarioInterface } from '../data/models/User';
import INotification from '../data/models/Notification';
import SocketClient from '../utils/socket-client';
import auth from '../utils/auth';
import Notifications from './Notifications';
import Get from '../utils/Get';
import NotificationsRepository from '../data/repositories/notifications-repository';
import { Dependencies } from '../dependency-injection';
import { ConcesionarioSucursal } from '../data/models/Leads';
import UserRepository from '../data/repositories/user-repository';
import LoadingDashboard from './LoadingDashboard';
import VchatContext from '../pages/Vchat/components/VchatContext';
import { decrypt } from '../utils/crypto';
import CRMRepository from '../data/repositories/CRM-repository';

const { Content, Footer, Sider, Header } = Layout;

interface SettingButton {
  name: string;
  pathImage: string;
  route: string;
}

class Template extends React.Component<{
  page: string;
  history: any;
  vchatActived?: boolean;
}> {
  usersRepository = Get.find<UserRepository>(Dependencies.users);
  CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  state = {
    init: false,
    contract: true,
    notifications: [] as INotification[],
    availableUser: true,
    loadingAvailableUser: false,
    roomVchat: null as string | null,
  };

  notificationsSubscription: Subscription | null = null;
  connectionSubscription: Subscription | null = null;
  onCallUser: Subscription | null = null;
  timeOutCallUser: NodeJS.Timeout | null = null;

  componentDidMount() {
    const { user } = auth;
    //console.log('log user', user);
    if (!user) {
      localStorage.clear();
      window.location.href = '/';
      return;
    }
    this.setState({ init: true });

    SocketClient.instance.connect(); // nos conectamos al ws
    this.notificationsSubscription =
      SocketClient.instance.onNotificationStream.subscribe((data) => {
        const tmp = this.state.notifications;
        this.setState({ notifications: [data, ...tmp] });
      });
    this.connectionSubscription =
      SocketClient.instance.onConnectionStream.subscribe(async (data) => {
        //console.log('data connectionSubscription', data);
        await this.changeAvailable(data);
      });
    this.onCallUser = SocketClient.instance.onCallUser.subscribe(
      async (data) => {
        const { history, vchatActived } = this.props;
        //console.log('data onCallUser', data);
        if (vchatActived) return;

        const dataLink = decrypt(data.content.linkVchat, true);
        //console.log('dataLink', dataLink);
        this.setState({ roomVchat: dataLink.code });

        /* var audio = new Audio('audio_file.mp3');
        audio.play(); */

        const secondsModal = 30;
        Modal.confirm({
          title: 'Llamada entrante',
          icon: <PhoneOutlined />,
          content: (
            <>
              <audio autoPlay hidden loop src="/sounds/ringtone.mp3" />
              <div>{data.description}</div>
            </>
          ),
          okText: 'Contestar',
          cancelText: 'Rechazar',
          onOk() {
            const idLead = data.content.tracing.leads.id;
            const { identification } = data.content.tracing.client;
            history.push(
              `/lead/id-lead=${idLead}/identification=${identification}`,
              {
                step: 0,
                id: identification,
                idLead,
                vchat: data.content.linkVchat,
              }
            );
            history.go(0);
          },
          onCancel: this.rejectCall,
        });

        this.timeOutCallUser = setTimeout(() => {
          Modal.destroyAll();
        }, secondsModal * 1000);
      }
    );
    this.loadNotifications();
  }

  componentWillUnmount() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    if (this.onCallUser) {
      this.onCallUser.unsubscribe();
    }
    if (this.timeOutCallUser) {
      clearTimeout(this.timeOutCallUser);
    }
  }

  loadNotifications = async () => {
    const notifications = await SocketClient.instance.getNotifications();
    this.setState({
      notifications,
    });
  };

  onNotificationViewed = async (index: number) => {
    const tmp = this.state.notifications;
    tmp[index].viewed = true;
    await Get.find<NotificationsRepository>(
      Dependencies.notifications
    ).setNotificationAsWiewed(tmp[index].id);
    SocketClient.instance.notifications = tmp;
    this.setState({ notifications: [...tmp] });
  };

  menuItems = (): SettingButton[] => {
    const userStorage = usersSettings.find(
      (element) => element.type === auth.user!.role
    );
    if (userStorage) {
      const { settings }: { settings: SettingButton[] } = userStorage;
      return settings;
    }
    return [];
  };

  changeAvailable = async (available: boolean) => {
    //console.log('log available', available);
    this.setState({ loadingAvailableUser: true });
    const respAvailableUser = await this.usersRepository.changeAvailable(
      available
    );
    if (respAvailableUser) {
      this.setState({ availableUser: available });
    }
    this.setState({ loadingAvailableUser: false });
  };

  rejectCall = async () => {
    const { user } = auth;
    const { roomVchat } = this.state;
    if (roomVchat) {
      const respReject = await this.CRMRepository.rejectCallVchat({
        room: roomVchat,
      });
      if (respReject) {
        //console.log('OK reject');
        this.setState({ roomVchat: null });
      }
    }
  };

  render() {
    //console.log('MENU');
    const {
      init,
      contract,
      notifications,
      availableUser,
      loadingAvailableUser,
    } = this.state;
    if (!init) {
      return <div />;
    }

    const { user } = auth;
    const { children, page, history, vchatActived } = this.props;

    return (
      <Layout style={{ height: '100vh' }}>
        <Sider
          style={{
            position: 'relative',
          }}
          theme="dark"
          collapsed={contract}
        >
          <div style={{ textAlign: 'center' }}>
            <img
              className="w-full"
              src={contract ? '/img/logo-iso.png' : '/img/logo.png'}
              alt="Corporación CRM"
              style={{ maxWidth: contract ? 60 : 170 }}
            />
          </div>
          <div style={{ height: 10 }} />
          <Menu theme="dark">
            {this.menuItems().map((item) => (
              <Menu.Item
                key={item.name}
                disabled={!!vchatActived}
                className={
                  item.name === page ? 'active menu-item' : 'menu-item'
                }
                icon={
                  <img
                    style={{
                      display: 'inline-block',
                      padding: 6,
                      paddingTop: 2,
                    }}
                    width={32}
                    height={32}
                    src={item.pathImage}
                    alt=""
                  />
                }
                onClick={() => {
                  history.push(item.route);
                }}
              >
                <span className={`normal ${contract ? '' : ''}`}>
                  {item.name}
                </span>
              </Menu.Item>
            ))}
          </Menu>

          {!contract && (
            <Footer
              className="py-1 px-0 text-center"
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
            >
              <small>Powered by ITZAM</small>
            </Footer>
          )}
        </Sider>
        <Layout>
          <Header
            className="flex justify-between pr-5"
            style={{ background: '#fff', padding: 0 }}
          >
            <div className="flex">
              <button
                id="collapse-menu-btn"
                onClick={() => this.setState({ contract: !contract })}
                disabled={!!vchatActived}
              >
                {contract ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
              {/* ESTADO USER */}
              <div className="px-5">
                <Switch
                  size="default"
                  checked={availableUser}
                  onChange={this.changeAvailable}
                  checkedChildren="Disponible"
                  unCheckedChildren="Ocupado"
                  disabled={!!vchatActived}
                  loading={loadingAvailableUser}
                />
              </div>
              {/* FIN ESTADO USER */}
            </div>

            <div className="flex items-center">
              <Notifications
                onViewed={this.onNotificationViewed}
                items={vchatActived ? [] : notifications}
              />

              <Divider type="vertical" className="px-3" />

              <UserButton user={user!} />
            </div>
          </Header>
          <Content
            style={{
              margin: '15px',
              padding: 15,
              minHeight: 280,
              backgroundColor: '#fff',
              overflowY: 'auto',
              position: 'relative',
              width: vchatActived ? `calc(100% - ${200}px)` : undefined,
              marginLeft: vchatActived ? 'auto' : undefined,
            }}
          >
            <AvoidReRender>{children}</AvoidReRender>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const UserButton: FunctionComponent<{ user: User }> = ({ user }) => {
  const { vchatActivated } = useContext(VchatContext);

  const userRepository = Get.find<UserRepository>(Dependencies.users);

  const [visible, setVisible] = useState<boolean>(false);
  const [brandName, setBrandName] = useState<string[] | null>();
  const [concesionarioName, setConcesionarioName] = useState<
    ConsesionarioInterface[] | null | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [employee, setEmployee] = useState<User[] | null>([]);

  // Empleados a cargo
  const employeeData = async () => {
    try {
      setLoading(true);
      if (user.role === 'JEFE DE VENTAS') {
        const employeeDataApi = await userRepository.getEmployeesByBoss();
        if (employeeDataApi) {
          setEmployee(employeeDataApi);
          setLoading(false);
          return true;
        }
      } else if (user.role === 'ASESOR COMERCIAL') {
        const bosses = await userRepository.getBossesFromUser();
        if (bosses) {
          setEmployee(bosses);
          setLoading(false);
          return true;
        }
      }
      setLoading(false);
      return false;
    } catch (e) {
      message.error('employeeData', e.message);
      setLoading(false);
      return false;
    }
  };
  useEffect(() => {
    const componentdidmount = async () => {
      // @ts-ignore
      setBrandName(user.brand);
      // @ts-ignore
      setConcesionarioName(user.dealer);
      // Si es jefe de ventas o asesor comercial traer su equivalente
      if (user.role === 'ASESOR COMERCIAL' || user.role === 'JEFE DE VENTAS') {
        await employeeData();
      }
    };
    componentdidmount();
  }, []);

  return (
    <>
      <Popover
        className="cursor-pointer"
        placement="bottom"
        content={
          <div style={{ maxWidth: 150 }}>
            <Menu style={{ border: 'none' }}>
              <Menu.Item
                className="text-right"
                onClick={() => {
                  setVisible(true);
                }}
                disabled={!!vchatActivated}
              >
                Mi Perfil
              </Menu.Item>
              <Modal
                visible={visible}
                onOk={() => {
                  setVisible(false);
                }}
                onCancel={() => {
                  setVisible(false);
                }}
                footer={null}
              >
                <h2 className="text-2xl text-black m-0 p-0">Mi Perfil</h2>
                <Divider />
                <div style={{ textAlign: 'center' }}>
                  <Avatar
                    style={{ backgroundColor: '#0099CC', marginBottom: 10 }}
                    icon={<UserOutlined />}
                    size={64}
                  />
                </div>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">Nombre: </p>
                  </Col>
                  <Col span={12}>
                    <p className="m-0 ml-2">{user.nombre}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">Apellido: </p>
                  </Col>
                  <Col span={12}>
                    <p className="m-0 ml-2">{user.apellido}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">Rol: </p>
                  </Col>
                  <Col span={12}>
                    <p className="m-0 ml-2">{user.role}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">Código: </p>
                  </Col>
                  <Col span={12}>
                    <p className="m-0 ml-2">{user.codUsuario}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">Marca(s): </p>
                  </Col>
                  <Col span={12}>
                    {brandName
                      ? brandName.map((dmb, index) => (
                          <p className="m-0 ml-2" key={index}>
                            {' '}
                            {dmb} <br />{' '}
                          </p>
                        ))
                      : null}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">
                      Concesionario(s):{' '}
                    </p>
                  </Col>
                  <Col span={12}>
                    {concesionarioName
                      ? concesionarioName.map((dmb, index) => (
                          <p className="m-0 ml-2" key={index}>
                            {' '}
                            {dmb.descripcion} <br />{' '}
                          </p>
                        ))
                      : null}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p className="text-black text-x text-right">
                      Sucursal(s):{' '}
                    </p>
                  </Col>
                  <Col span={12}>
                    {concesionarioName
                      ? concesionarioName.map((dmb, index) => (
                          <p className="m-0 ml-2" key={index}>
                            {' '}
                            {dmb.sucursal.map((su) => su.sucursal)} <br />{' '}
                          </p>
                        ))
                      : null}
                  </Col>
                </Row>
                {user.role === 'JEFE DE VENTAS' ||
                user.role === 'ASESOR COMERCIAL' ? (
                  <Row>
                    <Col span={12}>
                      {user.role === 'JEFE DE VENTAS' ? (
                        <p className="text-black text-x text-right">
                          Asesor Comercial(s):{' '}
                        </p>
                      ) : user.role === 'ASESOR COMERCIAL' ? (
                        <p className="text-black text-x text-right">
                          Jefe de ventas(s):{' '}
                        </p>
                      ) : null}
                    </Col>
                    <Col span={12}>
                      {employee
                        ? employee.map((dmb, index) => (
                            <p className="m-0 ml-2" key={index}>
                              {' '}
                              {dmb.nombre} {dmb.apellido} <br />{' '}
                            </p>
                          ))
                        : null}
                    </Col>
                  </Row>
                ) : null}
              </Modal>
              {/*
              <Menu.Item
                className="text-right"
                onClick={async () => {
                //setLoading(true);
                auth.signOut();
                const resp = await graphqlRoute('cerrar');
                if (resp.data) {
                  //setLoading(false);
                  //localStorage.clear();
                  //historyRouter.push('/');
                }
                //setLoading(false);
              }}
              >
                Cerrar Sesión
              </Menu.Item>
              */}
            </Menu>
          </div>
        }
      >
        <div className="flex items-center" style={{ lineHeight: 1 }}>
          <Avatar
            style={{ backgroundColor: '#0099cc' }}
            size="large"
          >{`${user.nombre?.charAt(0).toUpperCase()}${user.apellido
            ?.charAt(0)
            .toUpperCase()}`}</Avatar>
          <div className="ml-2">
            <div
              className="normal select-none"
              style={{ textTransform: 'capitalize' }}
            >
              {`${user.nombre} ${user.apellido}`.toLowerCase()}
            </div>
            <small style={{ fontSize: 11, textTransform: 'capitalize' }}>
              {user.role?.toLowerCase()}
            </small>
            <br />
            {concesionarioName
              ? concesionarioName.map((dmb, index) => (
                  <small
                    style={{ fontSize: 11, textTransform: 'capitalize' }}
                    key={index}
                  >
                    {' '}
                    {dmb.descripcion.toLowerCase()}{' '}
                  </small>
                ))
              : null}
            {/*{concesionarioName ?
              concesionarioName.map((dmb, index) => (
                <small
                  style={{ fontSize: 11, textTransform: 'capitalize' }}
                  key={index}
                > {dmb.sucursal.map((su) => su.sucursal.toLowerCase())} </small>
              )) : null}
             */}
          </div>
        </div>
      </Popover>
      <LoadingDashboard visible={loading} />
    </>
  );
};

export default (props: { children: React.ReactNode; page: string }) => {
  const { vchatActivated } = useContext(VchatContext);
  return (
    <Template
      page={props.page}
      history={useHistory()}
      vchatActived={vchatActivated}
    >
      {props.children}
    </Template>
  );
};
