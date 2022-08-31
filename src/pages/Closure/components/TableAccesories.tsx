import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AccesoriesModal from './Accesories';
import { Accesories } from '../../../data/models/Quotes';
import { Dependencies } from '../../../dependency-injection';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import Get from '../../../utils/Get';
import { AccesoriesInput } from '../../../data/providers/apollo/mutations/quotes';
import Loading from '../../../components/Loading';
import { currenyFormat } from '../../../utils/extras';

const TableAccesories: FunctionComponent<{
  idQuote?: number;
  actualAccessories: Accesories[];
  setActualAccessories: Function;
  setAccesoriesAmount?: Function | null;
  paramsToFind?: {
    brand: string;
    code: string;
    model: string;
  };
  read?: boolean | null;
}> = ({
  idQuote,
  actualAccessories,
  setActualAccessories,
  paramsToFind,
  read,
  setAccesoriesAmount,
}) => {
  const quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const [dataSource, setDataSource] = useState<
    {
      key: string;
      product: string;
      value: string;
      quantity: number;
      total: string;
    }[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [add, setAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  //const [accesoriesExtra, setAccesories] = useState<>(false);
  //const [columns, setColumns] = useState(null);
  useEffect(() => {
    //console.log({ actualAccessories });
    let totalNumber = 0;
    const mapArray = actualAccessories.map((pro, index) => {
      totalNumber += pro.cost! * pro.quantity!;
      return {
        key: `${index}`,
        product: pro.name!,
        value: `$${pro.cost}`,
        quantity: pro.quantity!,
        total: `${pro.cost! * pro.quantity!}`,
      };
    });
    setTimeout(() => {
      setDataSource(mapArray);
      setTotal(totalNumber); //Va a base rle total con IVA
      //console.log('ENTRO RERENDER', dataSource);
      if (setAccesoriesAmount) {
        setAccesoriesAmount(totalNumber);
      }
    }, 0);
  }, [actualAccessories]);

  const updateAccesories = async () => {
    //console.log('idQuote', idQuote);
    //console.log('ACTUAL ACCESORIES', actualAccessories);
    const accesoriesToUpdate: AccesoriesInput[] = actualAccessories.map(
      (acc) => ({
        code: acc.code!,
        name: acc.name!,
        cost: acc.cost!,
        dimension: acc.dimension!,
        id: acc.id!,
        id_Vh: acc.id_Vh!,
        brand: acc.brand!,
        model: acc.model!,
        urlPhoto: acc.urlPhoto!,
        quantity: acc.quantity!,
      })
    );
    setLoading(true);
    const resp = await quotesRepository.updateAccesoriesByIdQuote(
      idQuote!,
      accesoriesToUpdate
    );
    setLoading(false);
    if (resp) {
      message.success('Accesorios actualizados');
      return;
    }
    message.error('No se pudo actualizar los accesorios');
  };

  return (
    <div className="my-2">
      {dataSource.length > 0 ? (
        <>
          <Table
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: 370 }}
            columns={[
              { title: 'Accesorios', dataIndex: 'product', key: 'product' },
              { title: '$/U', dataIndex: 'value', key: 'value' },
              { title: 'Cant', dataIndex: 'quantity', key: 'quantity' },
              {
                title: 'Subtotal',
                dataIndex: 'total',
                key: 'total',
                render: (text: string, record) => {
                  return currenyFormat(parseFloat(text), true);
                },
              },
              {
                title: '',
                dataIndex: 'delete',
                key: 'delete',
                render: (text, record) => {
                  //console.log(text, record);
                  return (
                    <Button
                      danger
                      shape="circle"
                      onClick={() => {
                        setActualAccessories((prevState2: Accesories[]) => {
                          const newArray = [...prevState2];

                          const findIndex = newArray.findIndex(
                            (el) => el.name === record.product
                          );
                          //console.log({ newArray, findIndex });
                          if (findIndex >= 0) {
                            const nuevoArray = newArray.splice(findIndex, 1);
                            //console.log('RESULT newArray', {
                            //   arrayARetornar: newArray,
                            //   nuevoArray,
                            // });
                            return newArray;
                          }
                          return prevState2;
                        });
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
                Subtotal: {currenyFormat(total, true)}
              </b>
            </div>
            <div className="">
              <b className="mx-2 text-base">
                Total: {currenyFormat(total * 1.12, true)}{' '}
                <span className="text-sm">Inc. IVA</span>
              </b>
            </div>
          </div>
        </>
      ) : null}

      <div className="text-left mt-4">
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
              Agregar accesorio
            </Button>
            {!paramsToFind && dataSource.length > 0 && (
              <Button type="primary" onClick={updateAccesories}>
                Guardar
              </Button>
            )}
          </div>
        ) : null}
      </div>
      <Modal
        title="Accesorios y otros"
        visible={add}
        onCancel={() => setAdd((prevState: boolean) => !prevState)}
        footer=""
        width={600}
      >
        {add && (
          <AccesoriesModal
            idQuote={idQuote}
            actualAccessories={actualAccessories}
            setActualAccessories={setActualAccessories}
            paramsToFind={paramsToFind}
          />
        )}
      </Modal>
      <Loading visible={loading} />
    </div>
  );
};

export default TableAccesories;
