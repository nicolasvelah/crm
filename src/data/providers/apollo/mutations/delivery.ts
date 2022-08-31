import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';

export interface DocumentsVerifyInput {
  url: string | null;
  name: string | null;
  invoice: 'file' | 'invoice';
  walletState: string | null;
}

export interface ScheduleDeliveryInput {
  state: string;
  date: Date | string;
  location: string;
}

export interface NoteWalletInput {
  id: number;
  type: string;
  name: string;
  text: string;
  time: string;
}

export const MUTATION_UPDATE_DOCUMENT_VERIFICATION = gql`
  mutation UpdateDocumentsVerify(
    $documents: [DocumentsVerifyInput!]!
    $idDelivery: Int!
  ) {
    updateDocumentsVerify(documents: $documents, idDelivery: $idDelivery)
  }
`;

export const MUTATION_UPDATE_FINAL_DOCUMENT = gql`
  mutation UpdateFinalDocumentsDelivery(
    $documents: [DocumentsVerifyInput!]!
    $idDelivery: Int!
  ) {
    updateFinalDocumentsDelivery(
      documents: $documents
      idDelivery: $idDelivery
    ) {
      idBusinessHubspot
      status
      message
    }
  }
`;

export const MUTATION_UPDATE_VERIFY_DOCUMENT_WALLET = gql`
  mutation UpdateVerifyDocuments(
    $nameDocument: String!
    $idDelivery: Int!
    $walletState: String!
  ) {
    updateVerifyDocuments(
      nameDocument: $nameDocument
      idDelivery: $idDelivery
      walletState: $walletState
    )
  }
`;

export const MUTATION_UPDATE_REGISTRATION = gql`
  mutation UpdateRegistration($idPrebill: Int!, $plateNumber: String) {
    updateRegistration(idPrebill: $idPrebill, plateNumber: $plateNumber)
  }
`;

export const MUTATION_UPDATE_REGISTRATION_WITH_QUOTE = gql`
  mutation UpdateRegistrationWithQuote($idQuote: Int!, $plateNumber: String) {
    updateRegistrationWithQuote(idQuote: $idQuote, plateNumber: $plateNumber)
  }
`;

export const MUTATION_UPDATE_VEHICLE_ORDER = gql`
  mutation UpdateVehicleOrder($idDelivery: Int!, $url: String) {
    updateVehicleOrder(idDelivery: $idDelivery, url: $url)
  }
`;

export const MUTATION_UPDATE_AUTHORIZATHION_STATUS_REQUESTED = gql`
  mutation UpdateAuthorizathionStatusRequested($idPrebill: Int!) {
    updateAuthorizathionStatusRequested(idPrebill: $idPrebill)
  }
`;
export const MUTATION_AUTHORIZATHION_STATUS_REQUESTED_LEAD = gql`
  mutation authorizathionStatusRequestedLead($idQuotes: [Int!]!) {
    authorizathionStatusRequestedLead(idQuotes: $idQuotes)
  }
`;

export const MUTATION_UPDATE_AUTHORIZATHION_STATUS_AUTHORIZED = gql`
  mutation UpdateAuthorizathionStatusAuthorized(
    $idPrebill: Int!
    $authorizathionStatus: String!
    $comment: NoteWalletInput
    $idLead: Int
    $identificationClient: String
    $idUser: Int
    $idUserVerification: Int
    $codUser: String
    $nameClient: String
    $idQuote: Int
  ) {
    updateAuthorizathionStatusAuthorized(
      idPrebill: $idPrebill
      authorizathionStatus: $authorizathionStatus
      comment: $comment
      idLead: $idLead
      identificationClient: $identificationClient
      idUser: $idUser
      idUserVerification: $idUserVerification
      codUser: $codUser
      nameClient: $nameClient
      idQuote: $idQuote
    )
  }
`;

export const MUTATION_UPDATE_DELIVERY_FINAL = gql`
  mutation UpdateDeliveryFinal($idDelivery: Int!, $url: String!) {
    updateDeliveryFinal(idDelivery: $idDelivery, url: $url)
  }
`;

export const MUTATION_UPDATE_PRE_DELIVERY = gql`
  mutation UpdatePreDelivery($idPrebill: Int!) {
    updatePreDelivery(idPrebill: $idPrebill)
  }
`;

