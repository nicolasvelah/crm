import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Select, Drawer, Button, Divider, Tag, Row, Col, Alert } from 'antd';
import { CloseOutlined, FireOutlined, CarOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BusinessHistory from './BusinessHistory';
import Client from '../../data/models/Client';
import milisecondsToDate from '../../utils/milisecondsToDate';
import { ClientLeadContext } from '../GetClientData';
import { getNextTracing, outTime } from '../Follow/TimeLine';
import Get from '../../utils/Get';
import UserRepository from '../../data/repositories/user-repository';
import { Dependencies } from '../../dependency-injection';
import auth from '../../utils/auth';
import User from '../../data/models/User';
import Tracings from '../../data/models/Tracings';

const { Option } = Select;

const BusinessDetail: FunctionComponent<{ prospect: Client }> = ({
  prospect,
}) => {
  const historyRouter = useHistory();
  const usersRepository = Get.find<UserRepository>(Dependencies.users);
  const [employees, setEmployees] = useState<User[] | null>(null);
  const [nextTracing, setNextTracing] = useState<Tracings | null>(null);

  const getNextTracingProps = (nextTracingInput: Tracings) => {
    setNextTracing(nextTracingInput);
  };

  useEffect(() => {
    //console.log('prospect BusinessDetail', prospect);
    const componentdidmount = async () => {
      const h: any = historyRouter;

      if (h.location && h.location.state && h.location.state.identification) {
        const { user } = auth;
        if (user && user.role === 'JEFE DE VENTAS') {
          const empl = await usersRepository.getEmployeesByBoss();
          setEmployees(empl);
        }
      }
    };
    componentdidmount();
  }, []);

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  if (!prospect) {
    return <div />;
  }

  return (
    <>
      <Button type="dashed" onClick={showDrawer} className="w-full">
        Detalles del negocio
      </Button>

      <Drawer
        title="Detalles del Negocio"
        width={550}
        placement="right"
        // closable={true}
        closeIcon={<CloseOutlined />}
        onClose={onClose}
        visible={visible}
        drawerStyle={{
          backgroundColor: 'rgba(255,255,255,1)',
        }}
        headerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        bodyStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
      >
        {/*<Worksheet data={employees} />*/}
        <div>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Divider orientation="left">Cliente</Divider>
              <ClientInfo client={prospect} />
            </Col>
            <Col span={12}>
              <Divider orientation="left">Origen</Divider>
              <Origin prospect={prospect} />
            </Col>
          </Row>

          <Divider orientation="left">Seguimientos</Divider>
          <BusinessHistory
            prospectIdentification={prospect.identification!}
            getNextTracingProps={getNextTracingProps}
          />

          <Divider orientation="left">Próximo seguimiento</Divider>
          <NexFollowUp tracing={nextTracing!} />

          {/*<Divider orientation="left">Parámetros de pago</Divider>
          <PayParameters prospect={prospect} />*/}

          {/*<Divider>Embudo</Divider>
          <Enbudo stepBusiness="inquiry" />*/}
        </div>
      </Drawer>
    </>
  );
};

const TemperatureSelect: FunctionComponent<{
  temperature: string | undefined;
}> = ({ temperature }) => {
  return (
    <div className="flex items-center pl-3">
      <Select
        defaultValue="HOT"
        value={temperature}
        style={{ width: 100 }}
        onChange={() => {}}
        disabled
      >
        <Option value="HOT">Caliente</Option>
        <Option value="COLD">Frío</Option>
        <Option value="TIBIO">Tíbio</Option>
      </Select>

      <div className="mx-2">
        <div
          className={`w-3 h-3 border-l-2 border-r-2 border-t-2 rounded-t 
          border-red-500 ${temperature === 'Hot' ? 'bg-red-500' : ''}`}
        />
        <div
          className={`w-3 h-3 border-l-2 border-r-2 border-red-500 ${
            temperature === 'Tibio' || temperature === 'Caliente'
              ? 'bg-red-500'
              : ''
          }`}
        />
        <div
          className="w-3 h-3 bg-red-500 border-l-2 border-r-2
          border-red-500 border-b-2 rounded-b"
        />
      </div>
    </div>
  );
};

const ClientInfo: FunctionComponent<{ client: Client }> = ({ client }) => {
  const { lead } = useContext(ClientLeadContext);
  return (
    <div>
      <div className="pl-3">
        <div className="flex flex-row items-center">
          <span className="font-bold">Hoja de trabajo:</span>
          <Button type="primary" className="ml-2" size="small">
            Nro: {lead?.id}
          </Button>
        </div>
        <strong>Nombre: </strong>
        {`${client.name} ${client.lastName}`}
        <br />
        <b>Cédula: </b>
        {client.identification}
        <br />
        <b>Email: </b>
        {client.email}
        <br />
        <b>Celular: </b>
        {client.cellphone}
      </div>
    </div>
  );
};

const NexFollowUp: FunctionComponent<{
  tracing: Tracings;
}> = ({ tracing }) => {
  const nextTracing = tracing;

  return (
    <>
      {nextTracing ? (
        nextTracing && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Fecha de ejecución
              </Col>
              <Col
                className={
                  outTime(nextTracing.executionDate!)
                    ? 'text-red-600'
                    : 'text-green-600'
                }
                span={12}
              >
                {milisecondsToDate(
                  nextTracing.executionDate!,
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
                    nextTracing.priority === 'Alta'
                      ? 'red'
                      : nextTracing.priority === 'Media'
                      ? 'cyan'
                      : ''
                  }`}
                >
                  {nextTracing.priority}
                </Tag>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12} className="text-right">
                Motivo
              </Col>
              <Col span={12}>
                <Tag
                  color={`${
                    nextTracing.motive === 'Test Drive'
                      ? 'magenta'
                      : nextTracing.motive === 'Demostracion'
                      ? 'volcano'
                      : nextTracing.motive === 'Indagacion'
                      ? 'purple'
                      : nextTracing.motive === 'Cotizacion'
                      ? 'geekblue'
                      : ''
                  }`}
                >
                  {nextTracing.motive}
                </Tag>
              </Col>
            </Row>
          </div>
        )
      ) : (
        <Alert
          className="mt-5 text-center"
          message="El prospecto no tiene próximos seguimientos"
          type="warning"
        />
      )}
    </>
  );
};

const Origin: FunctionComponent<{
  prospect: Client;
}> = ({ prospect }) => {
  return (
    <div>
      <div>
        <b>Canal:</b>
        {prospect.chanel}
        <br />
        <b>Fecha:</b>
        {milisecondsToDate(prospect.createdAt!)}
      </div>
      <Divider orientation="left">Temperatura</Divider>
      <div className="flex items-center">
        <FireOutlined />
        <TemperatureSelect
          temperature={
            prospect && prospect.leads
              ? prospect.leads[0].temperature
              : undefined
          }
        />
      </div>
    </div>
  );
};

const PayParameters: FunctionComponent<{ prospect: Client }> = ({
  prospect,
}) => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12} className="text-right">
          Avalúo Mecánico
        </Col>
        <Col span={12}>
          <Tag color="default">Inactivo</Tag>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12} className="text-right">
          Solicitud de crédito
        </Col>
        <Col span={12}>
          <Tag color="default">Inactivo</Tag>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12} className="text-right">
          Reserva vehículo
        </Col>
        <Col span={12}>
          <Tag color="default">Sin reserva</Tag>
        </Col>
      </Row>
    </div>
  );
};

export default BusinessDetail;
