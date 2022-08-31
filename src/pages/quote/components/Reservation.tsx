/* eslint-disable dot-notation */
/* eslint-disable quotes */
/* eslint-disable camelcase */
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button, message, Modal, Result, Table } from 'antd';
import axios from 'axios';
import auth from '../../../utils/auth';
import Loading from '../../../components/Loading';
import { ClientLeadContext } from '../../../components/GetClientData';
import moment from 'moment';
import Leads from '../../../data/models/Leads';

interface AvalibleVehicle {
  codigo: string;
  descripcion: string;
  concesionario: number;
  concesionario_nombre: string;
  id_color: number;
  stock: number;
  color: string;
  dealer: string;
  sucursal: string;
  estado: string;
}

const Reservation: FunctionComponent<{
  codigo: string;
  quoteId: number;
  disabledReserveButton: boolean;
  reliceVehicleView: boolean;
  setVin: Function;
  setReliceVehicleView: Function;
  vin: any[] | null;
  setVehiclesToShow?: Function;
}> = ({
  codigo,
  quoteId,
  disabledReserveButton,
  reliceVehicleView,
  setVin,
  setReliceVehicleView,
  vin,
  setVehiclesToShow,
}) => {
  const { lead, setLead } = useContext(ClientLeadContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [vimSelected, setVimSelected] = useState<any>(null);
  const [vimLocal, setVimLocal] = useState<any | null>(null);
  const [avalibleVehicles, setAvalibleVehicles] = useState<AvalibleVehicle[]>(
    []
  );

  const getApi = async (url: string, body: any) => {
    const token = await auth.getAccessToken();
    const response = await axios({
      url: `${process.env.REACT_APP_API_URL}${url}`,
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
        token,
      },
    });

    return response;
  };

  const getAvalibleVehicles = async () => {
    try {
      if (lead?.concesionario?.code === undefined) {
        throw new Error('No Existe concesionario');
      }
      const body = {
        codigo,
        //concesionario: parseInt(lead.sucursal.code),
        concesionario: lead.concesionario.code,
      };

      const response: any = await getApi(
        '/api/v1/CRM/catalog/AvalibleVehicles',
        body
      );
      //console.log('getAvalibleVehicles', response, codigo);
      return response.data.data;
    } catch (err) {
      setLoading(false);
      //console.error(err.message);
      return false;
    }
  };

  const componentdidmount = async () => {
    if (vin) {
      let exist = false;
      await vin.map((vinItem: any) => {
        if (vinItem.quoteId === quoteId) {
          setVimLocal(vinItem);
          exist = true;
        }
        return vinItem;
      });
      if (!exist) {
        const avalibleVehiclesList: any = await getAvalibleVehicles();
        if (avalibleVehiclesList) {
          setAvalibleVehicles(avalibleVehiclesList);
          //console.log('avalibleVehiclesList', avalibleVehiclesList);
        }
      }
    }
  };

  useEffect(() => {
    //console.log('VIN RESERVATION', vin);
    componentdidmount();
  }, []);

  const ReserveVehicle = async (vehicleData: any) => {
    //console.log('log1');
    setLoading(true);
    try {
      const body = {
        concesionario: vehicleData.concesionario,
        codigo,
        quoteId,
        vehicleData: { ...vehicleData, createdAt: moment().format() },
      };
      //console.log({ body });
      const response = await getApi('/api/v1/CRM/catalog/vin/assign', body);
      //console.log('response', response);
      ////const myVin: any = response.data.data[0].vin;
      const myVin: any = vehicleData.vin;
      //const myVin: any = 'PERRO';
      const newState = { vin: myVin, quoteId };
      setVimLocal(newState);
      setVin((prevState: any) => [...prevState, newState]);
      setReliceVehicleView(true);
      //console.log('log2');
      if (setVehiclesToShow) {
        //console.log('log3');
        let newQuotes: any = null;
        setVehiclesToShow((prevState: any) => {
          const actualQuoteIndex = (prevState as any[]).findIndex(
            (quo) => quo.id === quoteId
          );
          //console.log('log4');
          //console.log({ actualQuoteIndex });
          if (actualQuoteIndex > -1) {
            const beforeQuotes = prevState;
            beforeQuotes[actualQuoteIndex] = {
              ...beforeQuotes[actualQuoteIndex],
              //vimVehiculo: 'PERRO',
              vimVehiculo: myVin,
              vimVehiculoData: vehicleData,
            };
            //console.log({ beforeQuotes });
            newQuotes = [...beforeQuotes];
            return [...beforeQuotes];
          }
          return prevState;
        });
        //console.log('log5');
        if (setLead && newQuotes !== null) {
          //console.log('log6');
          setLead((prevLead: any) => ({ ...prevLead, quotes: newQuotes }));
        }
      }
      //console.log('response VIN', response.data.data);
      message.success('Hemos asignado el Vin');
      setLoading(false);
      //return response.data.data;
    } catch (err) {
      setLoading(false);
      //console.error(err.message);
      message.error('No se pudo reservar, vuelva a intentar.');
      return false;
    }
  };

  const ReliceVehicle = async () => {
    setLoading(true);
    try {
      const body = {
        quoteId,
      };
      /* const response = await getApi(
        '/api/v1/CRM/catalog/vin/liberate',
        body
      ); */

      if (setVehiclesToShow) {
        setVehiclesToShow((prevState: any) => {
          const newState = prevState.map((item: any) => {
            const newItem = item;
            if (quoteId === item.id) {
              newItem.vimVehiculo = null;
              newItem.vimVehiculoData = null;
            }
            return newItem;
          });
          return [...newState];
        });
      }

      if (setLead) {
        setLead((prevState: Leads) => {
          const copia = { ...prevState };
          const newQuotes = prevState.quotes?.map((quo) => {
            const newQuo = quo;
            if (newQuo.id === quoteId) {
              newQuo.vimVehiculo = null;
              newQuo.vimVehiculoData = null;
            }
            return newQuo;
          });
          copia.quotes = newQuotes;
          return copia;
        });
      }

      setModal(false);
      setReliceVehicleView(false);
      setVin([]);
      setVimLocal(null);
      message.success('Vehiculo liberado');
      setLoading(false);
      //return response.data.data;
    } catch (err) {
      setLoading(false);
      //console.error(err.message);
      message.error('No se pudo liberar el vehículo.');
      //return false;
    }
  };

  const closeModal = () => {
    setModal(false);
    setVimSelected(null);
  };

  const openModal = () => {
    setModal(true);
  };

  return (
    <>
      {reliceVehicleView ? null : (
        <>
          <Modal
            visible={modal}
            centered
            onCancel={closeModal}
            footer={false}
            width={850}
          >
            {vimLocal ? (
              <Result
                status="success"
                title={`Hemos reservado el VIN ${vimLocal.vin}`}
              />
            ) : (
              <div>
                <h3 className="quote space-bottom-20">Vehículos disponibles</h3>
                {/* {avalibleVehicles.map((option, index) => (
                  <div
                    onClick={() => {
                     //console.log('index', index);
                      setVimSelected(index);
                    }}
                    key={index}
                    className="vim"
                    style={{
                      backgroundColor: `${
                        vimSelected === index ? '#e6f7ffc4' : ''
                      }`,
                      marginTop: '10px',
                      cursor: 'pointer',
                      padding: 20,
                    }}
                  >
                    <div>
                      <span className="font-weight-bold">Código:</span>
                      {option.codigo}
                    </div>
                    <div>
                      <span className="font-weight-bold">Descripción:</span>
                      {option.descripcion}
                    </div>
                    <div>
                      <span className="font-weight-bold">Concesionario:</span>
                      {option.concesionario_nombre}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span className="font-weight-bold">Color:  </span>
                      <div
                        className={`color${option.id_color} w-4 h-4 border-radius-50 outline-none`}
                      />
                        {option.color} 
                    </div>
                  </div>
                ))} */}
                <TableVIN
                  avalibleVehicles={avalibleVehicles}
                  setVimSelected={setVimSelected}
                />
                <div className="space-top-20">
                  <Button
                    type="primary"
                    disabled={!(vimSelected !== null)}
                    onClick={async () => {
                      /* const vehicleData: any = await avalibleVehicles.find(
                        (el, index) => index === vimSelected
                      ); */
                      //console.log('vimSelected', vimSelected);
                      ReserveVehicle(vimSelected);
                    }}
                  >
                    Asignar
                  </Button>
                </div>
              </div>
            )}
          </Modal>
          {!vimLocal ? (
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => openModal()}
              disabled={disabledReserveButton}
              //icon={<CarOutlined />}
            >
              Asignar
            </Button>
          ) : (
            <div>
              {vimLocal.vin}
              <Button
                type="primary"
                size="small"
                disabled={!!lead?.prebill && lead?.prebill.length > 0}
                style={{ marginLeft: 5 }}
                onClick={() => {
                  ReliceVehicle();
                }}
              >
                Liberar VIN
              </Button>
            </div>
          )}
        </>
      )}
      <Loading visible={loading} />
    </>
  );
};

