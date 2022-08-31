import { action, computed, observable } from 'mobx';
import { message } from 'antd';
import React from 'react';
import Client from '../../../../data/models/Client';
import { Prebill } from '../../../../data/models/PreBill';
import DeliveryRepository from '../../../../data/repositories/delivery-repository';
import PreBillsRepository from '../../../../data/repositories/prebills-repository';
import Get from '../../../../utils/Get';
import { Dependencies } from '../../../../dependency-injection';
import { DocumentsVerifyInput } from '../../../../data/providers/apollo/mutations/delivery';
import {
  DeliveryDocument,
  DeliveryDocumentsCase,
  getDocumentsByCase,
} from './utils/delivery_documents';
import Leads from '../../../../data/models/Leads';
import QuotesRepository from '../../../../data/repositories/quotes-repository';
import Quotes from '../../../../data/models/Quotes';
import CRMRepository from '../../../../data/repositories/CRM-repository';
import WalletRepository from '../../../../data/repositories/wallet-repository';
import auth from '../../../../utils/auth';

export class DeliveryStepController {
  lead: Leads = Get.find<Leads>('lead');
  client: Client = Get.find<Client>('lead-client');
  prebill?: Prebill;
  quote?: Quotes;
  prebillsRepository = Get.find<PreBillsRepository>(Dependencies.prebills);
  deliveryRepository = Get.find<DeliveryRepository>(Dependencies.delivery);
  quotesRepository = Get.find<QuotesRepository>(Dependencies.quotes);
  CRMRepository = Get.find<CRMRepository>(Dependencies.CRM);
  walletRepository = Get.find<WalletRepository>(Dependencies.wallet);

  // para la seccion de verificacion de documentos segun el tipo de cotizacion
  deliveryDocumentsCase: DeliveryDocumentsCase =
    DeliveryDocumentsCase.directoNatural;

  @observable documents: DeliveryDocument[] = [];

  /// retorna true si ya se han cargado todos los documentos obligatorios segun sea el caso
  @computed get verifyDocumentsIsOk(): boolean {
    const documentsRequired = this.documents.filter(
      (e) => e.optional === false
    );

    const documentsLoaded = this.documents.filter(
      (e) => e.url !== null && e.optional === false
    );
    return documentsLoaded.length >= documentsRequired.length;
  }

  constructor() {
    this.getInitialData();
  }

  @observable fetching = false;

  @observable vehicleRequest: {
    status: 'Pendiente' | 'Solicitado' | 'Entregado';
    deliveryReceipt: string | null;
  } = {
    status: 'Pendiente',
    deliveryReceipt: null,
  };

  @observable vehicleRegistration: {
    status: 'Pendiente' | 'Solicitado' | 'Matriculado';
    plate: string | null;
  } = {
    status: 'Pendiente',
    plate: null,
  };

  @observable autorizationDelivery: {
    status: 'Pendiente' | 'Solicitado' | 'Autorizado';
    receipt: string | null;
  } = {
    status: 'Pendiente',
    receipt: null,
  };

  @observable preDelivery: {
    status: 'Pendiente' | 'Completado';
    receipt: string | null;
  } = {
    status: 'Pendiente',
    receipt: null,
  };

  @observable scheduleDelivery: {
    status: 'Inactivo' | 'Pendiente' | 'Completado';
    date: Date;
    location: 'En Showroom' | 'A domicilio';
  } = {
    status: 'Inactivo',
    date: new Date(),
    location: 'En Showroom',
  };

  @observable delivery: {
    status: 'Inactivo' | 'Pendiente' | 'Entregado';
    receipt: string | null;
  } = {
    status: 'Inactivo',
    receipt: null,
  };

