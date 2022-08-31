import { gql } from '@apollo/client';
import apolloClient from '..';
import { UserReassignedInput } from './reassigned';
import Leads from '../../../models/Leads';
import { LeadInsertInput } from './clients';
import { ResSaleDown } from '../../../repositories-interfaces/leads-repository-interface';

export interface UserInput {
  id: number;

  chiefs: Number[];

  codUsuario: string;

  nombre: string;

  apellido: string;

  role: string;

  concessionaire: string;

  concesionario: string[];

  sucursal: string[];

  brand: string;

  CRMTransactionToken: String;

  timeExpiration: String;

  //leads: LeadsInput[];
}

const MUTATION_INSERT_LEADS = gql`
  mutation InsertLead(
    $leadsInsert: LeadInsertInput!
    $identificationClient: String!
    $campaign: String
    $channel: String!
  ) {
    insertLead(
      leadsInsert: $leadsInsert
      identificationClient: $identificationClient
      campaign: $campaign
      channel: $channel
    ) {
      id
      updateAt
      createdAt
    }
  }
`;

const MUTATION_REASIGN_LEAD = gql`
  mutation ReasignLead($idUser: Int!, $idsLeads: [Int!]!) {
    reasignLead(idUser: $idUser, idsLeads: $idsLeads)
  }
`;

const MUTATION_NOTIFY_SALE_DOWN = gql`
  mutation NotifySaleDown(
    $idUser: Int!
    $identification: String!
    $idLead: Int!
    $comment: String
    $saleDownExtra: InputSaleDown
  ) {
    notifySaleDown(
      idUser: $idUser
      identification: $identification
      idLead: $idLead
      comment: $comment
      saleDownExtra: $saleDownExtra
    )
  }
`;

const MUTATION_SALE_DOWN = gql`
  mutation SaleDown(
    $idLead: Int!
    $accepted: Boolean!
    $dataVehicle: DataVehicleSaleDown
    $comment: String
  ) {
    saleDown(
      idLead: $idLead
      accepted: $accepted
      dataVehicle: $dataVehicle
      comment: $comment
    ) {
      idsQuotesLiberatedVIN
      idsQuotesNOLiberatedVIN
    }
  }
`;

const MUTATION_UPDATE_TEMPERATURE = gql`
  mutation UpdateTemperature($id: Int!, $temperatureInsert: String!) {
    updateTemperature(id: $id, temperatureInsert: $temperatureInsert)
  }
`;
const MUTATION_UPDATE_CAMPAIGN = gql`
  mutation UpdateLeadToCampaign($id: Int!, $campaign: String!) {
    updateLeadToCampaign(id: $id, campaign: $campaign)
  }
`;

const MUTATION_UPDATE_STATE_LEAD = gql`
  mutation UpdateStateLead($id: Int!, $stateLead: String!) {
    updateStateLead(id: $id, stateLead: $stateLead)
  }
`;

const MUTATION_UPDATE_WORKPAGE = gql`
  mutation UpdateWorkPage($idLead: Int!) {
    updateWorkPage(idLead: $idLead)
  }
`;

const MUTATION_UPDATE_LEADS_DISCOUNT = gql`
  mutation UpdateLeadDiscount($id: Int!, $discount: Float!) {
    updateLeadDiscount(id: $id, discount: $discount)
  }
`;

const MUTATION_REASIGN_USER = gql`
  mutation ReasignUser(
    $user: UserReassignedInput!
    $userOld: UserReassignedInput!
    $idsLeads: [Int!]!
  ) {
    reasignUser(user: $user, userOld: $userOld, idsLeads: $idsLeads)
  }
`;

