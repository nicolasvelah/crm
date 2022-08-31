import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import { Prebill } from '../../../models/PreBill';

const QUERY_GET_ALL_PRE_BILLS = gql`
  query GetAllPrebills {
    getAllPrebills {
      id
      notes {
        texto
      }
      vehiculos
      otrosconceptos
      valortotalvehiculos
      valortotalseguro
      valortotaldeposito
      valortotalaccesorios
      status
      valortotalmantenimientos
      valortotalotros
      valortotal
      margen
      descuento
      margenfinalvalor
      margenfinalporcentaje
      idPrefacturaCRM
      updateAt
      createdAt
    }
  }
`;

const QUERY_GET_PRE_BILL_BY_ID_CRM = gql`
  query GetPrebillByIdCRM($idPrefacturaCRM: String!) {
    getPrebillByIdCRM(idPrefacturaCRM: $idPrefacturaCRM) {
      id
      notes {
        texto
      }
      vehiculos
      otrosconceptos
      valortotalvehiculos
      valortotalseguro
      valortotaldeposito
      valortotalaccesorios
      status
      valortotalmantenimientos
      valortotalotros
      valortotal
      margen
      descuento
      margenfinalvalor
      margenfinalporcentaje
      idPrefacturaCRM
      updateAt
      createdAt
    }
  }
`;

const QUERY_GET_PRE_BILL_BY_ID_LEAD = gql`
  query GetPrebillByIdLead($idLead: Int!) {
    getPrebillByIdLead(idLead: $idLead) {
      id
      notes {
        id
        type
        name
        texto
      }
      vehiculos {
        marca
        modelo
        anio
        version
        color
        valorunidad
        cantidad
        iva
        subtotal
        total
        urlPhoto
        descuentovalor
        descuentoporcentaje
      }
      otrosconceptos {
        id
        categoria
        descripcion
        cantidad
        valorunidad
        subtotal
        descuentovalor
        iva
        total
      }
      valortotalvehiculos
      valortotalseguro
      valortotaldeposito
      valortotalmantenimientos
      valortotalotros
      valortotal
      status
      margen
      descuento
      margenfinalvalor
      margenfinalporcentaje
      idPrefacturaCRM
      checkSeminuevos
      desiredPrice
    }
  }
`;

export default class PreBillQueryProvider {
  getAllPrebills = async (): Promise<Prebill[] | null> => {
    try {
      const { error, data, errors } = await apolloClient.query({
        query: QUERY_GET_ALL_PRE_BILLS,
      });

      if (error || errors) return null;
      return data.getAllPrebills;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  getPrebillByLead = async (idLead: number): Promise<Prebill | null> => {
    try {
      //console.log('🤢');
      const { error, data, errors } = await apolloClient.query({
        query: QUERY_GET_PRE_BILL_BY_ID_LEAD,
        variables: {
          idLead,
        },
      });

      if (error || errors) return null;
      //console.log('😅', data.getPrebillByIdLead);
      return data.getPrebillByIdLead;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  getPrebillByIdCRM = async (
    idPrefacturaCRM: string
  ): Promise<Prebill | null> => {
    try {
      const { error, data, errors } = await apolloClient.query({
        query: QUERY_GET_PRE_BILL_BY_ID_CRM,
        variables: {
          idPrefacturaCRM,
        },
      });

      if (error || errors) return null;
      return data.getPrebillByIdCRM;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };
}
