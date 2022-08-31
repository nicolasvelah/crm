import { notification } from 'antd';
import { action, observable } from 'mobx';
import { Subscription } from 'rxjs';
/* eslint-disable prefer-destructuring */
/* eslint-disable lines-between-class-members */
import Client from '../../../../data/models/Client';
import Leads from '../../../../data/models/Leads';
import {
  OtherConcept,
  Prebill,
  PrebillNote,
} from '../../../../data/models/PreBill';
import Quotes from '../../../../data/models/Quotes';
import User from '../../../../data/models/User';
import {
  PrebillInput,
  VehiclePrebillInput,
} from '../../../../data/providers/apollo/mutations/prebills';
import ClientsRepository from '../../../../data/repositories/clients-repository';
import PreBillsRepository from '../../../../data/repositories/prebills-repository';
import QuotesRepository from '../../../../data/repositories/quotes-repository';
import UserRepository from '../../../../data/repositories/user-repository';
import { Dependencies } from '../../../../dependency-injection';
import auth from '../../../../utils/auth';
import Get from '../../../../utils/Get';
import SocketClient from '../../../../utils/socket-client';
import INotification from '../../../../data/models/Notification';
import { calcTotal, calcLegals, subTotal } from '../../../../utils/extras';

export interface PreInvoiceInitialData {
  onNext: () => void;
  onViewProspect: (identification: string) => void;
}

export default class PreInvoiceController {
  prebillsRepository = Get.find<PreBillsRepository>(Dependencies.prebills);
  quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  clientsRepository = Get.find<ClientsRepository>(Dependencies.clients);
  usersRepository = Get.find<UserRepository>(Dependencies.users);

  lead: Leads = Get.find<Leads>('lead');
  client: Client = Get.find<Client>('lead-client');
  quote?: Quotes;
  asesor!: User;
  prebill?: Prebill;
  @observable prebillInput: PrebillInput | null = null;
  @observable notes: PrebillNote[] = [];

  otrosconceptos: any[] = [];
  @observable fetching = false;
  @observable comment: string = '';
  @observable discount = 0;
  @observable prebillStatus: 'NONE' | 'REQUESTED' | 'REJECTED' | 'APPROVED' =
    'NONE';
  onNext?: () => void;
  onViewProspect!: (identification: string) => void;

  subscription: Subscription | null = null;

  constructor(data: PreInvoiceInitialData) {
    const { onNext, onViewProspect } = data;
    this.getInitialData();
    this.onNext = onNext;
    this.onViewProspect = onViewProspect;

    this.subscription = SocketClient.instance.onNotificationStream.subscribe(
      this.onNotificationListener
    );
  }

  dispose = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  @action
  onNotificationListener = (noti: INotification) => {
    // noti es una notificacion desde el ws
    /* if (noti.type === NOTIFICATION_TYPES.PREBILL_STATUS_CHANGED) {
      if (this.prebill && this.prebill.id === noti.content.prebillId) {
        this.prebillStatus = noti.content.status;
      }
    } */
  };

  @action
  getInitialData = async () => {
    this.fetching = true;
    const leadId = this.lead.id!;
    this.asesor = this.lead.user;

    const quote = await this.quotesRepository.getClosedQuote(leadId);

    if (quote) {
      const prebill = await this.prebillsRepository.getPrebillByLead(leadId);
      //console.log('😡', prebill);
      this.quote = quote;
      this.discount = quote.discount || 0;
      if (prebill) {
        this.prebillStatus = prebill.status! as any;
        this.prebill = prebill;
        this.notes = prebill.notes || [];
        this.discount = prebill.descuento || this.discount;

        const mechanicalAppraisalQuote = this.quote!.mechanicalAppraisalQuote;

        if (mechanicalAppraisalQuote) {
          // si la prefactura existe y tambien tenemos un vehiculo como parte de pago
          this.quote = {
            ...this.quote,
            mechanicalAppraisalQuote: {
              ...mechanicalAppraisalQuote,
              /* desiredPrice:
                prebill.desiredPrice || mechanicalAppraisalQuote.desiredPrice, */
            },
          };
        }
      }

      const otrosConceptos: OtherConcept[] = [];
      if (quote.idAccesories) {
        quote.idAccesories.forEach((item: any) => {
          otrosConceptos.push({ ...item });
        });
      }
      this.otrosconceptos = otrosConceptos;
      this.buildPrebillInput();
    }
    ////console.log('this.prebill >>>>>', this.prebill);
    ////console.log(
    //   'this.prebill >>>>>',
    //   JSON.stringify(this.prebillInput, null, 2)
    // );

    this.fetching = false;
  };

