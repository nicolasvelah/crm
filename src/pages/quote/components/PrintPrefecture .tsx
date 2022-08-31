import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Client from '../../../data/models/Client';
import Leads from '../../../data/models/Leads';
import { PrebillNote } from '../../../data/models/PreBill';
import auth from '../../../utils/auth';
import { calcTotalQuotesGenerated, currenyFormat } from '../../../utils/extras';
const { user } = auth;

type PrebillStatus = 'NONE' | 'REQUESTED' | 'REJECTED' | 'APPROVED';

interface SummaryValues {
  totalValueVehicles: number;
  totalValueInsurance: number;
  totalValuesServices: number;
  totalValuesAccesories: number;
  totalMargen: number;
  totalValues: number;
  totalValueVehiclesWithoutLegals: number;
}
const PrintPrefecture = () => {
  const { propParams }: any = useHistory().location.state;
  const {
    client,
    lead,
    descuento,
    payThirdPerson,
    vehiclesToShow,
    totalSummaryValues,
    discountMount,
    notes,
    prebillStatus,
  }: {
    client: Client;
    lead: Leads;
    descuento: number;
    payThirdPerson: boolean;
    vehiclesToShow: any[];
    totalSummaryValues: SummaryValues;
    discountMount: number;
    notes: PrebillNote[];
    prebillStatus: PrebillStatus;
  } = propParams;

  const datos = (
    <table
      style={{
        marginTop: '1.5rem',
        border: '1px solid rgb(179 177 177)',
        width: '100%',
      }}
    >
      <thead>
        <tr>
          <th
            colSpan={2}
            style={{
              padding: '0.5rem',
              border: '1px solid rgb(179 177 177)',
            }}
          >
            Datos
          </th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ border: '1px solid rgb(179 177 177)' }}>
          <td
            style={{
              border: '1px solid rgb(179 177 177)',
              maxWidth: '40%',
            }}
          >
            <p style={{ padding: '0.5rem', margin: 0 }}>
              <b>Nombre: </b>
              {`${client.name} ${client.lastName}`}
              <br />
              <b>Cédula: </b>
              {`${client.identification}`}
              <br />
              <b>Email: </b>
              {`${client.email}`}
              <br />
              <b>Telefono: </b>
              {`${client.cellphone}`}
            </p>
          </td>
          <td style={{ width: '40%' }}>
            <p style={{ padding: '0.5rem', margin: 0 }}>
              <b>Concesionario: </b>
              {`${lead.concesionario?.name}`}
              <br />
              <b>Ciudad: </b>
              {`${lead.city}`}
              <br />
              <b>Agencia: </b>
              {`${lead.sucursal?.name}`}
              <br />
              <b>Vendedor: </b>
              {`${lead.user.nombre} ${lead.user.apellido}`}
              <br />
              <b>Fecha: </b>
              {`${moment().format('DD/MM/YYYY')}`}
            </p>
          </td>
        </tr>
        <tr style={{ border: '1px solid rgb(179 177 177)' }}>
          <th
            colSpan={2}
            style={{
              padding: '0.5rem',
              border: '1px solid rgb(179 177 177)',
            }}
          >
            Datos del negocio
          </th>
        </tr>
        <tr style={{ border: '1px solid rgb(179 177 177)' }}>
          <td colSpan={2} style={{ padding: '0.5rem' }}>
            <b>Id Negocio: </b>
            {`${lead.id}`}
            <br />
            <b>Tipo de Cliente: </b>
            {lead.inquiry?.find((inq) => inq!.question === 'clientType')
              ?.answer === 'retail'
              ? 'RETAIL'
              : 'FLOTA'}
          </td>
        </tr>
      </tbody>
    </table>
  );
  const vehiculosAFacturar = () => {
    return (
      <table
        style={{
          border: '1px solid rgb(179 177 177)',
          width: '100%',
        }}
      >
        <thead>
          <tr style={{ border: '1px solid rgb(179 177 177)' }}>
            <th
              colSpan={2}
              style={{
                padding: '0.5rem',
                borderBottom: '1px solid rgb(179 177 177)',
              }}
            >
              Vehículos a facturar
            </th>
          </tr>
        </thead>
        {vehiclesToShow.map((vhToShow: any, index) => {
          let gradeRender = null;
          if (vhToShow.exonerated?.percentage) {
            switch (vhToShow.exonerated.percentage) {
              case 'a': {
                gradeRender = '30% - 49%';
                break;
              }
              case 'b': {
                gradeRender = '50% - 74%';
                break;
              }
              case 'c': {
                gradeRender = '75% - 84%';
                break;
              }
              case 'd': {
                gradeRender = '85% - 100%';
                break;
              }
              default:
            }
          }
          if (vhToShow.exonerated?.type !== 'disabled') {
            gradeRender = null;
          }
          return (
            <tbody key={index}>
              <tr style={{ border: '1px solid rgb(179 177 177)' }}>
                <th
                  colSpan={2}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid rgb(179 177 177)',
                    textAlign: 'center',
                  }}
                >
                  <b>
                    {`${vhToShow.vehiculo[index].brand}`}
                    {`${vhToShow.vehiculo[index].description}`}
                  </b>
                </th>
              </tr>
              <tr
                style={{
                  border: '1px solid rgb(179 177 177)',
                  maxWidth: '100%',
                }}
              >
                <td
                  style={{
                    border: '1px solid rgb(179 177 177)',
                    width: '65%',
                  }}
                >
                  <div
                    style={{
                      borderBottom: '1px solid rgb(179 177 177)',
                    }}
                  >
                    <p style={{ margin: 0, padding: '0.5rem' }}>
                      <b>VIN: </b>
                      {`${vhToShow.vimVehiculo}`}
                      <br />
                      <b>Marca: </b>
                      {`${vhToShow.vehiculo[index].brand}`}
                      <br />
                      <b>Descripcion: </b>
                      {`${vhToShow.vehiculo[0].description}`}
                      <br />
                      <b>Año: </b>
                      {`${vhToShow.vehiculo[0].year}`}
                      <br />
                      <b>Color: </b>
                      {`${
                        vhToShow.vimVehiculoData
                          ? vhToShow.vimVehiculoData.color
                          : 'No se encontró color'
                      }`}
                      <br />
                      <b>Exonerado: </b>
                      {`${
                        vhToShow.exonerated
                          ? `${
                              vhToShow.exonerated.type === 'diplomatics'
                                ? 'Diplomático'
                                : 'Discapacidad'
                            } ${gradeRender ?? ''}`
                          : 'Sin exoneración'
                      }`}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0.5rem',
                      }}
                    >
                      <b>Vehículo</b>
                      <span>{`${vhToShow.vehiculo[index].description}`}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0.5rem',
                      }}
                    >
                      <b>Valor Unitario</b>
                      <span>{`${currenyFormat(
                        vhToShow.vehiculo[index].pvp -
                          (lead && lead.discount
                            ? vhToShow.vehiculo[index].pvp *
                              (lead.discount * 0.01)
                            : 0)
                      )}`}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0.5rem',
                      }}
                    >
                      <b>IVA</b>
                      <span>{`${currenyFormat(
                        (vhToShow.vehiculo[index].pvp -
                          (lead && lead.discount
                            ? vhToShow.vehiculo[index].pvp *
                              (lead.discount * 0.01)
                            : 0)) *
                          0.12
                      )}`}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0.5rem',
                      }}
                    >
                      <b>Total</b>
                      <span>
                        {`${currenyFormat(
                          (vhToShow.vehiculo[index].pvp -
                            (lead && lead.discount
                              ? vhToShow.vehiculo[index].pvp *
                                (lead.discount * 0.01)
                              : 0)) *
                            1.12
                        )}`}
                        Inc. IVA
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <img
                    src={vhToShow.vehiculo[index].imgs}
                    alt={vhToShow.vehiculo[index].description}
                    style={{ width: '100%' }}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  {accesorios({
                    accesories: vhToShow.idAccesories ?? [],
                    vhToShow: vhToShow,
                  })}
                </td>
              </tr>
              <tr style={{ border: '1px solid rgb(179 177 177)' }}>
                <td colSpan={2}>
                  {servicios({
                    services: vhToShow.services ?? [],
                    vhToShow: vhToShow,
                  })}
                </td>
              </tr>
              <tr style={{ border: '1px solid rgb(179 177 177)' }}>
                <td colSpan={2}>
                  {formaPago({
                    index: index,
                    vhToShow: vhToShow,
                    client: client,
                  })}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    );
  };

  const accesorios = ({
    accesories,
    vhToShow,
  }: {
    accesories: [];
    vhToShow: any;
  }) => {
    return (
      <table
        style={{
          width: '100%',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgb(179 177 177)',
              textAlign: 'center',
            }}
          >
            <th colSpan={2}>Accesorios</th>
          </tr>
        </thead>
        {accesories.length === 0 && accesories.length === 0 ? (
          <tbody>
            <tr>
              <th colSpan={2}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem',
                  }}
                >
                  <span style={{ textAlign: 'center' }}>
                    No posee accsesorios
                  </span>
                  <span
                    role="img"
                    aria-label="inbox"
                    className="anticon anticon-inbox"
                    style={{ fontSize: '40px', color: 'rgb(230, 230, 230)' }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      focusable="false"
                      data-icon="inbox"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <th style={{ textAlign: 'center' }}>Código</th>
              <th style={{ textAlign: 'center' }}>Descripción</th>
              <th style={{ textAlign: 'center' }}>Cantidad</th>
              <th style={{ textAlign: 'center' }}>Valor unitario</th>
              <th style={{ textAlign: 'center' }}>Subtotal</th>
              <th style={{ textAlign: 'center' }}>IVA</th>
              <th style={{ textAlign: 'center' }}>Total</th>
            </tr>
            {accesories.map((acc: any, index: number) => (
              <tr key={`acc_${index}`}>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {acc.code}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {acc.name}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {acc.quantity}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {currenyFormat(acc.cost, true)}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {currenyFormat(acc.cost * acc.quantity, true)}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {currenyFormat(acc.cost * acc.quantity * 0.12, true)}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: 0,
                    textAlign: 'center',
                  }}
                >
                  {currenyFormat(acc.cost * acc.quantity * 1.12, true)}
                  <span className="text-sm">Inc. IVA</span>
                </td>
              </tr>
            ))}
            {typeof vhToShow.accesoriesValue === 'number' && (
              <>
                <tr style={{ borderBottom: 'none' }}>
                  <td
                    colSpan={7}
                    style={{ borderBottom: 'none', textAlign: 'right' }}
                  >
                    <b>Subtotal: </b>
                    {currenyFormat(vhToShow.accesoriesValue)}
                  </td>
                </tr>
                <tr style={{ borderBottom: 'none' }}>
                  <td
                    colSpan={7}
                    style={{ borderBottom: 'none', textAlign: 'right' }}
                  >
                    <b>Total: </b>
                    {currenyFormat(vhToShow.accesoriesValue * 1.12)}
                    <span className="text-sm"> Inc. IVA</span>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        )}
      </table>
    );
  };
  const servicios = ({
    services,
    vhToShow,
  }: {
    services: [];
    vhToShow: any;
  }) => {
    return (
      <table
        style={{
          width: '100%',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgb(179 177 177)',
              textAlign: 'center',
            }}
          >
            <th colSpan={2}>Servicios</th>
          </tr>
        </thead>
        {services.length === 0 ? (
          <tbody>
            <tr>
              <th colSpan={2}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem',
                  }}
                >
                  <span style={{ textAlign: 'center' }}>
                    No posee servicios
                  </span>
                  <span
                    role="img"
                    aria-label="inbox"
                    className="anticon anticon-inbox"
                    style={{ fontSize: '40px', color: 'rgb(230, 230, 230)' }}
                  >
                    <svg
                      viewBox="0 0 1024 1024"
                      focusable="false"
                      data-icon="inbox"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                    </svg>
                  </span>
                </div>
              </th>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <th style={{ textAlign: 'center' }}>Categoría</th>
              <th style={{ textAlign: 'center' }}>Descripción</th>
              <th style={{ textAlign: 'center' }}>Subtotal</th>
              <th style={{ textAlign: 'center' }}>IVA</th>
              <th style={{ textAlign: 'center', minWidth: 200 }}>Total</th>
            </tr>
            {services.map((serList: any, index: number) => (
              <React.Fragment key={`cat_${index}`}>
                {serList.items.map((itms: any, indexItem: number) => (
                  <tr key={`ser_${indexItem}`}>
                    <td
                      style={{
                        border: 'none',
                        padding: 0,
                        textAlign: 'center',
                      }}
                    >
                      {serList.nombre}
                    </td>
                    <td
                      style={{
                        border: 'none',
                        padding: 0,
                        textAlign: 'center',
                      }}
                    >
                      {itms.descripcion}
                    </td>
                    <td
                      style={{
                        border: 'none',
                        padding: 0,
                        textAlign: 'center',
                      }}
                    >
                      {currenyFormat(itms.valor, true)}
                    </td>
                    <td
                      style={{
                        border: 'none',
                        padding: 0,
                        textAlign: 'center',
                      }}
                    >
                      {currenyFormat(itms.iva, true)}
                    </td>
                    <td
                      style={{
                        border: 'none',
                        padding: 0,
                        textAlign: 'center',
                      }}
                    >
                      {currenyFormat(itms.total, true)}{' '}
                      <span className="text-sm">Inc. IVA</span>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {typeof vhToShow.servicesValue === 'number' && (
              <>
                <tr>
                  <td
                    colSpan={5}
                    style={{ borderBottom: 'none', textAlign: 'right' }}
                  >
                    <b>Subtotal: </b>
                    {currenyFormat(vhToShow.servicesValue)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={5}
                    style={{ borderBottom: 'none', textAlign: 'right' }}
                  >
                    <b>Total: </b>
                    {currenyFormat(vhToShow.servicesValue * 1.12)}
                    <span className="text-sm"> Inc. IVA</span>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        )}
      </table>
    );
  };

  const formaPago = ({
    index: index,
    vhToShow: vhToShow,
    client: client,
  }: {
    index: number;
    vhToShow: any;
    client: Client;
  }) => {
    return (
      <table
        style={{
          width: '100%',
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                borderRight: '1px solid rgb(179 177 177)',
                maxWidth: '65%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    borderBottom: '1px solid rgb(179 177 177)',
                  }}
                >
                  <div style={{ padding: '0.5rem', width: '35%' }}>
                    <b>Forma de Pago</b>
                  </div>
                  <div style={{ padding: '0.5rem', width: '65%' }}>
                    {vhToShow.type === 'counted' ? 'Contado' : 'Crédito'}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    borderBottom: '1px solid rgb(179 177 177)',
                  }}
                >
                  <div style={{ padding: '0.5rem', width: '35%' }}>
                    <b>DESCRIPCIÓN</b>
                  </div>
                  <div
                    style={{
                      padding: '0.5rem',
                      width: '33.8%',
                    }}
                  >
                    <b>VALOR</b>
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <b>RESPONSABLE</b>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    borderBottom: '1px solid rgb(179 177 177)',
                  }}
                >
                  <div
                    style={{
                      padding: '0.5rem',
                      width: '35%',
                    }}
                  >
                    {vhToShow.reserveValue && 'Reserva'}
                    {vhToShow.type !== 'counted' && 'Entrada'}
                  </div>
                  <div
                    style={{
                      padding: '0.5rem',
                      width: '35%',
                    }}
                  >
                    {vhToShow.reserveValue &&
                      currenyFormat(vhToShow.reserveValue, true)}
                    {vhToShow.type !== 'counted' &&
                      currenyFormat(vhToShow.inputAmount ?? 0, true)}
                  </div>
                  <div>{`${client.name} ${client.lastName}`}</div>
                </div>
                {vhToShow.chosenEntity && (
                  <tbody>
                    <tr>
                      <td>Finaciamiento</td>
                      <td>
                        {currenyFormat(
                          calcTotalQuotesGenerated(vhToShow) * 1.12 -
                            vhToShow.inputAmount ?? 0,
                          true
                        )}
                      </td>
                      <td>
                        {vhToShow.chosenEntity === 'CONSORTIUM'
                          ? 'Consorcio'
                          : ''}
                        {` ${vhToShow.chosenEntity.entity}`}
                      </td>
                    </tr>
                  </tbody>
                )}
                {vhToShow.preOwnedSupplier && (
                  <tbody
                    style={{
                      width: '100%',
                    }}
                  >
                    <tr>
                      <td>Vehículo como forma de pago</td>
                      <td>
                        {currenyFormat(
                          vhToShow.preOwnedSupplier.appraisalValue,
                          true
                        )}
                      </td>
                      <td>{vhToShow.preOwnedSupplier.bussinessName}</td>
                    </tr>
                  </tbody>
                )}

                {vhToShow.chosenEntity && (
                  <tbody>
                    <tr>
                      <td style={{ border: 'none' }}>
                        {vhToShow.chosenEntity.type === 'FINANCIAL'
                          ? 'Financiera'
                          : 'Consorcio'}
                      </td>
                      <td style={{ border: 'none', padding: 0 }}>
                        {vhToShow.chosenEntity.entity}
                      </td>
                      <td style={{ border: 'none', padding: 0 }}> </td>
                    </tr>
                  </tbody>
                )}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      padding: '0.5rem',
                      width: '35%',
                    }}
                  >
                    Plazo
                  </div>
                  <div
                    style={{
                      padding: '0.5rem',
                      width: '35%',
                    }}
                  >
                    {`${vhToShow.months}`} meses
                  </div>
                </div>
              </div>
            </td>
            {vhToShow.insuranceCarrier && (
              <tbody>
                <tr>
                  <td style={{ borderBottom: 'none' }}>SEGURO</td>
                  <td style={{ borderBottom: 'none' }}>
                    {vhToShow.insuranceCarrier.name}{' '}
                    {vhToShow.insuranceCarrier.years} año
                    {vhToShow.insuranceCarrier.years > 1 ? 's' : ''} por{' '}
                    {currenyFormat(vhToShow.insuranceCarrier.cost)} Inc. IVA
                  </td>
                  <td />
                </tr>
                <tr>
                  <td style={{ borderBottom: 'none' }}>MATRÍCULA</td>
                  <td style={{ borderBottom: 'none' }}>
                    {currenyFormat(vhToShow.registration)}
                  </td>
                  <td style={{ borderBottom: 'none' }} />
                </tr>
              </tbody>
            )}
            <td style={{ width: '35%' }}>
              <div style={{ height: '159px' }}>
                {vhToShow.mechanicalAppraisalQuote ? (
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ borderTop: 'none' }} colSpan={2}>
                          Vehículo parte de pago
                        </th>
                      </tr>
                      <tr>
                        <td>Marca</td>
                        <td>{vhToShow.mechanicalAppraisalQuote.brand}</td>
                      </tr>
                      <tr>
                        <td>Modelo</td>
                        <td>{vhToShow.mechanicalAppraisalQuote.model}</td>
                      </tr>
                      <tr>
                        <td>Año</td>
                        <td>{vhToShow.mechanicalAppraisalQuote.year}</td>
                      </tr>
                      <tr>
                        <td>Kilometraje (km)</td>
                        <td>{vhToShow.mechanicalAppraisalQuote.mileage}</td>
                      </tr>
                      {vhToShow.preOwnedSupplier && (
                        <>
                          <tr>
                            <th style={{ borderTop: 'none' }} colSpan={2}>
                              Proveedor de seminuevos
                            </th>
                          </tr>
                          <tr>
                            <td>Razón Social</td>
                            <td>{vhToShow.preOwnedSupplier.bussinessName}</td>
                          </tr>
                          <tr>
                            <td>Identificación</td>
                            <td>{vhToShow.preOwnedSupplier.identification}</td>
                          </tr>
                          <tr>
                            <td>Celular</td>
                            <td>{vhToShow.preOwnedSupplier.email}</td>
                          </tr>
                          <tr>
                            <td>Valor avalúo</td>
                            <td>
                              {currenyFormat(
                                vhToShow.preOwnedSupplier?.appraisalValue ?? 0,
                                true
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>¿Aceptó la oferta?</td>
                            <td>
                              {vhToShow.preOwnedSupplier.acceptedAppraisal
                                ? 'SI'
                                : 'NO'}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    No posee avalúo mecánico
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const resumenNegocio = () => {
    return (
      <table
        style={{
          border: '1px solid rgb(179 177 177)',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th colSpan={2}>Resumen del Negocio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                border: '1px solid rgb(179 177 177)',
                maxWidth: '50%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '100%',
                  }}
                >
                  <div style={{ width: '50%' }} />
                  <b style={{ padding: '0.5rem', width: '50%' }}>Total</b>
                </div>
                <hr style={{ margin: '0', marginBlockStart: '0' }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '100%',
                  }}
                >
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    Valor vehículos
                  </span>
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    {currenyFormat(
                      vehiclesToShow[0].exonerated
                        ? totalSummaryValues.totalValueVehiclesWithoutLegals
                        : totalSummaryValues.totalValueVehiclesWithoutLegals *
                            1.12
                    )}
                    {vehiclesToShow[0].exonerated ? 'sin IVA' : ' inc. IVA'}
                  </span>
                </div>
                <hr style={{ margin: '0' }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '100%',
                  }}
                >
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    Valor Seguro
                  </span>
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    {currenyFormat(totalSummaryValues.totalValueInsurance)} Inc.
                    IVA
                  </span>
                </div>
                <hr style={{ margin: '0' }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '100%',
                  }}
                >
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    Servicios
                  </span>
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    {currenyFormat(
                      totalSummaryValues.totalValuesServices * 1.12
                    )}
                    Inc. IVA
                  </span>
                </div>
                <hr style={{ margin: '0' }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '100%',
                  }}
                >
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    Accesorios
                  </span>
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    {currenyFormat(
                      totalSummaryValues.totalValuesAccesories * 1.12
                    )}
                    Inc. IVA
                  </span>
                </div>
                <hr style={{ margin: '0' }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '100%',
                  }}
                >
                  <span style={{ padding: '0.5rem', width: '50%' }}>Total</span>
                  <span style={{ padding: '0.5rem', width: '50%' }}>
                    {currenyFormat(totalSummaryValues.totalValues)} Inc. IVA
                  </span>
                </div>
                <hr style={{ margin: '0' }} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '400px',
                  }}
                >
                  <hr style={{ width: '95%' }} />
                  <span>Asesor Comercial</span>
                </div>
              </div>
            </td>
            <td
              style={{
                border: '1px solid rgb(179 177 177)',
                width: '50%',
                height: '640px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    padding: '0.5rem',
                    borderBottom: '1px solid rgb(179 177 177)',
                  }}
                >
                  <span style={{ width: '50%' }}>Descuento</span>
                  <span style={{ width: '50%' }}>
                    {lead.discount ?? 0}% - {currenyFormat(discountMount)}
                  </span>
                </div>
                <div
                  style={{
                    padding: '0.5rem',
                    height: '33.7%',
                    borderBottom: '1px solid rgb(179 177 177)',
                  }}
                ></div>
                <div style={{ padding: '0.5rem' }}>
                  <h3>Comentarios</h3>
                  <span style={{ fontSize: '0.75rem' }}>{notesRender()}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '50%',
                  }}
                >
                  {prebillStatus === 'APPROVED' &&
                    (user.role === 'JEFE DE VENTAS' ||
                      user.role === 'GERENTE DE MARCA') && (
                      <div>
                        <div
                          className="ant-result-icon"
                          style={{ color: '#52c41a' }}
                        >
                          <span
                            role="img"
                            aria-label="check-circle"
                            className="anticon anticon-check-circle"
                          >
                            <svg
                              viewBox="64 64 896 896"
                              focusable="false"
                              data-icon="check-circle"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                            </svg>
                          </span>
                        </div>
                        <span style={{ color: 'black', fontSize: '1.5rem' }}>
                          Prefactura Aprobada
                        </span>
                      </div>
                    )}

                  {prebillStatus === 'REJECTED' &&
                    (user.role === 'JEFE DE VENTAS' ||
                      user.role === 'GERENTE DE MARCA') && (
                      <div>
                        <div className="ant-result-icon">
                          <span
                            role="img"
                            aria-label="close-circle"
                            className="anticon anticon-close-circle"
                          >
                            <svg
                              viewBox="64 64 896 896"
                              focusable="false"
                              data-icon="close-circle"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
                            </svg>
                          </span>
                        </div>
                        <span style={{ color: 'black', fontSize: '1.5rem' }}>
                          Prefactura Rechasada
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const notesRender = () => {
    return (
      <div>
        {notes.length === 0 ? (
          <div />
        ) : (
          <div className="bold">
            {notes.map((item, index) => {
              return (
                <div className="mb-3" key={`${index}`}>
                  <small
                    className="regular"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {(item.name || '').toLowerCase()}
                    <b className="bold">({item.type.toLowerCase()})</b>
                  </small>
                  <p className="normal">{item.texto}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ margin: '4rem', paddingBottom: '4rem' }}>
      <h3 style={{ padding: '0.5rem 0' }}>Prefactura</h3>
      {datos}
      {vehiculosAFacturar()}
      {resumenNegocio()}
    </div>
  );
};

export default PrintPrefecture;
