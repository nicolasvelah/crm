import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import 'antd/dist/antd.css';
import { Input, Button, Form, Select, notification, message } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import graphqlRoute from '../../data/providers/api/api-graphql';
import Leads, { Inquiry } from '../../data/models/Leads';
import Loading from '../Loading';
import toPrint from '../../utils/templates-html/toPrintTemplate';
import { templateWorkShop } from '../../utils/templates-html/template-new-credit';
import { ClientLeadContext } from '../GetClientData';
import LeadsRepository from '../../data/repositories/leads-repository';
import { Dependencies } from '../../dependency-injection';
import Get from '../../utils/Get';

const { Option } = Select;
export interface InquiryProps {}

const updateInquiry = (
  idLead: number,
  inquiryLead?: Array<{ question: string; answer: any }>,
  workPage?: string,
  state?: string
) => {
  let inquiry = '';
  if (inquiryLead) {
    inquiryLead.forEach((it: { question: string; answer: any }) => {
      inquiry += `{ question: "${it.question}", answer: "${it.answer}" },`;
    });
    inquiry = `inquiryLead: [
      ${inquiry}
    ],`;
  }

  let pageWork = '';
  if (workPage) {
    pageWork = `workPage: "${workPage}",`;
  }
  let stateGraph = '';
  if (state) {
    stateGraph = `state: "${state}",`;
  }

  return `
  mutation{
    updateInquiryLead(idLead: ${idLead}, ${inquiry} ${pageWork} ${stateGraph})
  }
  `;
};

