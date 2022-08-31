/* eslint-disable camelcase */
import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  Spin,
  Tag,
  InputNumber,
  Button,
  message,
  Carousel,
  Tooltip,
  Modal,
  Form,
  Input,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Accesories } from '../../../data/models/Quotes';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import CRMRepository from '../../../data/repositories/CRM-repository';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { currenyFormat, netType } from '../../../utils/extras';
import { ClientLeadContext } from '../../../components/GetClientData';

const AccesoriesModal: FunctionComponent<{
  idQuote?: number;
  actualAccessories: Accesories[];
  setActualAccessories: Function;
  paramsToFind?: {
    brand: string;
    code: string;
    model: string;
  };
}> = ({ idQuote, actualAccessories, setActualAccessories, paramsToFind }) => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [loading, setLoading] = useState<boolean>(true);
  const [accesoryList, setAccesoryList] = useState<
    {
      codigo: string;
      precio: number;
      anio: number;
      descripcion: string;
      dimencion: string;
      id: string;
      marca: string;
      modelo: string;
      urlPhoto: any[];
      urlpdf: any[];
      isAdded: boolean;
      quantity: number;
      es_kit: number;
    }[]
  >([]);
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const [activeRedExterna, setActiveRedExterna] = useState<boolean>(false);
  // VENTANA MODAL APRA VER TODOS LOS SEGUIMIENTOS
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [newElement, setNewElement] = useState<any>();

  const componentdidmount = async () => {
    ///AGREGAR MODELO
    setLoading(true);
    let marca: string = '';
    let codigo: string = '';
    let modelo: string = '';
    //console.log('paramsToFind !!!!', paramsToFind);
    if (!paramsToFind) {
      const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
      const actualQuote = await quouteRepository.getQuoteById(idQuote!);

      //console.log('ACTUAL QUOTE !!!!', actualQuote);
      marca = actualQuote ? actualQuote!.vehiculo![0]!.brand! : 'mazda';
      codigo = actualQuote ? actualQuote!.vehiculo![0]!.code! : 'BFRV-LAE 2020';
      modelo = actualQuote ? actualQuote!.vehiculo![0]!.model! : '';
    } else {
      marca = paramsToFind.brand;
      codigo = paramsToFind.code;
      modelo = paramsToFind.model;
    }

    const queryTestAccessory = { marca, codigo, modelo };
    //console.log(queryTestAccessory);

    //get Accessories
    const getAccessories = await CRMRepository.getAccesories(
      queryTestAccessory
    );
    if (getAccessories) {
      //console.log('✅ Data CRM Accessories', getAccessories);
      const newData = getAccessories.map((acsesorios: any) => {
        const find = actualAccessories.find(
          (dataS) => dataS.name === acsesorios.descripcion
        );
        return {
          ...acsesorios,
          isAdded: !!find,
          quantity: find ? find.quantity : 1,
        };
      });
      const existe = newData.filter((list: any) => list.es_kit === 1);
      //console.log('existe ?', existe);
      setAccesoryList(newData);
    } else {
      message.error('Este modelo no contiene accesorios');
    }

    //get Services
    /* const queryTestServices = { marca: 'mazda' };
        const getServices = await CRMRepository.getServices(
          queryTestServices,
          gucTokenJson.token
        );
        if (getServices) {
         //console.log(
            '✅ Data CRM Services',
            getServices[0].rastreo_satelital
          ); //[{rastreo: [{}]}]
          setServices(getServices[0].rastreo_satelital);
        } */

    setLoading(false);
  };

  useEffect(() => {
    if (netType(lead?.concesionario?.code!).toLowerCase() === 'red externa') {
      setActiveRedExterna(true);
    }
    componentdidmount();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const tailLayout = {
    wrapperCol: { offset: 17 },
  };

  return (
    <div>
      {activeRedExterna && (
        <div style={{ textAlign: 'center', marginBottom: 15 }}>
          <Tooltip title="Añadir accesorio">
            <Button
              className=""
              onClick={() => {
                setViewModal(true);
              }}
              size="small"
              shape="circle"
              type="primary"
              icon={<PlusOutlined />}
            />
          </Tooltip>
        </div>
      )}
      {/*MODAL Añadir Accesorio*/}
      {viewModal && (
        <Modal
          title="Añadir Accesorio"
          visible={viewModal}
          onOk={() => {
            setViewModal(false);
          }}
          onCancel={() => {
            setViewModal(false);
          }}
          footer={false}
        >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            name="basic"
            /* initialValues={{ remember: true }} */
            initialValues={{}}
            onFinish={(values) => {
              //console.log('Values', values);
              const newAccesorio = {
                codigo: values.codigo === undefined ? '' : values.codigo,
                precio: values.precio,
                descripcion: values.descripcion,
                anio: values.anio === undefined ? '' : values.anio,
                dimension:
                  values.dimension === undefined ? '' : values.dimension,
                id: values.id === undefined ? '' : 0,
                marca: values.marca === undefined ? '' : values.marca,
                modelo: values.modelo === undefined ? '' : values.modelo,
                urlPhoto: [],
                urlPdf: [],
                isAdded: false,
                quantity: 1,
              };
              // @ts-ignore
              accesoryList.push(newAccesorio);
              setViewModal(false);
            }}
            onFinishFailed={(errorInfo) => {
              //console.log('Failed:', errorInfo);
            }}
          >
            <Form.Item
              label="Id"
              name="id"
              /*  rules={[{ required: true, message: 'Ingrese id!' }]} */
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Año"
              name="anio"
              /* rules={[{ required: true, message: 'Ingrese año!' }]} */
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Código"
              name="codigo"
              /* rules={[{ required: true, message: 'Ingrese código!' }]} */
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Dimensión"
              name="dimension"
              /*  rules={[{ required: true, message: 'Ingrese dimensión!' }]} */
            >
              <Input placeholder="0.0000 x 0.0000 x 0.0000" />
            </Form.Item>
            <Form.Item
              label="Marca"
              name="marca"
              /*  rules={[{ required: true, message: 'Ingrese marca!' }]} */
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Modelo"
              name="modelo"
              /*  rules={[{ required: true, message: 'Ingrese modelo!' }]} */
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Precio"
              name="precio"
              rules={[{ required: true, message: 'Ingrese precio!' }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[{ required: true, message: 'Ingrese descripción!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Agregar a la lista
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/*FIN MODAL Añadir Accesorio*/}

      {accesoryList.map((acc, index: number) => (
        <div
          key={index}
          className="m-1 p-4 flex justify-between items-center rounded"
          style={{
            backgroundColor: acc.isAdded ? '#F6FFED' : '#f5f8fc',
            borderRadius: 10,
          }}
        >
          <div className="flex flex-col" style={{ width: '33%' }}>
            {acc.isAdded && (
              <div>
                <Tag color="green">Agregado</Tag>
              </div>
            )}
            <b className="leading-tight">{acc.descripcion}</b>
            {acc.urlPhoto.length > 0 ? (
              <Carousel autoplay>
                {acc.urlPhoto.map((item, indexCarousel) => (
                  <img
                    key={indexCarousel}
                    className="w-40 text-center"
                    src={item.link ?? '/img/no-image-found-360x250.png'}
                    alt={acc.descripcion}
                  />
                ))}
              </Carousel>
            ) : null}
          </div>
          <div>
            <div>
              <strong>Código:</strong> {acc.codigo ?? '---'}
            </div>
            <div>
              <strong>Marca:</strong> {acc.marca ?? '---'}
            </div>
            <div>
              <strong>Modelo:</strong> {acc.modelo ?? '---'}
            </div>
            <div>
              <strong>Año:</strong> {acc.anio ?? '---'}
            </div>
            <div>
              <strong>Dimensiones:</strong>{' '}
              {!acc.dimencion || acc.dimencion === '' ? '---' : acc.dimencion}
            </div>
            <div>
              <strong>Precio:</strong> {currenyFormat(acc.precio, true)}
            </div>
            <div>
              <strong>Pvp:</strong> {currenyFormat(acc.precio * 1.12, true)}{' '}
              <span className="text-sm">Inc. IVA</span>
            </div>
            {acc.es_kit === 1 && (
              <div>
                <Tag color="green">Kit</Tag>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between h-full">
            <InputNumber
              min={1}
              max={100}
              disabled={acc.isAdded}
              defaultValue={acc.quantity}
              onChange={(val) => {
                setAccesoryList((prevState) => {
                  const itemsList = [...prevState];
                  itemsList[index].quantity =
                    typeof val === 'string' ? parseInt(val! as string) : val!;
                  return itemsList;
                });
              }}
            />
            <br />
            <br />
            <Button
              type={acc.isAdded ? undefined : 'primary'}
              //disabled={acc.isAdded}
              onClick={() => {
                setAccesoryList((prevState) => {
                  const itemsList = [...prevState];
                  if (acc.isAdded) {
                    itemsList[index].isAdded = false;
                    setActualAccessories((prevState2: Accesories[]) => {
                      const newArray = [...prevState2];

                      const findIndex = newArray.findIndex(
                        (el) => el.name === itemsList[index].descripcion
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
                  } else {
                    itemsList[index].isAdded = true;
                    setActualAccessories((prevState2: Accesories[]) => {
                      const newArray = [...prevState2];

                      newArray.push({
                        brand: itemsList[index].marca,
                        code: itemsList[index].codigo,
                        cost: itemsList[index].precio,
                        dimension: itemsList[index].dimencion,
                        id: itemsList[index].id.toString(),
                        model: itemsList[index].modelo,
                        name: itemsList[index].descripcion,
                        quantity: itemsList[index].quantity,
                        urlPhoto: itemsList[index].urlPhoto,
                        es_kit: itemsList[index].es_kit,
                      });
                      return newArray;
                    });
                  }
                  return itemsList;
                });
              }}
            >
              {acc.isAdded ? 'Quitar' : 'Agregar'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccesoriesModal;