  @action
  getInitialData = async () => {
    //console.log('init data')
    this.fetching = true;
    const quote = await this.quotesRepository.getClosedQuote(this.lead.id!); //this.lead.id!
    const prebill = await this.prebillsRepository.getPrebillByLead(
      this.lead.id!
    ); //this.lead.id!
    if (!prebill) {
      this.fetching = false;
      return;
    }
    const deliveryData = await this.deliveryRepository.getDeliveryByPrebill(
      prebill.id!!
    );

    if (prebill && quote && deliveryData) {
      this.vehicleRegistration = {
        status: deliveryData.registration!.plateNumber
          ? 'Matriculado'
          : (deliveryData!.registration!.state as any),
        plate: deliveryData.registration!.plateNumber,
      };

      if (deliveryData.vehicleOrder) {
        this.vehicleRequest = {
          status: (deliveryData.vehicleOrder.state as any) || 'Pendiente',
          deliveryReceipt: deliveryData.vehicleOrder.url || null,
        };
      }

      if (deliveryData.authorizathionStatus) {
        this.autorizationDelivery = {
          status: deliveryData.authorizathionStatus as any,
          receipt: null, // EN LA BASE NO S EESTA GUARDANDO
        };
      }

      this.quote = quote;
      // documentos requeridos segun el tipo de negocio
      if (quote.exonerated) {
        // exonerados natural o diplomatico
        this.deliveryDocumentsCase =
          quote.exonerated.type === 'diplomatics'
            ? DeliveryDocumentsCase.exoneradoDiplomatico
            : DeliveryDocumentsCase.exoneradoNatural;
      } else if (quote.type !== 'credit') {
        // el pago es de contado y es persona natural
        if (this.client.identification !== 'RUC') {
          this.deliveryDocumentsCase = DeliveryDocumentsCase.contadoNatural;
        } else if (this.client.identification === 'RUC') {
          // si el cliente usa RUC y es perona natural o juridica
          this.deliveryDocumentsCase =
            this.client.isPerson !== undefined &&
            this.client.isPerson !== null &&
            this.client.isPerson === false
              ? DeliveryDocumentsCase.contadoJuridico
              : DeliveryDocumentsCase.contadoNaturalRUC;
        }
      } else {
        // si es a credito
        const isDirectCredit = this.quote!.chosenEntity
          ? this.quote!.chosenEntity.entity === 'CRM'
          : false;

        if (this.client.typeIdentification !== 'RUC') {
          // si es cedula o pasaporte
          this.deliveryDocumentsCase = isDirectCredit
            ? DeliveryDocumentsCase.directoNatural
            : DeliveryDocumentsCase.ifiNatural;
        } else if (this.client.typeIdentification === 'RUC') {
          // si es con ruc y no es persona natual
          if (
            this.client.isPerson !== undefined &&
            this.client.isPerson !== null &&
            this.client.isPerson === false
          ) {
            this.deliveryDocumentsCase = isDirectCredit
              ? DeliveryDocumentsCase.directoJuridico
              : DeliveryDocumentsCase.ifiJuridico;
          } else {
            // si es persona natural con ruc
            this.deliveryDocumentsCase = isDirectCredit
              ? DeliveryDocumentsCase.directoNaturalRUC
              : DeliveryDocumentsCase.ifiNaturalRUC;
          }
        }
      }
      // obtenemos los documentos segun el caso
      const documents = getDocumentsByCase(this.deliveryDocumentsCase);
      if (deliveryData.verifyDocuments) {
        // comprobamos los documentos que ya fueron cargados
        deliveryData.verifyDocuments.forEach((item) => {
          const index = documents.findIndex(
            (e) => e.name === item.name && item.url !== null
          );
          if (index !== -1) {
            documents[index] = { ...documents[index], url: item.url };
          }
        });
      }
      this.documents = documents;
      this.prebill = prebill;
      // si ya se guardo una fecha para la entrega
      if (deliveryData.scheduleDelivery && deliveryData.scheduleDelivery.date) {
        this.scheduleDelivery = {
          date: new Date(deliveryData.scheduleDelivery.date),
          status: 'Completado',
          location: deliveryData.scheduleDelivery.location as any,
        };
      } else if (
        this.verifyDocumentsIsOk
        // && this.autorizationDelivery.status === 'Autorizado'
      ) {
        // si ya se cargaron todos los documentos de verificacion y la autorizacion de entrega esta 'Autorizado'
        this.scheduleDelivery = {
          ...this.scheduleDelivery,
          status: 'Pendiente',
        };
      }

      if (
        deliveryData.delivery &&
        deliveryData.delivery.state === 'Entregado'
      ) {
        this.delivery = {
          status: 'Entregado',
          receipt: deliveryData.delivery.url,
        };
      } else if (
        this.verifyDocumentsIsOk
        // && this.autorizationDelivery.status === 'Autorizado'
      ) {
        // si ya se cargaron todos los documentos de verificacion y la autorizacion de entrega esta 'Autorizado'
        this.delivery = {
          status: 'Pendiente',
          receipt: null,
        };
      }
    }
    this.fetching = false;
  };

