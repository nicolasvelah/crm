/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import { currenyFormat } from '../../../utils/extras';
import ServicesModalPublic from './ServicesModalPublic'

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

const TableServicesPublic: FunctionComponent<{
  actualServices: ServicesTable[];
  setActualServices: Function;
  read?: boolean | null;
  code?: string;
  setServicesAmount?: Function | null;
}> = ({ actualServices, setActualServices, read, code, setServicesAmount }) => {
  const [dataSource, setDataSource] = useState<
    {
      key: string;
      product: string;
      code: string;
      //value: string;
      total: string;
    }[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [add, setAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [subTotal, setSubTotal] = useState<number>(0);
  
  useEffect(() => {
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
          total: `${currenyFormat(itemServ.valor, true)}`,
        };
        allServices.push(itmSer);
      });
    });
    setDataSource(allServices);
    setTotal(totalNumber);
    setSubTotal(subTotalNumber);
    if (setServicesAmount) {
      setServicesAmount(subTotalNumber);
    }
  }, [actualServices]);
  return (
    <>
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
                  render: (text: any, record: any) => {
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
                                const indexData = repo.findIndex(
                                  (dataTable) => {
                                    return (
                                      dataTable.code === record.code &&
                                      dataTable.total === record.total
                                    );
                                  }
                                );
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
            <ServicesModalPublic
              actualServices={actualServices}
              setActualServices={setActualServices}
              code={code}
            />
          )}
        </Modal>
        <Loading visible={loading} />
      </div>
    </>
  );
};

export default TableServicesPublic;