  buildPrebillInput = () => {
    const quote = this.quote!;
    const vehiculos: VehiclePrebillInput[] = [];
    let valortotalvehiculos = 0;
    let valorTotalDescuentos = 0;

    quote.vehiculo!.forEach((vehicle) => {
      //console.log('vehicle.cantidad', vehicle.cantidad, vehicle);
      const precioNormal = vehicle.cost! * 1;
      // const precioNormal = vehicle.cost! * (vehicle.cantidad || 1);
      const descuento = (precioNormal * this.discount) / 100;
      const subtotal = precioNormal - descuento;
      const iva = subtotal * 0.12;
      const total = subtotal + iva;
      valortotalvehiculos += total;
      valorTotalDescuentos += descuento;

      vehiculos.push({
        name: '',
        modelo: vehicle.model!,
        marca: vehicle.brand!,
        version: '',
        anio: vehicle.year!,
        color:
          vehicle.color && vehicle.color.length > 0
            ? vehicle.color[0].color!
            : '', // cual es el color del vehiculo
        chassis: '',
        motor: '',
        cilindraje: `${vehicle.cylinder}`, // vehicle.cylinder es un numero pero me pide que le pase como string. Por que?
        clase: '',
        ramv: '',
        ubicacionfisica: '',
        origen: '',
        tipo: '',
        urlPhoto: vehicle.imgs!,
        valorunidad: vehicle.cost!,
        descuentoporcentaje: this.discount,
        descuentovalor: descuento,
        cantidad: vehicle.cantidad || 1,
        subtotal,
        iva,
        total,
      });
    });

    // pago mesual * 12 * numero de años
    const valortotalseguro: number = quote.insuranceCarrier
      ? quote.insuranceCarrier.monthlyPayment *
        12 *
        quote.insuranceCarrier.years
      : 0;

    const valortotaldeposito = quote.inputAmount || 0;
    const valortotalaccesorios = quote.accesoriesValue || 0;
    /* const valortotalaccesorios =
      quote.idAccesories && quote.idAccesories.length > 0
        ? quote.idAccesories.reduce((accumulator, currentValue) => {
            if (currentValue) {
              return accumulator + currentValue.cost! * currentValue.quantity!;
            }
            return accumulator;
          }, 0)
        : 0; */
    //console.log('valortotalaccesorios', valortotalaccesorios);
    /* const valorTotalServices =
      quote.services &&
      quote.services.length > 0 &&
      quote.services[0].satelliteTracking &&
      quote.services[0].satelliteTracking.length > 0
        ? quote.services[0].satelliteTracking.reduce(
            (accumulator, currentValue) => accumulator + currentValue.total!,
            0
          )
        : 0; */
    //console.log('valorTotalServices', valorTotalServices);

    const valortotalmantenimientos = 0;
    const valortotalotros = quote.servicesValue || 0;

    //console.log('valortotalvehiculos', valortotalvehiculos);

    /* CALCULO DE COSTOS */

    let legals = 0;
    let totalRen = 0;
    let subtotal = 0;
    const vehicleren = quote.vehiculo?.map((vehicule) => {
      if (quote.type === 'credit') {
        legals = calcLegals(vehicule?.pvp!, true);
      }
      const insuranceCarrierAmmount = quote!.insuranceCarrier!
        ? quote!.insuranceCarrier!.cost!
        : 0;
      const totalBase =
        vehicule?.pvp! +
        quote!.accesoriesValue! +
        quote!.servicesValue! +
        (legals - (legals - legals / 1.12)) +
        insuranceCarrierAmmount +
        (quote.registration! ? quote.registration! : 0);

      totalRen = calcTotal(
        totalBase,
        vehicule?.pvp!,
        quote.registration!,
        insuranceCarrierAmmount,
        false
      );
      subtotal = subTotal(totalBase, insuranceCarrierAmmount);

      return true;
    });

    //console.log({ subtotal, totalRen, legals });

    /* const valortotal =
      valortotalvehiculos +
      valortotalseguro +
      valortotalaccesorios +
      valortotalmantenimientos +
      valortotalotros; */
    const valortotal = totalRen;

    if (quote.vimVehiculo) {
      /* const prebillInput: PrebillInput = {
        vehiculos,
        vimVehiculo: quote.vimVehiculo,
        // otrosconceptos: this.otrosconceptos,
        otrosconceptos: [],
        valortotalvehiculos,
        valortotalseguro,
        valortotaldeposito,
        valortotalaccesorios,
        valortotalmantenimientos,
        valortotalotros,
        valortotal,
        margen: 0, // no tengo este valor
        descuento: valorTotalDescuentos,
        margenfinalporcentaje: 0, // no tengo este valor
        margenfinalvalor: 0, // no tengo este valor
        notes: [],
        checkSeminuevos: quote.mechanicalAppraisalQuote ? false : undefined,
      };
      this.prebillInput = prebillInput;

      if (this.prebill) {
        this.prebillInput = {
          ...this.prebillInput!,
          ////checkSeminuevos: this.prebill.checkSeminuevos,
        };
      } */
    }
  };

