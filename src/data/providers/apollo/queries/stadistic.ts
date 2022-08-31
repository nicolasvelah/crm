// eslint-disable-next-line max-classes-per-file
import { gql } from '@apollo/client';
import apolloClient from '..';

export class StaidsticInputType {
  name: string | undefined | null;
  value: number | undefined | null;
}

export const GET_LEAD_BY_MONTH = gql`
  query GetLeadByMonth {
    getLeadByMonth {
      name
      value
    }
  }
`;

export const GET_SALE_DOWN = gql`
  query GetSaleDown {
    getSaleDown {
      name
      value
    }
  }
`;

export default class StadisticQueryProvider {
  getLeadByMonth = async (): Promise<StaidsticInputType[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_LEAD_BY_MONTH,
      });
      if (error) return null;
      return data.getLeadByMonth;
    } catch (error) {
      //console.log('Error getLeadByMonth', error.message);
      return null;
    }
  };

  getSaleDown = async (): Promise<StaidsticInputType[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: GET_SALE_DOWN,
      });
      if (error) return null;
      return data.getSaleDown;
    } catch (error) {
      //console.log('Error getSaleDown', error.message);
      return null;
    }
  };
}
