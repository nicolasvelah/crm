import React, { FunctionComponent, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Row,
  message,
  Modal,
  Table,
  Popover,
  Tag,
  Tabs,
  DatePicker,
} from 'antd';
import './css/messages.css';
import { useParams } from 'react-router-dom';
import Menu from '../../components/Template';
import User from '../../data/models/User';
import Get from '../../utils/Get';
import UserRepository from '../../data/repositories/user-repository';
import { Dependencies } from '../../dependency-injection';
import MessagesRepository from '../../data/repositories/messages-repository';
import { Messages } from '../../data/models/Messages';
import auth from '../../utils/auth';
import milisecondsToDate from '../../utils/milisecondsToDate';
import Loading from '../../components/Loading';
import { NOTIFICATION_TYPES } from '../../utils/types-notification';
import SocketClient from '../../utils/socket-client';
import INotification from '../../data/models/Notification';
import moment from 'moment';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface RangeDates {
  startDate: string;
  endDate: string;
}

const dateFormat = 'YYYY/MM/DD';

const MessageToEmployees: FunctionComponent = () => {
  return (
    <Menu page="Messages">
      <MessageEmployees />
    </Menu>
  );
};

const MessageEmployees: FunctionComponent = () => {
  const { id } = useParams();

  const [userLog, setUserLog] = useState<User | null>(null);
  const [myUsers, setMyUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [usersSend, setUsersSend] = useState<any[]>([]);
  const [messagesSend, setMessagesSend] = useState<Messages[]>([]);

  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [messageOk, setMessageOk] = useState<boolean>(false);
  const [messageAll, setMessageAll] = useState<boolean>(false);
  const [changeTabs, setChangeTabs] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [affair, setAffair] = useState<string>('');
  const [messageS, setMessageS] = useState<string>('');

  const [checkAll, setCheckAll] = useState<boolean>(false);

  // Rango de fechas a buscar
  const [rangeDate, setRangeDate] = useState<RangeDates>({
    startDate: moment(moment().startOf('month')).format(dateFormat),
    endDate: moment(moment()).format(dateFormat),
  });

  /* ----REPOSITORY---- */
  const userRepository = Get.find<UserRepository>(Dependencies.users);
  const messagesRepository = Get.find<MessagesRepository>(
    Dependencies.messages
  );

  async function getDataGraph(startDateGQ?: string, endDateGQ?: string) {
    setLoadingUsers(true);
    const getMessagesSend = await messagesRepository.getMessagesForUser(
      startDateGQ ?? rangeDate.startDate,
      endDateGQ ?? rangeDate.endDate
    );
    if (getMessagesSend) {
      setMessagesSend(getMessagesSend);
    }
    setLoadingUsers(false);
  }

  const onNotificationListener = async (noti: INotification) => {
    // noti es una notificacion desde el ws
    if (
      noti.type === NOTIFICATION_TYPES.BOSS_MESSAGE &&
      noti.content &&
      noti.content.message
    ) {
      const dateMiliseconds = new Date(noti.content.message.createdAt);

      setMessagesSend((prevState) => {
        return [
          { ...noti.content.message, createdAt: dateMiliseconds.getTime() },
          ...prevState,
        ];
      });
    }
  };

  const componentdidmount = async () => {
    const { user } = auth;
    setUserLog(user);
    setLoadingUsers(true);
    if (id) {
      await messagesRepository.updateMessages(parseInt(id), user.id);
    }
    //Usuarios disponibles
    const employeeData = await userRepository.getUsersForMessages();
    if (employeeData) {
      const usersId = employeeData.map((e: User) => {
        return e.id;
      });
      setUsersSend(usersId);
      setMyUsers(employeeData);
    }
    await getDataGraph();
    setLoadingUsers(false);
  };

  useEffect(() => {
    componentdidmount();
    SocketClient.instance.onNotificationStream.subscribe(
      onNotificationListener
    );
  }, []);

  // eslint-disable-next-line no-shadow
  const sendMessage = async (
    users: number[],
    messag: string,
    affai: string
  ) => {
    const send = await messagesRepository.notifyToEmployee(
      users,
      messag,
      affai
    );
    if (send) {
      setMessageOk(false);
      setMessageAll(false);
      message.success('Mensaje enviado');
      await getDataGraph();
    } else {
      setMessageOk(false);
      setMessageAll(false);
      message.error('El mensaje no se pudo enviar');
    }
  };

  const onChange = (e: any) => {
    const checkUsers: number[] = [];
    const pos = selectedUsers.findIndex(
      (item: number) => item === e.target.value.id
    );
    if (pos === -1 && e.target.checked === true) {
      checkUsers.push(e.target.value.id);
    }
    if (pos !== -1 && e.target.checked === false) {
      checkUsers.splice(pos, 1);
    }
    setSelectedUsers(checkUsers);
  };

  const tagStatus = (value: string) => {
    let color = 'green';
    if (value === 'Enviado') {
      color = 'green';
    } else if (value === 'Recibido') {
      color = 'geekblue';
    }
    return (
      <div>
        <Tag color={color}>{value}</Tag>
      </div>
    );
  };

  const changeTab = (key: any) => {
    if (key === '1') {
      setChangeTabs(false);
    }
    if (key === '2') {
      setChangeTabs(true);
    }
  };

  const columns = [
    {
      title: 'Asunto',
      dataIndex: 'affair',
      key: 'affair',
    },
    {
      title: 'Mensaje',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: changeTabs === false ? 'Para' : 'De parte de:',
      dataIndex: 'receiver',
      key: 'receiver',
      render: (text: any, row: any) => {
        if (row.sender.idSender === userLog?.id) {
          if (text.length > 1) {
            const content = (
              <div>
                {text.map((el: any, i: number) => (
                  <span key={i}>
                    {el.nameReceiver}
                    <br />
                  </span>
                ))}
              </div>
            );
            return (
              <Popover content={content} title="Enviado a:" trigger="click">
                <Button type="primary" size="middle">
                  Ver destinatarios
                </Button>
              </Popover>
            );
          }
          return text.map((el: any, i: number) => (
            <span key={i}>
              {el.nameReceiver}
              <br />
            </span>
          ));
        }
        return <span>{row.sender.nameSender}</span>;
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any, row: any) => {
        return (
          <span>{milisecondsToDate(text.toString(), 'D MMM, h:mm a')}</span>
        );
      },
    },
  ];

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const userIds = myUsers.map((el) => el.id!);
    setSelectedUsers(e.target.checked ? userIds : []);
    setCheckAll(e.target.checked);
  };

  return (
    <div>
      <div className="flex justify-between items-end mt-2">
        <h2 className="text-2xl c-black m-0 p-0 flex">Mensajería</h2>
        <Modal
          visible={viewModal}
          title="Nuevo mensaje"
          onCancel={() => {
            setViewModal(false);
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setViewModal(false);
              }}
            >
              Cancelar
            </Button>,
            <Button
              loading={messageOk}
              key="one"
              onClick={() => {
                setMessageOk(true);
                if (selectedUsers) {
                  sendMessage(selectedUsers, messageS, affair);
                }
              }}
              disabled={
                (messageS.length && affair.length && selectedUsers.length) === 0
              }
              type="primary"
            >
              Enviar mensaje
            </Button>,
          ]}
        >
          <h3>Selecciona a quien/es deseas enviar un mensaje</h3>
          <p style={{ marginTop: 20 }}>Asesores disponibles</p>
          <div style={{ display: 'flex' }}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 0, width: 300 }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ borderRadius: 0 }}
            />
          </div>
          <div style={{ paddingTop: 10 }}>
            <Checkbox onChange={onCheckAllChange} checked={checkAll}>
              Seleccionar todos
            </Checkbox>
          </div>

          <div
            style={{ marginTop: 10, overflowY: 'auto', overflowX: 'hidden' }}
          >
            <Row gutter={10}>
              {myUsers
                .filter((e) => {
                  if (
                    e.nombre
                      ?.toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return true;
                  }
                  if (
                    e.apellido
                      ?.toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return true;
                  }
                  const avatarChars: string = `${e.nombre
                    ?.charAt(0)
                    .toUpperCase()}${e.apellido?.charAt(0).toUpperCase()}`;
                  if (avatarChars.includes(search.toUpperCase())) {
                    return true;
                  }

                  return false;
                })
                .map((advisor) => {
                  const isChecked = selectedUsers.find(
                    (el) => el === advisor.id
                  );
                  return (
                    <Col style={{ marginTop: 10 }} key={`${advisor.id}`}>
                      <Card style={{ padding: 0 }}>
                        <div className="flex items-center">
                          <Checkbox
                            onChange={onChange}
                            value={advisor}
                            checked={!!isChecked || isChecked === 0}
                          />
                          <Avatar
                            className="ml-2"
                            style={{ backgroundColor: '#87d068' }}
                            size={40}
                          >
                            {advisor.nombre?.charAt(0).toUpperCase()}
                            {advisor.apellido?.charAt(0).toUpperCase()}
                          </Avatar>
                          <div className="ml-2">
                            <h4
                              className="m-0 p-0 font-bold"
                              style={{ lineHeight: 1 }}
                            >
                              {advisor.nombre} {advisor.apellido}
                            </h4>
                            <br />
                            <span>{advisor.role}</span>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </div>
          <Divider />
          <h3>
            Asunto{' '}
            <span style={{ color: '#7D7D7D' }}>(Max. 35 caracteres)</span>
          </h3>
          <Input
            placeholder="Asunto..."
            maxLength={35}
            value={affair}
            onChange={(e) => setAffair(e.target.value)}
          />
          <h3 style={{ marginTop: 10 }}>
            Mensaje{' '}
            <span style={{ color: '#7D7D7D' }}>(Max. 170 caracteres)</span>
          </h3>
          <TextArea
            rows={4}
            maxLength={170}
            value={messageS}
            onChange={(e) => setMessageS(e.target.value)}
          />
        </Modal>
      </div>
      <Divider />

      <div className="flex justify-between items-end">
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
        <Button
          size="middle"
          type="primary"
          onClick={() => {
            setViewModal(true);
          }}
        >
          Nuevo mensaje
        </Button>
      </div>
      <Tabs defaultActiveKey="1" onChange={changeTab}>
        <TabPane tab="Enviados" key="1">
          <div className="w-full my-3">
            <Table
              pagination={{ position: ['bottomRight'] }}
              columns={columns}
              dataSource={messagesSend.filter(
                (el: Messages) => el.sender!.idSender === userLog?.id
              )}
              scroll={{ y: window.innerHeight * 0.7 }}
              rowKey="id"
            />
          </div>
        </TabPane>
        <TabPane tab="Recibidos" key="2">
          <div className="w-full my-3">
            <Table
              pagination={{ position: ['bottomRight'] }}
              columns={columns}
              dataSource={messagesSend.filter(
                (el: Messages) => el.sender!.idSender !== userLog?.id
              )}
              scroll={{ y: window.innerHeight * 0.7 }}
              rowKey="id"
            />
          </div>
        </TabPane>
      </Tabs>
      <Loading visible={loadingUsers} />
    </div>
  );
};

export default MessageToEmployees;
