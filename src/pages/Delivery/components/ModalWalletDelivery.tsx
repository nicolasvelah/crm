import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from 'react';

import { Modal, Button, List, Empty, Alert, Result, message } from 'antd';
import {
  CheckCircleOutlined,
  FileTextOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { DataTable } from './TablaVehicles';
import CotizacionProspectHelp from '../../Help/components/CotizacionProspectHelp';
import SocketClient from '../../../utils/socket-client';
import { NOTIFICATION_TYPES } from '../../../utils/types-notification';
import INotification from '../../../data/models/Notification';
import Get from '../../../utils/Get';
import DeliveryRepository from '../../../data/repositories/delivery-repository';
import { Dependencies } from '../../../dependency-injection';
import { ClientLeadContext } from '../../../components/GetClientData';

export interface ModalWalletDeliveryProps {}
export interface NoteWallet {
  id: number;
  type: string;
  name: string;
  text: string;
  time: string;
}
const ModalWalletDelivery: FunctionComponent<{ data: DataTable }> = ({
  data,
}) => {
  const { lead } = useContext(ClientLeadContext);

  const [viewModal, setViewModal] = useState<boolean>(false);
  const [colorStatus, setColorStatus] = useState<string>('');
  const [notes, setNotes] = useState<NoteWallet[] | null>();
  const [disabledButton, setDisableButton] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>();
  const [dataRow, setDataRow] = useState<any>();
  const deliveryRepository = Get.find<DeliveryRepository>(
    Dependencies.delivery
  );

  const onNotificationListener = (noti: INotification) => {
    // noti es una notificacion desde el ws

    if (noti.type === NOTIFICATION_TYPES.WALLET_STATUS_CHANGED) {
      //console.log('noti🔔🔔🔔🔔', noti);
      if (noti.content.idQuote === data.idQuote) {
        if (noti.content.status === 'REJECTED') {
          setColorStatus('#EC7063');
          setStatus('Rechazado');
          setNotes(noti.content.notes);
        }
        if (noti.content.status === 'APPROVED') {
          setColorStatus('#52c41a');
          setStatus('Autorizado');
          setNotes(noti.content.notes);
        }
      }
    }
  };

  useEffect(() => {
    setDataRow(data);

    setNotes(data.delivery?.comment);
    SocketClient.instance.onNotificationStream.subscribe(
      onNotificationListener
    );
    let color = '#CCCCCC';
    if (data.delivery?.authorizathionStatus === 'Solicitado') {
      color = '#FFB418';
    }
    if (data.delivery?.authorizathionStatus === 'Autorizado') {
      color = '#52c41a';
    }
    if (data.delivery?.authorizathionStatus === 'Rechazado') {
      color = '#EC7063 ';
    }
    setColorStatus(color);
    setDisableButton(data.delivery?.authorizathionStatus === 'Pendiente');
    setStatus(data.delivery?.authorizathionStatus);
  }, [data]);

  const notification = async () => {
    const added: boolean = await deliveryRepository.updateAuthorizathionStatusRequested(
      dataRow.idQuote
    );

    if (added) {
      message.success('Se actualizo el estado correctamente');
    }
    setColorStatus('#FFB418');
    setStatus('Solicitado');
  };

  return (
    <>
      <div>
        <div>
          <CheckCircleOutlined
            style={{
              color: `${colorStatus}`,
              fontSize: 20,
              marginRight: 5,
            }}
          />
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              setViewModal(true);
            }}
            disabled={disabledButton || !!lead?.saleDown}
          >
            Ver
          </Button>
        </div>

        <Modal
          title="Detalles de cartera"
          visible={viewModal}
          onOk={() => {
            setViewModal(false);
          }}
          onCancel={() => {
            setViewModal(false);
          }}
          footer={false}
        >
          <div>
            {/* <p style={{ fontSize: 15, fontWeight: 'bold', color: '#1890ff' }}>
              Comentarios
            </p> */}
            {dataRow &&
              (dataRow.delivery?.comment !== null || notes !== null ? (
                <div>
                  {notes && (
                    <List
                      itemLayout="horizontal"
                      dataSource={notes}
                      renderItem={(item: any) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div>{item.name}</div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: '#B2BABB',
                                    marginRight: 5,
                                  }}
                                >
                                  {moment(item.time).format(
                                    'DD/MM/YYYY hh:mm:ss'
                                  )}
                                </div>
                              </div>
                            }
                            description={
                              <div>
                                <div>{item.text}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}

                  {status === 'Rechazado' && (
                    <div>
                      <Alert
                        style={{ marginBottom: 35, marginTop: 10 }}
                        message="Hubo un inconveniente con la verificación de documentos rectifica la información y vuelve a enviar."
                        type="warning"
                        showIcon
                      />
                      <div style={{ height: 40 }}>
                        <Button
                          type="primary"
                          style={{ float: 'right' }}
                          onClick={notification}
                        >
                          Notificar a Cartera
                        </Button>
                      </div>
                    </div>
                  )}
                  {status === 'Autorizado' && (
                    <Result
                      status="success"
                      title=""
                      subTitle="Los documentos han sido verificados exitosamente"
                    />
                  )}
                  {status === 'Solicitado' && (
                    <Result
                      icon={<SmileOutlined />}
                      title=""
                      subTitle="Los documentos han sido enviados para su revisión"
                    />
                  )}
                </div>
              ) : (
                <Empty />
              ))}
          </div>
        </Modal>
      </div>
    </>
  );
};
export default ModalWalletDelivery;