export const MUTATION_UPDATE_SCHEDULE_DELIVERY = gql`
  mutation UpdateScheduleDelivery(
    $idPrebill: Int!
    $scheduleDelivery: ScheduleDeliveryInput!
  ) {
    updateScheduleDelivery(
      idPrebill: $idPrebill
      scheduleDelivery: $scheduleDelivery
    )
  }
`;

export const MUTATION_UPDATE_ESTIMATED_DELIVERY_DATE = gql`
  mutation UpdateEstimatedDateDelivery(
    $idDelivery: Int!
    $estimatedDate: String!
  ) {
    updateEstimatedDateDelivery(
      idDelivery: $idDelivery
      estimatedDate: $estimatedDate
    )
  }
`;

export const MUTATION_UPDATE_SCHEDULE_DELIVERY_WITH_QUOTE = gql`
  mutation UpdateScheduleDeliveryWithQuote(
    $idQuote: Int!
    $scheduleDelivery: ScheduleDeliveryInput!
    $isRedExterna: Boolean
  ) {
    updateScheduleDeliveryWithQuote(
      idQuote: $idQuote
      scheduleDelivery: $scheduleDelivery
      isRedExterna: $isRedExterna
    ) {
      idBusinessHubspot
      message
      status
    }
  }
`;

export const MUTATION_FINISH_DELIVERY = gql`
  mutation FinishDelivery($idDelivery: Int!) {
    finishDelivery(idDelivery: $idDelivery)
  }
`;

export const MUTATION_UPDATE_VEHICLE_ORDER_FILE = gql`
  mutation updateVehicleOrderForFile($id: Int!, $url: String!) {
    updateVehicleOrderForFile(id: $id, url: $url)
  }
`;

export const MUTATION_UPDATE_VEHICLE_ORDER_FOR_LOGISTIC = gql`
  mutation updateVehicleOrderForLogistic(
    $id: Int!
    $usuario: String!
    $vin: String!
    $empresa: String!
    $correo: String!
  ) {
    updateVehicleOrderForLogistic(
      id: $id
      usuario: $usuario
      vin: $vin
      empresa: $empresa
      correo: $correo
    )
  }
`;

export const MUTATION_UPDATE_VEHICLE_REQUEST = gql`
  mutation UpdateVehicleOrderRequest(
    $id: Int!
    $empresa: String!
    $usuario: String!
    $vin: String!
    $correo: String!
    $fecha: String!
    $destino: String!
    $direccion: String!
    $sala: String!
    $concesionario: String!
  ) {
    updateVehicleOrderRequest(
      id: $id
      empresa: $empresa
      usuario: $usuario
      vin: $vin
      fecha: $fecha
      destino: $destino
      direccion: $direccion
      sala: $sala
      concesionario: $concesionario
    )
  }
`;

