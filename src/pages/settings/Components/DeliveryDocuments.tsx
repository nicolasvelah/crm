import React, { FunctionComponent, useState } from 'react';
import { Table, Button, Popconfirm, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Documents,
  getDocumentCaseString,
} from '../../lead/steps/delivery/utils/delivery_documents';

import ItemDeliveryDocuments from './ItemDeliveryDocuments';
import { DocumentsTable } from './Settings';
import Loading from '../../../components/Loading';
import SettingsRepository from '../../../data/repositories/settings-repository';
import Get from '../../../utils/Get';
import { Dependencies } from '../../../dependency-injection';

const DeliveryDocuments: FunctionComponent<{
  dataDocumentsDelivery: DocumentsTable[];
  setDataDocumentsDelivery: React.Dispatch<
    React.SetStateAction<DocumentsTable[] | null>
  >;
  idSettingDocument: number | null;
  setIdSettingDocument: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({
  dataDocumentsDelivery,
  setDataDocumentsDelivery,
  idSettingDocument,
  setIdSettingDocument,
}) => {
  //Hooks
  const [loading, setLoading] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [itemSelected, setItemSelected] = useState<DocumentsTable | undefined>(
    undefined
  );

  const settingsRepository = Get.find<SettingsRepository>(
    Dependencies.settings
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Nombre del Documento',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <span className="regular c-black">{text}</span>,
    },
    {
      title: 'Caso de uso',
      dataIndex: 'when',
      key: 'when',
      render: (when: any) => {
        if (when && typeof when === 'object' && when.length > 0) {
          return (
            <ul>
              {when.map((wh: number, index: number) => (
                <li key={`caso_${index}`}>{getDocumentCaseString(wh)}</li>
              ))}
            </ul>
          );
        }
        return <div>Todos</div>;
      },
    },
    {
      title: 'Obligatoriedad',
      dataIndex: 'optional',
      key: 'optional',
      render: (op: any) => {
        //console.log('Opcional', op);
        if (op && typeof op === 'object' && op.length > 0) {
          return (
            <div>
              <b>Obligatorio para:</b>
              <br />
              <ul>
                {op.map((wh: number, index: number) => (
                  <li key={`option_${index}`}>{getDocumentCaseString(wh)}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (op === 'all') {
          return <div>Obligatorio para todos</div>;
        }
        return <div>No obligatorio</div>;
      },
    },
    {
      title: 'Factura',
      dataIndex: 'invoice',
      key: 'invoice',
      render: (op: any) => {
        //console.log('op', op);
        return <b>{op ? 'SI' : 'NO'}</b>;
      },
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (op: any, dataRow: any, index: any) => {
        return (
          <div>
            <Button
              onClick={() => {
                //console.log('log documents Editar', { op, dataRow, index });
                setItemSelected(dataRow);
                //setIdSettingDocument(index);
                setViewModal(true);
              }}
              type="link"
              shape="round"
              icon={<EditOutlined />}
            >
              <span className="leading-none">Editar</span>
            </Button>
            <Popconfirm
              placement="rightTop"
              title="Esta seguro de eliminar Este documento"
              onConfirm={async () => {
                setLoading(true);
                //console.log('log documents dataDocuments', {
                //   idSettingDocument,
                //   op,
                //   dataRow,
                // });

                /// Elimino
                const copiaDoc = [...dataDocumentsDelivery];
                copiaDoc.splice(parseInt(dataRow.key), 1);

                //console.log('log documents delete', copiaDoc);
                const dataMap = copiaDoc.map((cp) => ({
                  name: cp.name,
                  when: cp.when === 'all' ? [] : cp.when,
                  optional: cp.optional === 'all' ? [] : cp.optional,
                  invoice: !!cp.invoice,
                }));
                //console.log('Array a enviar delete', dataMap);

                const respSettings = await settingsRepository.createUpdateDeleteDocumentsSetting(
                  idSettingDocument,
                  dataMap,
                  null
                );

                if (respSettings) {
                  setDataDocumentsDelivery((prevState) => {
                    if (prevState) {
                      const copia = prevState;
                      copia.splice(index, 1);
                      const newData = copia.map((el, indx) => ({
                        ...el,
                        key: indx.toString(),
                      }));
                      return [...newData];
                    }
                    return prevState;
                  });
                  message.success('Documento eliminado');
                  //console.log('Data luego de borrar', dataDocumentsDelivery);
                  setLoading(false);
                } else {
                  message.error('No se pudo eliminar. vuelva a intentarlo.');
                  setLoading(false);
                }
              }}
              okText="Si"
              cancelText="No"
            >
              <Button
                shape="round"
                icon={<DeleteOutlined />}
                danger
                style={{ marginLeft: 10 }}
                type="link"
              >
                <span className="leading-none">Eliminar</span>
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          onClick={() => {
            setItemSelected(undefined);
            setViewModal(true);
          }}
        >
          Agregar
        </Button>
      </div>
      <Table dataSource={dataDocumentsDelivery} columns={columns} />
      <Modal
        title="Documento"
        footer={false}
        visible={viewModal}
        onOk={() => {
          setViewModal(false);
        }}
        onCancel={() => {
          setViewModal(false);
        }}
        width={700}
      >
        {viewModal && (
          <ItemDeliveryDocuments
            itemSelected={itemSelected}
            idSetting={idSettingDocument}
            dataDocumentsDelivery={dataDocumentsDelivery}
            setDataDocumentsDelivery={setDataDocumentsDelivery}
            setIdSettingDocument={setIdSettingDocument}
            setViewModal={setViewModal}
          />
        )}
      </Modal>
      <Loading visible={loading} />
    </>
  );
};

export default DeliveryDocuments;
