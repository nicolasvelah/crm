/* eslint-disable react/jsx-curly-brace-presence */
import React, { FunctionComponent, useEffect, useState } from 'react';
import './css/funnel.css';

import { FunnelInput } from '../../../data/providers/apollo/queries/funnel';
// eslint-disable-next-line import/order
import { Radio, Select, Divider, Tooltip } from 'antd';
import { RangeDates } from '../../Follow/components/MainFollow';
import auth from '../../../utils/auth';

import { UserType } from '../../../data/models/User';
import DealerPicker from '../../../components/Prospect/DealerPicker';

import LoadingDashboard from '../../../components/LoadingDashboard';
import Leads from '../../../data/models/Leads';
import { getStateOfLead, StateLead } from '../../../utils/extras';
import QuoteFinancial from '../../../data/models/Quoute-Financial';

const { Option } = Select;

interface UserPicker {
  id: number;
  lastandname: string;
  disabled: boolean;
}

interface SecondaryValues {
  amountLeads: number;
  amountLeadsWithQuote: number;
  amountQuotesWithCredits: number;
  amountQuotesWithCreditsAndRequest: number;
  amountQuotesWithCreditsAndApprobedRequest: number;
  amountQuotes: number;
  amountQuotesInClose: number;
  amountFleetsRequest: number;
  amountFleetsApprobedRequest: number;
}

interface NameCodelInterface {
  name: string;
  code: string;
}
interface ConcesionarioSucursal {
  selectedConcesionario: NameCodelInterface | null;
  selectedSucursal: NameCodelInterface | null;
  dataDealer: any[];
}
interface FilterOptions {
  concesionarioSucursal: {
    concesionarioSucursal: ConcesionarioSucursal;
    activate: boolean;
  } | null;
  employees: { employees: NameCodelInterface[]; activate: boolean } | null;
  channel: { channel: string[]; activate: boolean } | null;
  brands: { brands: string[]; activate: boolean } | null;
  campaign: { campaign: string[]; activate: boolean } | null;
}

interface ClientsByChannels {
  channel: string;
  numberClients: number;
}

