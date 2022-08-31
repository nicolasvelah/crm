import { gql } from '@apollo/client';
import apolloClient from '..';
import Delivery from '../../../models/Delivery';

export const QUERY_GET_DELIVERY_BY_PREBILL = gql`
  query GetDeliveryByPrebill($idPrebill: Int!) {
    getDeliveryByPrebill(idPrebill: $idPrebill) {
      id
      deliveryFinal
      authorizathionStatus
      registration {
        state
        plateNumber
      }
      verifyDocuments {
        url
        name
        invoice
        walletState
      }
      finalDocuments {
        url
        name
        invoice
        walletState
      }
      delivery {
        url
        state
      }
      estimatedDeliveryDate
      scheduleDelivery {
        state
        date
        location
      }
      vehicleOrder {
        url
        state
      }
      printCheckPreDelivery
      comment {
        id
        type
        name
        text
        time
      }
    }
  }
`;

export const QUERY_GET_DELIVERY_BY_QUOTE = gql`
  query GetDeliveryByQuote($idQuote: Int!) {
    getDeliveryByQuote(idQuote: $idQuote) {
      id
      deliveryFinal
      authorizathionStatus
      registration {
        state
        plateNumber
      }
      verifyDocuments {
        url
        name
        invoice
        walletState
      }
      finalDocuments {
        url
        name
        invoice
        walletState
      }
      delivery {
        url
        state
      }
      scheduleDelivery {
        state
        date
        location
      }
      vehicleOrder {
        url
        state
      }
      printCheckPreDelivery
      comment {
        id
        type
        name
        text
        time
      }
    }
  }
`;

export default class DeliveryQueryProvider {
  getDeliveryByPrebill = async (
    idPrebill: number
  ): Promise<Delivery | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_DELIVERY_BY_PREBILL,
        variables: { idPrebill },
      });
      if (error || errors) return null;
      return data.getDeliveryByPrebill;
    } catch (error) {
      //console.log('Error getDeliveryByPrebill', error.message);
      return null;
    }
  };

  getDeliveryByQuote = async (idQuote: number): Promise<Delivery | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_DELIVERY_BY_QUOTE,
        variables: { idQuote },
      });
      if (error || errors) return null;
      return data.getDeliveryByQuote;
    } catch (error) {
      //console.log('Error getDeliveryByQuote', error.message);
      return null;
    }
  };
}
