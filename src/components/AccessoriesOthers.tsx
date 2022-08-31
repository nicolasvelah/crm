import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import 'antd/dist/antd.css';
import { Input, Button, List, Result, Tag, InputNumber, Form } from 'antd';
import Get from '../utils/Get';
import CRMRepository from '../data/repositories/CRM-repository';
import { Dependencies } from '../dependency-injection';
import auth from '../utils/auth';

const AccessoriesOthers: FunctionComponent<{
  type?: string;
  setAccesoriesServices: (data: any) => void;
  accesoriesServices: any;
  accesoriesAmount: number;
  setAccesoriesAmount: (data: any) => void;
  servicesAmount: number;
  setServicesAmount: (data: any) => void;
  setButtonsDisabled: (data: any) => void;
  buttonsDisabled: any;
  setButtonsDisabledMod2: (data: any) => void;
  buttonsDisabledMod2: any;
}> = ({
  type,
  setAccesoriesServices,
  accesoriesServices,
  accesoriesAmount,
  setAccesoriesAmount,
  servicesAmount,
  setServicesAmount,
  setButtonsDisabled,
  buttonsDisabled,
  setButtonsDisabledMod2,
  buttonsDisabledMod2,
}) => {
  const CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);

  const [accessories, setAccessories] = useState<any>([]);
  const [services, setServices] = useState<any>([]);
  const [buttonsDisabledTrigger, setbuttonsDisabledTrigger] =
    useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const componentdidmount = async () => {
    setLoading(true);
    const queryTestAccessory = { marca: 'mazda', codigo: 'BFRV-LAE 2020' };

    //get Accessories
    const getAccessories = await CRMRepository.getAccesories(
      queryTestAccessory
    );
    if (getAccessories) {
      //console.log('✅ Data CRM Accessories', getAccessories);
      setAccessories(getAccessories);
    }

    //get Services
    const queryTestServices = { marca: 'mazda' };
    const getServices = await CRMRepository.getServices(queryTestServices);
    if (getServices) {
      //console.log('✅ Data CRM Services', getServices[0].rastreo_satelital); //[{rastreo: [{}]}]
      setServices(getServices[0].rastreo_satelital);
    }
    setLoading(false);
  };

  useEffect(() => {
    componentdidmount();
  }, []);

  useEffect(() => {}, [
    buttonsDisabled,
    buttonsDisabledMod2,
    buttonsDisabledTrigger,
  ]);

  return (
    <div>
      <div>
        {/*<Search
          placeholder="Buscar..."
          onSearch={(value) => console.log(value)}
          style={{ width: 200 }}
        />*/}
      </div>
      {/* accesorios */}
      {type === 'Accessories' &&
        (accessories ? (
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={accessories}
            renderItem={(item: any, index: number) => {
              return (
                <List.Item
                  actions={[
                    <Form
                      name={`accItem-${index}`}
                      initialValues={{ quantity: 1 }}
                      onFinish={(values) => {
                        const accesory = {
                          cost: item.costo,
                          name: item.descripcion,
                          code: item.codigo,
                          //index,
                          quantity: values.quantity,
                          dimension: item.dimencion,
                          id: item.id,
                          id_Vh: item.id_vh.toString(),
                          brand: item.marca,
                          model: item.modelo,
                          urlPhoto: item.urlPhoto,
                        };
                        //console.log('accesory', accesory);
                        const accesoriesServicesTemp = accesoriesServices;
                        accesoriesServicesTemp.accesories.push(accesory);
                        setAccesoriesServices(accesoriesServicesTemp);

                        const accesoriesAmountTemp =
                          accesoriesAmount + parseFloat(item.costo);
                        setAccesoriesAmount(accesoriesAmountTemp);

                        const tempButtonsDisabled = buttonsDisabled;
                        tempButtonsDisabled.push(index);
                        setButtonsDisabled(tempButtonsDisabled);
                        setbuttonsDisabledTrigger(!buttonsDisabledTrigger);
                      }}
                    >
                      <Form.Item label="Cantidad" name="quantity">
                        <InputNumber
                          min={1}
                          max={100}
                          disabled={!!buttonsDisabled.includes(index)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          className="mt-6 float-right"
                          disabled={!!buttonsDisabled.includes(index)}
                          htmlType="submit"
                        >
                          Agregar
                        </Button>
                      </Form.Item>
                    </Form>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        {buttonsDisabled.includes(index) ? (
                          <Tag color="green">Agregado</Tag>
                        ) : null}
                        {item.descripcion}
                      </div>
                    }
                    description={
                      <img
                        className="w-40 text-center"
                        src={
                          item.urlPhoto.length > 0
                            ? item.urlPhoto
                            : '/img/no-image-found-360x250.png'
                        }
                        alt={item.descripcion}
                      />
                    }
                  />
                  <div className="ml-2">
                    <div>
                      <strong>Modelo:</strong> {item.modelo}
                    </div>
                    <div>
                      <strong>Version:</strong> {item.version}
                    </div>
                    <div>
                      <strong>Dimensiones:</strong> {item.dimencion}
                    </div>
                    <div>
                      <strong>Stock:</strong> {item.stock}
                    </div>
                    <div>
                      <strong>Costo:</strong> {item.costo}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        ) : (
          <Result status="warning" title="No se pudo cargar los accesorios." />
        ))}
      {type === 'Services' &&
        (services ? (
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={services}
            renderItem={(item: any, index: number) => (
              <List.Item
                actions={[
                  <Button
                    className="mt-6 float-right"
                    onClick={() => {
                      const service = {
                        name: item.descripcion,
                        code: item.codigo,
                        //index,
                        exonerated: item.exonerado,
                        wayToPay: item.forma_pago,
                        iva: item.iva,
                        brands: item.marcas,
                        total: item.total,
                      };
                      const accesoriesServicesTemp = accesoriesServices;
                      accesoriesServicesTemp.services.push(service);
                      setAccesoriesServices(accesoriesServicesTemp);

                      const servicesAmountTemp =
                        servicesAmount + parseFloat(item.total);
                      setServicesAmount(servicesAmountTemp);

                      const tempButtonsDisabled = buttonsDisabledMod2;
                      tempButtonsDisabled.push(index);
                      setButtonsDisabledMod2(tempButtonsDisabled);
                      setbuttonsDisabledTrigger(!buttonsDisabledTrigger);
                    }}
                    disabled={!!buttonsDisabledMod2.includes(index)}
                  >
                    Agregar
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      {buttonsDisabledMod2.includes(index) ? (
                        <Tag color="green">Agregado</Tag>
                      ) : null}
                      {item.descripcion}
                    </div>
                  }
                  description={
                    <div>
                      <div>
                        <strong>Código:</strong> {item.codigo}
                      </div>
                      <div>
                        <strong>Costo:</strong> ${item.valor}
                      </div>
                      <div>
                        <strong>Iva:</strong> ${item.iva}
                      </div>
                      <div>
                        <strong>Total:</strong> ${item.total}
                      </div>
                      <div>
                        <strong>Forma de pago:</strong> {item.forma_pago}
                      </div>
                      <div>
                        <strong>Marcas:</strong> {item.marcas}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Result status="warning" title="No se pudo cargar los accesorios." />
        ))}
    </div>
  );
};

export default AccessoriesOthers;