  @action
  notifyVehicleRegistration = async (): Promise<void> => {
    this.fetching = true;
    const vehicleQuote = this.quote!.vehiculo![0];
    const isOK = this.CRMRepository.sendMail({
      asunto: 'Solicitud de matrícula de vehículo',
      template: 'templateVehicle',
      bodyData: {
        //
        leadId: this.lead.id,
        clientCi: this.client.identification,
        //
        textHeader: 'Se solicita la matriculación del vehículo',
        vehicleName: `${vehicleQuote.brand} ${vehicleQuote.model}`,
        vinNumber: this.quote!.vimVehiculo,
        vehicleImage:
          vehicleQuote.imgs ||
          'https://guc.it-zam.com/img/no-image-found-360x250.png',
        data: {
          id_vh: this.quote?.vimVehiculo,
          codigo: vehicleQuote.code,
          marca: vehicleQuote.brand,
          modelo: vehicleQuote.model,
          version: vehicleQuote.description,
          anio: vehicleQuote.year,
          // costo: vehiculos[0].value, //
          costo: vehicleQuote.pvp,
          cilidraje: vehicleQuote.cylinder,
          nropasajeros: vehicleQuote.numPassengers,
          nroejes: '2',
          puertas: vehicleQuote.doors,
          combustible: vehicleQuote.fuel,
          color: vehicleQuote.color ? vehicleQuote.color[0].color : '',
        },
        PreTextCallToActionButton:
          'Confirma la matriculación del vehículo ingresando la placa en el siguiente link.',
        CallToActionText: 'Ingresar el número de placa',
      },
      destinatario: 'czarate@corpCRM.com.ec',
      copia: '', //'vhidalgo@pas-hq.com',
      cc: '',
    });

    if (isOK) {
      this.vehicleRegistration = {
        ...this.vehicleRegistration,
        status: 'Solicitado',
      };
      message.success('Mail enviado al cliente');
    } else {
      message.error('Algo salió mal, vuelve a intentar.');
    }
    this.fetching = false;
  };

  @action
  notifyToLogistic = async () => {
    this.fetching = true;
    const prebill = this.prebill!;
    const quote = await this.quotesRepository.getClosedQuote(this.lead.id!);
    const correo = this.client.email;
    const usuario = `${this.client.name} ${this.client.lastName}`;
    const vin = quote.vimVehiculo;
    // const destinoLocalStorage: any = localStorage.getItem('user');
    const destinoLocalStorage: any = auth.user;
    //console.log('syscal✅', `${this.client.name} ${this.client.lastName}`);
    const destino = destinoLocalStorage.dealer[0].sucursal[0].sucursal;

    const deliveryData: any =
      await this.deliveryRepository.getDeliveryByPrebill(prebill.id!);
    const idDeliverySet: number = deliveryData.id;
    const updateVehicleOrderForLogistic: any =
      await this.deliveryRepository.updateVehicleOrderForLogistic(
        idDeliverySet,
        usuario,
        vin,
        destino,
        correo!
      );
    //console.log('syscal✅', updateVehicleOrderForLogistic);
    const del = await this.deliveryRepository.updateVehicleOrder(
      prebill.id!,
      null
    );
    const vehicleQuote = this.quote!.vehiculo![0];
    const sent = this.CRMRepository.sendMail({
      asunto: 'Pedido de vehículo',
      template: 'templateVehicle',
      bodyData: {
        textHeader: 'Se solicita el vehículo',
        vehicleName: `${vehicleQuote.brand} ${vehicleQuote.model}`,
        vinNumber: this.quote!.vimVehiculo,
        vehicleImage:
          vehicleQuote.imgs ||
          'https://guc.it-zam.com/img/no-image-found-360x250.png',
        data: {
          id_vh: quote.vimVehiculo,
          codigo: vehicleQuote.code,
          marca: vehicleQuote.brand,
          modelo: vehicleQuote.model,
          version: vehicleQuote.description,
          anio: vehicleQuote.year,
          // costo: vehiculos[0].value, //
          descripcion: vehicleQuote.description,
          costo: vehicleQuote.pvp,
          cilidraje: vehicleQuote.cylinder,
          nropasajeros: vehicleQuote.numPassengers,
          nroejes: '2',
          puertas: vehicleQuote.doors,
          combustible: vehicleQuote.fuel,
          color: vehicleQuote.color ? vehicleQuote.color[0].color : '',
        },
        PreTextCallToActionButton:
          'Confirma la entrega del vehículo en el siguiente link.',
        CallToActionText: 'Confirmar entrega del vehículo',
        TypeMail: 'logistic',
        leadId: this.lead.id!,
        clientCi: this.client.identification!,
        idDelivery: idDeliverySet,
        prebillId: prebill.id!,
      },
      destinatario: 'luismiguelzacarias@outlook.com', //client.email
      copia: '',
      cc: '',
    });
    if (del && sent) {
      this.fetching = false;
      message.success('Mail enviado al cliente');
      this.vehicleRequest = {
        ...this.vehicleRequest,
        status: 'Solicitado',
      };
    } else {
      message.error('Algo salió mal, vuelve a intentar.');
    }
    this.fetching = false;
  };

