import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  Spin,
  Tag,
  InputNumber,
  Button,
  message,
  Divider,
  Result,
  Tooltip,
  Modal,
  Form,
  Input,
  Switch,
  Select,
} from 'antd';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';
import CRMRepository from '../../../data/repositories/CRM-repository';
import { ServiceWithType } from './Closure';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { currenyFormat, netType } from '../../../utils/extras';
import { ServicesTable } from './TableServices';
import { ClientLeadContext } from '../../../components/GetClientData';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

interface ItemServices {
  codigo: string;
  descripcion: string;
  exonerado: number;
  forma_pago: string;
  iva: number;
  marcas: string;
  total: number;
  valor: number;
  add: boolean;
}
interface ServicesModal {
  nombre: string;
  items: ItemServices[];
}
const { Option } = Select;

const ServicesModal: FunctionComponent<{
  idQuote?: number;
  code?: string;
  actualServices: ServicesTable[];
  setActualServices: Function;
}> = ({ idQuote, actualServices, setActualServices, code }) => {
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  const [loading, setLoading] = useState<boolean>(true);
  const [servicesList, setServicesList] = useState<ServicesModal[]>([]);
  const [activeRedExterna, setActiveRedExterna] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [newElement, setNewElement] = useState<any>();
  const [formaDePago, setFormaDePago] = useState<string>('');
  const [valueExonerado, setValueExonerado] = useState<boolean>(false);

  const componentdidmount = async () => {
    setLoading(true);
    let codigo = '';
    if (code) {
      codigo = code;
    } else {
      const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
      const actualQuote = await quouteRepository.getQuoteById(idQuote!);
      //console.log('ACTUAL QUOTE !!!!', actualQuote);
      codigo = actualQuote ? actualQuote!.vehiculo![0]!.code! : 'DHR9-LAB 2021';
    }
    //console.log('CODIGO SERVICIOS', codigo);

    const queryTestServices = {
      codigo,
    };
    const getServices = await CRMRepository.getServices(queryTestServices);
    if (getServices) {
      //console.log(
      //   '✅ Data CRM Services',
      //   { actualServices },
      //   getServices
      //   //getServices[0].rastreo_satelital
      // );

      const arrayAllServices: any = [];
      getServices.forEach((cat: any) => {
        /// recorro las categorias
        const category: any = {
          nombre: cat.nombre,
          items: [],
        };
        //console.log('CATEGORY', category);
        if (cat.items) {
          cat.items.forEach((itemService: any) => {
            ///recorro los items de las categorias
            const serviceAdded = actualServices
              .find((act) => act.nombre === cat.nombre) /// obtengo la categoria de la lista de servicios global
              ?.items.find(
                (itm) =>
                  itm.codigo === itemService.codigo &&
                  itm.total === itemService.total
              );
            //console.log('serviceAdded', serviceAdded);
            category.items.push({ ...itemService, add: !!serviceAdded });
          });
        }
        arrayAllServices.push(category);
      });
      //console.log('arrayAllServices', arrayAllServices);
      setServicesList(arrayAllServices);

      setLoading(false);
    }
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
  //console.log('actualServices REREnder', actualServices, servicesList);
  return (
    <div>
      {activeRedExterna && (
        <div style={{ textAlign: 'center', marginBottom: 15 }}>
          <Tooltip title="Añadir Servicio">
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
      {/*MODAL Añadir Servicio*/}
      {viewModal && (
        <Modal
          title="Añadir Servicio"
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
            initialValues={{}}
            onFinish={(values) => {
              const pos = servicesList.findIndex(
                (itemS: any) => itemS.nombre === values.name
              );
              if (pos === -1) {
                const newAccesorio = {
                  nombre: values.name,
                  items: [
                    {
                      codigo:
                        values.codigo === undefined
                          ? `${values.name}_${moment().format(
                              'YY-MM-DD hh:mm'
                            )}`
                          : values.codigo,
                      descripcion: values.descripcion,
                      exonerado: values.exonerado === undefined ? 0 : 1,
                      forma_pago: 'CONTADO',
                      iva: values.valor * 0.12,
                      marcas: values.marcas === undefined ? '' : values.marcas,
                      total: values.valor * 1.12,
                      valor: values.valor,
                      add: false,
                    },
                  ],
                };
                servicesList.unshift(newAccesorio);
              } else {
                servicesList[pos].items.unshift({
                  codigo:
                    values.codigo === undefined
                      ? `${values.name}_${moment().format('YY-MM-DD hh:mm')}`
                      : values.codigo,
                  descripcion: values.descripcion,
                  exonerado: values.exonerado === undefined ? 0 : 1,
                  forma_pago: 'CONTADO',
                  iva: values.valor * 0.12,
                  marcas: values.marcas === undefined ? '' : values.marcas,
                  total: values.valor * 1.12,
                  valor: values.valor,
                  add: false,
                });
              }
              setViewModal(false);
            }}
            onFinishFailed={(errorInfo) => {
              //console.log('Failed:', errorInfo);
            }}
          >
            <Form.Item
              label="Nombre del servicio"
              name="name"
              rules={[
                { required: true, message: 'Ingrese el nombre del servicio!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Categoría"
              name="descripcion"
              rules={[{ required: true, message: 'Ingrese la categoría!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Código"
              name="codigo"
              /* rules={[{ required: true, message: 'Ingrese año!' }]} */
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Marcas"
              name="marcas"
              /*  rules={[{ required: true, message: 'Ingrese dimensión!' }]} */
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Exonerado"
              name="exonerado"
              /*  rules={[{ required: true, message: 'Ingrese dimensión!' }]} */
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="Precio (Sin iva)"
              name="valor"
              rules={[{ required: true, message: 'Ingrese el Precio!' }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Agregar a la lista
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {servicesList.map((serList, index) => (
        <div key={index}>
          <Divider orientation="left">{serList.nombre}</Divider>
          {serList.items.length > 0 ? (
            serList.items.map((itms, indexItem) => (
              <div
                className="flex justify-between"
                key={`item_${indexItem}`}
                style={{
                  margin: '10px 0px',
                  backgroundColor: itms.add ? '#F6FFED' : '#f5f8fc',
                  borderRadius: 10,
                  padding: 15,
                }}
                //'#F6FFED' : '#f5f8fc'
              >
                <div>
                  <div>
                    <b className="mr-1">Categoría:</b>
                    <span>{itms.descripcion}</span>
                  </div>
                  <div>
                    <b className="mr-1">Código:</b>
                    <span>{itms.codigo}</span>
                  </div>
                  <div>
                    <b className="mr-1">Forma de pago:</b>
                    <span>{itms.forma_pago}</span>
                  </div>
                  <div>
                    <b className="mr-1">Marcas:</b>
                    <span>{itms.marcas}</span>
                  </div>
                  <div>
                    <b className="mr-1">Subtotal:</b>
                    <span>{currenyFormat(itms.valor, true)}</span>
                  </div>
                  <div>
                    <b className="mr-1">Total:</b>
                    <span>
                      {currenyFormat(itms.total, true)}{' '}
                      <span className="text-sm">Inc. IVA</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    //type={serv.isAdded ? undefined : 'primary'}
                    onClick={() => {
                      setActualServices((prevState: any) => {
                        const beforeServices = prevState;
                        const indexCategoryService = beforeServices.findIndex(
                          (cat: any) => cat.nombre === serList.nombre
                        );
                        if (indexCategoryService > -1) {
                          const indexServiceFinded = beforeServices[
                            indexCategoryService
                          ].items.findIndex(
                            (itm: any) => itm.codigo === itms.codigo
                          );
                          if (indexServiceFinded > -1) {
                            /// ESTOY ELIMINANDO
                            if (
                              beforeServices[indexCategoryService].items
                                .length === 1
                            ) {
                              beforeServices.splice(indexCategoryService, 1);
                            } else {
                              beforeServices[indexCategoryService].items.splice(
                                indexServiceFinded,
                                1
                              );
                            }
                          } else {
                            // ESTOY AGREGANDO
                            beforeServices[indexCategoryService].items.push({
                              codigo: itms.codigo,
                              descripcion: itms.descripcion,
                              exonerado:
                                typeof itms.exonerado === 'number'
                                  ? itms.exonerado
                                  : null,
                              forma_pago: itms.forma_pago ?? null,
                              iva: itms.iva,
                              marcas: itms.marcas,
                              total: itms.total,
                              valor: itms.valor,
                            });
                          }
                        } else {
                          /// ESTOY AGREGANDO CATEGORIA E ITEM
                          beforeServices.push({
                            nombre: serList.nombre,
                            items: [
                              {
                                codigo: itms.codigo,
                                descripcion: itms.descripcion,
                                exonerado:
                                  typeof itms.exonerado === 'number'
                                    ? itms.exonerado
                                    : null,
                                forma_pago: itms.forma_pago ?? null,
                                iva: itms.iva,
                                marcas: itms.marcas,
                                total: itms.total,
                                valor: itms.valor,
                              },
                            ],
                          });
                        }
                        //console.log('NEW LIST -->', [...beforeServices]);
                        return [...beforeServices];
                      });
                      const repoServicesList = servicesList;
                      repoServicesList[index].items[indexItem] = {
                        ...repoServicesList[index].items[indexItem],
                        add: !itms.add,
                      };
                      setServicesList([...repoServicesList]);
                    }}
                  >
                    {itms.add ? 'Quitar' : 'Agregar'}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Result title="No hay datos para mostrar" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ServicesModal;
