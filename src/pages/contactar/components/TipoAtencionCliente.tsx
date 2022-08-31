import React, { useState, useEffect } from 'react';
import {
  Button,
  DatePicker,
  Row,
  Tabs,
  TimePicker,
  Radio,
  Collapse,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import Form from 'antd/lib/form';
import Get from '../../../utils/Get';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { Dependencies } from '../../../dependency-injection';
import {
  IDataAtension,
  IDataConcessionaire,
  IDataListConcessionaire,
  IConcessionaire,
  IDataConcessionaire_BranchOfficess,
} from '../interfaces/iContactar';
import Loading from '../../../components/Loading';
import Modal from 'antd/lib/modal/Modal';
import SelectConcesionario from './SelectConcesionario';
import { message } from 'antd';
import ScheduleAppointment from './ScheduleAppointment';

type SizeType = Parameters<typeof Form>[0]['size'];
const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

const currentTime = moment().format('LT').toString().split(':');

const initialValues: IConcessionaire = { code: '', name: '' };
const initialDataConcessionaire: IDataConcessionaire_BranchOfficess = {
  concessionaire: initialValues,
  branchOffices: initialValues,
};

const TipoAtencionCliente = ({ dataClient }: any) => {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [buttonSend, setButtonSend] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [valueRadio, setValueRadio] = useState(1);
  const [isEnableAdvisers, setIsEnableAdvisers] = useState(false);
  const [isEnableConnectNow, setIsEnableConectNow] = useState(true);
  const [listConcessionaire, setListConcessionaire] = useState([]);
  const [dataConcessionaire, setDataConcessionaire] =
    useState<IDataConcessionaire_BranchOfficess>(initialDataConcessionaire);
  const [typeTap, setTypeTap] = useState<
    'presencial' | 'virtual' | 'contacten'
  >('presencial');

  const [dataAdvisers, setDataAdvisers] = useState([]);

  const [date, setDate] = useState({
    date: '',
    hors: '',
    minutes: '',
  });

  const [loadingVirtual, setLoadingVirtual] = useState(false);
  const [activeVirtualSchedule, setActiveVirtualSchedule] = useState(false);

  const getDataSucursal = async (): Promise<boolean> => {
    setIsLoading(true);
    const resp = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/sucursal',
      null
    );
    //console.log('SUcursales', resp);
    if (resp && !resp.ok) {
      message.error('Error al obtener sucursales');
      setIsLoading(false);
      return false;
    }
    const { data } = resp.data;
    if (data) {
      const newListConcessionaire: any = [];
      let newListSucursales: any = [];

      data.map((concessionaire: IDataConcessionaire) => {
        const exist = newListConcessionaire.every(
          (item: IDataListConcessionaire) => {
            return concessionaire.codigo !== item.concessionaire.code;
          }
        );
        if (exist) {
          data.forEach((item: IDataConcessionaire) => {
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
      //setIsVisibleModal(true);
      setListConcessionaire(newListConcessionaire);
      setIsLoading(false);
      return true;
    }
    message.error(
      'Verifique que se seleccionó un concesionario y una sucursal'
    );

    setIsLoading(false);
    return false;
  };
  useEffect(() => {
    getDataSucursal();
  }, []);

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = 0; i < start + 1; i++) {
      result.push(i);
    }
    for (let i = end; i < 24; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledHours = () => range(parseInt(currentTime[0]), 18);

  const onChangeDate = (mom: any, value: any) => {
    if (value.length !== 0) setDate({ ...date, date: value });
  };
  const onChangeHour = (mom: any, hours: string) => {
    if (hours.length !== 0) {
      const hour = hours.split(':');
      setDate({ ...date, hors: hour[0], minutes: hour[1] });
    }
  };

  const onClickSeeAdvisers = async () => {
    /* setIsLoading(true);
    const resp = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/sucursal',
      null
    );
    //console.log('SUcursales', resp);
    if (!resp) {
      message.error('Error al obtener sucursales');
      setIsLoading(false);
      return;
    }
    const { data } = resp;
    if (data) {
      const newListConcessionaire: any = [];
      let newListSucursales: any = [];

      data.map((concessionaire: IDataConcessionaire) => {
        const exist = newListConcessionaire.every(
          (item: IDataListConcessionaire) => {
            return concessionaire.codigo !== item.concessionaire.code;
          }
        );
        if (exist) {
          data.forEach((item: IDataConcessionaire) => {
            if (item.codigo === concessionaire.codigo) {
              newListSucursales.push({
                code: item.id_sucursal,
                name: item.sucursal,
                city: item.ciudad,
              });
            }
          });
          const {
            codigo: code,
            descripcion: name,
          }: IDataConcessionaire = concessionaire;
          newListConcessionaire.push({
            concessionaire: { code, name },
            branchOffices: newListSucursales,
          });
          newListSucursales = [];
        }
      });
      setIsVisibleModal(true);
      setListConcessionaire(newListConcessionaire);
    } else {
      message.error(
        'Verifique que se seleccionó un concesionario y una sucursal'
      );
    }
    setIsLoading(false); */
    ///const returnData = await getDataSucursal();
    setIsVisibleModal(true);
  };

  const onChangeRadio = (e: any) => {
    const { value } = e.target;
    setValueRadio(value);
    setIsEnableConectNow(false);
  };

  const onClickConnectNow = async () => {
    try {
      setLoadingVirtual(true);
      const { idClient } = dataClient;
      const { concessionaire, branchOffices } = dataConcessionaire;
      const dataApi: IDataAtension = {
        motive: 'Demostración',
        executionDate: moment().format(),
        openingNote: 'Nota de video llamada',
        idClient,
        idUser: valueRadio,
        idAgency: concessionaire.code.toString(),
        concessionaire,
        sucursal: branchOffices,
      };
      //console.log('dataApi', { dataApi, dataConcessionaire });
      //if (dataApi) return;
      const responseApi = await CRMRepository.apiCall(
        'POST',
        '/api/v1/videocall/schedule',
        {
          data: dataApi,
        }
      );
      //console.log('responseApi', responseApi);
      setLoadingVirtual(false);
      if (responseApi && !responseApi.ok) {
        message.error('Error al generar reunión');
        return;
      }
      window.open(
        `${process.env.REACT_APP_API_URL_VCHAT}/redirect/${responseApi.data.data.idTracing}/${responseApi.data.data.idLead}/${responseApi.data.data.idUser}`,
        'ventana1',
        'width=auto,height=auto,scrollbars=NO'
      );
    } catch (error) {
      //console.log('Error en onClickConnectNow', error.message);
      localStorage.clear();
    }
  };

  //console.log('dataClient -->', dataClient)

  return (
    <div>
      {/* {isVisibleModal && (
        
      )} */}
      {isLoading && <Loading visible={isLoading} />}
      {/* <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        onFinish={(values) => {
          console.log('values -->', { values, typeTap });
        }}
        layout="horizontal"
        initialValues={{ size: componentSize }}
        onValuesChange={() => onFormLayoutChange}
        size={componentSize as SizeType}
      >
        <Form.Item label="Tipo de Atención" name="typeAtencion"></Form.Item>
      </Form> */}
      <b>Tipo de Atención</b>
      <Tabs
        type="line"
        size="small"
        centered
        onChange={(value) => {
          setTypeTap(
            value === '1'
              ? 'presencial'
              : value === '2'
              ? 'virtual'
              : 'contacten'
          );
          return value !== '2' ? setButtonSend(true) : setButtonSend(false);
        }}
      >
        <Tabs.TabPane tab="PRESENCIAL" key="1">
          <Row>
            <span>
              <InfoCircleOutlined style={{ marginRight: 5 }} />
              Para agendar una cita de manera segura enviaremos un código a la
              dirección de correo ingresada.
            </span>
          </Row>
          {/*<h3 style={{ margin: '1rem 0' }}>Seleccionar una fecha y hora</h3>
               <Form.Item label="Hora" name="hour">
                <TimePicker
                  showNow={false}
                  format="HH:mm"
                  disabledHours={disabledHours}
                  minuteStep={30}
                  onChange={onChangeHour}
                  name="hours"
                />
              </Form.Item>
              <Form.Item label="Fecha" name="date">
                <DatePicker
                  disabledDate={(current) => {
                    return current && current <= moment().startOf('day');
                  }}
                  name="date"
                  onChange={onChangeDate}
                />
              </Form.Item> */}
          <ScheduleAppointment
            typeScheduleTap={typeTap}
            listConcessionaire={listConcessionaire}
            idClient={dataClient.idClient}
            //idClient={14700}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="VIRTUAL" key="2">
          <div className="tab-virtual">
            <p>
              Reúnete con uno de nuestros asesores comerciales virtuales a
              través de nuestra plataforma.
              <br />
              Nuestro horario de atención virtual es de lunes a viernes de 10:00
              - 18:00
            </p>
            <div className="tab-virtual-btns">
              <Button
                type="primary"
                onClick={onClickSeeAdvisers}
                style={{ marginBottom: 10 }}
                disabled={activeVirtualSchedule}
              >
                Reunión virtual inmediata
              </Button>

              <Collapse
                //defaultActiveKey={['1']}
                style={{ width: '100%' }}
                onChange={(value) => {
                  //console.log('value', value);
                  if (value.length === 0) {
                    setActiveVirtualSchedule(false);
                  } else {
                    setActiveVirtualSchedule(true);
                  }
                }}
              >
                <Collapse.Panel header="Agendar Cita" key="1">
                  <ScheduleAppointment
                    typeScheduleTap={typeTap}
                    listConcessionaire={listConcessionaire}
                    idClient={dataClient.idClient}
                    //idClient={14700}
                  />
                </Collapse.Panel>
              </Collapse>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="QUIERO QUE ME CONTACTEN" key="3">
          <span>
            Uno de nuestros asesores se comunicará contigo a lo largo de la
            semana
          </span>
          <ScheduleAppointment
            typeScheduleTap={typeTap}
            listConcessionaire={listConcessionaire}
            idClient={dataClient.idClient}
            //idClient={14700}
          />
        </Tabs.TabPane>
      </Tabs>
      <Modal
        title="Asesores Disponibles"
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
        footer={[
          <Button key="back" onClick={() => setIsVisibleModal(false)}>
            Regresar
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onClickConnectNow}
            disabled={isEnableConnectNow}
            loading={loadingVirtual}
          >
            Conectarse Ahora
          </Button>,
        ]}
      >
        <SelectConcesionario
          setIsEnableAdvisers={setIsEnableAdvisers}
          setDataAdvisers={setDataAdvisers}
          setIsEnableConectNow={setIsEnableConectNow}
          listConcessionaire={listConcessionaire}
          dataConcessionaire={dataConcessionaire}
          setDataConcessionaire={setDataConcessionaire}
        />
        {isEnableAdvisers && (
          <Form.Item style={{ marginBottom: 0 }}>
            <h4>Selecione un asesor</h4>
            <Radio.Group value={valueRadio} onChange={onChangeRadio}>
              {dataAdvisers.map((item: any, i) => {
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
          </Form.Item>
        )}
      </Modal>
    </div>
  );
};

export default TipoAtencionCliente;
