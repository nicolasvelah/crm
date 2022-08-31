import { Button, Form, Input, message, Result } from 'antd';
/* eslint-disable react/state-in-constructor */
import React from 'react';
import moment from 'moment';
import Loading from '../components/Loading';
import MailingsFormTemplate from '../components/MailingsFormTamplate';

import Client from '../data/models/Client';
import { Vehicle } from '../data/models/Vehicle';
import Get from '../utils/Get';
import { crypt } from '../utils/crypto';
import QuotesRepository from '../data/repositories/quotes-repository';
import { Dependencies } from '../dependency-injection';
import ClientsRepository from '../data/repositories/clients-repository';
import DeliveryRepository from '../data/repositories/delivery-repository';
import Quotes from '../data/models/Quotes';

export default class VehicleRegistrationPage extends React.PureComponent {
  quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  deliveryRepository = Get.find<DeliveryRepository>(Dependencies.delivery);

  state = {
    vehicle: null as Vehicle | null,
    client: null as Client | null,
    vimVehiculo: 0,
    loading: false,
    activePage: true,
    ResponseMessage: 'Esta página ya expiró.',
    quoteId: 0,
    discount: 0,
    quote: null as Quotes | null,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const query = window.location.search.substring(1);
    const searchParam = new URLSearchParams(query);
    const token = searchParam.get('tk');
    const dateTkGenerated = searchParam.get('date');

    if (token && dateTkGenerated) {
      this.setTokenLS(token, dateTkGenerated);

      // Identifica la quota para ingresar la matricula
      const quoteId = Number(searchParam.get('quoteId'));
      const leadId = Number(searchParam.get('leadId'));
      // El cliente trae toda la información que se necesita
      const clientCi: string | null = searchParam.get('clientCi');

      if (clientCi) {
        const clientsRepository = await this.clientsRepository.getClientsByIdentification(
          clientCi!
        );

        //console.log('Información del cliente', clientsRepository);

        const leadSel = await clientsRepository?.map((dataMapLead) =>
          dataMapLead.leads?.filter((lead) => {
            if (lead.id === leadId) {
              //console.log('entro en el lead', lead.id, leadId);
              return lead;
            }
            return null;
          })
        );
        //console.log('Lead', leadSel);

        if (leadSel) {
          this.setState({ discount: leadSel![0]![0].discount });
          const quote = leadSel![0]![0].quotes!.filter(
            (quoteMap: any) => quoteMap.id === quoteId
          );

          //console.log('Quote:', quote);

          if (quote) {
            if (quote![0]?.delivery?.registration?.state === 'Matriculado') {
              this.setState({ activePage: false, loading: false });
            } else {
              //console.log('quote.vehiculo[0]', quote![0]?.vehiculo![0]);
              const vehicle = quote![0]?.vehiculo![0];
              if (clientsRepository) {
                const client: Client = {
                  name: clientsRepository[0].name,
                  lastName: clientsRepository[0].lastName,
                  identification: clientsRepository[0].identification,
                  typeIdentification:
                    clientsRepository[0].typeIdentification === 'C'
                      ? 'Cédula'
                      : null,
                  email: clientsRepository[0].email,
                  cellphone: clientsRepository[0].cellphone,
                };
                this.setState({
                  vehicle,
                  client,
                  vimVehiculo: quote![0]?.vimVehiculo,
                  quoteId,
                  quote: quote![0]!,
                });
              }
            }
          }
        }
      }
    }
    this.setState({ loading: false });
  }

  setTokenLS = async (token: string, dateTkGenerated: string) => {
    const gucToken = crypt({
      token,
      expiresIn: 604800, // 7 dias 604800 segundos
      createdAt: moment(dateTkGenerated).format('YYYY/MM/DD HH:mm:ss'), //'2020-10-08T16:09:56.584Z'
    });
    localStorage.setItem('gucToken', gucToken);
    //console.log('token', token);
  };

  savePlate = async (plate: string) => {
    //const { registrationValue } = this.state;
    this.setState({ loading: true });

    //console.log('registrationValue', registrationValue);
    const { quoteId } = this.state;
    if (quoteId > 0) {
      // Se guarda en la tabla Delivery en la columna REGISTRATION
      await this.deliveryRepository.updateRegistrationWithQuote(quoteId, plate);

      message.success('Se guardó con éxito');
      this.setState({
        loading: false,
        ResponseMessage: 'El valor de la placa se ha actualizado.',
        activePage: false,
      });
    }
  };

  render() {
    const {
      vehicle,
      client,
      vimVehiculo,
      loading,
      activePage,
      ResponseMessage,
      quote,
      discount,
    } = this.state;
    return (
      <div>
        {vehicle && client && activePage ? (
          <MailingsFormTemplate
            vehicle={vehicle}
            client={client}
            vimVehiculo={vimVehiculo}
            quote={quote}
            discount={discount}
          >
            <p>
              Confirma la matrícula del vehiculo ingresando el número de placa.
            </p>
            <div className="flex items-center">
              <Form
                onFinish={async (values) => {
                  this.savePlate(values.plateNumber);
                }}
              >
                <Form.Item
                  name="plateNumber"
                  label="Número del placa"
                  rules={[
                    {
                      pattern: /\b[A-Z]{2,3}-[0-9]{4}\b/,
                      message: 'Formato: ABC-0409 / AB-0409',
                      required: true,
                    },
                  ]}
                  style={{ marginRight: 0 }}
                >
                  <Input className="ml-2" style={{ width: 350 }} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: 80,
                      margin: 0,
                      padding: 3,
                      borderRadius: 0,
                    }}
                  >
                    Guardar
                  </Button>
                </Form.Item>
              </Form>
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