  @action
  notifyToWallet = async () => {
    this.fetching = true;
    const prebill = this.prebill!;
    const client = this.client!;
    const prospect = {
      campaign: client.campaign,
      cellphone: client.cellphone,
      chanel: client.chanel,
      email: client.email,
      identification: client.identification,
      lastName: client.lastName,
      name: client.name,
      phone: client.phone,
      socialRazon: client.socialRazon,
      typeIdentification: client.typeIdentification,
    };
    /* const valuesWallet = {
      descuento: prebill.descuento,
      margen: prebill.margen,
      margenfinalporcentaje: prebill.margenfinalporcentaje,
      margenfinalvalor: prebill.margenfinalvalor,
      valortotal: prebill.valortotal,
      valortotalaccesorios: prebill.valortotalaccesorios,
      valortotaldeposito: prebill.valortotaldeposito,
      valortotalmantenimientos: prebill.valortotalmantenimientos,
      valortotalotros: prebill.valortotalotros,
      valortotalseguro: prebill.valortotalseguro,
      valortotalvehiculos: prebill.valortotalvehiculos,
    }; */
    const valuesWallet: any = {
      descuento: prebill.descuento,
    };
    /* const vehicles = prebill.vehiculos.map((e: VehiclePrebillInput) => {
      const v: VehiclePrebillInput = {
        name: e.name,
        marca: e.marca,
        modelo: e.modelo,
        version: e.version,
        anio: e.anio,
        color: e.color,
        chassis: e.chassis,
        motor: e.motor,
        cilindraje: e.cilindraje,
        clase: e.clase,
        ramv: e.ramv,
        ubicacionfisica: e.ubicacionfisica,
        origen: e.origen,
        tipo: e.tipo,
        urlPhoto: e.urlPhoto,
        valorunidad: e.valorunidad,
        descuentoporcentaje: e.descuentoporcentaje,
        descuentovalor: e.descuentovalor,
        cantidad: e.cantidad,
        subtotal: e.subtotal,
        iva: e.iva,
        total: e.total,
      };
      return v;
    }); */
    const vehicles: any[] = [];

    const del = await this.deliveryRepository.getDeliveryByPrebill(prebill.id!);
    const inv = del!.verifyDocuments!.filter((e) => e.invoice === 'invoice');
    const invoices = inv.map((e) => {
      const i: DocumentsVerifyInput = {
        invoice: e.invoice,
        name: e.name,
        url: e.url,
        walletState: e.walletState,
      };
      return i;
    });
    const wallet = await this.walletRepository.createWallet(
      prospect,
      valuesWallet,
      vehicles,
      invoices,
      { idLead: this.lead.id!, idPrebill: prebill.id! }
    );
    const added: boolean =
      await this.deliveryRepository.updateAuthorizathionStatusRequested(
        prebill.id!
      );
    if (added && wallet) {
      this.fetching = false;
      this.autorizationDelivery = {
        ...this.autorizationDelivery,
        status: 'Solicitado',
      };
    } else {
      message.error('No se pudo actualizar la información');
    }
    this.fetching = false;
  };

  // notificamos que el vehiculo ha sido entregado
  @action
  sendDeliveryReceipt = async (fileUrl: string) => {
    this.fetching = true;
    const prebill = this.prebill!;
    const added: boolean = await this.deliveryRepository.updateDeliveryFinal(
      prebill.id!,
      fileUrl
    );
    if (added) {
      this.delivery = {
        ...this.delivery,
        status: 'Entregado',
        receipt: fileUrl,
      };
    } else {
      message.error('No se pudo actualizar la información');
    }
    this.fetching = false;
  };

