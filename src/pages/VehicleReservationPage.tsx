import { Button, InputNumber, message, Result } from 'antd';
/* eslint-disable react/state-in-constructor */
import React from 'react';
import moment from 'moment';
import Loading from '../components/Loading';
import MailingsFormTemplate from '../components/MailingsFormTamplate';
import { crypt } from '../utils/crypto';

import Client from '../data/models/Client';
import { Vehicle } from '../data/models/Quotes';
import QuotesRepository from '../data/repositories/quotes-repository';
import ClientsRepository from '../data/repositories/clients-repository';
import { Dependencies } from '../dependency-injection';
import Get from '../utils/Get';

export default class VehicleReservationPage extends React.PureComponent {
  quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);

  state = {
    vehicle: null as Vehicle | null,
    client: null as Client | null,
    reservationValue: 0,
    vimVehiculo: 0,
    loading: false,
    activePage: true,
    ResponseMessage: 'Esta página ya expiró.',
    quoteId: 0,
    quote: null as any | null,
    discountValue: 0,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const query = window.location.search.substring(1);
    const searchParam = new URLSearchParams(query);
    const token = searchParam.get('tk');
    const dateTkGenerated = searchParam.get('date');
    const discount = searchParam.get('desc');
    this.setState({ discountValue: discount });
    //console.log('descuento👍', discount);

    if (token && dateTkGenerated) {
      this.setTokenLS(token, dateTkGenerated);
      const quoteId = Number(searchParam.get('quoteId'));
      const quote: any = await this.quotesRepository.getQuoteById(quoteId);

      if (quote) {
        //console.log('quote🌎', quote);
        if (quote.reserveValue) {
          this.setState({ activePage: false, loading: false });
        } else {
          const vehicle: Vehicle = quote.vehiculo[0];

          const clientCi: string | null = searchParam.get('clientCi');
          //console.log('cedula', clientCi);
          if (clientCi) {
            const clientsRepository = await this.clientsRepository.getClientsByIdentification(
              clientCi!
            );
            //console.log('clientsRepository', clientsRepository);
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
              const { vimVehiculo } = quote;
              this.setState({
                vehicle,
                client,
                vimVehiculo,
                quoteId: quote.id!,
                quote,
              });
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
      createdAt: moment(dateTkGenerated).format('YYYY-MM-DDTHH:mm:ssZ'), //'2020-10-08T16:09:56.584Z'
    });
    await localStorage.setItem('gucToken', gucToken);
    //console.log('token', token);
  };

  onSave = async () => {
    const { reservationValue } = this.state;
    this.setState({ loading: true });

    //console.log('reservationValue', reservationValue);
    const { quoteId } = this.state;
    if (quoteId > 0) {
      this.quotesRepository.updateQuoteReserveValue(
        quoteId,
        Number(reservationValue)
      );

      message.success('Se guardó con éxito');
      this.setState({
        loading: false,
        ResponseMessage: 'El valor de la reserva se ha actualizado.',
        activePage: false,
      });
    }
  };

  render() {
    const {
      vehicle,
      client,
      reservationValue,
      vimVehiculo,
      loading,
      activePage,
      ResponseMessage,
      quote,
      discountValue,
    } = this.state;
    //console.log('vehicle- client - activepage', vehicle, client, activePage);
    //console.log('discountValue', discountValue);
    return (
      <div className="max-w-screen-lg m-auto">
        {vehicle && client && activePage && quote ? (
          <MailingsFormTemplate
            vehicle={vehicle}
            client={client}
            vimVehiculo={vimVehiculo}
            quote={quote}
            discount={discountValue}
          >
            <p className="mb-1">
              Confirma la reserva del vehiculo ingresando el valor de la
              reserva.
            </p>
            {/*<Tag color="gold">
              Recuerda que el valor mínimo de reserva para este vehículo es USD
              200
            </Tag>*/}
            <div className="flex items-center mt-5">
              <div className="font-bold" style={{ whiteSpace: 'nowrap' }}>
                Valor de la reserva:
              </div>
              <InputNumber
                formatter={(value) => {
                  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }}
                parser={(value) => {
                  return value ? value.replace(/\$\s?|(,*)/g, '') : '';
                }}
                value={reservationValue}
                onChange={(e) => {
                  if (typeof e === 'number') {
                    this.setState({ reservationValue: e });
                  }
                }}
                className="ml-2"
                style={{ width: 200 }}
              />
              <Button
                onClick={this.onSave}
                className="ml-2"
                type="primary"
                loading={loading}
              >
                Guardar
              </Button>
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
