/* eslint-disable camelcase */
import React, { useEffect, useState, FunctionComponent } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Row,
  Select,
  Radio,
} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { RadioChangeEvent } from 'antd/lib/radio';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Menu from '../../components/Template';
import UserRepository from '../../data/repositories/user-repository';
import Get from '../../utils/Get';
import { Dependencies } from '../../dependency-injection';
import User from '../../data/models/User';
import LeadsRepository from '../../data/repositories/leads-repository';
import Leads from '../../data/models/Leads';
import Loading from '../../components/Loading';
import milisecondsToDate from '../../utils/milisecondsToDate';
import { UserReassignedInput } from '../../data/providers/apollo/mutations/reassigned';
import ReassignedRepository from '../../data/repositories/reassigned-repository';
import auth from '../../utils/auth';
import LoadingMessage from './components/LoadingMessage';

interface Dealer {
  codigo: string;
  descripcion: string;
  ruc?: string;
  sucursal: {
    ciudad: string;
    id_sucursal: number;
    sucursal: string;
  }[];
  tipo_concesionario?: string;
}

const { Option } = Select;
const { user }: { user: User } = auth;

const MainReasign = () => {
  return (
    <Menu page="help">
      <Reasign />
    </Menu>
  );
};

const Reasign = () => {
  /* ----HOOKS---- */
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [leadsType, setLeadsType] = useState<'without' | 'with'>('without');
  const [myLeads, setMyLeads] = useState<Leads[]>([]);
  const [myUsers, setMyUsers] = useState<User[]>([]);
  const [usersFilter, setUserFilter] = useState<User[]>([]);
  const [idLeads, setIdLeads] = useState<number[]>([]);
  const [idUser, setIdUser] = useState<number>(0);

  /* ----REPOSITORY---- */
  const userRepository = Get.find<UserRepository>(Dependencies.users);
  const leadsRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const reassignedRepository = Get.find<ReassignedRepository>(
    Dependencies.reassigned
  );

  const componentdidmount = async () => {
    setLoading(true);
    const respGQL = await leadsRepository.getLeadsToReasign();
    console.log('respGQL Reasign-->', respGQL);
    if (respGQL) {
      setMyLeads(respGQL);
      const usersByConcecionario = await userRepository.getEmployeesByConcesionaire();
      if (usersByConcecionario) {
        console.log('usersByConcecionario -->', usersByConcecionario);
        setMyUsers(usersByConcecionario);
      }
      //console.log('USER-->', user);
    }

    setLoading(false);
  };

  useEffect(() => {
    componentdidmount();
  }, []);

  const sendToReasign = async () => {
    setLoading(true);
    if (idLeads.length > 20) {
      setLoadingMessage(true);
    }
    if (leadsType === 'without') {
      const respGQL = await leadsRepository.reasignLead(idUser, idLeads);
      //const respGQL = false;
      //console.log('respGQL', respGQL);
      const userToReasign = myUsers.find((us) => us.id === idUser);
      if (respGQL) {
        message.success(
          `Se ha asignado el asesor ${userToReasign?.nombre} ${userToReasign?.apellido} al/los negocio/s.`,
          20
        );
      } else {
        message.error(
          `No se pudo asignar el asesor ${userToReasign?.nombre} ${userToReasign?.apellido} al/los negocio/s.`,
          20
        );
      }
    } else if (leadsType === 'with') {
      const prevUser = myLeads.find((l) => l.id === idLeads[0])?.user;
      const previousUser: UserReassignedInput = {
        id: prevUser?.id,
        apellido: prevUser?.apellido,
        codUsuario: prevUser?.codUsuario,
        nombre: prevUser?.nombre,
      };

      const nuevoUser = myUsers.find((u) => u.id === idUser);
      const newUser: UserReassignedInput = {
        id: idUser,
        apellido: nuevoUser?.apellido,
        codUsuario: nuevoUser?.codUsuario,
        nombre: nuevoUser?.nombre,
      };
      const okReasing = await leadsRepository.reasignUser(
        newUser,
        previousUser,
        idLeads
      );
      if (okReasing) {
        const newReassigned = await reassignedRepository.createReassigned(
          previousUser,
          'Reasignación directa',
          newUser,
          idLeads
        );
        if (newReassigned) {
          message.success(
            `Se reasignaron los Negocios del usuario ${previousUser.nombre} ${previousUser.apellido} al usuario ${newUser.nombre} ${newUser.apellido}`,
            20
          );
        } else {
          message.error(
            'No se pudo reasignar la venta. Vuelve a intentarlo.',
            20
          );
        }
      }
    }
    setUserFilter([]);
    setIdLeads([]);
    setIdUser(0);
    setLoading(false);
    setIsModalVisible(false);
    if (idLeads.length > 20) {
      setLoadingMessage(false);
    }
    await componentdidmount();
  };
  const reasignLead = async () => {
    if (idLeads.length > 20) {
      setIsModalVisible(true);
    } else {
      await sendToReasign();
      //onOkModal();
    }
  };

  const handleChangeLeadsType = (e: RadioChangeEvent) => {
    //setSize(e.target.value);
    setLeadsType(e.target.value);
    setUserFilter([]);
  };

  const filterUserByConSucu = (codeCon: string, codeSucu: string) => {
    const newUsers = myUsers.filter((mU) => {
      return !!(
        mU.sucursal?.includes(codeSucu) && mU.concesionario?.includes(codeCon)
      );
    });
    console.log('newUsers filterUserByConSucu -->', newUsers);
    setUserFilter(newUsers);
  };

  const filterUserByArrayConSucu = (
    codeCon: string[],
    codeSucu: string[],
    userId: number
  ) => {
    const usersCon: User[] = [];
    myUsers.forEach((mU) => {
      const okUser = mU.concesionario?.find((con) => codeCon.includes(con));
      if (okUser) {
        const okUserSucu = mU.sucursal?.find((sucu) => codeSucu.includes(sucu));
        if (okUserSucu) {
          if (mU.id !== userId) {
            usersCon.push(mU);
          }
        }
      }
    });
    console.log('usersCon filterUserByArrayConSucu -->', usersCon);
    setUserFilter(usersCon);
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl c-black m-0 p-0 flex">
          Reasignación de negocios
        </h2>
      </div>

      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: 20,
        }}
      >
        <Button
          type="primary"
          shape="round"
          disabled={idUser === 0 || idLeads.length === 0}
          onClick={reasignLead}
        >
          Reasignar negocio/s
        </Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '50%' }}>
          <Card style={{ marginRight: 10, padding: 10 }}>
            <h3>
              <b>Selecciona a quien reasignar los negocios</b>
            </h3>
            <ListUsers
              myUsers={usersFilter}
              idUser={idUser}
              setIdUser={setIdUser}
            />
          </Card>
        </div>
        <div style={{ width: '50%' }}>
          <Card style={{ marginLeft: 10, padding: 10 }}>
            <h3>
              <b>Negocios a reasignar</b>
            </h3>
            <div style={{ paddingBottom: 15 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Radio.Group value={leadsType} onChange={handleChangeLeadsType}>
                  <Radio.Button value="without">
                    Negocios sin asesor
                  </Radio.Button>
                  <Radio.Button value="with">Negocios con asesor</Radio.Button>
                </Radio.Group>
              </div>
              {leadsType === 'without' && user.dealer && (
                <DealsWithoutAdviser
                  dealer={user.dealer}
                  myLeads={myLeads}
                  filterUserByConSucu={filterUserByConSucu}
                  idLeads={idLeads}
                  setIdLeads={setIdLeads}
                />
              )}
              {leadsType === 'with' && user.dealer && (
                <DealsWithAdviser
                  advisers={myUsers}
                  myLeads={myLeads}
                  filterUserByArrayConSucu={filterUserByArrayConSucu}
                  idLeads={idLeads}
                  setIdLeads={setIdLeads}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
      <Loading visible={loading} />
      {loadingMessage && <LoadingMessage />}
      {isModalVisible && (
        <Modal
          width={400}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              //onClick={onOkModal}
              onClick={sendToReasign}
            >
              Confirmar
            </Button>,
          ]}
        >
          <p style={{ color: '#0388fc', fontSize: '1.5rem' }}>! Importante ¡</p>
          <p style={{ margin: '0 0.2rem' }}>
            Recuerde que reasignar una gran cantidad de
            <br />
            negocios, puede tomar varios minutos.
          </p>
        </Modal>
      )}
    </div>
  );
};