const MainInquiry: FunctionComponent<{
  setOnFinishValue?: Function;
  setInquiryClosable: Function;
  inquiryClosable: boolean;
  setInquiryOpen: Function;
}> = ({
  setOnFinishValue,
  setInquiryClosable,
  inquiryClosable,
  setInquiryOpen,
}) => {
  const { client, lead, setLead } = useContext(ClientLeadContext);
  //console.log('lead Inquiry', lead);

  if (!client || !lead) {
    return <div />;
  }
  return (
    <InquiryStep
      idLead={lead.id!}
      inquiryQuestions={lead?.inquiry ?? undefined}
      workPage={lead?.workPage ?? undefined}
      setOnFinishValue={setOnFinishValue}
      setInquiryClosable={setInquiryClosable}
      inquiryClosable={inquiryClosable}
      setInquiryOpen={setInquiryOpen}
    />
  );
};
const InquiryStep: FunctionComponent<{
  idLead: number;
  inquiryQuestions?: Inquiry[];
  workPage?: string;
  setOnFinishValue?: Function;
  setInquiryClosable: Function;
  inquiryClosable: boolean;
  setInquiryOpen: Function;
}> = ({
  idLead,
  inquiryQuestions,
  workPage,
  setOnFinishValue,
  setInquiryClosable,
  inquiryClosable,
  setInquiryOpen,
}) => {
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const [myInquiry, setMyInquiry] = useState<Inquiry[] | null>(null);
  const [myWorkPage, setMyWorkPage] = useState<string | null>(null);

  const [visibleSelectVehicle, setVisibleSelectVehicle] = useState<boolean>(
    false
  );

  const [loading, setloading] = useState<boolean>(false);
  const leadRepository = Get.find<LeadsRepository>(Dependencies.leads);

  useEffect(() => {
    //console.log('lead master', lead);
    if (inquiryQuestions) {
      setMyInquiry(inquiryQuestions);
    }
    if (workPage) {
      setMyWorkPage(workPage);
    }
  }, []);

  const onFinish = async (values: any) => {
    //console.log('Success:', values, idLead);
    const inquiry = Object.keys(values).map((key: string) => ({
      question: key,
      answer: values[key] ?? '',
    }));
    const query = updateInquiry(idLead, inquiry);
    //console.log({ inquiry, query });

    setloading(true);
    const resp = await graphqlRoute(query);
    /* const resp = {
      data: 'Hola'
    } */
    setloading(false);

    if (resp.data) {
      notification.success({
        message: 'Imprime la hoja de trabajo para continuar.',
        description: 'Datos Guardados con ??xito.',
      });
      //console.log('resp.data', resp.data);
      const isFloat = !!inquiry.find(
        (item) => item.answer === 'flota' && item.question === 'clientType'
      );
      setMyInquiry(inquiry);
      setLead!((prevState: Leads) => ({
        ...prevState,
        inquiry,
        isFleet: isFloat,
      }));
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    //console.log('Failed:', errorInfo);
    //console.log('debug_0', lead, setLead);
  };

  // eslint-disable-next-line no-shadow
  const updateWorkPage = async (idLead: number) => {
    try {
      const resp = await leadRepository.updateWorkPage(idLead);
      if (resp) {
        message.success('Workpage Actualizado');
        return true;
      }
      message.success('Error en actualizacion');
      return false;
    } catch (e) {
      //console.log('Failed:', e.message);
      message.success('Error en actualizacion');
      return false;
    }
  };

  const isThereInitialValue = (val: string) => {
    try {
      const isThere: string | undefined =
        inquiryQuestions?.find((inq) => inq.question === val)?.answer ??
        undefined;

      return { value: isThere ?? undefined, disable: !!isThere };
    } catch (error) {
      return { value: undefined, disable: false };
    }
  };

  const openModal = () => setVisibleSelectVehicle(true);
  const closeModal = () => setVisibleSelectVehicle(false);

  return (
    <div style={{ margin: 'auto' }}>
      <div className="c-black text-2xl bold mt-4">
        Genial empecemos a indagar
      </div>
      <p className="mt-2">
        Te dejare algunas preguntas que podrias hacer para guiar al cliente en
        su compra
      </p>

      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="flex flex-wrap">
          <Form.Item
            className=""
            label="??Para qui??n es el auto?"
            name="??Para qui??n es el auto?"
            initialValue={isThereInitialValue('??Para qui??n es el auto?').value}
            rules={[
              {
                message: 'Por favor ingresa un tipo de documento.',
              },
            ]}
          >
            <Input
              style={{ width: '400px', marginRight: 20 }}
              disabled={isThereInitialValue('??Para qui??n es el auto?').disable}
            />
          </Form.Item>

          <Form.Item
            className=" "
            label="??Qu?? atributos valora m??s de un auto?"
            name="??Qu?? atributos valora m??s de un auto?"
            initialValue={
              isThereInitialValue('??Qu?? atributos valora m??s de un auto?').value
            }
            rules={[
              {
                message: 'Por favor ingresa un tipo de documento.',
              },
            ]}
          >
            <Input
              style={{ width: '400px', marginRight: 20 }}
              disabled={
                isThereInitialValue('??Qu?? atributos valora m??s de un auto?')
                  .disable
              }
            />
          </Form.Item>

          <Form.Item
            className=""
            label="??Para qu?? va a usar el auto?"
            name="??Para qu?? va a usar el auto?"
            initialValue={
              isThereInitialValue('??Para qu?? va a usar el auto?').value
            }
            rules={[
              {
                message: 'Por favor ingresa un tipo de documento.',
              },
            ]}
          >
            <Input
              style={{ width: '400px', marginRight: 20 }}
              disabled={
                isThereInitialValue('??Para qu?? va a usar el auto?').disable
              }
            />
          </Form.Item>
          <Form.Item
            className=""
            label="??Cu??ntas personas se van a movilizar en el auto?"
            name="??Cu??ntas personas se van a movilizar en el auto?"
            initialValue={
              isThereInitialValue(
                '??Cu??ntas personas se van a movilizar en el auto?'
              ).value
            }
            rules={[
              {
                message: 'Por favor ingresa un tipo de documento.',
              },
            ]}
          >
            <Input
              style={{ width: '400px', marginRight: 20 }}
              disabled={
                isThereInitialValue(
                  '??Cu??ntas personas se van a movilizar en el auto?'
                ).disable
              }
            />
          </Form.Item>
          <Form.Item
            className=""
            label="??En qu?? trabaja?"
            name="??En qu?? trabaja?"
            initialValue={isThereInitialValue('??En qu?? trabaja?').value}
            rules={[
              {
                message: 'Por favor ingresa un tipo de documento.',
              },
            ]}
          >
            <Input
              style={{ width: '400px', marginRight: 20 }}
              disabled={isThereInitialValue('??En qu?? trabaja?').disable}
            />
          </Form.Item>
          <Form.Item
            className=""
            label="??Qu?? transmisi??n prefiere?"
            name="??Qu?? transmisi??n prefiere?"
            initialValue={
              isThereInitialValue('??Qu?? transmisi??n prefiere?').value
            }
          >
            <Select
              placeholder="Seleccione el tipo de trasmisi??n"
              allowClear
              //value={isThereInitialValue('Tipo de cliente').value}
              disabled={
                isThereInitialValue('??Qu?? transmisi??n prefiere?').disable
              }
              style={{ width: 400, marginRight: 20 }}
            >
              type
              <Option value="Manual">Manual</Option>
              <Option value="Autom??tica">Autom??tica</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className=""
            label="??Tiene auto como parte de pago?"
            name="??Tiene auto como parte de pago?"
            initialValue={
              isThereInitialValue('??Tiene auto como parte de pago?').value
            }
            rules={[
              {
                message: 'Por favor ingresa un tipo de documento.',
              },
            ]}
          >
            <Input
              style={{ width: 400, marginRight: 20 }}
              disabled={
                isThereInitialValue('??Tiene auto como parte de pago?').disable
              }
            />
          </Form.Item>
          <Form.Item
            name="clientType"
            label="Tipo de cliente"
            initialValue={isThereInitialValue('clientType').value}
            rules={[
              {
                required: true,
                message: 'Seleccione el tipo de cliente',
              },
            ]}
          >
            <Select
              placeholder="Seleccione el tipo de cliente"
              allowClear
              //value={isThereInitialValue('Tipo de cliente').value}
              disabled={isThereInitialValue('clientType').disable}
              style={{ width: 400, marginRight: 20 }}
            >
              type
              <Option value="retail">Retail</Option>
              <Option value="flota">Flota</Option>
            </Select>
          </Form.Item>
        </div>
        {/* <Button onClick={openModal}>Seleccionar veh??culo de inter??s</Button> */}
        <Form.Item>
          {!inquiryQuestions && (
            <div className="mt-2 text-red-400"> * Obligatorio</div>
          )}

          <Button
            className="button-green mt-2 "
            htmlType="submit"
            disabled={myInquiry !== null || !!lead?.saleDown}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>

      <div className="flex mt-10 ">
        <p>
          Imprime la hoja de trabajo para que tomes todos los apuntes necesarios
          y puedas??
          <span className="font-bold"> continuar a la demostraci??n.</span>
        </p>
      </div>

      <div>
        <Button
          type="primary"
          ghost
          icon={<PrinterOutlined />}
          disabled={myInquiry === null || !!lead?.saleDown}
          onClick={() => {
            setOnFinishValue!(true);
            toPrint(
              templateWorkShop(lead!, myInquiry!, client!, idLead, {
                concesionario: lead!.concesionario!,
                sucursal: lead!.sucursal!,
                name: `${lead!.user!.nombre!} ${lead!.user!.apellido!}`,
              })
            );
            setInquiryClosable(true);
            updateWorkPage(idLead);
          }}
        >
          {myWorkPage === null ? 'Imprimir' : ''}??
          <span>Hoja de trabajo Nro {idLead}</span>
        </Button>
        {inquiryClosable ? (
          <Button
            type="primary"
            style={{ marginLeft: 20 }}
            onClick={() => {
              setInquiryOpen(false);
              console.log('click cat??logo ..');
            }}
          >
            Vamos al cat??logo
          </Button>
        ) : null}
      </div>
      {/* <Modal
        title="Selecci??n de veh??culo de inter??s"
        visible={visibleSelectVehicle}
        width={800}
        onOk={closeModal}
        onCancel={closeModal}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
      >
        <SelectVehicleInquiry />
      </Modal> */}
      <Loading visible={loading} />
    </div>
  );
};

export default MainInquiry;
