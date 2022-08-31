import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, Button, Modal, Tag, Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import milisecondsToDate from '../../utils/milisecondsToDate';
import { Dependencies } from '../../dependency-injection';
import Get from '../../utils/Get';
import Loading from '../Loading';
import ModalDetail from './ModalDetail';
import ModalForm from './ModalForm';
import Tracings from '../../data/models/Tracings';
import TracingsRepository from '../../data/repositories/tracings-repository';

/******************************GENERALFUNCTION*********************************/

// FECHA ACTUAL DEL SISTEMA
// FECHA ACTUAL DEL SISTEMA RESTA DOS OBJETOS MOMENT
const dateActuallySystem = moment().format('YYYY/MM/DD HH:mm:ss');
const dateOne = moment(dateActuallySystem, 'YYYY/MM/DD HH:mm:ss');

export const outTime = (dateInput: string) => {
  return (
    moment(
      milisecondsToDate(dateInput, 'YYYY/MM/DD HH:mm:ss'),
      'YYYY/MM/DD HH:mm:ss'
    ).diff(dateOne) < 0
  );
};

// eslint-disable-next-line consistent-return
export const getNextTracing = (allTracingaDBInput: Tracings[]) => {
  try {
    //console.log('debugger_4:', allTracingaDBInput);
    //PASO 1: FILTRAR SEGUIMIENTOS OPTIMOS
    // (QUE NO ESTEN CERRADOS, CLOSE DATE: NULL O '')
    const allTracingaDBInputFilter = allTracingaDBInput.filter((dataFilter) => {
      return !dataFilter.closeDate;
    });

    //console.log('debugger_5:', allTracingaDBInputFilter);
    //console.log('debugger_6:', dateActuallySystem);
    //console.log('debugger_7:', allTracingaDBInputFilter
    // .forEach((value) => { console.log(value.executionDate) }));

    //PASO 2: ESCOGER EL PROXIMO SEGUIMIENTO (EL MAS CERCANO A LA FECHA ACTUAL,
    // SI ESTA TARDE ES EL MAS LEJANO)
    const nearTracing = allTracingaDBInputFilter.map((dataMapExecuteDate) => {
      const dateTwo = moment(
        milisecondsToDate(
          dataMapExecuteDate.executionDate!,
          'YYYY/MM/DD HH:mm:ss'
        ),
        'YYYY/MM/DD HH:mm:ss'
      );
      const diffDates = dateTwo.diff(dateOne, 'minutes');
      return { value: dateTwo, diffvalue: diffDates };
    }); //.sort((a) => a.diffvalue)

    //console.log('debugger_9:', nearTracing);
    //console.log('debugger_10:',
    // nearTracing[0].value.format('YYYY/MM/DD HH:mm:ss'
    // ));

    // PASO3: RETORNAR AL OBJETO
    const objectTracing = allTracingaDBInputFilter.filter((data) => {
      const flag = milisecondsToDate(
        data.executionDate!,
        'YYYY/MM/DD HH:mm:ss'
      );
      return flag === nearTracing[0].value.format('YYYY/MM/DD HH:mm:ss');
    });

    //console.log('debugger_10:', objectTracing);

    return objectTracing[0];
  } catch (e) {
    // console.log(
    //   'getNextTracing (El prospecto no tiene próximo segumiento)',
    //   e.message
    // );
  }
};

