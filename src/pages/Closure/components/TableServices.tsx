import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ServiceWithType } from './Closure';
import ServicesModal from './Services';
import { currenyFormat } from '../../../utils/extras';
import { Dependencies } from '../../../dependency-injection';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import Get from '../../../utils/Get';
import Loading from '../../../components/Loading';

interface ItemServices {
  codigo: string;
  descripcion: string;
  exonerado: number;
  forma_pago: string;
  iva: number;
  marcas: string;
  total: number;
  valor: number;
}
export interface ServicesTable {
  nombre: string;
  items: ItemServices[];
}

const TableServices: FunctionComponent<{
  idQuote?: number;
  code?: string;
  actualServices: ServicesTable[];
  setActualServices: Function;
  read?: boolean | null;
  setServicesAmount?: Function | null;
}> = ({
  idQuote,
  actualServices,
  setActualServices,
  code,
  read,
  setServicesAmount,
}) => {
  const [dataSource, setDataSource] = useState<
    {
      key: string;
      product: string;
      code: string;
      //value: string;
      total: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [add, setAdd] = useState<boolean>(false);
  //const [accesoriesExtra, setAccesories] = useState<>(false);
  //const [columns, setColumns] = useState(null);

  useEffect(() => {
    //console.log({ actualServices });

    let totalNumber = 0;
    let subTotalNumber = 0;

    const allServices: any = [];
    actualServices.forEach((catSer) => {
      catSer.items.forEach((itemServ, index) => {
        totalNumber += itemServ.total;
        subTotalNumber += itemServ.valor;
        const itmSer = {
          key: `${catSer.nombre}_${index}`,
          product: itemServ.descripcion,
          type: catSer.nombre,
          code: itemServ.codigo,
          //total: `${currenyFormat(itemServ.total, true)}`,
          total: `${currenyFormat(itemServ.valor, true)}`,
        };
        allServices.push(itmSer);
      });
    });
    //console.log('allServices', allServices);
    setDataSource(allServices);
    setTotal(totalNumber);
    setSubTotal(subTotalNumber);
    if (setServicesAmount) {
      setServicesAmount(subTotalNumber);
    }
    //console.log('ENTRO RERENDER', dataSource);
  }, [actualServices]);

  return (
    <div className="my-2">
      {dataSource.length > 0 ? (
        <>
          <Table
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: 370 }}
            columns={[
              { title: 'Servicios', dataIndex: 'product', key: 'product' },
              { title: 'Tipo', dataIndex: 'type', key: 'type' },
              { title: 'Subtotal', dataIndex: 'total', key: 'total' },
              {
                title: '',
                dataIndex: 'delete',
                key: 'delete',
                render: (text, record: any) => {
                  //console.log(text, record);
                  return (
                    <Button
                      danger
                      shape="circle"
                      onClick={() => {
                        //console.log('RECORD', record);
                        const findCatIndex = actualServices.findIndex(
                          (actSer) => actSer.nombre === record.type
                        );
                        if (findCatIndex > -1) {
                          const itemIndex = actualServices[
                            findCatIndex
                          ].items.findIndex((itm) => {
                            return (
                              itm.codigo === record.code &&
                              itm.descripcion === record.product
                            );
                          });
                          if (itemIndex > -1) {
                            setDataSource((data) => {
                              const repo = data;
                              const indexData = repo.findIndex((dataTable) => {
                                return (
                                  dataTable.code === record.code &&
                                  dataTable.total === record.total
                                );
                              });
                              if (indexData) {
                                repo.splice(indexData, 1);
                                return [...repo];
                              }
                              return data;
                            });
                            setActualServices((prevState: any) => {
                              const repo = prevState;
                              if (repo[findCatIndex].items.length === 1) {
                                repo.splice(findCatIndex, 1);
                              } else {
                                repo[findCatIndex].items.splice(itemIndex, 1);
                              }
                              return [...repo];
                            });
                          }
                        }

                        /* const findSerIndex = actualServices.findIndex(
                          (actSer) => actSer.code === record.code
                        );
                       //console.log({ findSerIndex });
                        if (findSerIndex >= 0) {
                          const respaldoActSer = actualServices;
                          respaldoActSer.splice(findSerIndex, 1);
                          setActualServices([...respaldoActSer]);
                        } */
                        /* setactualServices((prevState2: Accesories[]) => {
                          const newArray = [...prevState2];

                          const findIndex = newArray.findIndex(
                            (el) => el.name === record.product
                          );
                         //console.log({ newArray, findIndex });
                          if (findIndex >= 0) {
                            const nuevoArray = newArray.splice(findIndex, 1);
                           //console.log('RESULT newArray', {
                              arrayARetornar: newArray,
                              nuevoArray,
                            });
                            return newArray;
                          }
                          return prevState2;
                        }); */
                        /* setDataSource((prevState2: any[]) => {
                          const findIndex = prevState2.findIndex(
                            (el) => el.product === record.product
                          );
                         //console.log({ findIndex });
                          if (findIndex >= 0) {
                            const nuevoArray = [...prevState2];
                           //console.log('ANTES RESULT newArray', {
                              nuevoArray,
                            });
                            nuevoArray.splice(findIndex, 1);
                           //console.log('RESULT newArray', {
                              nuevoArray,
                            });
                            return nuevoArray;
                          }
                          return prevState2;
                        }); */
                      }}
                      disabled={!!read}
                    >
                      X
                    </Button>
                  );
                },
              },
            ]}
          />
          <div className="text-right mt-4">
            <div className="">
              <b className="mx-2 text-base">
                Subtotal: {currenyFormat(total / 1.12, true)}
              </b>
            </div>
            <div className="">
              <b className="mx-2 text-base">
                Total: {currenyFormat(total, true)}{' '}
                <span className="text-sm">Inc. IVA</span>
              </b>
            </div>
          </div>
        </>
      ) : null}

      {!read ? (
        <div className="inline">
          <Button
            type="primary"
            ghost
            size="small"
            onClick={() => setAdd((prevState: boolean) => !prevState)}
            style={{ marginRight: 5 }}
            icon={<PlusOutlined />}
          >
            Agregar servicio
          </Button>
          {/* {!brand && (
            <Button
              type="primary"
              onClick={async () => {
               //console.log('ACTUAL SERVICES', actualServices);

                const servicesType = actualServices.map((serv) => serv.type);
                //const servicesType = exampleServ.map((serv) => serv.type);
                const unicosType: string[] = [];
                servicesType.forEach((tipo: string) => {
                  const ele = unicosType.find((uni) => uni === tipo);
                  if (!ele) {
                    unicosType.push(tipo);
                  }
                });

                //hacer las categorias
                const mainJson: any = {};
                unicosType.forEach((type) => {
                  mainJson[type] = [];
                });

                //filtrar elementos
                unicosType.forEach((type) => {
                  //const filterServices = exampleServ.map((serv) => serv.type);
                  const filterServices = actualServices
                    .filter((serv) => serv.type === type)
                    .map((ser) => ({
                      brands: ser.brands,
                      code: ser.code,
                      exonerated: ser.exonerated,
                      iva: ser.iva,
                      name: ser.name,
                      quantity: ser.quantity,
                      total: ser.value,
                      value: ser.value,
                      wayToPay: ser.wayToPay,
                    }));
                  mainJson[type] = filterServices;
                });
                setLoading(true);
                const resp = await quotesRepository.updateServicesByIdQuote(
                  idQuote!,
                  [mainJson]
                );
               //console.log({ servicesType, unicosType, mainJson });
                setLoading(false);
                if (resp) {
                  message.success('Servicios actualizados');
                  return;
                }
                message.error('No se pudo actualizar los servicios');
              }}
            >
              Guardar
            </Button>
          )} */}
        </div>
      ) : null}

      <Modal
        title="Servicios y otros"
        visible={add}
        onCancel={() => setAdd((prevState: boolean) => !prevState)}
        footer=""
        width={600}
      >
        {add && (
          <ServicesModal
            idQuote={idQuote}
            actualServices={actualServices}
            setActualServices={setActualServices}
            code={code}
          />
        )}
      </Modal>
      <Loading visible={loading} />
    </div>
  );
};

export default TableServices;