const Funnel: FunctionComponent<{
  rangeDate: RangeDates;
  allLeads: Leads[];
}> = ({ rangeDate, allLeads }) => {
  /******************************HOOKS*****************************************/
  // Datos de usuario
  const { user } = auth;
  // Setea los datos del Funnel
  const [data, setData] = useState<FunnelInput[]>([]);

  /////////////
  const [secondaryValues, setSecondaryValues] = useState<SecondaryValues>({
    amountLeads: allLeads.length,
    amountLeadsWithQuote: 0,
    amountQuotesWithCredits: 0,
    amountQuotesWithCreditsAndRequest: 0,
    amountQuotesWithCreditsAndApprobedRequest: 0,
    amountQuotes: 0,
    amountQuotesInClose: 0,
    amountFleetsRequest: 0,
    amountFleetsApprobedRequest: 0,
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    employees: null,
    brands: null,
    channel: null,
    concesionarioSucursal: null,
    campaign: null,
  });

  const [leadsFiltered, setLeadsFiltered] = useState<Leads[]>([]);

  // Estado para contralar el filtro seleccionado por el usuaruio
  const [filterValue, setFilterValue] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  /******************************GENERALFUNCTIONAPI****************************/

  const getEmployeesFromLeads = (leads: Leads[]): NameCodelInterface[] => {
    const employees: NameCodelInterface[] = [];
    leads.forEach((lead) => {
      const userLead = lead.user;
      const isOnTheList = !!employees.find((itemEmployee) => {
        if (lead.toReasign) {
          return itemEmployee.code === 'reasign';
        }
        return itemEmployee.code === userLead.codUsuario;
      });
      if (!isOnTheList) {
        if (lead.toReasign) {
          employees.push({
            code: 'reasign',
            name: 'Sin asesor',
          });
        } else {
          employees.push({
            code: userLead!.codUsuario!,
            name: `${userLead.nombre} ${userLead.apellido}`,
          });
        }
      }
    });
    return employees;
  };

  const getChannelsFromLeads = (leads: Leads[]): string[] => {
    const channels: string[] = [];
    leads.forEach((lead) => {
      /* const { client } = lead;
      const isOnTheList = !!channels.find(
        (itemChannel) => itemChannel === client.chanel
      );
      if (!isOnTheList && client?.chanel) {
        channels.push(client.chanel);
      } */
      const isOnTheList = !!channels.find((itemChannel) => {
        return (
          itemChannel === lead.chanel ||
          (!lead.chanel && itemChannel === 'Ninguno')
        );
      });
      if (!isOnTheList) {
        channels.push(lead.chanel ?? 'Ninguno');
      }
    });
    // console.log('channels -->', channels);
    return channels;
  };

  const getCampaignsFromLeads = (leads: Leads[]): string[] => {
    const campaigns: string[] = [];
    leads.forEach((lead) => {
      const isOnTheList = !!campaigns.find((itemCampaign) => {
        return (
          itemCampaign === lead.campaign ||
          (!lead.campaign && itemCampaign === 'Ninguna')
        );
      });
      if (!isOnTheList) {
        campaigns.push(lead.campaign ?? 'Ninguna');
      }
    });
    // console.log('channels -->', channels);
    return campaigns;
  };

  const activateUserFilters = () => {
    const { role } = user;
    // console.log('user -->', user);

    const employees = getEmployeesFromLeads(allLeads);
    // console.log('employees -->', employees);
    const channels = getChannelsFromLeads(allLeads);
    const campaign = getCampaignsFromLeads(allLeads);

    const options: FilterOptions = {
      employees: null,
      brands: null,
      channel: null,
      concesionarioSucursal: null,
      campaign: null,
    };
    switch (role) {
      case UserType.JEFE_VENTAS:
        options.concesionarioSucursal = {
          concesionarioSucursal: {
            selectedConcesionario: null,
            selectedSucursal: null,
            dataDealer: user.dealer ?? [],
          },
          activate: false,
        };
        options.channel = {
          channel: channels,
          activate: false,
        };
        options.employees = {
          employees,
          activate: false,
        };
        options.campaign = {
          campaign,
          activate: false,
        };
        break;

      case UserType.GERENTE:
        options.concesionarioSucursal = {
          concesionarioSucursal: {
            selectedConcesionario: null,
            selectedSucursal: null,
            dataDealer: user.dealer ?? [],
          },
          activate: false,
        };
        options.channel = {
          channel: channels,
          activate: false,
        };
        options.campaign = {
          campaign,
          activate: false,
        };
        options.employees = {
          employees,
          activate: false,
        };
        options.brands = {
          brands: user?.brand ?? [],
          activate: false,
        };
        break;

      case UserType.ASESOR:
        options.channel = {
          channel: channels,
          activate: false,
        };
        options.campaign = {
          campaign,
          activate: false,
        };
        options.brands = {
          brands: user?.brand ?? [],
          activate: false,
        };
        break;

      case UserType.F_Y_I:
      case UserType.CARTERA:
        options.concesionarioSucursal = {
          concesionarioSucursal: {
            selectedConcesionario: null,
            selectedSucursal: null,
            dataDealer: user.dealer ?? [],
          },
          activate: false,
        };
        break;

      default:
        break;
    }
    // console.log('options -->', options);

    setFilterOptions(options);
  };

  useEffect(() => {
    activateUserFilters();
  }, []);

  const dataFunnel = async (leadList?: Leads[]) => {
    setLoading(true);
    let leads: Leads[] = [...allLeads];
    if (leadList) {
      leads = [...leadList];
    }

    const secondary: SecondaryValues = {
      amountLeads: 0,
      amountLeadsWithQuote: 0,
      amountQuotesWithCredits: 0,
      amountQuotesWithCreditsAndRequest: 0,
      amountQuotesWithCreditsAndApprobedRequest: 0,
      amountQuotes: 0,
      amountQuotesInClose: 0,
      amountFleetsRequest: 0,
      amountFleetsApprobedRequest: 0,
    };

    console.log('leads -->', leads);
    const prospecting: FunnelInput = {
      etapa: 'Prospección',
      cantidad: 0,
    };
    const traffic: FunnelInput = {
      etapa: 'Tráfico',
      cantidad: 0,
    };
    const presentation: FunnelInput = {
      etapa: 'Presentación',
      cantidad: 0,
    };
    const quotes: FunnelInput = {
      etapa: 'Cotizaciones',
      cantidad: 0,
    };
    const requests: FunnelInput = {
      etapa: 'Solicitudes',
      cantidad: 0,
    };
    const approbed: FunnelInput = {
      etapa: 'Aprobaciones',
      cantidad: 0,
    };
    const close: FunnelInput = {
      etapa: 'Cierre',
      cantidad: 0,
    };
    const delivery: FunnelInput = {
      etapa: 'Entrega',
      cantidad: 0,
    };

    leads.forEach((lead: Leads) => {
      if (lead.saleDown || lead.statusSaleDown === 'solicitada') {
        return;
      }
      /////// Secondary Values /////
      secondary.amountLeads += 1;

      if (!lead.inquiry || lead.inquiry?.length === 0) {
        prospecting.cantidad = (prospecting.cantidad ?? 0) + 1;
      }
      if ((lead.inquiry?.length ?? 0) > 0 && !lead.workPage) {
        prospecting.cantidad = (prospecting.cantidad ?? 0) + 1;
        traffic.cantidad = (traffic.cantidad ?? 0) + 1;
      }
      if (lead.inquiry && lead.inquiry.length > 0 && lead.workPage) {
        prospecting.cantidad = (prospecting.cantidad ?? 0) + 1;
        traffic.cantidad = (traffic.cantidad ?? 0) + 1;
        presentation.cantidad = (presentation.cantidad ?? 0) + 1;
      }

      if (lead.quotes && lead.quotes.length > 0) {
        quotes.cantidad = (quotes.cantidad ?? 0) + lead.quotes.length;

        const requestToFyI = lead.quotes.filter((quo) => !!quo.sendToFyI);
        requests.cantidad = (requests.cantidad ?? 0) + requestToFyI.length;

        const approbedRequests: QuoteFinancial[] = [];
        lead.quotes.forEach((quo) => {
          const newQuoteFinancials =
            quo.quoteFinancial?.filter((qF) => {
              return (
                (qF.responseBank === 'APPROBED' ||
                  qF.responseBank === 'PREAPPROBED') &&
                qF.financial &&
                qF.financial.nameEntityFinancial?.toUpperCase() !== 'CRM'
              );
            }) ?? [];
          approbedRequests.push(...newQuoteFinancials);
        });
        approbed.cantidad = (approbed.cantidad ?? 0) + approbedRequests.length;

        const quotesInClose = !!lead.quotes.find((quo) => !!quo.closed);
        close.cantidad = (close.cantidad ?? 0) + (quotesInClose ? 1 : 0);

        const quotesInDelivery = !!lead.quotes.find((quo) => !!quo.delivery);
        delivery.cantidad =
          (delivery.cantidad ?? 0) + (quotesInDelivery ? 1 : 0);

        /////// Secondary Values /////
        secondary.amountLeadsWithQuote += 1;
        secondary.amountQuotes += lead.quotes.length;
        secondary.amountQuotesWithCredits += lead.quotes.filter(
          (quo) => quo.type === 'credit'
        ).length;
        secondary.amountQuotesWithCreditsAndRequest += requestToFyI.length;
        secondary.amountQuotesWithCreditsAndApprobedRequest +=
          approbedRequests.length;
        secondary.amountQuotesInClose += lead.quotes.filter(
          (quo) => !!quo.closed
        ).length;
        /////// Secondary Values /////
      }

      //Fleets
      if (lead.isFleet) {
        const requestToFyI = lead.leadsQuoteFinancial?.sendToFyI;
        requests.cantidad = (requests.cantidad ?? 0) + (requestToFyI ? 1 : 0);

        const approbedRequests =
          lead.leadsQuoteFinancial?.quoteFinancial?.filter(
            (qF) => !!qF.selected && requestToFyI
          );

        approbed.cantidad =
          (approbed.cantidad ?? 0) +
          (approbedRequests ? approbedRequests.length : 0);

        /////// Secondary Values /////
        secondary.amountFleetsRequest += requestToFyI ? 1 : 0;
        secondary.amountFleetsApprobedRequest += approbedRequests
          ? approbedRequests.length
          : 0;
        /////// Secondary Values /////
      }
    });

    const orderData = [
      prospecting,
      traffic,
      presentation,
      quotes,
      requests,
      approbed,
      close,
      delivery,
    ];
    // console.log('orderData -->', orderData);
    setData(orderData);
    // console.log('secondary -->', secondary);
    setSecondaryValues(secondary);

    setLoading(false);
  };

  useEffect(() => {
    setLeadsFiltered(allLeads);
    activateUserFilters();
    setFilterValue(undefined);
  }, [allLeads]);

  useEffect(() => {
    dataFunnel(leadsFiltered);
  }, [leadsFiltered]);

  // Calculo de los porcentajes
  const calcPercetage = (value: number, total: number) => {
    if (total === 0) {
      return '0 %';
    }
    return `${
      Number.isInteger((value * 100) / total)
        ? ((value * 100) / total).toFixed(0)
        : ((value * 100) / total).toFixed(2)
    } %`;
  };

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  /******************************HOOKS*****************************************/

  const selectBrand = (value: string) => {
    const newLeads = allLeads.filter((itemLeads) => {
      return !!itemLeads.quotes?.find(
        (quo) => !!quo.vehiculo?.find((vh) => vh.brand === value)
      );
    });
    setLeadsFiltered(newLeads);
  };

  const selectChannel = (value: string) => {
    const newLeads = allLeads.filter((itemLeads) => itemLeads.chanel === value);
    setLeadsFiltered(newLeads);
  };

  const selectCampaign = (value: string) => {
    // console.log('value selectCampaign -->', value);
    const newLeads = allLeads.filter((itemLead) => {
      if (!itemLead.campaign) {
        return value === 'Ninguna';
      }
      return itemLead.campaign === value;
    });
    setLeadsFiltered(newLeads);
  };

  const selectEmployee = (value: string) => {
    // console.log('value employee -->', value);
    const newLeads = allLeads.filter((itemLead) => {
      if (itemLead.toReasign) {
        return value === 'reasign';
      }
      return itemLead.user?.codUsuario === value;
    });
    setLeadsFiltered(newLeads);
  };

  const selectConcesionarioSucursal = (valueCodigoID: any, label: any) => {
    if (typeof valueCodigoID === 'object' && valueCodigoID.length > 1) {
      const newLeads = allLeads.filter((lead) => {
        return (
          lead.concesionario?.code === valueCodigoID[0] &&
          lead.sucursal?.code === valueCodigoID[1].toString()
        );
      });
      setLeadsFiltered(newLeads);
    }
  };

  const getStepFunnel = (step: string) => {
    switch (step) {
      case 'Prospección':
      case 'Tráfico':
      case 'Presentación':
      case 'Cierre':
      case 'Entrega':
        return 'negocios';

      default:
        return 'cotizaciones';
    }
  };

  const changeOptionFilter = (e: any) => {
    const key: string = e.target.value;
    const options: any = { ...filterOptions };
    // console.log('options -->', options);
    // console.log('key -->', key);
    const optionSelected = options[key];
    if (optionSelected) {
      Object.keys(filterOptions).forEach((keyOption) => {
        // console.log('options[keyOption] -->', options[keyOption]);
        if (keyOption === key) {
          options[keyOption].activate = true;
        } else if (options[keyOption]) {
          options[keyOption].activate = false;
        }
      });
    }
    setFilterOptions(options);
    setFilterValue(key);
    setLeadsFiltered(allLeads);
  };

  /*******************************RETURN***************************************/
  return (
    <div style={{ margin: 'auto' }}>
      <div className="flex">
        <div
          className="w-3/12"
          style={{
            backgroundColor: '#f8f9f9d1',
            padding: '20px 30px',
            borderRadius: '5px',
          }}
        >
          <div>Selecione una opción:</div>
          <div className="mt-5">
            <Radio.Group onChange={changeOptionFilter} value={filterValue}>
              {filterOptions.concesionarioSucursal && (
                <Radio value="concesionarioSucursal" style={radioStyle}>
                  Concesionario/sucursal
                </Radio>
              )}
              {filterOptions.employees && (
                <Radio value="employees" style={radioStyle}>
                  Empleados
                </Radio>
              )}
              {filterOptions.channel && (
                <Radio value="channel" style={radioStyle}>
                  Canal
                </Radio>
              )}
              {filterOptions.campaign && (
                <Radio value="campaign" style={radioStyle}>
                  Campaña
                </Radio>
              )}
              {filterOptions.brands && (
                <Radio value="brands" style={radioStyle}>
                  Marca
                </Radio>
              )}
            </Radio.Group>
          </div>
          {filterOptions.concesionarioSucursal?.activate && (
            <DealerPicker
              widthInput={200}
              placeholderInput="Concesionario / Sucursal"
              getDataDealerPicker={selectConcesionarioSucursal}
            />
          )}
          {filterOptions.employees?.activate && (
            <div>
              <br />
              <Select
                placeholder="Empleados"
                style={{ width: 200 }}
                allowClear
                onChange={selectEmployee}
              >
                {filterOptions.employees &&
                  filterOptions.employees.employees.map(
                    (itemEmployee, index) => (
                      <Option key={index} value={itemEmployee.code}>
                        {itemEmployee.name}
                      </Option>
                    )
                  )}
              </Select>
              <br />
            </div>
          )}

          {filterOptions.channel?.activate && (
            <div>
              <br />
              <Select
                placeholder="Canales"
                style={{ width: 200 }}
                allowClear
                onChange={selectChannel}
              >
                {filterOptions.channel.channel.map((itemChannel) => (
                  <Option key={itemChannel} value={itemChannel}>
                    {itemChannel}
                  </Option>
                ))}
              </Select>
              <br />
            </div>
          )}

          {filterOptions.campaign?.activate && (
            <div>
              <br />
              <Select
                placeholder="Campañas"
                style={{ width: 200 }}
                allowClear
                onChange={selectCampaign}
              >
                {filterOptions.campaign.campaign.map((itemCampaign) => (
                  <Option key={itemCampaign} value={itemCampaign}>
                    {itemCampaign}
                  </Option>
                ))}
              </Select>
              <br />
            </div>
          )}

          {filterOptions.brands?.activate && (
            <div>
              <br />
              <Select
                placeholder="Marca"
                style={{ width: 200 }}
                allowClear
                onChange={selectBrand}
              >
                {filterOptions.brands.brands.map((itemBrand, index) => (
                  <Option key={index} value={itemBrand}>
                    {itemBrand}
                  </Option>
                ))}
              </Select>
              <br />
            </div>
          )}

          <Divider />
        </div>
        <div className="w-2/12">
          <Item title="Prospección" color="rgba(53, 195, 201, 1)" />
          <Item title="Tráfico" color="rgba(53, 201, 161, 1)" />
          <Item title="Presentación" color="rgba(53, 201, 93, 1)" />
          <Item title="Cotizaciones" color="rgba(110, 201, 53, 1)" />
          <Item title="Solicitudes" color="rgba(161, 201, 53, 1)" />
          <Item title="Aprobaciones" color="rgba(201, 184, 53, 1)" />
          <Item title="Cierre" color="rgba(201, 127, 53, 1)" />
          <Item title="Entrega" color="rgba(201, 59, 53, 1)" />
        </div>
        <div
          className="inline-block w-7/12 min-h-full leading-3 text-base"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {data && data.length > 0 ? (
            data.map((dataFunnelMap, index) => (
              <Tooltip
                placement="top"
                title={() => {
                  return (
                    <div className="ml-3">
                      {dataFunnelMap.cantidad}{' '}
                      {dataFunnelMap.etapa
                        ? getStepFunnel(dataFunnelMap.etapa)
                        : ''}{' '}
                      están en la etapa {'"'}
                      {dataFunnelMap.etapa ?? ''}
                      {'"'}
                    </div>
                  );
                }}
                color="#ff8f00e8"
                key={index}
              >
                <div
                  // key={`index_${index}`}
                  className={`funnel-level funnel-level-${
                    index + 1
                  } h-8 m-auto text-center mb-2`}
                >
                  <span>{dataFunnelMap.cantidad}</span>
                </div>
              </Tooltip>
            ))
          ) : (
            <span>
              <div className="funnel-level funnel-level-1 h-8 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-2 h-8 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-3 h-8 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-4 h-8 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-5 h-8 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-6 h-8 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-7 h-10 m-auto text-center mb-2">
                <span>0</span>
              </div>
              <div className="funnel-level funnel-level-8 h-10 m-auto text-center mb-2">
                <span>0</span>
              </div>
            </span>
          )}

          <div className="funnel-percentages">
            <div className="funnel-percentages-items funnel-percentages-item-1 mb-2">
              <span style={{ color: '#9e9e9ede' }}>
                Cant. Negocios: {secondaryValues.amountLeads}
              </span>

              <br />
              <span>
                <b>
                  {calcPercetage(
                    secondaryValues.amountLeadsWithQuote,
                    secondaryValues.amountLeads
                  )}
                </b>{' '}
                de los negocios han sido cotizados.
              </span>
            </div>
            <div className="funnel-percentages-items funnel-percentages-item-2 mb-5">
              <span style={{ color: '#9e9e9ede' }}>
                Cotizaciones con crédito: 
                {secondaryValues.amountQuotesWithCredits}
              </span>
              <br />
              <span>
                <b>
                  {calcPercetage(
                    secondaryValues.amountQuotesWithCreditsAndRequest,
                    secondaryValues.amountQuotesWithCredits
                  )}
                </b>
                 de las cotizaciones con crédito cuentan con una solicitud
                vinculada.
              </span>
            </div>
            <div className="funnel-percentages-items funnel-percentages-item-3">
              <span style={{ color: '#9e9e9ede' }}>
                Solicitudes de flotas enviadas: 
                {secondaryValues.amountFleetsRequest}
              </span>
              <br />
              <span>
                <b>
                  {calcPercetage(
                    secondaryValues.amountFleetsApprobedRequest,
                    secondaryValues.amountFleetsRequest
                  )}
                </b>{' '}
                de las solicitudes de flota han sido aprobadas.
              </span>
            </div>
            <div className="funnel-percentages-items funnel-percentages-item-3 mb-5">
              <span style={{ color: '#9e9e9ede' }}>
                Solicitudes enviadas: 
                {secondaryValues.amountQuotesWithCreditsAndRequest}
              </span>
              <br />
              <span>
                <b>
                  {calcPercetage(
                    secondaryValues.amountQuotesWithCreditsAndApprobedRequest,
                    secondaryValues.amountQuotesWithCreditsAndRequest
                  )}
                </b>{' '}
                de las solicitudes han sido aprobadas.
              </span>
            </div>
            <div className="funnel-percentages-items funnel-percentages-item-4">
              <span>
                <b>
                  {calcPercetage(
                    secondaryValues.amountQuotesInClose,
                    secondaryValues.amountQuotes
                  )}
                </b>{' '}
                de las cotizaciones han llegado al cierre.
              </span>
            </div>
          </div>
        </div>
      </div>
      <LoadingDashboard visible={loading} />
    </div>
  );
};

const Item: FunctionComponent<{
  title: string;
  color: string;
  active?: boolean;
}> = ({ title, color, active }) => {
  return (
    <div
      className="funnel-lavel-name flex w-auto items-center rounded"
      style={{ color }}
    >
      <div className={`bg-${color} rounded-full mx-2 h-2 w-2`} />
      <span className="mr-2">{title}</span>
    </div>
  );
};

export default Funnel;