  // realizamos el pedifo del vehiculo
  @action
  sendDeliveryRequestReceipt = async (fileUrl: string) => {
    this.fetching = true;
    const result = await this.deliveryRepository.updateVehicleOrder(
      this.prebill!.id!,
      fileUrl
    );
    if (result) {
      this.vehicleRequest = { status: 'Entregado', deliveryReceipt: fileUrl };
    } else {
      message.error('No se pudo actualizar la información');
    }
    this.fetching = false;
  };

  @action
  saveVehiclePlate = async (plate: string) => {
    this.fetching = true;
    if (plate.trim().length === 0) return;
    const added: boolean = await this.deliveryRepository.updateRegistration(
      this.prebill!.id!,
      plate
    );
    if (added) {
      this.vehicleRegistration = { status: 'Matriculado', plate };
      this.fetching = false;
    } else {
      message.error('No se pudo actualizar la información');
    }
    this.fetching = false;
  };

  @action
  updateScheduleDate = (date: Date) => {
    this.scheduleDelivery = { ...this.scheduleDelivery, date };
  };

  @action
  updateScheduleLocation = (location: 'En Showroom' | 'A domicilio') => {
    this.scheduleDelivery = { ...this.scheduleDelivery, location };
  };

  @action
  saveSchedule = async () => {
    this.fetching = true;
    const prebill = this.prebill!;
    const added: boolean = await this.deliveryRepository.updateScheduleDelivery(
      prebill.id!,
      {
        date: this.scheduleDelivery.date,
        location: this.scheduleDelivery.location,
        state: 'Completado',
      }
    );
    if (added) {
      this.fetching = false;
      this.scheduleDelivery = {
        ...this.scheduleDelivery,
        status: 'Completado',
      };
    } else {
      message.error('No se pudo actualizar la información');
    }
    this.fetching = false;
  };

  /**
   * busca una factura usando la api de CRM /api/catalog
   * @param documentIndex
   * @param invoiceNumber
   */
  @action
  searchAndSaveInvoice = async (
    documentIndex: number,
    invoiceNumber: string
  ) => {
    this.fetching = true;
    // buscamos si existe la factura con el nuemro dado
    const result = await this.CRMRepository.catalog({
      operacion: 'facturas',
      filtro: { numero: invoiceNumber },
    });
    if (!result) {
      // si no existe la factura
      this.fetching = false;
      message.error('Factura no encontrada');
      return;
    }
    // creamos una copia de los documentos
    const tmp = [...this.documents];
    tmp[documentIndex].url = invoiceNumber;
    // actualizamos en base
    await this.updateDocumentVerification(tmp);
    this.fetching = false;
  };

  /**
   * actualiza un documento de verificacion
   * @param documentIndex
   * @param url
   */
  @action
  updateFileinDocumentVerification = async (
    documentIndex: number,
    url: string
  ) => {
    this.fetching = true;
    // creamos una copia de los documentos
    const tmp = [...this.documents];
    tmp[documentIndex].url = url;
    // actualizamos en base
    await this.updateDocumentVerification(tmp);
    this.fetching = false;
  };

  @action
  deliveryFinished = async () => {
    this.fetching = true;
    const prebill = this.prebill!;
    const added: boolean = await this.deliveryRepository.finishDelivery(
      prebill.id!
    );
    if (added) {
      this.fetching = false;
    } else {
      this.fetching = false;
      message.error('No se pudo actualizar la información');
    }
  };

  private updateDocumentVerification = async (
    documents: DeliveryDocument[]
  ) => {
    // convertimos los documentos al tipo de dato que require la mutacion
    const data: DocumentsVerifyInput[] = [];
    documents.forEach((item) => {
      data.push({
        name: item.name,
        url: item.url,
        invoice: item.invoice ? 'invoice' : 'file',
        walletState: 'walletState',
      });
    });
    const isOk = await this.deliveryRepository.updateDocumentsVerify(
      this.prebill!.id!,
      data
    );
    if (isOk) {
      // si los documentos se actualizaron correctamente en base
      this.documents = documents;
      this.enableScheduleAndDeliveryModules(); // comprobamos si podemos habilitar los modulos de agendamiento y entrega
    } else {
      message.error('No se pudo actualizar la información');
    }
  };

  private enableScheduleAndDeliveryModules = () => {
    if (
      this.verifyDocumentsIsOk &&
      this.scheduleDelivery.status === 'Inactivo'
    ) {
      this.scheduleDelivery = {
        ...this.scheduleDelivery,
        status: 'Pendiente',
      };
      this.delivery = {
        ...this.delivery,
        status: 'Pendiente',
      };
    }
  };
}
