import React, {
  FunctionComponent,
  useReducer,
  useState,
  useEffect,
} from 'react';
import { Form, Button, Divider, Alert, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import Quotes, { Vehicle, Accesories } from '../../../data/models/Quotes';
import { currenyFormat, calcTotal, calcLegals } from '../../../utils/extras';
import {
  reducer,
  initState,
  InitDataClosure,
} from '../form-closure-controller';
import ParamsBusiness from './form-components/ParamsBusiness';
import AvaluoMecanico from './form-components/AvaluoMecanico';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../utils/Get';
import QuotesRepository from '../../../data/repositories/quotes-repository';
import Loading from '../../../components/Loading';
import { ServiceWithType } from './Closure';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const FormClosure: FunctionComponent<{
  actualQuote: Quotes;
  vehicle: Vehicle;
  actualAccessories: Accesories[];
  actualServices: ServiceWithType[];
}> = ({ actualQuote, vehicle, actualAccessories, actualServices }) => {
  const [store, dispatch] = useReducer(reducer, initState);
  const [forceRender, setForceRender] = useState<boolean>(false);
  const quouteRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  const [loading, setLoading] = useState<boolean>(false);
  const [valueToFinance, setValueToFinance] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [legalAmount, setLegalAmount] = useState<number>(0);

  useEffect(() => {
   //console.log('actualQuote', actualQuote);
   //console.log('Current Format', currenyFormat(0, true));
    let valueToFinanceRen = 0;
    let totalRen = 0;
    if (actualQuote && vehicle) {
      let legalsAmount = 0;
      if (actualQuote.type === 'credit') {
        legalsAmount = calcLegals(vehicle.pvp!, true);
        setLegalAmount(legalsAmount);
      }
      const insuranceCarrierAmmount = actualQuote!.insuranceCarrier!
        ? actualQuote!.insuranceCarrier!.cost! *
          actualQuote!.insuranceCarrier!.years!
        : 0;
      const totalBase =
        actualQuote!.vehiculo![0].pvp! +
        actualQuote!.accesoriesValue! +
        actualQuote!.servicesValue! +
        (legalsAmount - (legalsAmount - legalsAmount / 1.12)) +
        insuranceCarrierAmmount +
        (actualQuote!.registration! ? actualQuote!.registration! : 0);

      totalRen = calcTotal(
        totalBase,
        vehicle.pvp!,
        actualQuote.registration!,
        insuranceCarrierAmmount,
        false
      );
     //console.log('-------------++++totalRen', totalRen);
      setTotal(totalRen);
      if (actualQuote.type === 'credit') {
        setValueToFinance(totalRen - actualQuote.inputAmount!);
        valueToFinanceRen =
          totalRen - actualQuote.inputAmount! - actualQuote.registration!;
      }
    }

    const mapInitData: InitDataClosure = {
      acceptedAppraisal:
        actualQuote.acceptedAppraisal === null ||
        actualQuote.acceptedAppraisal === undefined
          ? null
          : actualQuote.acceptedAppraisal,
      discount:
        actualQuote.discount === null ? undefined : actualQuote.discount,
      pvp: currenyFormat(vehicle.pvp ?? 0, true),
      exonerated: actualQuote.exonerated ? 'SI' : 'NO',
      exoneratedType: actualQuote.exonerated
        ? actualQuote.exonerated.type === 'diplomatics'
          ? 'Diplomático'
          : 'Discapacitado'
        : null,
      exoneratedPercentage: actualQuote.exonerated
        ? actualQuote.exonerated.percentage
        : null,
      payType: actualQuote.type === 'credit' ? 'Crédito' : 'Contado',
      inputAmount: currenyFormat(
        actualQuote.inputAmount ? actualQuote.inputAmount : 0,
        true
      ),
      valueToFinance: currenyFormat(valueToFinanceRen, true),
      creditMonths: actualQuote.months ? actualQuote.months : 0,
      quoteAmount: actualQuote.monthly
        ? currenyFormat(actualQuote.monthly, true)
        : '0',
      insuranceName: actualQuote.insuranceCarrier
        ? actualQuote.insuranceCarrier.name
        : '',
      insuranceMonthlyPayment: currenyFormat(
        actualQuote.insuranceCarrier
          ? actualQuote.insuranceCarrier.monthlyPayment
          : '',
        true
      ),
      insuranceYears: actualQuote.insuranceCarrier
        ? actualQuote.insuranceCarrier.years
        : '',
      insuranceCost: currenyFormat(
        actualQuote.insuranceCarrier ? actualQuote.insuranceCarrier.cost : '',
        true
      ),
      carAsPayFrom: actualQuote.mechanicalAppraisalQuote !== null,
      carAsPayFromBrand: actualQuote.mechanicalAppraisalQuote
        ? actualQuote.mechanicalAppraisalQuote.brand
        : '',
      carAsPayFromModel: actualQuote.mechanicalAppraisalQuote
        ? actualQuote.mechanicalAppraisalQuote!.model
        : '',
      carAsPayFromYear: actualQuote.mechanicalAppraisalQuote
        ? actualQuote.mechanicalAppraisalQuote!.year?.toString()
        : '0',
      carAsPayFromKm: actualQuote.mechanicalAppraisalQuote
        ? actualQuote.mechanicalAppraisalQuote!.mileage?.toString()
        : '0',
      carAsPayFromDesiredPrice: actualQuote.mechanicalAppraisalQuote
        ? currenyFormat(
            actualQuote.mechanicalAppraisalQuote!.desiredPrice!,
            true
          )
        : '',
      bussinessName: actualQuote.preOwnedSupplier
        ? actualQuote.preOwnedSupplier.bussinessName
        : '',
      identification: actualQuote.preOwnedSupplier
        ? actualQuote.preOwnedSupplier.identification
        : '',
      email: actualQuote.preOwnedSupplier
        ? actualQuote.preOwnedSupplier.email
        : '',
      phone: actualQuote.preOwnedSupplier
        ? actualQuote.preOwnedSupplier.phone
        : undefined,
      appraisalValue: actualQuote.preOwnedSupplier
        ? actualQuote.preOwnedSupplier.appraisalValue
        : 0,
      registrationValue: currenyFormat(
        actualQuote.registration ? actualQuote.registration : 0,
        true
      ),
      totalValue: currenyFormat(totalRen, true),
      payThirdPerson: actualQuote.payThirdPerson,
      entity: actualQuote.chosenEntity ? actualQuote.chosenEntity.entity : null,
    };
    dispatch({ type: 'init-data', value: mapInitData });
    /* setTimeout(() => {
     //console.log('TIMEOUT', store);
    }, 3000); */
    setForceRender(true);
  }, []);
 //console.log(store, dispatch);
  return (
    <>
      <Divider orientation="left">Parámetros del Negocio</Divider>
      <div className="m-auto">
        {forceRender && (
          <Form
            {...layout}
            initialValues={store}
            onFinishFailed={(error) => {
              message.error('Existen campos por llenar');
            }}
            onFinish={async (values: any) => {
             //console.log('values', values);
              if (values.entity === null) {
                message.error('Escoja una entidad');
                return;
              }
              setLoading(true);
              const servicesType = actualServices.map((serv) => serv.type);
              //const servicesType = exampleServ.map((serv) => serv.type);
              const unicosType: string[] = [];
              servicesType.forEach((tipo: string) => {
                const ele = unicosType.find((uni) => uni === tipo);
                if (!ele) {
                  unicosType.push(tipo);
                }
              });

              //hacer las categorias
              const mainJson: any = {};
              unicosType.forEach((type) => {
                mainJson[type] = [];
              });

              //filtrar elementos
              unicosType.forEach((type) => {
                //const filterServices = exampleServ.map((serv) => serv.type);
                const filterServices = actualServices
                  .filter((serv) => serv.type === type)
                  .map((ser) => ({
                    brands: ser.brands,
                    code: ser.code,
                    exonerated: ser.exonerated,
                    iva: ser.iva,
                    name: ser.name,
                    quantity: ser.quantity,
                    total: ser.total,
                    value: ser.value,
                    wayToPay: ser.wayToPay,
                  }));
                mainJson[type] = filterServices;
              });
              const orderAccesories = actualAccessories.map((acc) => ({
                code: acc.code,
                name: acc.name,
                cost: acc.cost,
                dimension: acc.dimension,
                id: acc.id,
                id_Vh: acc.id_Vh,
                brand: acc.brand,
                model: acc.model,
                urlPhoto: acc.urlPhoto
                  ? acc.urlPhoto.map((acce) => ({ link: acce.link }))
                  : [],
                quantity: acc.quantity,
              }));
              const orderServices =
                actualServices.length > 0 ? [mainJson] : undefined;
             //console.log('Services', [mainJson], orderAccesories);
              const dataToSend: any = {
                bussinessName: values.bussinessName ? values.bussinessName : '',
                identification: values.identification
                  ? values.identification
                  : '',
                phone: values.phone ? values.phone : '',
                email: values.email ? values.email : '',
                appraisalValue: values.appraisalValue
                  ? values.appraisalValue
                  : 0,
                acceptedAppraisal: !!values.acceptedAppraisal,
                closed: true,
                discount: values.discount,
                chosenEntity: {
                  type: values.payType === 'Crédito' ? 'credit' : 'counted',
                  entity: values.entity,
                },
                payThirdPerson: !!values.payThirdPerson,
                accesories: orderAccesories.length > 0 ? orderAccesories : [],
                services: orderServices,
              };

             //console.log('dataToSend', dataToSend);

              const resp = await quouteRepository.updateQuote(
                actualQuote.id!,
                dataToSend
              );
              setLoading(false);
              if (resp) {
                message.success('Datos guardados');
                return;
              }
              //setLoading(false);
              message.error('Error al guardar los Datos');
            }}
          >
            <ParamsBusiness
              actualQuote={actualQuote}
              valueToFinance={valueToFinance}
              store={store}
              dispatch={dispatch}
            />
            {actualQuote.mechanicalAppraisalQuote && (
              <AvaluoMecanico
                actualQuote={actualQuote}
                store={store}
                dispatch={dispatch}
              />
            )}

            <div className="text-center">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Guardar Cierre
              </Button>
            </div>
          </Form>
        )}

        <Alert
          message="Debes guardar los parámetros del negocio y notficar a caja para obtener el monto de reserva y poder asignar un VIN que te permita pasar a prefactura."
          type="info"
          showIcon
          className="mt-4"
        />
        <div className="mt-5 mb-5 flex">
          {/*vehicle.pdf && (
            <Button
              className="text-red-400 button-red mr-2"
              href={`${vehicle.pdf![0].link}`}
              target="_blank"
            >
              Descargar PDF
            </Button>
          )*/}
        </div>
      </div>
      <Loading visible={loading} />
    </>
  );
};

export default FormClosure;
