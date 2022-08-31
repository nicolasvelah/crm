import React, { FunctionComponent, useState, useContext } from 'react';
import { DatePicker, Form, message } from 'antd';
import moment, { Moment } from 'moment';
import { DataTable } from './TablaVehicles';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';

import { ScheduleDeliveryInput } from '../../../data/providers/apollo/mutations/delivery';
import { ScheduleDelivery } from '../../../data/models/Delivery';
import milisecondsToDate from '../../../utils/milisecondsToDate';
import { ClientLeadContext } from '../../../components/GetClientData';
import { netType } from '../../../utils/extras';

// Setea individualmente el estado de las fechas
const DateStates: FunctionComponent<{
  dataRow: DataTable;
  isEstimated?: boolean;
}> = ({ dataRow, isEstimated }) => {
  /******************************HOOKS*****************************************/
  const { lead, setLead } = useContext(ClientLeadContext);
  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );
  // Estados de las fechas
  const [dateState, setDateState] = useState<
    '' | 'success' | 'warning' | 'error' | 'validating' | undefined
  >(
    !isEstimated
      ? dataRow.delivery &&
        dataRow.delivery?.scheduleDelivery?.date &&
        dataRow.delivery?.scheduleDelivery?.date.length > 0
        ? 'success'
        : ''
      : dataRow.delivery && dataRow.delivery?.estimatedDeliveryDate
      ? 'success'
      : ''
  );
  // Setea el valor de lafecha si existe o si se guarda correctamente en db

  const [dateValue, setDateValue] = useState<Moment | undefined>(
    !isEstimated
      ? dataRow.delivery &&
        dataRow.delivery?.scheduleDelivery?.date &&
        dataRow.delivery?.scheduleDelivery?.date.length > 0
        ? moment(dataRow.delivery?.scheduleDelivery?.date!, 'YYYY/MM/DD HH:mm')
        : undefined
      : dataRow.delivery && dataRow.delivery?.estimatedDeliveryDate
      ? moment(
          milisecondsToDate(
            dataRow.delivery?.estimatedDeliveryDate!,
            'YYYY/MM/DD HH:mm'
          ),
          'YYYY/MM/DD HH:mm'
        )
      : undefined
  );
  const [myDateT, setMyDateT] = useState<string>('');

  const isRedExterna =
    netType(lead?.concesionario?.code!).toLowerCase() === 'red externa';

  /******************************GENERALFUNCTION*******************************/

  // Actualiza la fecha de entrega
  const insertScheduleDeliveryWithQuote = async (
    idQuote: number,
    scheduleDelivery: ScheduleDeliveryInput
  ) => {
    try {
      setDateState('validating');
      const respApi = await deliveryRepository.updateScheduleDeliveryWithQuote(
        idQuote,
        scheduleDelivery,
        isRedExterna ?? null
      );
      if (respApi.status === 200) {
        setDateState('success');
        message.success('Información actualizada');
        //console.log('True updateScheduleDeliveryWithQuote', respApi);

        //return true;
      } else {
        setDateState('error');
        message.error(
          `No se pudo actualizar la información. ${respApi.message}`
        );
        //console.log('False updateScheduleDeliveryWithQuote', respApi);
      }
      dataRow.setDataToTable((prevState) => {
        //console.log('prevState', prevState);
        const copia = prevState;
        const index = copia.findIndex((dt) => dt.idQuote === dataRow.idQuote);
        //console.log('index', index);
        if (index > -1) {
          const actualDel = copia[index].delivery!;
          if (respApi.status === 200) {
            actualDel.scheduleDelivery = scheduleDelivery as ScheduleDelivery;
          }

          const faltanDoc = !!actualDel.finalDocuments?.find(
            (doc) => doc.url === null
          );
          console.log('faltanDoc setDataToTable', { faltanDoc, actualDel });
          if (
            (actualDel.finalDocuments &&
              !faltanDoc &&
              actualDel.scheduleDelivery &&
              actualDel.scheduleDelivery.date) ||
            isRedExterna
          ) {
            if (respApi.status === 200) {
              actualDel.deliveryFinal = true;
            }

            actualDel.idBusinessHubspot = respApi.idBusinessHubspot ?? null;
          }

          copia[index].delivery = actualDel;
          //console.log('copia[index]', copia[index]);
          return [...copia];
        }
        return prevState;
      });
      if (setLead) {
        setLead((prevState: any) => {
          const copiaLead = prevState;
          const indexQuote = copiaLead.quotes?.findIndex(
            (quo: any) => quo.id === dataRow.idQuote
          );
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            const actualDel = copiaLead.quotes[indexQuote].delivery;
            if (respApi.status === 200) {
              actualDel.scheduleDelivery = scheduleDelivery as ScheduleDelivery;
            }

            //actualDel.finalDocuments = copyLast;
            const faltanDoc = !!actualDel.finalDocuments?.find(
              (doc: any) => doc.url === null
            );
            //console.log('faltanDoc setDataToTable', { faltanDoc, actualDel });
            if (
              (actualDel.finalDocuments &&
                !faltanDoc &&
                actualDel.scheduleDelivery &&
                actualDel.scheduleDelivery.date) ||
              isRedExterna
            ) {
              if (respApi.status === 200) {
                actualDel.deliveryFinal = true;
              }

              actualDel.idBusinessHubspot = respApi.idBusinessHubspot ?? null;
            }
            copiaLead.quotes[indexQuote].delivery = actualDel;
            return { ...copiaLead };
          }
          return prevState;
        });
      }
      if (respApi.status === 200) return true;
      return false;
    } catch (e) {
      setDateState('error');
      message.error(`No se pudo actualizar la información. ${e.message}`);
      //console.log('Error updateScheduleDeliveryWithQuote', e.message);
      return false;
    }
  };

  // Actualiza la fecha estimada de entrega
  const estimatedDateDelivery = async (idDelivery: number, date: string) => {
    try {
      setDateState('validating');
      const respApi = await deliveryRepository.updateEstimatedDateDelivery(
        idDelivery,
        date
      );
      if (respApi) {
        setDateState('success');
        //console.log('True updateScheduleDeliveryWithQuote', respApi);
        dataRow.setDataToTable((prevState) => {
          //console.log('prevState', prevState);
          const copia = prevState;
          const index = copia.findIndex((dt) => dt.idQuote === dataRow.idQuote);
          //console.log('index', index);
          if (index > -1) {
            const actualDel = copia[index].delivery!;
            actualDel.estimatedDeliveryDate = date;
            copia[index].delivery = actualDel;
            return [...copia];
          }
          return prevState;
        });
        if (setLead) {
          setLead((prevState: any) => {
            const copiaLead = prevState;
            const indexQuote = copiaLead.quotes?.findIndex(
              (quo: any) => quo.id === dataRow.idQuote
            );
            if (typeof indexQuote === 'number' && indexQuote > -1) {
              const actualDel = copiaLead.quotes[indexQuote].delivery;
              actualDel.estimatedDeliveryDate = date;
              copiaLead.quotes[indexQuote].delivery = actualDel;
              return { ...copiaLead };
            }
            return prevState;
          });
        }
        return true;
      }
      setDateState('error');
      //console.log('False estimatedDateDelivery', respApi);
      return false;
    } catch (e) {
      setDateState('error');
      //console.log('Error estimatedDateDelivery', e.message);
      return false;
    }
  };

  const validateDate = () => {
    const timeA = moment().format('HH');
    const timeEdit: any = [18, 19, 20, 21, 22, 23];
    const timeDif: any = [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23];
    let timeD: number = 0;
    const myD = moment(moment()).format('dddd');
    if (myDateT === myD) {
      if (parseInt(timeA) <= 8) {
        timeD = 8;
      } else {
        timeD = parseInt(timeA);
      }
      // eslint-disable-next-line no-plusplus
      for (let index = timeD; index >= 0; --index) {
        timeEdit.push(index);
      }
      return timeEdit;
    }
    // eslint-disable-next-line no-plusplus

    return timeDif;
  };

  /*******************************RETURN***************************************/

  return (
    <>
      <Form initialValues={{ fecha: dateValue }}>
        <Form.Item
          hasFeedback
          validateStatus={dateState}
          style={{ margin: 0 }}
          name="fecha"
        >
          <DatePicker
            disabled={
              (isEstimated
                ? false
                : dataRow.okDocuments &&
                  dataRow.delivery?.scheduleDelivery !== null) ||
              !!lead?.saleDown
            }
            style={{ width: '100%' }}
            showTime
            onSelect={(value) => {
              const myDay = moment(value).format('dddd');
              setMyDateT(myDay);
            }}
            disabledHours={() => validateDate()}
            disabledDate={(current: any) => {
              if (
                current &&
                isEstimated &&
                current < moment().add(-3, 'day').endOf('day')
              ) {
                return true;
              }
              if (
                current &&
                !isEstimated &&
                (current > moment().endOf('day') ||
                  current < moment().add(-3, 'day').endOf('day'))
              ) {
                return true;
              }
              return false;
            }}
            onChange={async (value, dateString) => {
              if (!value) {
                setDateState('error');
                return;
              }
              if (!isEstimated) {
                const respDate = await insertScheduleDeliveryWithQuote(
                  dataRow.idQuote,
                  {
                    state: '',
                    date: dateString,
                    location: '',
                  }
                );
                if (respDate) {
                  setDateValue(value);
                }
              } else {
                const respDate = estimatedDateDelivery(
                  dataRow.delivery!.id!,
                  dateString
                );
                if (respDate) {
                  setDateValue(value);
                }
              }
            }}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default DateStates;
