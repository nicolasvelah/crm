/* eslint-disable implicit-arrow-linebreak */
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
  Button,
  Alert,
  Modal,
  Divider,
  Row,
  Col,
  Spin,
  Tag,
  List,
  Tooltip,
  Drawer,
  Table,
  notification,
  InputNumber,
  Checkbox,
  message,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  LoginOutlined,
  CloseOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import Quotes from '../../../data/models/Quotes';
import QuoteButtons from './QuoteButtons';
import Result from './QuoteResult';
import {
  calcLegals,
  currenyFormat,
  calcTotal as calcTotalCredit,
  allValuesOfQuote,
  DataValuesQuote,
} from '../../../utils/extras';
import TableAccesories from '../../Closure/components/TableAccesories';
import TableServices from '../../Closure/components/TableServices';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import Box from './Box';
import Prebill from './Prebill';
import '../css/quote.css';
import FormOwnedSupplier from '../../MechanicalAppraisal/components/FormOwnedSupplier';
import { ClientLeadContext } from '../../../components/GetClientData';
import FinancialRepository from '../../../data/repositories/financial-repository';
import auth from '../../../utils/auth';
import Leads from '../../../data/models/Leads';
import LeadsRepository from '../../../data/repositories/leads-repository';
import ReservationVIN from './ReservationVIN';
import QuoteFinancialRepository from '../../../data/repositories/quote-financial-repository';
import Loading from '../../../components/Loading';
import SelectFinancialConsorcium, {
  switchResponseBank,
} from './SelectFinancialConsorcium';
import PrintPrefecture from './PrintPrefecture ';
import VchatContext from '../../Vchat/components/VchatContext';
import CreditApplicationFleets from '../../lead/components/CreditApplicationFleets';
import { Vehicle } from '../../../data/models/Vehicle';
import NewCreditApplication from '../../lead/steps/new-credit-application/NewCreditApplication2';
import SelectFinancialFleet from './SelectFinancialFleet';
import { verifyStatusPrebill } from '../../../utils/step-extras';