  @action
  requestAgain = async (): Promise<void> => {
    this.fetching = true;
    const user = auth.user!;
    const note = {
      id: user.id!,
      type: user.role!,
      name: `${user.nombre} ${user.apellido}`,
      texto: this.comment,
    };
    /*   const sent = await this.prebillsRepository.updatePrebillCreated({
      idPrebill: this.prebill!.id!,
      note,
      descuento: this.discount,
      desiredPrice: this.quote!.mechanicalAppraisalQuote
        ? this.quote!.mechanicalAppraisalQuote.desiredPrice!
        : null,
      checkSeminuevos: null,
    });

    if (sent) {
      notification.success({
        placement: 'bottomRight',
        duration: 4,
        message: 'Se ha enviado la prefactura a aprobación',
      });
      this.notes = [...this.notes, note];
      this.prebillStatus = 'REQUESTED';
    } else {
      notification.error({
        placement: 'bottomLeft',
        message: 'Error',
        description: 'No se pudo crear la prefactura',
      });
    } */
    this.fetching = false;
  };

  @action
  sendPreInvoce = async (): Promise<void> => {
    this.fetching = true;
    const user = auth.user!;
    const notes =
      this.comment.trim().length === 0
        ? []
        : [
            {
              id: user.id!,
              type: user.role!,
              name: `${user.nombre} ${user.apellido}`,
              texto: this.comment,
            },
          ];

    const result = await this.prebillsRepository.createPrebill(
      this.quote!.id!,
      {
        ...this.prebillInput!,
        notes,
      }
    );
    this.fetching = false;

    if (result) {
      if (notes.length > 0) {
        // si se envia un comentario al moento de solicitar la aprobacion
        this.notes = [...this.notes, notes[0]];
      }
      notification.success({
        placement: 'bottomRight',
        duration: 4,
        message: 'Se ha enviado la prefactura a aprobación',
      });
      this.prebillStatus = 'REQUESTED';
      const prebill = await this.prebillsRepository.getPrebillByLead(
        this.lead!.id!
      );
      if (prebill) {
        this.prebill = prebill;
      }

      // this.onNext();
    } else {
      notification.error({
        placement: 'bottomLeft',
        message: 'Error',
        description: 'No se pudo crear la prefactura',
      });
    }
  };

  @action
  acceptOrDeclinePrebill = async (accepted: boolean) => {
    if (!this.prebill || !this.prebill?.id) return;
    this.fetching = true;
    // const note = this.comment.trim().length > 0 ? {} : undefined;
    const user = auth.user!;
    const note = {
      id: user.id!,
      type: user.role!,
      name: `${user.nombre} ${user.apellido}`,
      texto: this.comment,
    };

    const result = await this.prebillsRepository.acceptOrDecline({
      id: this.prebill.id,
      accepted,
      note,
      idsQuotes: null,
    });

    if (result) {
      this.notes = [...this.notes, note];
      this.prebillStatus = accepted ? 'APPROVED' : 'REJECTED';
    } else {
      notification.error({
        placement: 'bottomLeft',
        message: 'Error',
        description: 'No se pudo procesar tu solicitud',
      });
    }
    this.fetching = false;
  };

  onCommentChange = (comment: string) => {
    this.comment = comment;
  };

  @action
  onDiscountChange = (discount: number) => {
    this.discount = discount;
  };

  onVehicleAprecialValueChange = (value: number) => {
    this.quote = {
      ...this.quote!,
      mechanicalAppraisalQuote: {
        ...this.quote!.mechanicalAppraisalQuote,
        desiredPrice: value,
      },
    };
  };

  @action
  onCheckSeminuevos = (value: boolean) => {
    /* this.prebillInput = { ...this.prebillInput!, checkSeminuevos: value }; */
  };
}
