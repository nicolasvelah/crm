import React, { FunctionComponent, useState } from 'react';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Radio,
  Row,
  Col,
  message,
  Switch,
} from 'antd';
import { getDocumentCaseString } from '../../lead/steps/delivery/utils/delivery_documents';
import Get from '../../../utils/Get';
import SettingsRepository from '../../../data/repositories/settings-repository';
import { Dependencies } from '../../../dependency-injection';
import Loading from '../../../components/Loading';
import auth from '../../../utils/auth';
import { DocumentsTable } from './Settings';
import { ItemDocumentsInput } from '../../../data/providers/apollo/mutations/settings';

const ItemDeliveryDocuments: FunctionComponent<{
  itemSelected?: DocumentsTable;
  idSetting: number | null;
  dataDocumentsDelivery: DocumentsTable[];
  setDataDocumentsDelivery?: React.Dispatch<
    React.SetStateAction<DocumentsTable[] | null>
  >;
  setIdSettingDocument: React.Dispatch<React.SetStateAction<number | null>>;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  itemSelected,
  idSetting,
  dataDocumentsDelivery,
  setDataDocumentsDelivery,
  setIdSettingDocument,
  setViewModal,
}) => {
  //console.log('Data a itemdelivery', dataDocumentsDelivery);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewCasesOfWhen, setViewCasesOfWhen] = useState<boolean>(
    !!(itemSelected && itemSelected.when !== 'all')
  );
  const [viewCasesOfOptional, setViewCasesOfOptional] = useState<boolean>(
    !!(
      itemSelected &&
      itemSelected.optional &&
      typeof itemSelected.optional === 'object'
    )
  );

  const [disabledButtonButton, setDisabledButton] = useState<boolean>(
    !!itemSelected
  );

  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );
  const { user } = auth;

  const onFinish = async (values: any) => {
    setLoading(true);
    const datatoSend = {
      name: values.name,
      optional:
        values.optional === 'any'
          ? values.optional_items
          : values.optional === 'null'
          ? null
          : values.optional,
      when: values.when === 'any' ? values.when_items : values.when,
      invoice: values.invoice,
    };

    const dataToSendRepository: ItemDocumentsInput = {
      ...datatoSend,
      optional: datatoSend.optional === 'all' ? [] : datatoSend.optional,
      when: datatoSend.when === 'all' ? [] : datatoSend.when,
    };

    //console.log('log documents dataDocuments', {
    //   values,
    //   datatoSend,
    //   dataToSendRepository,
    // });

    /// Se esta actualizando
    if (itemSelected && idSetting && setDataDocumentsDelivery) {
      //console.log('log documents ACTUALIZAR', {
      //   idSetting,
      //   dataToSendRepository,
      // });
      const copiaDoc = [...dataDocumentsDelivery];
      const dataMap: any = copiaDoc.map((cp, index) => {
        return {
          name: cp.name,
          when: cp.when === 'all' ? [] : cp.when,
          optional: cp.optional === 'all' ? [] : cp.optional,
          invoice: !!cp.invoice,
        };
      });
      //console.log('log documents ACTUALIZAR to send', dataMap);

      dataMap[parseInt(itemSelected.key)] = dataToSendRepository;

      const respSettings = await settingsRepository.createUpdateDeleteDocumentsSetting(
        idSetting,
        dataMap,
        null
      );
      if (respSettings) {
        setDataDocumentsDelivery((prevState) => {
          if (prevState) {
            const copia = prevState;
            copia[parseInt(itemSelected.key)] = {
              ...datatoSend,
              key: itemSelected.key,
            };
            return [...copia];
          }
          return prevState;
        });
        setViewModal(false);
        message.success('Documento Actualizado');
        setLoading(false);
      } else {
        message.error(
          'No se pudo actualizar el documento. Vuelva a intentarlo.'
        );
        setLoading(false);
      }

      return;
    }
    /// Se esta creando
    if (setDataDocumentsDelivery) {
      const copiaDoc = [...dataDocumentsDelivery];
      const dataMap: any = copiaDoc.map((cp, index) => {
        return {
          name: cp.name,
          when: cp.when === 'all' ? [] : cp.when,
          optional: cp.optional === 'all' ? [] : cp.optional,
          invoice: !!cp.invoice,
        };
      });
      dataMap.push(dataToSendRepository);
      //console.log('log documents CREAR', {
      //   idSetting,
      //   dataMap,
      //   itemSelected,
      // });

      const respSettings = await settingsRepository.createUpdateDeleteDocumentsSetting(
        idSetting,
        dataMap,
        itemSelected ? null : user.dealer[0].sucursal[0].id_sucursal
      );
      if (respSettings) {
        setViewModal(false);
        message.success('Documento Agregado');
        setDataDocumentsDelivery((prevState) => {
          if (prevState) {
            const copia = prevState;
            copia.push({
              ...datatoSend,
              key: dataMap.length,
            });
            return [...copia];
          }
          return prevState;
        });
        setIdSettingDocument(parseInt(respSettings));
        setLoading(false);
      } else {
        message.error('No se pudo agregar el documento. Vuelve a intentarlo.');
        setLoading(false);
      }
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    //console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    if (values?.when === 'any') {
      setViewCasesOfWhen(true);
    } else if (values?.when === 'all') {
      setViewCasesOfWhen(false);
    }

    if (values?.optional === 'null' || values?.optional === 'all') {
      setViewCasesOfOptional(false);
    } else if (values?.optional === 'any') {
      setViewCasesOfOptional(true);
    }
    setDisabledButton(false);
    //console.log('change values', { changedValues, values });
  };

  const initialValues = () => {
    const dataInital = {
      name: itemSelected!.name,
      optional: !itemSelected!.optional
        ? 'null'
        : itemSelected!.optional === 'all'
        ? 'all'
        : 'any',
      optional_items:
        itemSelected!.optional !== 'all' ? itemSelected!.optional : undefined,
      when: itemSelected!.when === 'all' ? 'all' : 'any',
      when_items: itemSelected!.when !== 'all' ? itemSelected!.when : undefined,
    };
    //console.log('dataInital', dataInital);
    return dataInital;
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <div>
      <Form
        {...layout}
        name="basic"
        initialValues={
          itemSelected
            ? {
                name: itemSelected!.name,
                optional: !itemSelected!.optional
                  ? 'null'
                  : itemSelected!.optional === 'all'
                  ? 'all'
                  : 'any',
                optional_items:
                  itemSelected!.optional !== 'all'
                    ? itemSelected!.optional
                    : undefined,
                when: itemSelected!.when === 'all' ? 'all' : 'any',
                when_items:
                  itemSelected!.when !== 'all' ? itemSelected!.when : undefined,
                invoice: !!itemSelected!.invoice,
              }
            : undefined
        }
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="Nombre del Documento"
          name="name"
          rules={[
            { required: true, message: 'Ingrese el nombre del documento' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="when"
          label="Caso de uso"
          rules={[{ required: true, message: 'Elija una opción' }]}
        >
          <Radio.Group>
            <Radio.Button value="all">Todos</Radio.Button>
            <Radio.Button value="any">Algunos</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {viewCasesOfWhen && (
          <Form.Item
            name="when_items"
            label="Casos"
            rules={[{ required: true, message: 'Elija una opción' }]}
          >
            <Checkbox.Group>
              <Row>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                  (caseDocument, index) => (
                    <Col span={10} key={index}>
                      <Checkbox value={caseDocument}>
                        {getDocumentCaseString(caseDocument)}
                      </Checkbox>
                    </Col>
                  )
                )}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        )}

        <Form.Item
          name="optional"
          label="Obligatoriedad"
          rules={[{ required: true, message: 'Elija una opción' }]}
        >
          <Radio.Group>
            <Radio.Button value="all">Obligatorio para todos</Radio.Button>
            <Radio.Button value="null">No obligatorio</Radio.Button>
            <Radio.Button value="any">Algunos</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {viewCasesOfOptional && (
          <Form.Item
            name="optional_items"
            label="Casos"
            rules={[{ required: true, message: 'Elija una opción' }]}
          >
            <Checkbox.Group>
              <Row>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                  (caseDocument, index) => (
                    <Col span={10} key={index}>
                      <Checkbox value={caseDocument}>
                        {getDocumentCaseString(caseDocument)}
                      </Checkbox>
                    </Col>
                  )
                )}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        )}

        <Form.Item name="invoice" label="Factura" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            disabled={disabledButtonButton}
            type="primary"
            htmlType="submit"
          >
            {!itemSelected ? 'Crear' : 'Actualizar'}
          </Button>
        </Form.Item>
      </Form>
      <Loading visible={loading} />
    </div>
  );
};

export default ItemDeliveryDocuments;
