/* eslint-disable camelcase */
import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { Modal, Button, Table, notification, message, Spin } from 'antd';
import { ClientLeadContext } from '../../../components/GetClientData';
import auth from '../../../utils/auth';
import Quotes from '../../../data/models/Quotes';
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
  margen: number;
  key?: string;
}

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

const ReservationVIN: FunctionComponent<{ quoteId: number }> = ({
  quoteId,
}) => {
  ///Contexto del LEAD y el CLIENT
  const { lead, setLead } = useContext(ClientLeadContext);
  const [loadingLiberate, setloadingLiberate] = useState<boolean>(false);
  const user = auth.user!;

  const liberateVin = async () => {
    setloadingLiberate(true);
    // eslint-disable-next-line prefer-const
    let liberate: AxiosResponse<any> | null = null;
    try {
      liberate = await getApi('/api/v1/CRM/catalog/vin/liberate', {
        quoteId,
      });
    } catch (error) {
      //console.log('Error en liberar VIN');
    }
    //const liberate: any = true;

    //console.log('APIIII', liberate);
    setloadingLiberate(false);

    if (!liberate || (liberate && liberate.data === null)) {
      message.error('No se pudo liberar el vin');
      return;
    }

    message.success('Vin liberado');
    if (setLead) {
      setLead((prevState: Leads) => {
        const copia = prevState;
        const indexQuo = copia.quotes?.findIndex((quo) => quo.id === quoteId);
        if (typeof indexQuo === 'number' && indexQuo > -1) {
          copia.quotes![indexQuo].vimVehiculo = null;
          //copia.quotes![indexQuo].closed = false;
          copia.quotes![indexQuo].vimVehiculoData = null;
          //Si existe una prefactura
          if (copia.prebill && copia.prebill.length > 0) {
            copia.prebill = [];
          }
          //console.log('NEGOCIO ACTUAL', copia);
          return { ...copia };
        }

        return prevState;
      });
    }
  };

  const actualQuote = lead?.quotes?.find((quo) => quo.id === quoteId);
  //ajuste bloquear liberar VIM para el jefe de ventas cuando ya tiene aprobada prefactura.
  const buttonDisabled = !!actualQuote?.delivery;

  if (!actualQuote) {
    return <span>No existe Quote</span>;
  }
  return (
    <div>
      {actualQuote!.vimVehiculo ? (
        <div style={{ display: 'flex' }}>
          <span>{actualQuote?.vimVehiculo}</span>
          {user?.role === 'JEFE DE VENTAS' && (
            <Button
              loading={loadingLiberate}
              type="primary"
              size="small"
              style={{ marginLeft: 5 }}
              onClick={liberateVin}
              disabled={buttonDisabled || !!lead?.saleDown}
            >
              Liberar VIN
            </Button>
          )}
        </div>
      ) : (
        <ButtonModal actualQuote={actualQuote} />
      )}
    </div>
  );
};

const ButtonModal: FunctionComponent<{ actualQuote: Quotes }> = ({
  actualQuote,
}) => {
  const { lead } = useContext(ClientLeadContext);
  const [modal, setModal] = useState<boolean>(false);

  const closeModal = () => setModal(false);
  const openModal = () => setModal(true);
  return (
    <>
      <Button size="small" onClick={openModal} disabled={!!lead?.saleDown}>
        Asignar
      </Button>
      <Modal
        visible={modal}
        centered
        onCancel={closeModal}
        footer={false}
        width={850}
      >
        {modal && <ContentModalVIN actualQuote={actualQuote} />}
      </Modal>
    </>
  );
};