const DealsWithoutAdviser: FunctionComponent<{
  dealer: Dealer[];
  myLeads: Leads[];
  filterUserByConSucu: (codeCon: string, codeSucu: string) => void;
  idLeads: number[];
  setIdLeads: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ dealer, myLeads, filterUserByConSucu, idLeads, setIdLeads }) => {
  const [concesionario, setConcesionario] = useState<string>('');
  const [sucursal, setSucursal] = useState<string>('');
  const [leadsFilter, setLeadsFilter] = useState<Leads[]>([]);
  //const [idLeads, setIdLeads] = useState<number[]>([]);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);

  useEffect(() => {
    setConcesionario('');
    setSucursal('');
    setLeadsFilter([]);
    setCheckedAll(false);
  }, [myLeads]);

  const handleChangeConcesionario = (value: string) => {
    setSucursal('');
    setConcesionario(value);

    setIdLeads([]);
    setLeadsFilter([]);
  };
  const handleChangeSucursal = (value: string) => {
    setSucursal(value);
    const leads = myLeads.filter((mL) => {
      return (
        mL.concesionario?.code === concesionario &&
        mL.sucursal?.code === value &&
        mL.toReasign
      );
    });
    console.log({ concesionario, sucursal: value, leads });
    setLeadsFilter(leads);
    setIdLeads([]);
    setCheckedAll(false);

    filterUserByConSucu(concesionario, value);
  };

  const onChangeCheckbox = (value: any[]) => {
    setCheckedAll(false);
    setIdLeads(value);
  };

  const selectAll = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    setIdLeads(checked ? leadsFilter.map((l) => l.id!) : []);
    setCheckedAll(checked);
  };

  return (
    <div style={{ overflowY: 'auto', maxHeight: '600px' }}>
      <div style={{ margin: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
          <b style={{ marginRight: 5, width: 95 }}>Concesionario:</b>
          <Select
            style={{ width: 300 }}
            value={concesionario === '' ? undefined : concesionario}
            onChange={handleChangeConcesionario}
          >
            {dealer.map((d, index) => (
              <Option key={index} value={d.codigo}>
                {d.descripcion}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <b style={{ marginRight: 5, width: 95, textAlign: 'right' }}>
            Sucursal:
          </b>
          <Select
            style={{ width: 300 }}
            onChange={handleChangeSucursal}
            disabled={concesionario === ''}
            value={sucursal !== '' ? sucursal : undefined}
          >
            {dealer
              .find((d) => d.codigo === concesionario)
              ?.sucursal.map((s, index) => (
                <Option key={index} value={s.id_sucursal.toString()}>
                  {s.sucursal}
                </Option>
              ))}
          </Select>
        </div>
      </div>
      <div>
        <Checkbox
          checked={checkedAll}
          onChange={selectAll}
          style={{ marginBottom: 10 }}
        >
          Seleccionar todos
        </Checkbox>

        <Checkbox.Group
          style={{ width: '100%', overflowY: 'auto', maxHeight: '600px' }}
          onChange={onChangeCheckbox}
          value={idLeads}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          >
            {leadsFilter.map((lF) => (
              <Checkbox
                key={lF.id}
                value={lF.id}
                style={{ display: 'flex', alignItems: 'center', margin: 10 }}
              >
                <CardLead lead={lF} />
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </div>
  );
};

const DealsWithAdviser: FunctionComponent<{
  advisers: User[];
  myLeads: Leads[];
  filterUserByArrayConSucu: (
    codeCon: string[],
    codeSucu: string[],
    userId: number
  ) => void;
  idLeads: number[];
  setIdLeads: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ advisers, myLeads, filterUserByArrayConSucu, idLeads, setIdLeads }) => {
  const [leadsFilter, setLeadsFilter] = useState<Leads[]>([]);
  //const [idLeads, setIdLeads] = useState<number[]>([]);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [userSelect, setUserSelect] = useState<number>(0);

  useEffect(() => {
    setLeadsFilter([]);
    setUserSelect(0);
    setCheckedAll(false);
  }, [myLeads]);

  const handleChangeAdviser = (value: number) => {
    const leads = myLeads.filter((mL) => mL.user.id === value && !mL.toReasign);
    setUserSelect(value);
    setLeadsFilter(leads);
    setIdLeads([]);
    setCheckedAll(false);

    const allCon: string[] = [];
    const allSucu: string[] = [];
    leads.forEach((l) => {
      const okCon = allCon.includes(l.concesionario!.code!);
      if (!okCon) {
        allCon.push(l.concesionario!.code!);
      }
      const okSucu = allSucu.includes(l.sucursal!.code!);
      if (!okSucu) {
        allSucu.push(l.sucursal!.code!);
      }
    });
    console.log(
      'leads -->',
      leads.map((l) => ({ con: l.concesionario, sucu: l.sucursal }))
    );
    filterUserByArrayConSucu(allCon, allSucu, value);
  };

  const onChangeCheckbox = (value: any[]) => {
    setIdLeads(value);
    setCheckedAll(false);
  };

  const selectAll = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    setIdLeads(checked ? leadsFilter.map((l) => l.id!) : []);
    setCheckedAll(checked);
  };

  return (
    <div>
      <div style={{ margin: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
          <b style={{ marginRight: 5, width: 95, textAlign: 'right' }}>
            Asesor:
          </b>
          <Select
            value={userSelect === 0 ? undefined : userSelect}
            style={{ width: 300 }}
            onChange={handleChangeAdviser}
          >
            {advisers.map((ad, index) => (
              <Option key={index} value={ad.id!}>
                {ad.nombre} {ad.apellido}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Checkbox
          checked={checkedAll}
          onChange={selectAll}
          style={{ marginBottom: 10 }}
        >
          Seleccionar todos
        </Checkbox>
        <Checkbox.Group
          style={{ width: '100%', overflowY: 'auto', maxHeight: '600px' }}
          onChange={onChangeCheckbox}
          value={idLeads}
          //style={{ overflowY: 'auto', maxHeight: '600px' }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          >
            {leadsFilter.map((lF) => (
              <Checkbox
                key={lF.id}
                value={lF.id}
                style={{ display: 'flex', alignItems: 'center', margin: 10 }}
              >
                <CardLead lead={lF} />
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </div>
  );
};

const ListUsers: FunctionComponent<{
  myUsers: User[];
  idUser: number;
  setIdUser: React.Dispatch<React.SetStateAction<number>>;
}> = ({ myUsers, idUser, setIdUser }) => {
  const [userFilterSearch, setUserFilterSearch] = useState<User[]>([]);
  const [search, setSearch] = useState<string>('');
  //const [idUser, setIdUser] = useState<number>(0);

  useEffect(() => {
    setUserFilterSearch(myUsers);
    setSearch('');
    setIdUser(0);
  }, [myUsers]);

  const onChangeSeach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    const users = myUsers.filter((mU) => {
      return (
        mU.nombre?.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
        mU.apellido?.toLocaleLowerCase().includes(val.toLocaleLowerCase())
      );
    });
    setUserFilterSearch(users);
    setIdUser(0);
  };

  const onChangeCheckbox = (value: any[]) => {
    // console.log('value -->', value, value[value.length - 1]);
    setIdUser(value[value.length - 1] ?? 0);
  };

  return (
    <div>
      <Input
        value={search}
        onChange={onChangeSeach}
        style={{ borderRadius: 0, width: 300 }}
        placeholder="Ingrese el usuario a buscar"
      />
      <Checkbox.Group
        style={{ width: '100%', overflowY: 'auto', maxHeight: '600px' }}
        onChange={onChangeCheckbox}
        value={idUser ? [idUser] : undefined}
        //style={{ overflowY: 'auto', maxHeight: '600px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {userFilterSearch.map((userF) => (
            <Checkbox
              key={userF.id}
              value={userF.id}
              style={{ display: 'flex', alignItems: 'center', margin: 10 }}
            >
              <CardUser myUser={userF} />
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
};

const CardLead: FunctionComponent<{ lead: Leads }> = ({ lead }) => (
  <Card>
    <div className="">
      <h3 style={{ marginLeft: '2.2em' }}>{`Negocio ${lead.id}`}</h3>
      <ul
        style={{
          paddingInlineStart: '25px',
          marginBottom: 0,
        }}
      >
        <li>
          <b>Cliente:</b>{' '}
          <span>{`${lead.client.name} ${lead.client.lastName}`}</span>
        </li>
        <li>
          <b>Fecha de creación:</b>{' '}
          <span>{milisecondsToDate(lead.createdAt!, 'DD/MM/YYYY hh:mm')}</span>
        </li>
        <li>
          <b>Usuario anterior:</b>{' '}
          <span>{`${lead.user.nombre} ${lead.user.apellido}`}</span>
        </li>
      </ul>
      <b style={{ color: '#000' }}>
        {lead.concesionario?.name} - {lead.sucursal?.name}
      </b>
    </div>
  </Card>
);

const CardUser: FunctionComponent<{ myUser: User }> = ({ myUser }) => (
  <Card>
    <div className="flex items-center">
      <div className="flex items-center justify-center">
        <Avatar
          style={{
            backgroundColor: '#87d068',
            marginLeft: '5px',
          }}
          size={36}
        >
          {myUser.nombre?.charAt(0).toUpperCase()}
          {myUser.apellido?.charAt(0).toUpperCase()}
        </Avatar>
      </div>

      <div className="ml-2">
        <h3 className="m-0 p-0 font-bold" style={{ lineHeight: 1 }}>
          {myUser.nombre} {myUser.apellido}
        </h3>
        <div className="text-sm" style={{ lineHeight: 1 }}>
          <br />
          <span>{myUser.role}</span>
        </div>
      </div>
    </div>
  </Card>
);

export default MainReasign;
