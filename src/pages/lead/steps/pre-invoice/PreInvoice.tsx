/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */
import { Button, Input, Result, Tag } from 'antd';

import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import { currenyFormat } from '../../../../utils/extras';
import PanelView from '../../../../components/PanelView';
import Accesories from '../../../../components/Accesories';
import BisnessParams from './components/BisnessParams';
import TableTemplate from '../../../../components/TableTemplate';
import PreInvoiceController, {
  PreInvoiceInitialData,
} from './pre-invoice-controller';
import Loading from '../../../../components/Loading';
import { Vehicle } from '../../../../data/models/Quotes';
import auth from '../../../../utils/auth';
import setHistoryState from '../../../../utils/set-history-state';

const { TextArea } = Input;

@inject('preInvoiceController')
@observer
class PreInvoice extends React.PureComponent<{
  preInvoiceController?: PreInvoiceController;
}> {
  componentWillUnmount() {
    this.props.preInvoiceController!.dispose();
  }

  viewProspect = () => {
    const { client, onViewProspect } = this.props.preInvoiceController!;
    onViewProspect(client.identification!);
  };

  notes = () => {
    const { preInvoiceController } = this.props;
    const { notes } = preInvoiceController!;
    if (notes.length === 0) return <div />;
    return (
      <div>
        <h3 className="bold">Comentarios</h3>
        {notes.map((item, index) => (
          <div className="mb-3" key={`${index}`}>
            <small className="regular" style={{ textTransform: 'capitalize' }}>
              {(item.name || '').toLowerCase()}{' '}
              <b className="bold">({item.type.toLowerCase()})</b>
            </small>
            <p className="normal">{item.texto}</p>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { preInvoiceController } = this.props;
    const {
      client,
      asesor,
      quote,
      fetching,
      prebillStatus,
      sendPreInvoce,
      otrosconceptos,
      onCommentChange,
      acceptOrDeclinePrebill,
      requestAgain,
      onNext,
    } = preInvoiceController!;
    //console.log({ preInvoiceController });

    const vehicle: Vehicle | undefined =
      quote && quote.vehiculo ? quote.vehiculo[0] : undefined;

    let tagColor = 'default';
    let spanishStatus = '';
    switch (prebillStatus) {
      case 'NONE':
        tagColor = 'default';
        break;
      case 'REQUESTED':
        tagColor = 'gold';
        spanishStatus = 'Solicitado';
        break;
      case 'APPROVED':
        tagColor = 'green';
        spanishStatus = 'Aprobado';
        break;
      default:
        tagColor = 'red';
        spanishStatus = 'Rechazado';
    }

    const { user } = auth;
    return (
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <span>Prefactura</span>
          {prebillStatus !== 'NONE' && (
            <Tag className="ml-2" color={tagColor}>
              {spanishStatus}
            </Tag>
          )}
        </h2>

        <Loading visible={fetching} />

        {vehicle && (
          <>
            <PanelView
              customHeader={
                <div className="font-bold text-lg">Datos cliente</div>
              }
            >
              <TableTemplate
                rows={[
                  {
                    label: 'Nombres',
                    content: `${client.name} ${client.lastName}`,
                  },
                  { label: 'C.I', content: `${client.identification}` },
                  { label: 'Teléfono', content: `${client.cellphone}` },
                  { label: 'Email', content: `${client.email}` },
                ]}
              />
            </PanelView>
            <br />
            <PanelView
              customHeader={
                <div className="font-bold text-lg">Datos del vehículo</div>
              }
            >
              <TableTemplate
                mode="horizontal"
                rows={[
                  {
                    label: 'Marca',
                    content: `${vehicle.brand}`,
                  },
                  { label: 'Modelo', content: `${vehicle.model}` },
                  { label: 'Versión', content: `${vehicle.description}` },
                  { label: 'Año', content: `${vehicle.year}` },
                  // { label: 'Cilindraje', content: `${vehicle.cylinder}` },
                  { label: 'Pasajeros', content: `${vehicle.numPassengers}` },
                  // { label: 'Ejes', content: `${vehicle.numberAxles}` },
                  { label: 'Puertas', content: `${vehicle.doors}` },
                  { label: 'Combustible', content: `${vehicle.fuel}` },
                  // { label: 'Color', content: `${vehicle.color}` },
                  {
                    label: 'Costo',
                    content: `${currenyFormat(vehicle.pvp || 0)}`,
                  },
                ]}
              />
            </PanelView>
            {otrosconceptos.length > 0 && (
              <PanelView
                customHeader={
                  <div className="bold text-lg">
                    Accesorios, aliados y otros
                  </div>
                }
              >
                <Accesories accesories={otrosconceptos} />
                {/* {quote &&
                  quote.services &&
                  quote.services.length > 0 &&
                  quote!.services![0].satelliteTracking &&
                  quote!.services![0].satelliteTracking.length > 0 && (
                    <Services
                      services={quote!.services![0].satelliteTracking}
                    />
                  )} */}
              </PanelView>
            )}

            <br />
            <BisnessParams />
            <br />
            {(user!.role === 'ASESOR COMERCIAL' ||
              user!.role === 'JEFE DE VENTAS') && (
              <div>
                {this.notes()}

                {(prebillStatus === 'NONE' || prebillStatus === 'REJECTED') &&
                  !(
                    user.role === 'JEFE DE VENTAS' ||
                    user.role === 'GERENTE DE MARCA'
                  ) && (
                    <div className="p-2" style={{ backgroundColor: '#FCFCFC' }}>
                      <div>
                        <h2 className="text-3xl font-bold m-0">
                          Buen trabajo, falta poco
                        </h2>
                        <div>Envía la prefactura para aprobación.</div>

                        <TextArea
                          style={{ maxWidth: 500 }}
                          className="mt-2"
                          placeholder="Comentario"
                          onChange={(e) => onCommentChange(e.target.value)}
                        />
                      </div>
                      <br />
                      <Button
                        onClick={() => {
                          if (prebillStatus === 'NONE') {
                            sendPreInvoce();
                          } else {
                            requestAgain();
                          }
                        }}
                        type="primary"
                        size="large"
                      >
                        Solicitar aprobación
                      </Button>
                    </div>
                  )}

                {prebillStatus === 'REQUESTED' &&
                  (user.role === 'JEFE DE VENTAS' ||
                    user.role === 'GERENTE DE MARCA') && (
                    <div className="p-2" style={{ backgroundColor: '#FCFCFC' }}>
                      <div>
                        <h2 className="text-3xl font-bold m-0">
                          El asesor {`${asesor?.nombre} ${asesor?.apellido}`}{' '}
                          solicita aprobación para prefactura
                        </h2>

                        <TextArea
                          style={{ maxWidth: 500 }}
                          className="mt-2"
                          placeholder="Comentario"
                          onChange={(e) => onCommentChange(e.target.value)}
                        />
                      </div>
                      <br />
                      <div>
                        <Button
                          onClick={() => {
                            acceptOrDeclinePrebill(false);
                          }}
                          danger
                          size="large"
                        >
                          Rechazar
                        </Button>
                        <Button
                          className="ml-2"
                          onClick={() => {
                            acceptOrDeclinePrebill(true);
                          }}
                          type="primary"
                          size="large"
                        >
                          Aprobar
                        </Button>
                      </div>
                    </div>
                  )}

                {prebillStatus !== 'NONE' &&
                  prebillStatus !== 'REJECTED' &&
                  !(
                    user.role === 'JEFE DE VENTAS' ||
                    user.role === 'GERENTE DE MARCA'
                  ) && (
                    <div>
                      <Tag color={tagColor}>{spanishStatus}</Tag>
                      <Button
                        size="large"
                        type="primary"
                        onClick={onNext}
                        disabled={prebillStatus !== 'APPROVED'}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                {prebillStatus === 'APPROVED' &&
                  (user.role === 'JEFE DE VENTAS' ||
                    user.role === 'GERENTE DE MARCA') && (
                    <Result
                      title="Prefactura Aprobada"
                      status="success"
                      extra={
                        <Button onClick={this.viewProspect} type="primary">
                          Ver prospecto
                        </Button>
                      }
                    />
                  )}

                {prebillStatus === 'REJECTED' &&
                  (user.role === 'JEFE DE VENTAS' ||
                    user.role === 'GERENTE DE MARCA') && (
                    <Result
                      status="error"
                      title="Prefactura Rechazada"
                      extra={
                        <Button onClick={this.viewProspect} type="primary">
                          Ver prospecto
                        </Button>
                      }
                    />
                  )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default class PreInvoiceStep extends React.Component<{
  data: PreInvoiceInitialData;
}> {
  componentDidMount() {
    // eslint-disable-next-line no-undef
    setHistoryState(4);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <Provider
        preInvoiceController={new PreInvoiceController(this.props.data)}
      >
        <PreInvoice />
      </Provider>
    );
  }
}