const TableVIN: FunctionComponent<{
  avalibleVehicles: AvalibleVehicle[];
  setVimSelected: Function;
}> = ({ avalibleVehicles, setVimSelected }) => {
  /******************************INTERFAZ**************************************/
  // OPCIONES DE FILTROS EN LA TABLA
  interface dataFilter {
    text: string;
    value: string;
  }

  /*****************************ESTADO*****************************************/

  // SETEA LOS DATOS DE LA TABLA
  const [dataTable, setDataTable] = useState<any[]>([]);
  // SETEA LOS FILTROS DE COLOR QUE ENCUENTRA EN LA DATA TRAIDA DESDE DB
  const [dataColor, setDataColor] = useState<dataFilter[]>([]);
  // SETEA LOS FILTROS DE Concesionario QUE ENCUENTRA EN LA DATA TRAIDA DESDE DB
  const [dataConcesionario, setDataConcesionario] = useState<dataFilter[]>([]);
  // SETEA LOS FILTROS DE Sucursal QUE ENCUENTRA EN LA DATA TRAIDA DESDE DB
  const [dataSucursal, setDataSucursal] = useState<dataFilter[]>([]);
  // SETEA LOS FILTROS DEL estado QUE ENCUENTRA EN LA DATA TRAIDA DESDE DB
  const [dataEstado, setDataEstado] = useState<dataFilter[]>([]);

  /******************************GENERALFUNCTION*******************************/

  // OPCIÓN PARA MANIPULAR EL NUMERO DE ITEMS EN LA TABLA
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      //console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows
      // );
      if (selectedRows && selectedRows.length === 1) {
        const vehicleSelected = { ...selectedRows[0] };
        //console.log('vehicleSelected 1', vehicleSelected);

        const respDelete = delete vehicleSelected['key'];
        //console.log('respDelete', respDelete);

        //console.log('vehicleSelected 2', vehicleSelected);
        setVimSelected(vehicleSelected);
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  //FUNCION QUE RETORNA LOS DATOS DE FILTRO DE LA TABLA FILTRADOS
  // data, value: COLOR, CONCESIONARIO, SUCURSAL O ESTADO
  function filterFunction(data: AvalibleVehicle[], value: number) {
    return data
      .map((dataMap) => {
        if (value === 0) {
          return {
            text: dataMap.color,
            value: dataMap.color,
          };
        }
        if (value === 1) {
          return {
            text: dataMap.dealer,
            value: dataMap.dealer,
          };
        }
        if (value === 2) {
          return {
            text: dataMap.sucursal,
            value: dataMap.sucursal,
          };
        }
        if (value === 3) {
          return {
            text: dataMap.estado,
            value: dataMap.estado,
          };
        }
        return {
          text: '',
          value: '',
        };
      })
      .filter((presentValue, indexPresent, array) => {
        return (
          array.findIndex(
            (arrayValue) =>
              JSON.stringify(arrayValue) === JSON.stringify(presentValue)
          ) === indexPresent
        );
      });
  }

  /******************************HOOKS*****************************************/

  useEffect(() => {
    //console.log('degub_RESERVATION_0', avalibleVehicles, 1);
    const data = avalibleVehicles.map((aV, index) => ({
      ...aV,
      key: index.toString(),
    }));
    //console.log('degub_RESERVATION_0', data, 2);

    // DATOS DE LOS COLORES
    const dataColorMap: dataFilter[] = filterFunction(data, 0);

    // DATOS DE LOS CONCESIONARIOS
    const dataConcesionarioMap: dataFilter[] = filterFunction(data, 1);

    // DATOS DE LA SUCURSAL
    const dataSucursalMap: dataFilter[] = filterFunction(data, 2);

    // DATOS DEL ESTADO
    const dataEstadoMap: dataFilter[] = filterFunction(data, 3);

    setDataTable(data);
    setDataColor(dataColorMap);
    setDataConcesionario(dataConcesionarioMap);
    setDataSucursal(dataSucursalMap);
    setDataEstado(dataEstadoMap);
  }, []);

  /*******************************TABLESTRUCT**********************************/

  return (
    <Table
      pagination={{ position: ['bottomRight'], defaultPageSize: 5 }}
      rowSelection={{
        type: 'radio',
        ...rowSelection,
      }}
      columns={[
        {
          title: 'Color',
          dataIndex: 'color',
          key: 'color',
          filters: dataColor,
          filterMultiple: true,
          onFilter: (value: any, record: any) =>
            record.color.indexOf(value) === 0,
          sorter: (a: any, b: any) => a.color.length - b.color.length,
        },
        {
          title: 'Concesionario',
          dataIndex: 'dealer',
          key: 'dealer',
          filters: dataConcesionario,
          filterMultiple: true,
          onFilter: (value: any, record: any) =>
            record.dealer.indexOf(value) === 0,
          sorter: (a: any, b: any) => a.dealer.length - b.dealer.length,
        },
        {
          title: 'Sucursal',
          dataIndex: 'sucursal',
          key: 'sucursal',
          filters: dataSucursal,
          filterMultiple: true,
          onFilter: (value: any, record: any) =>
            record.sucursal.indexOf(value) === 0,
          sorter: (a: any, b: any) => a.sucursal.length - b.sucursal.length,
        },
        {
          title: 'VIN',
          dataIndex: 'vin',
        },
        {
          title: 'Estado',
          dataIndex: 'estado',
          key: 'estado',
          filters: dataEstado,
          filterMultiple: true,
          onFilter: (value: any, record: any) =>
            record.estado.indexOf(value) === 0,
          sorter: (a: any, b: any) => a.estado.length - b.estado.length,
        },
      ]}
      dataSource={dataTable}
    />
  );
};

export default Reservation;
