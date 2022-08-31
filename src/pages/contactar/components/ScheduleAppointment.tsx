/* eslint-disable camelcase */
import React, { useState, FunctionComponent } from 'react';
import {
  Button,
  DatePicker,
  Row,
  Tabs,
  TimePicker,
  Radio,
  Form,
  Input,
  message,
} from 'antd';
import SelectConcesionario from './SelectConcesionario';
import {
  IDataConcessionaire_BranchOfficess,
  IConcessionaire,
  IDataAtension,
} from '../interfaces/iContactar';
import moment from 'moment';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import TracingsRepository from '../../../data/repositories/tracings-repository';
import CRMRepository from '../../../data/repositories/CRM-repository';

const initialValues: IConcessionaire = { code: '', name: '' };
const initialDataConcessionaire: IDataConcessionaire_BranchOfficess = {
  concessionaire: initialValues,
  branchOffices: initialValues,
};

const ScheduleAppointment: FunctionComponent<{
  listConcessionaire: never[];
  typeScheduleTap: 'presencial' | 'virtual' | 'contacten';
  idClient: number;
}> = ({ listConcessionaire, typeScheduleTap, idClient }) => {
  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  const [isEnableAdvisers, setIsEnableAdvisers] = useState(false);
  const [isEnableConnectNow, setIsEnableConectNow] = useState(true);
  const [dataAdvisers, setDataAdvisers] = useState([]);
  const [dataConcessionaire, setDataConcessionaire] =
    useState<IDataConcessionaire_BranchOfficess>(initialDataConcessionaire);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    //console.log('dataApi', { dataConcessionaire });
    const dataApi: IDataAtension = {
      motive: 'Demostración',
      executionDate: `${values.date.format('YYYY-MM-DD')} ${values.hour.format(
        'HH'
      )}:${values.hour.format('mm')}`,
      openingNote: values.openingNote ?? null,
      idClient,
      idUser: values.asesor,
      idAgency: dataConcessionaire.branchOffices.code.toString(),
      concessionaire: dataConcessionaire.concessionaire,
      sucursal: dataConcessionaire.branchOffices,
      tracingType:
        typeScheduleTap === 'virtual'
          ? 'Cita Virtual'
          : typeScheduleTap === 'presencial'
          ? 'Cita Presencial'
          : 'Contactar',
    };

    //if (dataApi) return;
    const responseApi = await CRMRepository.apiCall(
      'POST',
      '/api/v1/videocall/schedule',
      {
        data: dataApi,
      }
    );
    //console.log('responseApi', responseApi);
    if (responseApi && !responseApi.ok) {
      message.error(
        responseApi.message.length > 0
          ? responseApi.message
          : 'Error al generar reunión'
      );
      setLoading(false);
      return;
    }
    /* console.log('data api -->', dataApi);
    console.log('data resp -->', responseApi.data); */
    message.success('Reunión agendada');
    setLoading(false);
    /* const newTracingRespond = await tracingsRepository.creatTracing(
      dataToSend,
      CI!,
      idEmployee!,
      idLead !== undefined ? idLead : dataForm.idLead
    ); */
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h3 style={{ margin: '1rem 0' }}>Selecciona un asesor</h3>
      <SelectConcesionario
        setIsEnableAdvisers={setIsEnableAdvisers}
        setDataAdvisers={setDataAdvisers}
        setIsEnableConectNow={setIsEnableConectNow}
        listConcessionaire={listConcessionaire}
        dataConcessionaire={dataConcessionaire}
        setDataConcessionaire={setDataConcessionaire}
        allUsers
      />
      <Form
        {...{
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        }}
        onFinish={onFinish}
      >
        {dataAdvisers.length > 0 && (
          <Form.Item
            name="asesor"
            label="Selecione un asesor"
            style={{ marginBottom: 0 }}
            rules={[{ required: true }]}
          >
            <Radio.Group>
              {dataAdvisers.map((item: any, i) => {
                return (
                  <Radio value={item.id} key={i}>
                    {`${item.nombre} ${item.apellido}`}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
        )}
        <h3 style={{ margin: '1rem 0' }}>Seleccionar una fecha y hora</h3>
        <Form.Item label="Hora" name="hour" rules={[{ required: true }]}>
          <TimePicker
            showNow={false}
            format="HH:mm"
            //disabledHours={disabledHours}
            minuteStep={30}
            //onChange={onChangeHour}
            name="hours"
          />
        </Form.Item>
        <Form.Item label="Fecha" name="date" rules={[{ required: true }]}>
          <DatePicker
            disabledDate={(current) => {
              return current && current <= moment().startOf('day');
            }}
            name="date"
            //onChange={onChangeDate}
          />
        </Form.Item>

        <Form.Item name="openingNote" label="Comentario">
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button
            style={{ margin: 'auto', display: 'block' }}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Crear cita
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ScheduleAppointment;