export const MUTATION_SEND_DATA_TO_HUBSPOT = gql`
  mutation sendDataToHubspot($idDelivery: Int!) {
    sendDataToHubspot(idDelivery: $idDelivery)
  }
`;
export default class DeliveryMutationProvider {
  updateVerifyDocuments = async (
    nameDocument: string,
    idDelivery: number,
    walletState: string
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_VERIFY_DOCUMENT_WALLET,
        variables: {
          nameDocument,
          idDelivery,
          walletState,
        },
      });

      if (errors) return false;
      //console.log('Update Verify Documents Wallet', data);
      return true;
    } catch (e) {
      //console.log('Error Verify Documents Wallet', e.message);
      return false;
    }
  };

  updateDocumentsVerify = async (
    idDelivery: number,
    documents: DocumentsVerifyInput[]
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_DOCUMENT_VERIFICATION,
        variables: {
          idDelivery,
          documents,
        },
      });

      if (errors) return false;
      //console.log('createDelivery', data);
      return true;
    } catch (e) {
      //console.log('Error createDelivery', e.message);
      return false;
    }
  };

  updateFinalDocumentsDelivery = async (
    idDelivery: number,
    documents: DocumentsVerifyInput[]
  ): Promise<{
    status: number;
    message: string;
    idBusinessHubspot?: string | null;
  }> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_FINAL_DOCUMENT,
        variables: {
          idDelivery,
          documents,
        },
      });

      if (errors) return { status: 400, message: errors[0].message };
      console.log('updateFinalDocumentsDelivery', data);

      return {
        status: data.updateFinalDocumentsDelivery.status,
        message: data.updateFinalDocumentsDelivery.message,
        idBusinessHubspot: data.updateFinalDocumentsDelivery?.idBusinessHubspot,
      };
    } catch (e) {
      console.log('Error updateFinalDocumentsDelivery', e.message);
      return { status: 400, message: e.message };
    }
  };

  updateRegistrationWithQuote = async (
    idQuote: number,
    plateNumber: string | null
  ): Promise<string | null> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_REGISTRATION_WITH_QUOTE,
        variables: {
          idQuote,
          plateNumber,
        },
      });

      if (errors) return null;
      //console.log(
      //   'updateRegistrationWithQuote',
      //   data.updateRegistrationWithQuote
      // );
      return data.updateRegistrationWithQuote;
    } catch (e) {
      //console.log('Error updateRegistration', e.message);
      return null;
    }
  };

  updateRegistration = async (
    idPrebill: number,
    plateNumber: string | null
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_REGISTRATION,
        variables: {
          idPrebill,
          plateNumber,
        },
      });

      if (errors) return false;
      //console.log('updateRegistration', data);
      return true;
    } catch (e) {
      //console.log('Error updateRegistration', e.message);
      return false;
    }
  };

  updateVehicleOrder = async (
    idDelivery: number,
    url: string | null
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_VEHICLE_ORDER,
        variables: {
          idDelivery,
          url,
        },
      });

      if (errors) return false;
      //console.log('UpdateVehicleOrder', data);
      return true;
    } catch (e) {
      //console.log('Error UpdateVehicleOrder', e.message);
      return false;
    }
  };

  updateAuthorizathionStatusRequested = async (
    idPrebill: number
  ): Promise<boolean> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return false;
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_AUTHORIZATHION_STATUS_REQUESTED,
        variables: {
          idPrebill,
        },
        context,
      });

      if (errors) return false;
      //console.log('updateAuthorizathionStatusRequested', data);
      return true;
    } catch (e) {
      //console.log('Error updateAuthorizathionStatusRequested', e.message);
      return false;
    }
  };

  authorizathionStatusRequestedLead = async (
    idQuotes: number[]
  ): Promise<{ ok: boolean; message: string }> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return { ok: false, message: 'No existe context' };
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_AUTHORIZATHION_STATUS_REQUESTED_LEAD,
        variables: {
          idQuotes,
        },
        context,
      });

      if (errors) return { ok: false, message: errors[0].message };
      //console.log('authorizathionStatusRequestedLead', data);
      return { ok: true, message: 'ok' };
    } catch (e) {
      //console.log('Error authorizathionStatusRequestedLead', e.message);
      return { ok: false, message: e.message };
    }
  };

  updateAuthorizathionStatusAuthorized = async (
    idPrebill: number,
    authorizathionStatus: string,
    comment: NoteWalletInput,
    idLead: number,
    identificationClient: string,
    idUser: number,
    idUserVerification: number,
    codUser: string,
    nameClient: string,
    idQuote: number
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_AUTHORIZATHION_STATUS_AUTHORIZED,
        variables: {
          idPrebill,
          authorizathionStatus,
          comment,
          idLead,
          identificationClient,
          idUser,
          idUserVerification,
          codUser,
          nameClient,
          idQuote,
        },
      });
      //console.log('Datos ded envio ⛔⛔⛔', idUserVerification);
      if (errors) return false;
      //console.log('updateAuthorizathionStatusAuthorized', data);
      return true;
    } catch (e) {
      //console.log('Error updateAuthorizathionStatusAuthorized', e.message);
      return false;
    }
  };

  updateDeliveryFinal = async (
    idDelivery: number,
    url: string | null
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_DELIVERY_FINAL,
        variables: {
          idDelivery,
          url,
        },
      });

      if (errors) return false;
      //console.log('updateDeliveryFinal', data);
      return true;
    } catch (e) {
      //console.log('Error updateDeliveryFinal', e.message);
      return false;
    }
  };

  updatePreDelivery = async (idPrebill: number): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_PRE_DELIVERY,
        variables: {
          idPrebill,
        },
      });

      if (errors) return false;
      //console.log('updatePreDelivery', data);
      return true;
    } catch (e) {
      //console.log('Error updatePreDelivery', e.message);
      return false;
    }
  };

  updateScheduleDelivery = async (
    idPrebill: number,
    scheduleDelivery: ScheduleDeliveryInput
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_SCHEDULE_DELIVERY,
        variables: {
          idPrebill,
          scheduleDelivery,
        },
      });

      if (errors) return false;
      //console.log('updateScheduleDelivery', data);
      return true;
    } catch (e) {
      //console.log('Error updateScheduleDelivery', e.message);
      return false;
    }
  };

  updateScheduleDeliveryWithQuote = async (
    idQuote: number,
    scheduleDelivery: ScheduleDeliveryInput,
    isRedExterna: boolean | null
  ): Promise<{
    status: number;
    message: string;
    idBusinessHubspot?: string | null;
  }> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_SCHEDULE_DELIVERY_WITH_QUOTE,
        variables: {
          idQuote,
          scheduleDelivery,
          isRedExterna,
        },
      });

      if (errors) return { status: 400, message: errors[0].message };
      console.log('updateScheduleDeliveryWithQuote', data);

      return {
        status: data.updateScheduleDeliveryWithQuote.status,
        message: data.updateScheduleDeliveryWithQuote.message,
        idBusinessHubspot:
          data.updateScheduleDeliveryWithQuote?.idBusinessHubspot,
      };
    } catch (e) {
      console.log('Error updateScheduleDeliveryWithQuote', e.message);
      return { status: 400, message: e.message };
    }
  };

  updateEstimatedDateDelivery = async (
    idDelivery: number,
    estimatedDate: string
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_ESTIMATED_DELIVERY_DATE,
        variables: {
          idDelivery,
          estimatedDate,
        },
      });

      if (errors) return false;
      //console.log('updateEstimatedDateDelivery', data);
      return true;
    } catch (e) {
      //console.log('Error updateEstimatedDateDelivery', e.message);
      return false;
    }
  };

  finishDelivery = async (idDelivery: number): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_FINISH_DELIVERY,
        variables: {
          idDelivery,
        },
      });

      if (errors) return false;
      //console.log('finishDelivery', data);
      return true;
    } catch (e) {
      //console.log('Error finishDelivery', e.message);
      return false;
    }
  };

  updateVehicleOrderForFile = async (
    id: number,
    url: string
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_VEHICLE_ORDER_FILE,
        variables: {
          id,
          url,
        },
      });

      if (errors) return false;
      //console.log('updateOrderFile', data);
      return true;
    } catch (e) {
      //console.log('Error updateOrderFile', e.message);
      return false;
    }
  };

  updateVehicleOrderForLogistic = async (
    id: number,
    usuario: string,
    vin: string,
    empresa: string,
    correo: string
  ): Promise<boolean> => {
    try {
      //console.log({ id, usuario, vin, empresa, correo });
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_VEHICLE_ORDER_FOR_LOGISTIC,
        variables: {
          id,
          usuario,
          vin,
          empresa,
          correo,
        },
      });

      if (errors) return false;
      //console.log('updateOrderFile', data);
      return true;
    } catch (e) {
      //console.log('Error updateOrderFile', e.message);
      return false;
    }
  };

  updateVehicleOrderRequest = async (
    id: number,
    empresa: string,
    usuario: string,
    vin: string,
    fecha: string,
    destino: string,
    direccion: string,
    sala: string,
    concesionario: string
  ): Promise<boolean> => {
    try {
      //console.log({
      //   id,
      //   empresa,
      //   usuario,
      //   vin,
      //   fecha,
      //   destino,
      //   direccion,
      //   sala,
      //   concesionario,
      // });
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_VEHICLE_REQUEST,
        variables: {
          id,
          empresa,
          usuario,
          vin,
          fecha,
          destino,
          direccion,
          sala,
          concesionario,
        },
      });

      if (errors) return false;
      //console.log('updateVehicleOrderRequest', data);
      return true;
    } catch (e) {
      //console.log('Error updateVehicleOrderRequest', e.message);
      return false;
    }
  };

  sendDataToHubspot = async (idDelivery: number): Promise<string | null> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_SEND_DATA_TO_HUBSPOT,
        variables: {
          idDelivery,
        },
      });

      if (errors) return null;
      console.log('sendDataToHubspot', data);
      return data;
    } catch (e) {
      console.log('Error sendDataToHubspot', e.message);
      return null;
    }
  };
}
