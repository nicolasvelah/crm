import { Button, message, Result } from 'antd';
/* eslint-disable react/state-in-constructor */
import moment from 'moment';
import React from 'react';
import Loading from '../components/Loading';
import MailingsFormTemplate from '../components/MailingsFormTamplate';
import UploadFile from '../components/UploadFile';
import Client from '../data/models/Client';
import { Vehicle } from '../data/models/Vehicle';
import ClientsRepository from '../data/repositories/clients-repository';
import QuotesRepository from '../data/repositories/quotes-repository';
import DeliveryRepository from '../data/repositories/delivery-repository';
import { crypt } from '../utils/crypto';
import PreBillsRepository from '../data/repositories/prebills-repository';
import { Dependencies } from '../dependency-injection';
import Get from '../utils/Get';

export default class VehicleDeliveryConfirmationPage extends React.PureComponent {
  quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  deliveryRepository = Get.find<DeliveryRepository>(Dependencies.delivery);
  prebillsRepository = Get.find<PreBillsRepository>(Dependencies.prebills);

  state = {
    vehicle: null as Vehicle | null,
    client: null as Client | null,
    deliveryRecipient: null as null | string,
    vimVehiculo: '',
    deliveryIdSet: null,
    ResponseMessage: 'Esta página ya expiró.',
    pageValidated: true,
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const query = window.location.search.substring(1);
    const searchParam = new URLSearchParams(query);
    const token = searchParam.get('tk');
    const dateTkGenerated = searchParam.get('date');
    const clientCi = searchParam.get('clientCi');
    const leadIdGet = searchParam.get('leadId');
    const deliveryId = searchParam.get('deliveryId');
    const prebillId = searchParam.get('prebillId');
    const leadId: number = parseInt(leadIdGet!, 10);
    const id: string = clientCi!;
    const quote = await this.quotesRepository.getClosedQuote(leadId);
    const clientId: any = await this.clientsRepository.getClientsByIdentification(
      id
    );
    const deliveryData: any = await this.deliveryRepository.getDeliveryByPrebill(
      parseInt(prebillId!)
    );
    /*  if (token && dateTkGenerated) {
      this.setTokenLS(token, dateTkGenerated);
    } */
    if (token && dateTkGenerated) {
      if (deliveryData.vehicleOrder.state === 'Solicitado') {
        this.setState({
          vehicle: quote.vehiculo[0],
          client: clientId[0],
          vimVehiculo: quote.vimVehiculo,
          deliveryIdSet: parseInt(deliveryId!),
        });
      } else {
        this.setState({ pageValidated: false });
      }
    }
    this.setState({ loading: false });
  }

  setTokenLS = async (token: string, dateTkGenerated: string) => {
    const gucToken = crypt({
      token,
      expiresIn: 604800, // 7 dias 604800 segundos
      createdAt: moment(dateTkGenerated).format('YYYY-MM-DDTHH:mm:ssZ'), //'2020-10-08T16:09:56.584Z'
    });
    localStorage.setItem('gucToken', gucToken);
    //console.log('token', token);
  };

  onSave = async () => {
    const { deliveryRecipient, deliveryIdSet } = this.state;
    this.setState({ loading: true });
    const url = deliveryRecipient!;
    const updateDeliveryFile: any = await this.deliveryRepository.updateVehicleOrderForFile(
      deliveryIdSet!,
      url
    );
    message.success('Se guardó con éxito');

    this.setState({
      loading: false,
      ResponseMessage: 'La confirmacion de entrega se ha actualizado.',
      pageValidated: false,
    });

    if (!deliveryRecipient) {
      message.error('Debes subir el archivo de recibido');
    }
  };

  render() {
    const {
      vehicle,
      client,
      deliveryRecipient,
      vimVehiculo,
      ResponseMessage,
      pageValidated,
      loading,
    } = this.state;
    return (
      <div>
        {vehicle && client && pageValidated ? (
          <MailingsFormTemplate
            vehicle={vehicle}
            client={client}
            vimVehiculo={vimVehiculo}
          >
            <p>
              Confirma la entrega del vehículo adjuntando el documento de
              recibido.
            </p>
            <div className="flex items-center">
              <div style={{ minWidth: 350 }}>
                <UploadFile
                  id="delivery-input-file"
                  label="Recibo de entrega"
                  onFileUploaded={(url) => {
                    this.setState({ deliveryRecipient: url });
                  }}
                  uploadedFile={deliveryRecipient}
                />
                <br />
                <Button
                  disabled={deliveryRecipient === null}
                  onClick={this.onSave}
                  size="large"
                  type="primary"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </MailingsFormTemplate>
        ) : (
          <Result
            status="success"
            title={ResponseMessage}
            subTitle="El acceso a este link ha caducado."
          />
        )}

        <Loading visible={loading} />
      </div>
    );
  }
}