const ItemQuote: FunctionComponent<{
  dataVehicle: any;
  showModal: Function;
  setModalVehicle: Function;
  deleteData: Function;
  writeData: Function;
  setInactives: Function;
  inactives: any[];
  isTherePrebill?: boolean;
}> = ({
  dataVehicle,
  showModal,
  setModalVehicle,
  deleteData,
  writeData,
  setInactives,
  inactives,
  isTherePrebill,
}) => {
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const { lead } = useContext(ClientLeadContext);

  useEffect(() => {
    const componentdidmount = async () => {
      if (dataVehicle.closed === true) {
        setInactives((prevState2: any) => [...prevState2, dataVehicle.id]);
      }
    };
    componentdidmount();
  }, [dataVehicle]);

  const vehicle = dataVehicle.vehiculo ? dataVehicle.vehiculo[0] : [];
  //console.log('dataVehicle internal', dataVehicle);
  return dataVehicle ? (
    <Col xl={6} lg={6} md={8}>
      <div
        className={`quoteNatural ${
          inactives.find((item: number) => item === dataVehicle.id)
            ? 'quoteClosed'
            : null
        }`}
        style={{
          border: '1px solid #ccc',
          minHeight: 240,
          paddingBottom: 80,
          height: '100%',
        }}
      >
        <div className="topTags">
          <Tag color="#108ee9" style={{ marginRight: 10, marginLeft: 2 }}>
            {dataVehicle.id}
          </Tag>
          <Tag color={dataVehicle.type === 'counted' ? 'green' : 'volcano'}>
            {dataVehicle.type === 'counted' ? 'Contado' : 'Crédito'}
          </Tag>
          {dataVehicle.exonerated ? <Tag color="purple">Exonerado</Tag> : null}
          {inactives.find((item: number) => item === dataVehicle.id) && (
            <Tag color="#f50">CIERRE</Tag>
          )}
        </div>

        <LazyLoadImage
          className="w-full"
          placeholder={<Spin />}
          effect="blur"
          src={vehicle.imgs}
        />
        <div
          style={{
            marginTop: 20,
            paddingTop: 20,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <div className="quoteCardFooter">
            <div>
              {vehicle.brand} {vehicle.model} - {vehicle.year}
            </div>
            <div>
              <b>
                {' '}
                {dataVehicle.exonerated === null
                  ? `${currenyFormat(
                      dataVehicle.vehiculo[0].pvp * 1.12
                    )} Inc. IVA`
                  : currenyFormat(dataVehicle.vehiculo[0].pvp)}
              </b>
            </div>

            <div style={{ marginTop: 10 }}>
              {/*console.log('isTherePrebill', isTherePrebill)*/}
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  //console.log({ dataVehicle });
                  setModalVehicle(dataVehicle);
                  showModal();
                }}
              >
                ABRIR
              </Button>
              {!inactives.find((item: number) => item === dataVehicle.id) ? (
                <Tooltip title="Agregar al Cierre">
                  <Button
                    type="primary"
                    disabled={!!isTherePrebill || !!lead?.saleDown}
                    onClick={() => writeData(dataVehicle)}
                    style={{ marginLeft: 10 }}
                    shape="circle"
                    size="small"
                    icon={<PlusOutlined />}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  color={!dataVehicle.vimVehiculo ? 'red' : 'orange'}
                  title={
                    !dataVehicle.vimVehiculo
                      ? 'Quitar del Cierre'
                      : `Tienes un VIN asignado ${dataVehicle.vimVehiculo}`
                  }
                >
                  <Button
                    danger
                    onClick={() => deleteData(dataVehicle)}
                    style={{ marginLeft: 10 }}
                    shape="circle"
                    size="small"
                    icon={<CloseOutlined />}
                    disabled={!!dataVehicle.vimVehiculo || !!lead?.saleDown}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </Col>
  ) : null;
};

const QuotesGenerated: FunctionComponent<{
  title: string;
  dataQuote: Array<Quotes>;
  nextStep: Function;
  sendQuoteMail: Function;
  loading?: boolean;
  idLead?: any;
  setViewTestDriver?: Function;
  setSelectNewVehicle?: Function;
}> = ({
  title = '',
  dataQuote,
  nextStep,
  sendQuoteMail,
  loading,
  setViewTestDriver,
  idLead,
  setSelectNewVehicle,
}) => {
  const { client, lead, setLead } = useContext(ClientLeadContext);
  const { vchatActivated } = useContext(VchatContext);
  const leadRepository = Get.find<LeadsRepository>(Dependencies.leads);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const financialRepository = Get.find<FinancialRepository>(
    Dependencies.financial
  );
  const {
    quoteFinancialMutationProvider: { updateSelectedQuoteFinancialById },
  } = Get.find<QuoteFinancialRepository>(Dependencies.quoteFinancial);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalVehicle, setModalVehicle] = useState<any>(null);
  const [isThereClousure, setIsThereClousure] = useState<boolean>(false);
  const [closeQuotesShow, setCloseQuotesShow] = useState<boolean>(false);
  const [loadingchosenEntity, setLoadingchosenEntity] = useState<boolean>(
    false
  );
  const [modalPrevillShow, setModalPrevillShow] = useState<boolean>(false);
  const [quotesToClouse, setQuotesToClouse] = useState<any>([]);
  const [TotalPvps, setTotalPvps] = useState<number>(0);
  const [ivaTotal, setIvaTotal] = useState<number>(0);
  const [ivaSubTotal, setIvaSubTotal] = useState<number>(0);
  const [ivaOthers, setIvaOthers] = useState<number>(0);
  const [TotalOtros, setTotalOtros] = useState<number>(0);
  const [Total, setTotal] = useState<number>(0);
  const [SubTotalDescuento, setSubTotalDescuento] = useState<number>(0);
  const [MontoDescuento, setMontoDescuento] = useState<number>(0);
  const [discountContext, setDiscountContext] = useState<number>(0);
  const [financieras, setFinancieras] = useState<any>([]);
  const [consorcio, setConsorcio] = useState<
    { item: string; value: string; id: number }[]
  >([]);
  const { user } = auth;
  const [inactivesCloseButton, setInactivesCloseButton] = useState<any[]>([]);
  const [vehiclesToShow, setVehiclesToShow] = useState<any[]>([]);
  const [vin, setVin] = useState<any[] | null>([]);
  const [payThirdPerson, setPayThirdPerson] = useState<boolean>(false);
  const [descuento, setDescuento] = useState<number>(0);
  //
  const [cierreTotal, setCierreTotal] = useState<number>(0);
  //
  const [totalPVPCierre, setTotalPVPCierre] = useState<number>(0);
  const [load, setLoad] = useState<boolean>(false);

  ///////////////////////////////////////////
  //
  /// FLEETS
  const [dataFleet, setDataFleet] = useState<{
    idLeadsQuoteFinancial: number;
    isFleetCreditApplication: boolean;
    vehicles: Vehicle[];
  } | null>(null);

  //CREDIT APPLICATION
  const [showDrawerCredit, setShowDrawerCredit] = useState<boolean>(false);
  const [
    dataVehicleCredit,
    setDataVehicleCredit,
  ] = useState<DataValuesQuote | null>(null);

  const closeDraweCredit = () => {
    setShowDrawerCredit(false);
    if (dataFleet) setDataFleet(null);
  };
  const openDraweCredit = () => setShowDrawerCredit(true);

  useEffect(() => {
    if (dataFleet) {
      openDraweCredit();
    }
  }, [dataFleet]);

  useEffect(() => {
    if (modalVehicle) {
      setDataVehicleCredit(allValuesOfQuote(modalVehicle));
    } else {
      setDataVehicleCredit(null);
    }
  }, [modalVehicle]);
  //
  ///////////////////////////////////////////

  const getApi = async (url: string, body: any) => {
    try {
      const token = await auth.getAccessToken();
      const response = await axios({
        url: `${process.env.REACT_APP_API_URL}${url}`,
        method: 'POST',
        data: body,
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      });
      return response.data;
    } catch (error) {
      //console.log('Error Liberate Vin', error.message);
      return null;
    }
  };

  const calcTotalOtros = (record: any) =>
    (record.servicesValue ?? 0) + (record.accesoriesValue ?? 0);

  const calcOtros = (record: any) => {
    if (record) {
      return (
        (record.registration ?? 0) +
        (record.type === 'credit'
          ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
          : 0) +
        (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
      );
    }
    return 0;
  };

  const calcTotal = (record: any) => {
    if (record) {
      return (
        (record.vehiculo ? record.vehiculo[0].pvp : 0) +
        (record.servicesValue ?? 0) +
        (record.accesoriesValue ?? 0) +
        (record.registration ?? 0) +
        (record.type === 'credit'
          ? calcLegals(record.vehiculo[0].pvp, true) / 1.12
          : 0) +
        (record.insuranceCarrier ? record.insuranceCarrier.cost / 1.12 : 0)
      );
    }
    return 0;
  };

  const calcDescount = (
    discount: number,
    TotalPvpsInput: number,
    totalValue?: number
  ) => {
    const descuentoSobreValorSinIva = TotalPvpsInput * (discount * 0.01);
    //console.log(
    //   'descuento',
    //   `Monto de descuento: ${TotalPvpsInput} * ${
    //     discount * 0.01
    //   } = ${descuentoSobreValorSinIva}`
    // );
    setSubTotalDescuento((totalValue ?? Total) - descuentoSobreValorSinIva);
    setMontoDescuento(descuentoSobreValorSinIva);
    setDiscountContext(discount);
    setCierreTotal((totalValue ?? Total) - descuentoSobreValorSinIva);
    setTotalPVPCierre(TotalPvpsInput - descuentoSobreValorSinIva);
  };

  const calcIvaWithDiscount = (discount: number) => {
    let ivaT = 0;
    dataQuote.forEach((quo) => {
      if (quo.closed && !quo.exonerated) {
        const vhWithDiscount =
          quo.vehiculo![0].pvp! - quo.vehiculo![0].pvp! * discount * 0.01;
        //console.log('debug_1', { vhWithDiscount });
        ivaT += vhWithDiscount * 0.12;
        //console.log('debug_2', { ivaT });
      }
    });
    setIvaSubTotal(ivaT);
  };

  useEffect(() => {
    const componentdidmount = async () => {
      if (dataQuote) {
        //console.log('DATAQUOTEEE !!!!!!!!!!!!!', dataQuote);
        setTotalPvps(0);
        setTotalOtros(0);
        setTotal(0);
        setVehiclesToShow([]);
        setQuotesToClouse([]);
        setIvaTotal(0);
        setIvaOthers(0);

        let totalpvsrepo = 0;
        let totalvaluerepo = 0;
        dataQuote.map((quo) => {
          //console.log('valores log quo', quo);
          if (quo.closed === true) {
            setQuotesToClouse((prevState: any) => [...prevState, quo]);
            setIsThereClousure(true);

            //console.log('quo.vimVehiculo', quo.vimVehiculo);
            if (quo.vimVehiculo) {
              setVin((prevState: any) => [
                ...prevState,
                { vin: quo.vimVehiculo, quoteId: quo.id },
              ]);
            }
            setTotalPvps((prevState) => {
              const result = prevState + quo.vehiculo![0].pvp!;
              totalpvsrepo = result;
              return result;
            });
            setTotalPVPCierre((prevState) => prevState + quo.vehiculo![0].pvp!);
            // eslint-disable-next-line no-use-before-define
            setTotalOtros((prevState) => prevState + calcTotalOtros(quo));
            // eslint-disable-next-line no-use-before-define
            setTotal((prevState) => {
              const result = prevState + calcTotal(quo);
              totalvaluerepo = result;
              return result;
            });
            setCierreTotal((prevState) => prevState + calcTotal(quo));
            if (!quo.exonerated) {
              setIvaTotal(
                (prevState) => prevState + quo.vehiculo![0].pvp! * 0.12
              );
              if (typeof lead?.discount === 'number') {
                setIvaSubTotal(
                  (prevState) =>
                    prevState + quo.vehiculo![0].pvp! * lead!.discount! * 0.12
                );
              }
            }
            /* ///calculo el iva de otros
            setIvaOthers((prevState) => {
             //console.log('valores log 0', {
                prevState,
                calc: calcOtros(quo) * 0.12,
              });
              return prevState + calcOtros(quo) * 0.12;
            }); */
          }
          //console.log('valores log fuera');
          if (quo.vimVehiculo) {
            setVin((prevState: any) => [
              ...prevState,
              { vin: quo.vimVehiculo, quoteId: quo.id },
            ]);
          }
          setVehiclesToShow((prevState) => [...prevState, quo]);
          return quo;
        });
        const size = 3;
        const arrayOfArrays = [];
        for (let i = 0; i < dataQuote.length; i += size) {
          arrayOfArrays.push(dataQuote.slice(i, i + size));
        }
        //setVehicles(arrayOfArrays);
        //console.log('USER', user, lead);
        if (lead && lead.sucursal && lead.sucursal.code) {
          const respEntities = await financialRepository.getFinancialsBySucursal(
            lead.sucursal.code,
            'CONSORTIUM'
          );
          if (respEntities) {
            //console.log('DEBUG', respEntities);
            const mapEntities = respEntities.map((enti) => ({
              item: enti.nameEntityFinancial!,
              value: enti.idSucursal!,
              id: enti.id,
            }));
            setConsorcio(mapEntities);
          }
          //console.log('RESP ENTITIES', respEntities);
        }
        if (typeof lead?.discount === 'number') {
          //console.log('Entro', lead!.discount!);
          setDescuento(lead!.discount!);
          calcDescount(Number(lead!.discount!), totalpvsrepo, totalvaluerepo);
          calcIvaWithDiscount(Number(lead!.discount!));
        } else {
          //console.log('NO ENTRO');
        }
        //console.log('DATA QUOTEEE generated', dataQuote);
        //console.log('vehicles', arrayOfArrays);
      }
    };
    componentdidmount();
  }, [dataQuote]);

  const showModal = () => {
    setModalShow(true);
  };

  const handleCancel = () => {
    setModalShow(false);
    setModalPrevillShow(false);
    setModalVehicle(null);
  };

  /*const reloadQuotes = () => {
    setVehiclesToShow([]);
    reload();
  };*/

  const showModallPrevill = () => {
    const resp = leadRepository.updateLeadDiscount(lead!.id!, descuento);
    if (resp) {
      message.success('Descuento actualizado');
      if (setLead) {
        setLead((prevState: any) => {
          const copia = prevState;
          copia.discount = descuento;
          return { ...copia };
        });
      }
      setModalPrevillShow(true);
    } else {
      message.error('Algo salió mal. Vuelve a intentarlo.');
    }
  };

  const verifyVins = async () => {
    setLoad(true);
    /* if (
      lead &&
      lead.prebill &&
      lead.prebill.length > 0 &&
      lead.prebill[0].accepted
    ) */
    if (lead?.prebill && lead.prebill[lead.prebill.length - 1]?.accepted) {
      //console.log('log verifyVINs ENTREGA');
      setLoad(false);
      setCloseQuotesShow(true);

      return;
    }
    const ids = lead?.quotes
      ?.filter((vh) => vh.closed && vh.vimVehiculo && vh.vimVehiculoData)
      ?.map((vh) => vh.id);
    //console.log('log verifyVINs IDS', ids);

    if (ids && ids.length > 0) {
      const resp = await quouteRepository.verifyVINs(ids as number[]);
      //console.log('log verifyVINs', resp);
      if (resp) {
        resp.forEach(
          (element: {
            idQuote: number;
            changed: boolean;
            message: string;
            vin: string;
          }) => {
            if (element.changed) {
              notification.warning({
                message: `El VIN "${element.vin}" ha sido eliminado de la cotización ${element.idQuote} debido a que no se encontraba en estado RESERVADO o FACTURADO. Vuelve a asignar un VIN.`,
                duration: 10,
              });
            }
          }
        );
      }
      if (resp) {
        //console.log('resp verifyVins', resp);
        if (setLead) {
          setLead((prevState: any) => {
            const copia: Leads = prevState;
            resp.forEach((itm: any) => {
              const index = copia.quotes?.findIndex(
                (quo) => quo.id === itm.idQuote && itm.changed
              );
              if (typeof index === 'number' && index > -1) {
                copia.quotes![index].vimVehiculo = null;
                copia.quotes![index].vimVehiculoData = null;
                if (copia.prebill && copia.prebill.length > 0) {
                  copia.prebill = [];
                }
              }
            });
            return { ...copia };
          });
        }
      }
    }

    setLoad(false);
    setCloseQuotesShow(true);
  };

  const init = async () => {
    if (quotesToClouse.length > 0) {
      setTotalPvps(0);
      setTotalOtros(0);
      setTotal(0);
      setIvaTotal(0);

      let totalPvpsReferencial = 0;
      let totalReferencial = 0;
      let totalReferencialIvaOthers = 0;

      await quotesToClouse.map((quo: any) => {
        setTotalPvps((prevState) => {
          totalPvpsReferencial += quo.vehiculo![0].pvp!;
          return prevState + quo.vehiculo![0].pvp!;
        });
        // eslint-disable-next-line no-use-before-define
        setTotalOtros((prevState) => prevState + calcTotalOtros(quo));
        // eslint-disable-next-line no-use-before-define
        setTotal((prevState) => {
          totalReferencial += calcTotal(quo);
          return prevState + calcTotal(quo);
        });
        //console.log('valores log quo init', quo)
        if (!quo.exonerated) {
          setIvaTotal((prevState) => prevState + quo.vehiculo![0].pvp! * 0.12);
        }
        //console.log('valores log afuera init')

        /// calculo de otros referencial
        totalReferencialIvaOthers += calcOtros(quo) * 0.12;
        //console.log('valores log totalReferencialIvaOthers', totalReferencialIvaOthers)
        return quo;
      });

      ///calculo el iva de otros
      setIvaOthers(totalReferencialIvaOthers);

      // eslint-disable-next-line no-use-before-define
      //console.log('ESTA CAMBIANDO CARAJU', lead!.discount);
      setDescuento(lead?.discount ?? 0);
      await calcDescount(
        lead?.discount ?? 0,
        totalPvpsReferencial,
        totalReferencial
      );
      calcIvaWithDiscount(lead?.discount ?? 0);
      //await calcDescount(lead?.discount ?? 0, TotalPvps);
      //setSubTotalDescuento(0);
      //setMontoDescuento(0);
      await verifyVins();
      setCloseQuotesShow(true);
      if (vchatActivated) {
        setCloseQuotesShow(false);
      }
    }
  };

  useEffect(() => {
    init();
  }, [quotesToClouse]);

  useEffect(() => {
    //console.log('vchatActivated', vchatActivated);
    if (vchatActivated) {
      setCloseQuotesShow(false);
    }
  }, [vchatActivated]);

  let total: number = 0;
  let legalAmount: number = 0;
  //console.log('modalVehicle', modalVehicle);
  if (modalVehicle) {
    if (modalVehicle.type === 'credit') {
      legalAmount = modalVehicle.vehiculo[0].pvp * 0.005 + 25 + 300 + 95;
    }
    total = modalVehicle.vehiculo[0].pvp + legalAmount;

    if (modalVehicle.accesoriesValue) {
      total += modalVehicle.accesoriesValue;
    }
    if (modalVehicle.servicesValue) {
      total += modalVehicle.servicesValue;
    }
    if (modalVehicle.registration) {
      total += modalVehicle.registration;
    }
    if (modalVehicle.type === 'credit') {
      //total -= modalVehicle.inputAmount
    }
    if (modalVehicle.insuranceCarrier) {
      total += modalVehicle.insuranceCarrier.cost;
    }
    // console.log('modalVehicle, Total', total);
  }

  const writeData = async (dataVehicle: any) => {
    //console.log('valores log write data');
    const quotesClosed = lead?.quotes?.filter((quo) => quo.closed);
    //console.log('writeData', { quotesClosed });
    if (quotesClosed && quotesClosed.length > 0) {
      //console.log('writeData', !!quotesClosed[0].exonerated, !!dataVehicle.exonerated)
      if (!!quotesClosed[0].exonerated !== !!dataVehicle.exonerated) {
        notification.error({
          message: 'No se pudo agregar a cierre',
          description:
            'No se puede agregar a cierre una cotización diferente. Las cotizaciones deben ser del mismo tipo en términos de exoneración.',
        });
        return;
      }
    }
    const respMutation = await quouteRepository.selectQuoteForClousure(
      idLead,
      dataVehicle.id
    );
    //console.log('respMutation', respMutation);
    if (respMutation) {
      if (setLead) {
        setLead((prevState: Leads) => {
          const beforeLead = prevState;
          //dataVehicle.id
          const indexQuote = prevState.quotes?.findIndex(
            (item) => item.id === dataVehicle.id
          );
          //console.log('indexQuote', indexQuote);
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            beforeLead.quotes![indexQuote] = {
              ...beforeLead.quotes![indexQuote],
              closed: true,
            };
          }
          return { ...beforeLead };
        });
      }
      setQuotesToClouse((prevState: any) => {
        const exist = prevState.find((item: any) => item.id === dataVehicle.id);
        if (!exist) {
          setInactivesCloseButton((prevState2: any) => [
            ...prevState2,
            dataVehicle.id,
          ]);
        }

        return !exist ? [...prevState, dataVehicle] : [...prevState];
      });
      setVehiclesToShow((prevState) => {
        const newState = prevState.map((item: any) => {
          const newItem = item;
          if (item.id === dataVehicle.id) {
            newItem.closed = true;
          }
          return newItem;
        });
        //console.log('NUEVOOOOOOOOOOOO', newState);
        return [...newState];
      });
    }
    notification.info({
      message: 'Cierre actualizado',
      description: `Se agrego la cotización ${dataVehicle.id} al Cierre`,
      placement: 'topLeft',
    });
  };

  const deleteData = async (dataVehicle: any) => {
    //console.log('deleteData dataVehicle', dataVehicle);
    //console.log('deleteData vehicleToshow', vehiclesToShow);
    const respMutation = await quouteRepository.deleteQuoteForClousure(
      idLead,
      dataVehicle.id
    );
    //console.log('respMutation', respMutation);
    if (respMutation) {
      if (setLead) {
        setLead((prevState: Leads) => {
          const beforeLead = prevState;
          //dataVehicle.id
          const indexQuote = prevState.quotes?.findIndex(
            (item) => item.id === dataVehicle.id
          );
          //console.log('indexQuote', indexQuote);
          if (typeof indexQuote === 'number' && indexQuote > -1) {
            //console.log('Quote before', beforeLead.quotes![indexQuote]);
            beforeLead.quotes![indexQuote] = {
              ...beforeLead.quotes![indexQuote],
              closed: false,
            };
          }
          return { ...beforeLead };
        });
      }
      setQuotesToClouse((prevState: any) => {
        const newData: any = prevState.filter(
          (item: any) => item.id !== dataVehicle.id
        );
        setInactivesCloseButton((prevState2: any) => {
          const newDataIn: any = prevState2.filter(
            (item: any) => item !== dataVehicle.id
          );
          return [...newDataIn];
        });
        return [...newData];
      });
      setVehiclesToShow((prevState) => {
        const newState = prevState.map((item: any) => {
          const newItem = item;
          if (item.id === dataVehicle.id) {
            newItem.closed = false;
          }
          return newItem;
        });
        //console.log('NUEVOOOOOOOOOOOO', newState);
        return [...newState];
      });
    }
    notification.info({
      message: 'Cierre actualizado',
      description: `Se quitó la cotización ${dataVehicle.id} del Cierre`,
      placement: 'topLeft',
    });
  };

  /* const quotesForReview = lead?.quotes?.filter((vhT) => {
    let logic = vhT.closed === true && vhT.type === 'credit';
    /// Obtengo las cotizaciones individuales
    if (lead?.isFleet) {
      const ids = lead.leadsQuoteFinancial?.quotes?.map((q) => q.id);
      if (ids) {
        /* console.log('ids -->', {
          ids,
          idQuote: vhT.id,
          include: !ids.includes(vhT.id),
        }); /
        logic = !ids.includes(vhT.id) && logic;
      }
    }
    return logic;
  });
  const quotesFinancialReview = quotesForReview?.filter((dm) =>
    dm.quoteFinancial?.find((df) => df.selected === true)
  );
  let okFleet = true;
  if (
    lead?.isFleet &&
    lead.leadsQuoteFinancial?.quoteFinancial &&
    lead.leadsQuoteFinancial?.quoteFinancial.length > 0
  ) {
    okFleet = !!lead.leadsQuoteFinancial?.quoteFinancial?.find(
      (qF) => qF.selected === true
    );
  }

  const toPrebill =
    lead?.quotes?.filter((vhT) => vhT.vimVehiculo !== null).length ===
      lead?.quotes?.filter((vhT) => vhT.closed === true).length &&
    quotesForReview?.length === quotesFinancialReview?.length &&
    okFleet; */

  /* console.log('Prebill', {
    toPrebill,
    quotesForReview,
    quotesFinancialReview,
  }); */

  //console.log('✅✅datos actualizados', vehiclesToShow, dataQuote, toPrebill)

  const prefacture = (
    <Modal
      title="Prefactura"
      visible={modalPrevillShow}
      onCancel={handleCancel}
      footer=""
      width={900}
    >
      {modalPrevillShow && (
        <>
          {client && lead && (
            <Prebill
              client={client}
              vehiclesToShow={lead!.quotes!.filter(
                (vh: any) => vh.closed === true
              )}
              lead={lead}
              descuento={descuento}
              payThirdPerson={payThirdPerson}
            />
          )}
        </>
      )}
    </Modal>
  );
  const isThereQuotesCredits = !!lead?.quotes?.find(
    (quo) => quo.type === 'credit'
  );

  const dataValuesCredit = modalVehicle
    ? {
        total: total - (legalAmount ? legalAmount - legalAmount / 1.12 : 0),
        pvp: modalVehicle.vehiculo[0].pvp,
        carRegistration: modalVehicle.registration,
        insuranceAmountYears: modalVehicle.insuranceCarrier
          ? modalVehicle.insuranceCarrier.cost
          : 0,
        Exonerated: !!modalVehicle.exonerated,
        EntryQuantity: modalVehicle.inputAmount ? modalVehicle.inputAmount : 0,
      }
    : null;

  /* console.log('dataValuesCredit QuoteGenerated -->', {
    dataValuesCredit,
    total,
    legalAmount
  }); */

  const valueEsKit = modalVehicle?.idAccesories?.reduce(
    (acumulador: any, valorActual: any) => {
      if (valorActual.es_kit === 1) {
        return (
          acumulador +
          (valorActual.cost
            ? valorActual.cost * (valorActual.quantity ?? 0)
            : 0)
        );
      }
      return acumulador;
    },
    0
  );

  const renderValuesVehicle = (quote: Quotes) => {
    const allValues = allValuesOfQuote(quote);
    const { financingValue, subTotal } = allValues;
    const totalVal = allValues.total;

    const isCredit = quote.type === 'credit';
    const isExonerated = !!quote.exonerated;

    const vehicle =
      quote?.vehiculo && quote.vehiculo?.length > 0 ? quote.vehiculo[0] : null;

    const legal = (vehicle?.pvp ?? 0) * 0.005 + 25 + 300 + 95;

    return (
      <div>
        <b>NEW</b>
        <br />
        {/*  <div>{JSON.stringify(modalVehicle, null, 2)}</div> */}
        {quote.insuranceCarrier && (
          <>
            <b>Aseguradora:</b>
            {quote.insuranceCarrier?.name ?? ''}
            <br />
            <b>Valor seguro anual:</b>
            {currenyFormat(
              (quote.insuranceCarrier?.monthlyPayment ?? 0) * 12,
              true
            )}
            <br />
            <b>Valor seguro total {quote.insuranceCarrier?.years ?? 0}:</b>
            {currenyFormat(quote.insuranceCarrier?.cost ?? 0, true)}
            <br />
          </>
        )}
        {legal > 326 && !isExonerated && (
          <>
            <b>Gastos Legales:</b>
            {currenyFormat(legal, true)}
            <br />
          </>
        )}
        {isCredit && (
          <>
            <b>Cuota referencial:</b>
            {currenyFormat(quote.monthly ?? 0, true)}
            <br />
            <b>Total a financiar:</b>
            {currenyFormat(financingValue, true)}
            <br />
          </>
        )}
        <b>Subtotal:</b>
        {currenyFormat(subTotal, true)}
        <br />
        <b>Total:</b>
        {currenyFormat(totalVal, true)}
      </div>
    );
  };
  //console.log('USER ------->', user);

  const toPrebill = verifyStatusPrebill(lead);

  return (
    <div>
      <div>
        {title !== '' ? <Divider orientation="left">{title}</Divider> : null}
        {lead && lead.isFleet && isThereQuotesCredits && (
          <CreditApplicationFleets
            setDataFleet={setDataFleet}
            openDraweCredit={openDraweCredit}
          />
        )}
        {dataQuote && dataQuote.length > 0 ? (
          <div className="mt-8">
            <Row gutter={[10, 10]}>
              {vehiclesToShow.map((dataVehicle: any, index: number) => (
                <ItemQuote
                  key={`${index}`}
                  dataVehicle={dataVehicle}
                  showModal={showModal}
                  setModalVehicle={setModalVehicle}
                  writeData={writeData}
                  deleteData={deleteData}
                  inactives={inactivesCloseButton}
                  setInactives={setInactivesCloseButton}
                  isTherePrebill={
                    !!(
                      lead?.prebill &&
                      lead.prebill[lead.prebill.length - 1]?.status ===
                        'APPROVED'
                    )
                  }
                />
              ))}
            </Row>
          </div>
        ) : (
          <Alert
            message="No hay cotizaciones generadas para este negocio."
            description="Genera la primera cotización seleccionando el vehículo que deseas cotizar."
            type="info"
            showIcon
            className="w-full mt-5"
          />
        )}
      </div>
      <Modal
        title={modalVehicle ? `Cotización Nro ${modalVehicle.id}` : ''}
        visible={modalShow}
        onCancel={handleCancel}
        footer=""
        width={600}
        zIndex={10}
      >
        {modalVehicle ? (
          <>
            <Result
              insuranceAmount={
                modalVehicle.insuranceCarrier
                  ? modalVehicle.insuranceCarrier.monthlyPayment
                  : 0
              }
              insuranceAmountYear={
                modalVehicle.insuranceCarrier
                  ? modalVehicle.insuranceCarrier.monthlyPayment * 12
                  : 0
              }
              insuranceAmountYears={
                modalVehicle.insuranceCarrier
                  ? modalVehicle.insuranceCarrier.cost
                  : 0
              }
              insuranceYears={
                modalVehicle.insuranceCarrier
                  ? modalVehicle.insuranceCarrier.years
                  : 0
              }
              insuranceName={
                modalVehicle.insuranceCarrier
                  ? modalVehicle.insuranceCarrier.name
                  : ''
              }
              accesoriesServices={
                modalVehicle.idAccesories ? modalVehicle.idAccesories : []
              }
              accesoriesAmount={
                modalVehicle.accesoriesValue ? modalVehicle.accesoriesValue : 0
              }
              servicesAmount={
                modalVehicle.servicesValue ? modalVehicle.servicesValue : 0
              }
              legals={legalAmount}
              pvp={modalVehicle.vehiculo[0].pvp}
              cuota={modalVehicle.monthly ? modalVehicle.monthly : 0}
              total={
                total - (legalAmount ? legalAmount - legalAmount / 1.12 : 0)
              }
              paymenType={modalVehicle.type}
              Exonerated={!!modalVehicle.exonerated}
              typeExonerated={
                modalVehicle.exonerated ? modalVehicle.exonerated.type : ''
              }
              grade={
                modalVehicle.exonerated
                  ? modalVehicle.exonerated.percentage
                  : ''
              }
              autoPayment={!!modalVehicle.mechanicalAppraisalQuote}
              EntryQuantity={
                modalVehicle.inputAmount ? modalVehicle.inputAmount : 0
              }
              rate={modalVehicle.rate ? modalVehicle.rate : 0}
              months={modalVehicle.months ? modalVehicle.months : 0}
              carRegistration={modalVehicle.registration}
              activeDevice={false}
              device={0}
              deviceYears={0}
              deviceAmountYear={0}
              deviceAmountYears={0}
              imgurl={modalVehicle.vehiculo[0].imgs}
              nextStep={nextStep}
              setViewTestDriver={setViewTestDriver}
              modalVehicle={modalVehicle}
              setSelectNewVehicle={setSelectNewVehicle}
            />
            {/* {modalVehicle && renderValuesVehicle(modalVehicle)} */}
            {modalVehicle.idAccesories ? (
              <>
                <h3>Accesorios</h3>
                <TableAccesories
                  paramsToFind={{
                    code: modalVehicle.vehiculo[0].code,
                    brand: modalVehicle.vehiculo[0].brand,
                    model: modalVehicle.vehiculo[0].model,
                  }}
                  actualAccessories={modalVehicle.idAccesories}
                  setActualAccessories={() => {}}
                  read
                />
              </>
            ) : null}
            {modalVehicle.services ? (
              <>
                <h3>Servicios</h3>
                <TableServices
                  actualServices={modalVehicle.services}
                  setActualServices={() => {}}
                  code={modalVehicle.vehiculo[0].code}
                  read
                />
              </>
            ) : null}
            {modalVehicle.mechanicalAppraisalQuote ? (
              <>
                <List
                  size="small"
                  header={<h3>Avalúo mecánico</h3>}
                  bordered
                  dataSource={[
                    <span>
                      <b>Marca:</b>{' '}
                      {modalVehicle.mechanicalAppraisalQuote.brand}
                    </span>,
                    <span>
                      <b>Modelo:</b>{' '}
                      {modalVehicle.mechanicalAppraisalQuote.model}
                    </span>,
                    <span>
                      <b>Año:</b> {modalVehicle.mechanicalAppraisalQuote.year}
                    </span>,
                    <span>
                      <b>Km:</b> {modalVehicle.mechanicalAppraisalQuote.mileage}
                    </span>,
                    <span>
                      <b>Precio deseado:</b>{' '}
                      {currenyFormat(
                        modalVehicle.mechanicalAppraisalQuote.desiredPrice,
                        true
                      )}
                    </span>,
                  ]}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </>
            ) : null}
            {modalVehicle.mechanicalAppraisalQuote ? (
              <div className="space-top-20">
                <List
                  size="small"
                  header={<h3>Proveedor de seminuevos</h3>}
                  bordered
                  dataSource={[
                    <FormOwnedSupplier
                      dataFormOwnedSupplier={modalVehicle.preOwnedSupplier}
                      acceptedAppraisal={modalVehicle.acceptedAppraisal}
                      idLead={modalVehicle.id}
                      viewModal={() => {}}
                      loadForm={(e: any, id: number) => {
                        setVehiclesToShow((prevState) => {
                          const newState = prevState.map((item: any) => {
                            const newItem = item;
                            if (item.id === id) {
                              newItem.acceptedAppraisal = e.acceptedAppraisal;
                              newItem.preOwnedSupplier = {
                                ...e.preOwnedSupplier,
                                acceptedAppraisal: e.acceptedAppraisal,
                              };
                            }
                            return newItem;
                          });
                          return newState;
                        });
                      }}
                    />,
                  ]}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </div>
            ) : null}
          </>
        ) : null}
        {modalVehicle && (
          <QuoteButtons
            sendQuoteMail={sendQuoteMail}
            modalVehicle={modalVehicle}
            isThereClousure={isThereClousure}
            isCredit={modalVehicle && modalVehicle.type !== 'counted'}
            loading={loading!}
            writeData={writeData}
            deleteData={deleteData}
            dataValuesCredit={dataValuesCredit}
            openDraweCredit={openDraweCredit}
          />
        )}
      </Modal>
      <div>
        {quotesToClouse.length > 0 ? (
          <Button
            type="primary"
            style={{ position: 'fixed', bottom: 60, right: 60, zIndex: 9 }}
            icon={<LoginOutlined />}
            size="large"
            onClick={verifyVins}
          >
            Cierre
          </Button>
        ) : null}

        <Drawer
          title="Cotizaciones para el cierre"
          placement="right"
          closable
          onClose={() => setCloseQuotesShow(false)}
          mask
          visible={closeQuotesShow}
          width={1000}
          drawerStyle={{
            backgroundColor: '#fff',
          }}
          headerStyle={{ backgroundColor: '#fff' }}
          bodyStyle={{ backgroundColor: '#fff' }}
          zIndex={15}
        >
          <Table
            pagination={false}
            dataSource={quotesToClouse.sort(
              (a: Quotes, b: Quotes) => (a.id ?? 0) - (b.id ?? 0)
            )}
            scroll={{ x: 800 }}
            rowKey="id"
            columns={[
              { title: 'Id', dataIndex: 'id', key: 'id' },
              {
                title: 'Descripción',
                dataIndex: 'description',
                key: 'description',
                render: (text, record, index) => (
                  <div key={index}>{record.vehiculo[0].description}</div>
                ),
              },
              {
                title: 'Precio vehículo',
                dataIndex: 'pvp',
                key: 'pvp',
                render: (text, record, index) => (
                  <div key={index}>
                    {currenyFormat(record.vehiculo[0].pvp, true)}
                  </div>
                ),
              },
              {
                title: 'Accesorios y Servicios',
                dataIndex: 'otros',
                key: 'otros',
                render: (text, record, index) => {
                  return (
                    <div key={index}>
                      {currenyFormat(calcTotalOtros(record), true)}
                    </div>
                  );
                },
              },
              {
                title: 'Otros',
                dataIndex: 'otrostwo',
                key: 'otrostwo',
                render: (text, record, index) => {
                  //console.log({ record });
                  return (
                    <div key={index}>
                      {currenyFormat(calcOtros(record), true)}
                    </div>
                  );
                },
              },
              {
                title: 'Subtotal',
                dataIndex: 'Total',
                key: 'total',
                render: (text, record, index) => (
                  <Tooltip
                    title={
                      <ul
                        style={{
                          marginLeft: 0,
                          paddingLeft: 0,
                          listStyleType: 'none',
                        }}
                      >
                        {record.type === 'credit' ? (
                          <li>Entrada {currenyFormat(record.inputAmount)}</li>
                        ) : null}
                        {record.type === 'credit' ? (
                          <li>
                            Total sin entrada{' '}
                            {currenyFormat(
                              calcTotal(record) * 1.12 - record.inputAmount
                            )}
                          </li>
                        ) : null}
                        <li>
                          Total{' '}
                          {currenyFormat(
                            (calcTotal(record) - record.registration) * 1.12 +
                              record.registration
                          )}{' '}
                          Inc. IVA
                        </li>
                      </ul>
                    }
                    color="green"
                  >
                    <div key={index}>
                      {currenyFormat(calcTotal(record), true)}
                    </div>
                  </Tooltip>
                ),
              },
              {
                title: 'Tipo',
                dataIndex: 'type',
                key: 'type',
                render: (text, record, index) => (
                  <Tag color={record.type === 'counted' ? 'green' : 'volcano'}>
                    {record.type === 'counted' ? 'Contado' : 'Crédito'}
                  </Tag>
                ),
              },
              {
                title: 'Financiera / Consorcio',
                dataIndex: 'finCon',
                key: 'finCon',
                render: (text, record: Quotes, index) => {
                  const quotesClosedFleet = quotesToClouse.filter(
                    (qc: Quotes) =>
                      !!lead?.leadsQuoteFinancial?.quotes
                        ?.map((q) => q.id)
                        ?.includes(qc.id ?? -1) && qc.closed
                  );

                  const indexQuoteOfLQF = quotesClosedFleet?.findIndex(
                    (q: Quotes) => q.id === record.id
                  );

                  /*  console.log('indexQuoteOfLQF -->', {
                    id: record.id,
                    quotesClosedFleet,
                  }); */
                  if (
                    lead?.leadsQuoteFinancial &&
                    typeof indexQuoteOfLQF === 'number' &&
                    indexQuoteOfLQF > -1
                  ) {
                    const financialSelected = lead.leadsQuoteFinancial.quoteFinancial?.find(
                      (qf) => qf.selected
                    );
                    return (
                      <div>
                        <b style={{ color: '#000' }}>Financiera de Flota</b>
                        <br />
                        {indexQuoteOfLQF === 0 ? (
                          <SelectFinancialFleet
                            leadQuoteFinancial={lead.leadsQuoteFinancial}
                          />
                        ) : (
                          <>
                            {financialSelected &&
                            financialSelected.responseBank ? (
                              <Badge
                                status={
                                  switchResponseBank(
                                    financialSelected.responseBank
                                  ).color as any
                                }
                                text={
                                  financialSelected.financial!
                                    .nameEntityFinancial!
                                }
                              />
                            ) : (
                              <span>Seleccione una financiera para FLOTA</span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }
                  return (
                    <SelectFinancialConsorcium
                      quote={record}
                      consorcio={consorcio}
                      setVehiclesToShow={setVehiclesToShow}
                    />
                  );
                },
              },
              {
                title: 'VIN',
                dataIndex: 'vin',
                key: 'vin',
                render: (text, record, index) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ReservationVIN quoteId={record.id!} />
                  </div>
                ),
              },
              {
                title: 'Reserva',
                dataIndex: 'reserva',
                key: 'reserva',
                render: (text, record, index) => {
                  if (!record.reserveValue) {
                    return (
                      <Box
                        key={`box${index}`}
                        disabledReserveButton={false}
                        data={record}
                        leadId={idLead}
                        clientCi={client?.identification!}
                        discountRate={descuento}
                      />
                    );
                  }
                  return currenyFormat(record.reserveValue);
                },
              },
              /* {
                title: 'Valor matrícula',
                dataIndex: 'registration',
                key: 'registration',
                render: (text, record, index) => (
                  <Registration
                    quouteRepository={quouteRepository}
                    idQuote={record.id}
                    registration={record.registration}
                    setVehiclesToShow={setVehiclesToShow}
                  />
                ),
              }, */
            ]}
            size="small"
            expandable={{
              expandedRowRender: (record, index) => {
                const columns: any = [];
                if (record.accesoriesValue) {
                  columns.push({
                    title: 'Accesorios',
                    dataIndex: 'accesoriesValue',
                    key: 'accesoriesValue',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>
                        {currenyFormat(recordSub.accesoriesValue)}
                      </div>
                    ),
                  });
                }
                if (record.servicesValue) {
                  columns.push({
                    title: 'Servicios',
                    dataIndex: 'servicesValue',
                    key: 'servicesValue',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>
                        {currenyFormat(recordSub.servicesValue)}
                      </div>
                    ),
                  });
                }
                if (record.registration) {
                  columns.push({
                    title: 'Matrícula',
                    dataIndex: 'registration',
                    key: 'registration',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>
                        {currenyFormat(recordSub.registration)}
                      </div>
                    ),
                  });
                }
                if (record.insuranceCarrier) {
                  columns.push({
                    title: 'Seguro',
                    dataIndex: 'insurance',
                    key: 'insurance',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <Table
                        style={{ width: '100%', marginLeft: '0 !important' }}
                        rowKey="name"
                        key={indexSub}
                        pagination={false}
                        columns={[
                          {
                            title: 'Aseguradora',
                            dataIndex: 'name',
                            key: 'name',
                          },
                          {
                            title: 'Costo/mes',
                            dataIndex: 'monthlyPayment',
                            key: 'monthlyPayment',
                            render: () =>
                              currenyFormat(
                                recordSub.insuranceCarrier.monthlyPayment
                              ),
                          },
                          { title: 'Años', dataIndex: 'years', key: 'years' },
                          {
                            title: 'Total',
                            dataIndex: 'cost',
                            key: 'cost',
                            render: () =>
                              `${currenyFormat(
                                recordSub.insuranceCarrier.cost
                              )}`,
                          },
                        ]}
                        dataSource={[recordSub.insuranceCarrier]}
                      />
                    ),
                  });
                }
                if (record.months) {
                  columns.push({
                    title: 'Meses',
                    dataIndex: 'month',
                    key: 'month',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>{recordSub.months}</div>
                    ),
                  });
                }
                if (record.monthly) {
                  columns.push({
                    title: 'Cuota',
                    dataIndex: 'monthly',
                    key: 'monthly',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>
                        {currenyFormat(recordSub.monthly)}
                      </div>
                    ),
                  });
                }
                if (record.inputAmount) {
                  columns.push({
                    title: 'Entrada',
                    dataIndex: 'inputAmount',
                    key: 'inputAmount',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>
                        {currenyFormat(recordSub.inputAmount)}
                      </div>
                    ),
                  });
                }
                if (record.type === 'credit') {
                  columns.push({
                    title: 'Gastos Legales',
                    dataIndex: 'legals',
                    key: 'legals',
                    render: (text: any, recordSub: any, indexSub: number) => (
                      <div key={indexSub}>
                        {currenyFormat(
                          calcLegals(recordSub.vehiculo[0].pvp, true)
                        )}
                      </div>
                    ),
                  });
                }
                return columns.length > 0 ? (
                  <Table
                    rowKey="monthly"
                    key={index}
                    size="small"
                    pagination={false}
                    bordered
                    columns={columns}
                    dataSource={[record]}
                  />
                ) : (
                  <div>No hay más datos para esta cotización</div>
                );
              },
            }}
            summary={(quoteData) => {
              //console.log('quoteData for Summary', quoteData);
              if (quoteData.length === 0) {
                return (
                  <Table.Summary.Row key={991}>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <div />
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }
              return (
                <>
                  <Table.Summary.Row key={991}>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <b>Subtotal</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1}>
                      {currenyFormat(TotalPvps, true)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2}>
                      {currenyFormat(TotalOtros, true)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={6}>
                      {currenyFormat(Total, true)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row key={992}>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <b>Descuento</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1}>
                      <div style={{ display: 'flex' }}>
                        <InputNumber
                          size="small"
                          min={0}
                          max={5}
                          defaultValue={0}
                          disabled={
                            !!quoteData[0].exonerated || !!lead?.saleDown
                          }
                          value={descuento}
                          formatter={(value) => `${value}%`}
                          parser={(value) => value!.replace('%', '')}
                          onChange={(valor) => {
                            //console.log('VALOR DESCUENTO', valor);
                            if (typeof valor === 'number') {
                              //console.log('VALOR DESCUENTO', valor);
                              setDescuento(valor);
                            }
                            calcDescount(Number(valor), TotalPvps);
                            calcIvaWithDiscount(Number(valor));
                          }}
                        />
                        {/*<Button
                          type="primary"
                          size="small"
                          icon={<SaveOutlined />}
                          //disabled={typeof matricula !== 'number'}
                          onClick={async () => {
                            const resp = leadRepository.updateLeadDiscount(
                              lead!.id!,
                              descuento
                            );
                            if (resp) {
                              message.success('Información actualizada');
                              if (setLead) {
                                setLead((prevState: any) => {
                                  const copia = prevState;
                                  copia.discount = descuento;
                                  return { ...copia };
                                });
                              }
                            } else {
                              message.error(
                                'Algo salió mal. Vuelve a intentarlo.'
                              );
                            }
                          }}
                          //loading={loading}
                        />*/}
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2}>
                      Descuento: {currenyFormat(MontoDescuento)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} colSpan={6}>
                      {currenyFormat(SubTotalDescuento)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row key={993}>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <b>IVA</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1}>
                      {/* {currenyFormat(TotalPvps * 0.12)} */}
                      <span>
                        {currenyFormat(
                          quoteData[0].exonerated
                            ? ivaTotal
                            : (TotalPvps - TotalPvps * descuento * 0.01) * 0.12
                        )}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2}>
                      {currenyFormat(TotalOtros * 0.12)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} colSpan={6}>
                      {/* {currenyFormat(SubTotalDescuento * 0.12)} */}
                      <span>
                        {currenyFormat(
                          quoteData[0].exonerated
                            ? TotalOtros * 0.12 + ivaTotal + ivaOthers
                            : SubTotalDescuento * 0.12
                        )}
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row key={994}>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <b>Total</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1}>
                      {/* {currenyFormat(TotalPvps * 1.12)}{' '} */}
                      <span>
                        {currenyFormat(
                          quoteData[0].exonerated
                            ? TotalPvps + ivaTotal
                            : (TotalPvps - TotalPvps * descuento * 0.01) * 1.12
                        )}
                      </span>
                      <span style={{ fontSize: 11 }}>
                        {quoteData[0].exonerated ? ' sin IVA' : ' inc. IVA'}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2}>
                      {currenyFormat(TotalOtros * 1.12)}{' '}
                      <span style={{ fontSize: 11 }}>inc. IVA</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} colSpan={1}>
                      {/* {currenyFormat(SubTotalDescuento * 1.12)} */}
                      {/*console.log('valores log', {
                        actualQuote: quoteData[0],
                        TotalPvps,
                        ivaTotal,
                        TotalOtros,
                        ivaOthers,
                        SubTotalDescuento
                      })*/}
                      <span>
                        {currenyFormat(
                          quoteData[0].exonerated
                            ? TotalPvps +
                                ivaTotal +
                                TotalOtros * 1.12 +
                                (112 * ivaOthers) / 12
                            : SubTotalDescuento * 1.12
                        )}
                      </span>
                      <span style={{ fontSize: 11 }}> inc. IVA</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} colSpan={2}>
                      <div style={{ textAlign: 'right' }}>
                        Paga tercera persona?
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5} colSpan={1}>
                      <Checkbox
                        disabled={!!lead?.saleDown}
                        onChange={(e) => {
                          //console.log('checkbox', e.target.checked);
                          setPayThirdPerson(e.target.checked);
                        }}
                      />
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={2}>
                      <Button
                        type="primary"
                        disabled={!toPrebill}
                        icon={<CopyOutlined />}
                        onClick={showModallPrevill}
                      >
                        Prefactura
                      </Button>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
          {!toPrebill && (
            <Alert
              className="mt-5 text-center"
              message="Para poder pasar a prefactura debes asignar un VIN a cada vehículo y tener una entidad financiera elegida para las cotizaciones de tipo crédito"
              type="warning"
            />
          )}
        </Drawer>
      </div>
      {load && <Loading visible={load} />}
      {prefacture}

      <Drawer
        title="Solicitud de Crédito"
        width={900}
        onClose={closeDraweCredit}
        visible={showDrawerCredit}
        headerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        bodyStyle={{ backgroundColor: 'rgba(255,255,255,1)' }}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        footerStyle={{ backgroundColor: '#fff' }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={closeDraweCredit} style={{ marginRight: 8 }}>
              Cerrar
            </Button>
          </div>
        }
      >
        {showDrawerCredit && dataVehicleCredit && modalVehicle && (
          <div>
            <NewCreditApplication
              client={client!}
              vehicle={{
                brand: dataVehicleCredit.brand,
                description: dataVehicleCredit.version,
                model: dataVehicleCredit.model,
                value: dataVehicleCredit.pvp,
                totalServices: dataVehicleCredit.servicesValue,
                totalAccesories: dataVehicleCredit.accesoriesValue,
                year: dataVehicleCredit.year,
                entrada: dataVehicleCredit.entry,
                financing: dataVehicleCredit.financingValue,
                monthlyPayments: dataVehicleCredit.monthly,
                plazo: dataVehicleCredit.months,
                tasa: dataVehicleCredit.rate,
                valueExtraEsKit: dataVehicleCredit.valueEsKit,
              }}
              user={{
                concessionaire: lead?.concesionario?.name || '',
                name: lead ? `${lead.user.nombre} ${lead.user.apellido}` : '',
                place: lead?.city ?? 'Sin ciudad',
                role: lead ? lead.user!.role! : 'ASESOR COMERCIAL',
                sucursal: lead?.sucursal?.name || '',
              }}
              idQuoute={modalVehicle.id!}
              nextStep={() => {}}
              concesionarioCode={lead?.concesionario?.code}
            />
          </div>
        )}
        {dataFleet && (
          <div>
            <NewCreditApplication
              client={client!}
              user={{
                concessionaire: lead?.concesionario?.name || '',
                name: lead ? `${lead.user.nombre} ${lead.user.apellido}` : '',
                place: lead?.city ?? 'Sin ciudad',
                role: lead ? lead.user!.role! : 'ASESOR COMERCIAL',
                sucursal: lead?.sucursal?.name || '',
              }}
              nextStep={() => {}}
              concesionarioCode={lead?.concesionario?.code}
              {...dataFleet}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default QuotesGenerated;