const TimeLine: FunctionComponent<{
  identification?: string;
  tracingsProps?: Tracings[];
  idLead?: number;
  block?: boolean;
}> = ({ identification, tracingsProps, idLead, block }) => {
  /******************************HOOKS*****************************************/

  const tracingsRepository = Get.find<TracingsRepository>(
    Dependencies.tracings
  );
  // SETEO ARREGLO DE TRACINGS MAPEADOS DESDE LA BASE DE DATOS
  const [allTracingaDB, setAllTracingaDB] = useState<Tracings[]>([]);
  // SETEO OBJETO  NEXT TRACING
  const [nextTracing, setNextTracing] = useState<Tracings>();
  // CUANDO EL PROSPECTO NO TIENE SEGUIMIENTOS, NO MUESTRO LA INTERFAZ
  const [viewCard, setviewCard] = useState<boolean | null>();
  // CUANDO TIENE MAS DE 5 SEGUIMIENTOS MUESTRO SU HISTORIAL DE SEGUIMIENTOS
  const [viewHistory, setviewHistory] = useState<boolean | null>();
  // VENTANA MODAL APRA VER TODOS LOS SEGUIMIENTOS
  const [viewModal, setViewModal] = useState<boolean | null>();
  // ESTADO PARA ACTIVAR EL LOADING SCREEN MIENTRAS OPERA
  const [loading, setLoading] = useState<boolean>(false);

  /******************************GENERALFUNCTIONAPI****************************/

  const setTracingsByUserAndClient = async (identificationInput: string) => {
    setLoading(true);
    const dataAPI:
      | Tracings[]
      | null = await tracingsRepository.getTracingsByUserAndClient(
      identificationInput,
      idLead
    );
    if (dataAPI && dataAPI.length > 0) {
      setviewCard(true);
      if (dataAPI.length > 5) {
        setviewHistory(true);
      } else {
        setviewHistory(false);
      }
      dataAPI!.sort((a, b) => {
        return moment(
          milisecondsToDate(a.executionDate!, 'YYYY/MM/DD HH:mm:ss')
        ).diff(milisecondsToDate(b.executionDate!, 'YYYY/MM/DD HH:mm:ss'));
      });
      setAllTracingaDB(dataAPI!);
      setNextTracing(getNextTracing(dataAPI!));
      setLoading(false);
      return 'ok';
    }
    setviewCard(false);
    setLoading(false);
    return 'El prospecto no tiene seguimientos';
  };

  /******************************HOOKS*****************************************/

  useEffect(() => {
    const componentdidmount = async () => {
      await setTracingsByUserAndClient(identification!);
    };
    componentdidmount();
  }, []);

  /*******************************RETURN***************************************/

  return (
    <>
      {/*TODA LA CARTA DE SEGUIMIENTOS*/}
      {viewCard ? (
        <div className="" style={{ width: 300 }}>
          {/*HISTORIAL*/}
          {viewHistory ? (
            <div>
              <Button
                onClick={() => {
                  setViewModal(true);
                }}
                className="mb-5 ml-5"
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a style={{ textDecoration: 'underline' }}>
                  Ver todo el histórico de segumientos
                </a>
              </Button>
            </div>
          ) : (
            ''
          )}
          {/*FIN HISTORIAL*/}
          <div
            style={{ marginBottom: 14, textAlign: 'center', color: 'black' }}
          >
            <span>
              {moment().startOf('month').add(-3, 'month').format('YYYY/MM/DD')}
            </span>
            <span>
              {' '}
              - {moment().endOf('month').add(3, 'month').format('YYYY/MM/DD')}
            </span>
          </div>
          {/*5 ITEMS*/}
          <Timeline mode="alternate">
            {allTracingaDB &&
              allTracingaDB.slice(-5).map((data, index) => (
                <Timeline.Item
                  color={
                    data.closeDate
                      ? 'blue'
                      : outTime(data.executionDate!)
                      ? 'red'
                      : 'green'
                  }
                  label={milisecondsToDate(
                    data.executionDate!,
                    'YYYY/MM/DD HH:mm:ss'
                  )}
                  key={`index_${index}`}
                >
                  {data && (
                    <ModalDetail
                      tracing={data}
                      setDataTimeLine={setAllTracingaDB}
                    />
                  )}
                </Timeline.Item>
              ))}

            <ModalForm
              indetificationModal={identification!}
              idLead={idLead}
              block={block}
              setDataTimeLine={setAllTracingaDB}
            />
          </Timeline>
          {/*FIN 5 ITEMS*/}

          {/* PROXIMO SEGUIMIENTO */}
          {nextTracing ? (
            nextTracing && (
              <div
                className="bg-white shadow border-black"
                style={{
                  width: 280,
                  height: 170,
                  borderRadius: 20,
                  marginTop: -40,
                  marginLeft: 20,
                }}
              >
                <div className="flex">
                  <div className="text-right pt-5 text-black pr-2 pl-4">
                    <ClockCircleOutlined />
                  </div>

                  <div className="pt-4">
                    <p className="pt-2 font-bold text-black">
                      Próximo Seguimiento
                    </p>

                    <p className="mb-0 text-xs ">
                      <strong>Fecha de ejecución: </strong>
                      <span
                        className={
                          outTime(nextTracing.executionDate!)
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      >
                        {milisecondsToDate(
                          nextTracing.executionDate!,
                          'YYYY/MM/DD HH:mm:ss'
                        )}
                      </span>
                    </p>
                    <p className="mb-0 text-xs">
                      <strong>Prioridad: </strong>
                      <span className="mb-0 text-xs">
                        <Tag
                          color={`${
                            nextTracing.priority === 'Alta'
                              ? 'red'
                              : nextTracing.priority === 'Baja'
                              ? 'blue'
                              : ''
                          }`}
                        >
                          {nextTracing.priority}
                        </Tag>
                      </span>
                    </p>
                    <p className="mb-0 text-xs">
                      <strong>Tipo: </strong>
                      {nextTracing.type}
                    </p>
                    <p className="mb-0 text-xs ">
                      <strong>Motivo: </strong>
                      <span className="mb-0 text-xs">
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
                      </span>
                    </p>
                  </div>

                  <div className="pt-4 col-span-2 text-center">
                    <Tag
                      color={
                        outTime(nextTracing.executionDate!) ? 'red' : 'green'
                      }
                    >
                      {outTime(nextTracing.executionDate!)
                        ? 'Tarde'
                        : 'A tiempo'}
                    </Tag>
                  </div>
                </div>
              </div>
            )
          ) : (
            <Alert
              className="mt-5 text-center"
              message="El prospecto no tiene próximos seguimientos"
              type="warning"
            />
          )}
          {/* FIN PROXIMO SEGUIMIENTO */}
        </div>
      ) : (
        <ModalForm
          indetificationModal={identification!}
          idLead={idLead}
          block={block}
        />
      )}
      {/*FIN CARTA DE SEGUIMIENTOS*/}

      {/*MODAL HISTORIAL DEL SEGUIMIENTO*/}
      <Modal
        title="Historial de seguimientos"
        visible={viewModal!}
        onOk={() => {
          setViewModal(false);
        }}
        onCancel={() => {
          setViewModal(false);
        }}
        footer={false}
      >
        <Timeline mode="alternate">
          {allTracingaDB &&
            allTracingaDB.map((data, index) => (
              <Timeline.Item
                color={
                  data.closeDate
                    ? 'blue'
                    : outTime(data.executionDate!)
                    ? 'red'
                    : 'green'
                }
                label={milisecondsToDate(
                  data.executionDate!,
                  'YYYY/MM/DD HH:mm:ss'
                )}
                key={`index_${index}`}
              >
                <ModalDetail
                  tracing={data}
                  setDataTimeLine={setAllTracingaDB}
                />
              </Timeline.Item>
            ))}
        </Timeline>
      </Modal>
      {/*FIN MODAL HISTORIAL DEL SEGUIMIENTO*/}

      <Loading visible={loading} />
    </>
  );
};

export default TimeLine;