export default class LeadsMutationProvider {
  notifySaleDown = async (
    idUser: number,
    identification: string,
    idLead: number,
    comment: string,
    saleDownExtra: {
      idModelo: number;
      marca: string;
    } | null
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_NOTIFY_SALE_DOWN,
        variables: {
          idUser,
          identification,
          idLead,
          comment,
          saleDownExtra,
        },
      });

      if (errors) return false;
      //console.log('notifySaleDown', data);
      return true;
    } catch (e) {
      //console.error('notifySaleDown', e.message);
      return false;
    }
  };

  updateTemperature = async (
    id: number,
    temperatureInsert: string
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_TEMPERATURE,
        variables: {
          id,
          temperatureInsert,
        },
      });

      if (errors) return false;
      //console.log('Update temperature', data);
      return true;
    } catch (e) {
      //console.error('Update temperature', e.message);
      return false;
    }
  };

  updateLeadToCampaign = async (
    id: number,
    campaign: string
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_CAMPAIGN,
        variables: {
          id,
          campaign,
        },
      });

      if (errors) return false;
      //console.log('Update temperature', data);
      return true;
    } catch (e) {
      //console.error('Update temperature', e.message);
      return false;
    }
  };

  updateStateLead = async (id: number, stateLead: string): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_STATE_LEAD,
        variables: {
          id,
          stateLead,
        },
      });

      if (errors) return false;
      //console.log('Update StateLead', data);
      return true;
    } catch (e) {
      //console.error('Update StateLead', e.message);
      return false;
    }
  };

  saleDown = async (
    idLead: number,
    accepted: boolean,
    dataVehicle: {
      id_modelo: number;
      marca: string;
    } | null,
    comment?: string | null
  ): Promise<ResSaleDown> => {
    try {
      const { data, errors } = await apolloClient.mutate({
        mutation: MUTATION_SALE_DOWN,
        variables: {
          idLead,
          accepted,
          dataVehicle,
          comment: comment ?? null,
        },
      });

      if (errors) return { ok: false, message: errors[0].message };
      //console.log('saleDown', data);
      return { ok: true, message: 'ok', data: data.saleDown };
    } catch (e) {
      //console.error('saleDown', e.message);
      return { ok: false, message: e.message };
    }
  };

  reasignUser = async (
    user: UserReassignedInput,
    userOld: UserReassignedInput,
    idsLeads: number[]
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_REASIGN_USER,
        variables: {
          user,
          userOld,
          idsLeads,
        },
      });

      if (errors) return false;
      //console.log('reasignUser', data);
      return true;
    } catch (e) {
      //console.error('reasignUser', e.message);
      return false;
    }
  };

  updateWorkPage = async (idLead: number): Promise<boolean> => {
    try {
      //console.log('INCIO ');
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_WORKPAGE,
        variables: {
          idLead,
        },
      });

      if (errors) return false;
      //console.log('updateWorkPage', data);
      return true;
    } catch (e) {
      //console.error('updateWorkPage', e.message);
      return false;
    }
  };

  updateLeadDiscount = async (
    id: number,
    discount: number
  ): Promise<boolean> => {
    try {
      //console.log('INCIO ');
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_LEADS_DISCOUNT,
        variables: {
          id,
          discount,
        },
      });

      if (errors) return false;
      //console.log('updateLeadDiscount', data);
      return true;
    } catch (e) {
      //console.error('updateLeadDiscount', e.message);
      return false;
    }
  };

  insertLead = async (
    leadsInsert: LeadInsertInput,
    identificationClient: string,
    campaign: string | null,
    channel: string
  ): Promise<Leads | null> => {
    try {
      //console.log('INCIO');
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_INSERT_LEADS,
        variables: {
          leadsInsert,
          identificationClient,
          campaign,
          channel,
        },
      });

      if (errors) return null;
      //console.log('insertLead', data.insertLead);
      return data.insertLead;
    } catch (e) {
      //console.error('Error insertLead', e.message);
      return null;
    }
  };

  reasignLead = async (
    idUser: number,
    idsLeads: number[]
  ): Promise<boolean> => {
    try {
      const { errors } = await apolloClient.mutate({
        mutation: MUTATION_REASIGN_LEAD,
        variables: {
          idUser,
          idsLeads,
        },
      });

      if (errors) return true;
      //console.log('reasignLead', data.reasignLead);
      return true;
    } catch (e) {
      //console.error('Error reasignLead', e.message);
      return false;
    }
  };
}