const ContentModalVIN: FunctionComponent<{ actualQuote: Quotes }> = ({
  actualQuote,
}) => {
  const { lead, setLead } = useContext(ClientLeadContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [avalibleVehicles, setAvalibleVehicles] = useState<AvalibleVehicle[]>(
    []
  );
  const [actualVIN, setActualVIN] = useState<any>(null);

  const getAvalibleVehicles = async () => {
    try {
      const codigo = actualQuote!.vehiculo![0].code!;
      if (lead?.concesionario?.code === undefined) {
        throw new Error('No Existe concesionario');
      }
      const body = {
        codigo,
        //concesionario: parseInt(lead.sucursal.code),
        concesionario: lead.concesionario.code,
        exonerado: actualQuote.exonerated ? 1 : 0,
      };

      const response: any = await getApi(
        '/api/v1/CRM/catalog/AvalibleVehicles',
        body
      );
      //console.log('getAvalibleVehicles', response, codigo);
      return response.data.data;
    } catch (err) {
      //console.error(err.message);
      return false;
    }
  };

  const componendidmout = async () => {
    setLoading(true);
    const data = await getAvalibleVehicles();
    //console.log('RENDER TABLA, VIN', data);
    if (data) {
      setAvalibleVehicles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    componendidmout();
  }, []);

  const reserveVehicle = async (vinSelected: any) => {
    try {
      setLoading(true);
      //console.log('vinSelected', vinSelected);
      const codigo = actualQuote!.vehiculo![0].code!;
      const body = {
        concesionario: lead?.concesionario?.code,
        codigo,
        quoteId: actualQuote!.id!,
        vehicleData: { ...vinSelected, createdAt: moment().format() },
        exonerado: actualQuote?.exonerated ? 1 : 0,
      };
      let respVIN: AxiosResponse<any> | null = null;
      try {
        respVIN = await getApi('/api/v1/CRM/catalog/vin/assign', body);
      } catch (error) {
        //console.log('Error al asignar VIN');
      }

      //console.log('respVIN----', respVIN);
      if (respVIN && respVIN.status === 200) {
        notification.success({
          message: `VIN ${vinSelected.vin} reservado`,
        });
        setLoading(false);
        if (setLead) {
          setLead((prevState: Leads) => {
            const copia = prevState;
            const indexQuo = copia.quotes?.findIndex(
              (quo) => quo.id === actualQuote.id
            );
            if (typeof indexQuo === 'number' && indexQuo > -1) {
              copia.quotes![indexQuo].vimVehiculo = vinSelected.vin;
              copia.quotes![indexQuo].vimVehiculoData = body.vehicleData;
              return { ...copia };
            }
            return prevState;
          });
        }
      } else {
        notification.error({
          message: 'Error al asignar VIN',
        });
        setLoading(false);
      }
    } catch (error) {
      //console.log('ERROR EN reserveVehicle', error.message);
      notification.error({
        message: 'Error al asignar VIN',
      });
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <h3 className="quote space-bottom-20">Vehículos disponibles</h3>
      <TableVIN
        avalibleVehicles={avalibleVehicles}
        //setVimSelected={reserveVehicle}
        setVimSelected={setActualVIN}
      />

      <Button
        disabled={!actualVIN || !!lead?.saleDown}
        type="primary"
        onClick={() => {
          //console.log('actual VIN', actualVIN);
          const myVin = { ...actualVIN };
          //console.log('myVin before', myVin);
          delete myVin.key;
          //console.log('myVin after', myVin);
          reserveVehicle(myVin);
        }}
      >
        Asignar
      </Button>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(255, 255, 255, 0.6)',
          }}
        >
          <Spin />
        </div>
      )}
    </div>
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
  //ACTUAL ROW
  const [actualRow, setActualRow] = useState<AvalibleVehicle | null>(null);

  /******************************GENERALFUNCTION*******************************/

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
          array.findIndex((arrayValue) => {
            return JSON.stringify(arrayValue) === JSON.stringify(presentValue);
          }) === indexPresent
        );
      });
  }

  /******************************HOOKS*****************************************/

  useEffect(() => {
    console.log('degub_RESERVATION_0', avalibleVehicles, 1);
    const data = avalibleVehicles
      .filter((av) => av.estado !== 'RESERVADO')
      .map((aV, index) => ({
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
  }, [avalibleVehicles]);

  /*******************************TABLESTRUCT**********************************/

  return (
    <Table
      pagination={{ position: ['bottomRight'], defaultPageSize: 5 }}
      onRow={(record, rowIndex) => {
        //ant-table-row-selected
        return {
          onClick: () => {
            //console.log('CLICK', record);
            setActualRow(record);
            setVimSelected(record);
          }, // click row
        };
      }}
      rowClassName={(record, index) => {
        //console.log('record rowClassName', record, index);
        if (actualRow?.key === record.key) {
          return 'ant-table-row-selected cursor-pointer';
        }
        return 'cursor-pointer';
      }}
      /* rowSelection={{
        type: 'radio',
        ...rowSelection,
      }} */
      columns={[
        {
          title: 'Color',
          dataIndex: 'color',
          key: 'color',
          filters: dataColor,
          filterMultiple: true,
          onFilter: (value: any, record: any) => {
            return record.color.indexOf(value) === 0;
          },
          sorter: (a: any, b: any) => a.color.length - b.color.length,
        },
        {
          title: 'Concesionario',
          dataIndex: 'dealer',
          key: 'dealer',
          filters: dataConcesionario,
          filterMultiple: true,
          onFilter: (value: any, record: any) => {
            return record.dealer.indexOf(value) === 0;
          },
          sorter: (a: any, b: any) => a.dealer.length - b.dealer.length,
        },
        {
          title: 'Sucursal',
          dataIndex: 'sucursal',
          key: 'sucursal',
          filters: dataSucursal,
          filterMultiple: true,
          onFilter: (value: any, record: any) => {
            return record.sucursal.indexOf(value) === 0;
          },
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
          onFilter: (value: any, record: any) => {
            return record.estado.indexOf(value) === 0;
          },
          sorter: (a: any, b: any) => a.estado.length - b.estado.length,
        },
      ]}
      dataSource={dataTable}
    />
  );
};

export default ReservationVIN;
