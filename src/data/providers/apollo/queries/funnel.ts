// eslint-disable-next-line max-classes-per-file
import { gql } from '@apollo/client';
import apolloClient from '..';

export class FunnelInput {
  etapa: string | undefined | null;
  cantidad: number | undefined | null;
}

export class ByChannels {
  chanel: string | undefined | null;
  cantidad: number | undefined | null;
}

export const GET_FUNNEL = gql`
  query GetFunnel($firstDate: String!, $secondDate: String!) {
    getFunnel(firstDate: $firstDate, secondDate: $secondDate) {
      etapa
      cantidad
    }
  }
`;

export const GET_TOTAL_FUNNEL = gql`
  query GetTotalFunnel($id: Float!, $firstDate: String!, $secondDate: String!) {
    getTotalFunnel(id: $id, firstDate: $firstDate, secondDate: $secondDate) {
      etapa
      cantidad
    }
  }
`;

export const GET_CHANNEL_FUNNEL = gql`
  query GetChannelFunnel(
    $firstDate: String!
    $secondDate: String!
    $channel: String!
  ) {
    getChannelFunnel(
      firstDate: $firstDate
      secondDate: $secondDate
      channel: $channel
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_CHANNEL_JEFE = gql`
  query getChannelJefe(
    $firstDate: String!
    $secondDate: String!
    $channel: String!
  ) {
    getChannelJefe(
      firstDate: $firstDate
      secondDate: $secondDate
      channel: $channel
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_CHANNEL_ASESOR = gql`
  query GetChannelAsesor(
    $id: Float!
    $firstDate: String!
    $secondDate: String!
    $channel: String!
  ) {
    getChannelAsesor(
      id: $id
      firstDate: $firstDate
      secondDate: $secondDate
      channel: $channel
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_SUCURSAL_FUNNEL = gql`
  query GetSucursalFunnel(
    $firstDate: String!
    $secondDate: String!
    $concessionaire: String!
    $sucursal: String!
    $brands: String
  ) {
    getSucursalFunnel(
      firstDate: $firstDate
      secondDate: $secondDate
      concessionaire: $concessionaire
      sucursal: $sucursal
      brands: $brands
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_FUNNEL_REFERENTIAL_BRAND = gql`
  query GetFunnelReferentialBrand(
    $brand: String!
    $firstDate: String!
    $secondDate: String!
  ) {
    getFunnelReferentialBrand(
      brand: $brand
      firstDate: $firstDate
      secondDate: $secondDate
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_CHANNEL_FUNNEL_REFERENTIAL = gql`
  query GetChannelFunnelReferential(
    $firstDate: String!
    $secondDate: String!
    $channel: String!
  ) {
    getChannelFunnelReferential(
      firstDate: $firstDate
      secondDate: $secondDate
      channel: $channel
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_CHANNEL_JEFE_REFERENTIAL = gql`
  query GetChannelJefeReferential(
    $firstDate: String!
    $secondDate: String!
    $channel: String!
  ) {
    getChannelJefeReferential(
      firstDate: $firstDate
      secondDate: $secondDate
      channel: $channel
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_CHANNEL_ASESOR_REFERENTIAL = gql`
  query GetChannelAsesorReferential(
    $id: Float!
    $firstDate: String!
    $secondDate: String!
    $channel: String!
  ) {
    getChannelAsesorReferential(
      id: $id
      firstDate: $firstDate
      secondDate: $secondDate
      channel: $channel
    ) {
      etapa
      cantidad
    }
  }
`;
export const GET_SUCURSAL_FUNNEL_REFERENTIAL = gql`
  query GetSucursalFunnelReferential(
    $firstDate: String!
    $secondDate: String!
    $concessionaire: String!
    $sucursal: String!
    $brand: String!
  ) {
    getSucursalFunnelReferential(
      firstDate: $firstDate
      secondDate: $secondDate
      concessionaire: $concessionaire
      sucursal: $sucursal
      brand: $brand
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_FUNNEL_BY_CONSESIONAIRE_AND_SUCURSAL = gql`
  query GetFunnelByConsesionaireAndSucursal(
    $consesionario: String!
    $sucursal: String!
    $firstDate: String!
    $secondDate: String!
  ) {
    getFunnelByConsesionaireAndSucursal(
      consesionario: $consesionario
      sucursal: $sucursal
      firstDate: $firstDate
      secondDate: $secondDate
    ) {
      etapa
      cantidad
    }
  }
`;

export const GET_FUNNEL_BY_ASESOR = gql`
  query GetFunnelByAsesor(
    $id: Float!
    $firstDate: String!
    $secondDate: String!
  ) {
    getFunnelByAsesor(id: $id, firstDate: $firstDate, secondDate: $secondDate) {
      etapa
      cantidad
    }
  }
`;

export const GET_FUNNEL_BY_BRANDS = gql`
  query GetFunnelByBrands(
    $brand: String!
    $firstDate: String!
    $secondDate: String!
  ) {
    getFunnelByBrands(
      brand: $brand
      firstDate: $firstDate
      secondDate: $secondDate
    ) {
      etapa
      cantidad
    }
  }
`;
export const GET_BY_CHANNEL = gql`
  query GetByChannel($firstDate: String!, $secondDate: String!) {
    getByChannel(firstDate: $firstDate, secondDate: $secondDate) {
      chanel
      cantidad
    }
  }
`;

export default class FunnelQueryProvider {
  getFunnel = async (
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_FUNNEL,
        variables: { firstDate, secondDate },
      });
      if (error) return null;
      return data.getFunnel;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getTotalFunnel = async (
    id: number | null,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_TOTAL_FUNNEL,
        variables: { id, firstDate, secondDate },
      });
      if (error) return null;
      return data.getTotalFunnel;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getChannelFunnel = async (
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_CHANNEL_FUNNEL,
        variables: { firstDate, secondDate, channel },
      });
      if (error) return null;
      return data.getChannelFunnel;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getChannelJefe = async (
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_CHANNEL_JEFE,
        variables: { firstDate, secondDate, channel },
      });
      if (error) return null;
      return data.getChannelJefe;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getChannelAsesor = async (
    id: number,
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_CHANNEL_ASESOR,
        variables: { id, firstDate, secondDate, channel },
      });
      if (error) return null;
      return data.getChannelAsesor;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getSucursalFunnel = async (
    firstDate: string,
    secondDate: string,
    concessionaire: string,
    sucursal: string,
    brands: string | null
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_SUCURSAL_FUNNEL,
        variables: { firstDate, secondDate, concessionaire, sucursal, brands },
      });
      if (error) return null;
      return data.getSucursalFunnel;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getFunnelReferentialBrand = async (
    brand: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_FUNNEL_REFERENTIAL_BRAND,
        variables: { brand, firstDate, secondDate },
      });
      if (error) return null;
      return data.getFunnelReferentialBrand;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getChannelFunnelReferential = async (
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_CHANNEL_FUNNEL_REFERENTIAL,
        variables: { firstDate, secondDate, channel },
      });
      if (error) return null;
      return data.getChannelFunnelReferential;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getChannelJefeReferential = async (
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_CHANNEL_JEFE_REFERENTIAL,
        variables: { firstDate, secondDate, channel },
      });
      if (error) return null;
      return data.getChannelJefeReferential;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getChannelAsesorReferential = async (
    id: number,
    firstDate: string,
    secondDate: string,
    channel: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_CHANNEL_ASESOR_REFERENTIAL,
        variables: { id, firstDate, secondDate, channel },
      });
      if (error) return null;
      return data.getChannelAsesorReferential;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getSucursalFunnelReferential = async (
    firstDate: string,
    secondDate: string,
    concessionaire: string,
    sucursal: string,
    brand: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_SUCURSAL_FUNNEL_REFERENTIAL,
        variables: { firstDate, secondDate, concessionaire, sucursal, brand },
      });
      if (error) return null;
      return data.getSucursalFunnelReferential;
    } catch (error) {
      //console.log('Error getFunnel', error.message);
      return null;
    }
  };

  getFunnelByConsesionaireAndSucursal = async (
    consesionario: string,
    sucursal: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_FUNNEL_BY_CONSESIONAIRE_AND_SUCURSAL,
        variables: { consesionario, sucursal, firstDate, secondDate },
      });
      if (error) return null;
      return data.getFunnelByConsesionaireAndSucursal;
    } catch (error) {
      //console.log('Error getFunnelByConsesionaireAndSucursal', error.message);
      return null;
    }
  };

  getFunnelByAsesor = async (
    id: number | null,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_FUNNEL_BY_ASESOR,
        variables: { id, firstDate, secondDate },
      });
      if (error) return null;
      return data.getFunnelByAsesor;
    } catch (error) {
      //console.log('Error getFunnelByAsesor', error.message);
      return null;
    }
  };

  getFunnelByBrands = async (
    brand: string,
    firstDate: string,
    secondDate: string
  ): Promise<FunnelInput[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_FUNNEL_BY_BRANDS,
        variables: { brand, firstDate, secondDate },
      });
      if (error) return null;
      return data.getFunnelByBrands;
    } catch (error) {
      //console.log('Error GetFunnelByBrands', error.message);
      return null;
    }
  };

  getByChannel = async (
    firstDate: string,
    secondDate: string
  ): Promise<ByChannels[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_BY_CHANNEL,
        variables: { firstDate, secondDate },
      });
      if (error) return null;
      return data.getByChannel;
    } catch (error) {
      //console.log('Error getByChannel', error.message);
      return null;
    }
  };
}
