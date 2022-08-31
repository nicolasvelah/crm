import { gql } from '@apollo/client';
import apolloClient from '..';
import { Messages } from '../../../models/Messages';
import { GetObjectives, Objectives, ObjectivesAccessories, ObjectivesAllies } from '../../../models/Objectives';

export const QUERY_GET_OBJECTIVES_ADVISER = gql`
  {
  getObjectivesAdviser {
    id
    idConcessionaire
    concessionaire
    idSucursal
    sucursal
    idAdviser
    adviser
    idVersion
    exonerated
    month
    quantity
    margin
    type
    createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_ACCESSORIES = gql`
  {
  getObjectivesAccessories {
  id
  idConcessionaire
  concessionaire
  idSucursal
  sucursal
  idAdviser
  adviser
  idVersion
  exonerated
  month
  budgetYear
  amountAccessories
  counted
  type
  createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_ACCESSORIES_RESULT = gql`
 query GetObjectivesAccessoriesResult($firstDate: String!, $secondDate: String!, $counted: Int, $credit: Int) {
  getObjectivesAccessoriesResult(firstDate: $firstDate, secondDate: $secondDate, counted: $counted, credit: $credit)  {
  id
  idConcessionaire
  concessionaire
  idSucursal
  sucursal
  idAdviser
  adviser
  idVersion
  exonerated
  month
  budgetYear
  amountAccessories
  counted
  type
  createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_SALES_RESULT = gql`
 query GetObjectivesSalesResult($firstDate: String!, $secondDate: String!, $counted: Int, $credit: Int) {
  getObjectivesSalesResult(firstDate: $firstDate, secondDate: $secondDate, counted: $counted, credit: $credit)  {
    id
    idConcessionaire
    concessionaire
    idSucursal
    sucursal
    idAdviser
    adviser
    idVersion
    exonerated
    month
    quantity
    margin
    type
    createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_ALLIES_RESULT = gql`
 query GetObjectivesAlliesResult($firstDate: String!, $secondDate: String!, $counted: Int, $credit: Int) {
  getObjectivesAlliesResult(firstDate: $firstDate, secondDate: $secondDate, counted: $counted, credit: $credit)  {
    id
  idConcessionaire
  concessionaire
  idSucursal
  sucursal
  idAdviser
  adviser
  idVersion
  exonerated
  month
  budgetYear
  amountAccessories
  counted
  type
  insurance
  insuranceAmount
  device
  amountDevice
  prepaid
  amountPrepaid
  used
  amountUsed
  type
  createdAt
  }
}
`;
export const QUERY_GET_OBJECTIVES_ACCESSORIES_RESULT_BY_IDADVISER = gql`
 query GetObjectivesAccessoriesResultByIdAdviser($id:Int!, $firstDate: String!, $secondDate: String!, $counted: Int, $credit: Int) {
  getObjectivesAccessoriesResultByIdAdviser(id: $id, firstDate: $firstDate, secondDate: $secondDate, counted: $counted, credit: $credit)  {
  id
  idConcessionaire
  concessionaire
  idSucursal
  sucursal
  idAdviser
  adviser
  idVersion
  exonerated
  month
  budgetYear
  amountAccessories
  counted
  type
  createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_ALLIES_RESULT_BY_IDADVISER = gql`
 query getObjectivesAlliesResultByIdAdviser($id:Int!, $firstDate: String!, $secondDate: String!, $counted: Int, $credit: Int) {
  getObjectivesAlliesResultByIdAdviser(id: $id, firstDate: $firstDate, secondDate: $secondDate, counted: $counted, credit: $credit)  {
    id
  idConcessionaire
  concessionaire
  idSucursal
  sucursal
  idAdviser
  adviser
  idVersion
  exonerated
  month
  budgetYear
  amountAccessories
  counted
  type
  insurance
  insuranceAmount
  device
  amountDevice
  prepaid
  amountPrepaid
  used
  amountUsed
  type
  createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_ALLIES = gql`
  {
  getObjectivesAllies {
  id
  idConcessionaire
  concessionaire
  idSucursal
  sucursal
  idAdviser
  adviser
  idVersion
  exonerated
  month
  budgetYear
  amountAccessories
  counted
  type
  insurance
  insuranceAmount
  device
  amountDevice
  prepaid
  amountPrepaid
  used
  amountUsed
  type
  createdAt
  }
}
`;

export const QUERY_GET_OBJECTIVES_BY_IDADVISER = gql`
   query GetObjectivesByIdAdviser($id: Int!, $firstDate: String!, $secondDate: String!) {
    getObjectivesByIdAdviser(id: $id, firstDate: $firstDate, secondDate: $secondDate) {
    id
    idConcessionaire
    concessionaire
    idSucursal
    sucursal
    idAdviser
    adviser
    idVersion
    exonerated
    month
    quantity
    margin
    type
    createdAt
  }
}
`;

export const QUERY_GET_ALL_OBJECTIVES = gql`
  query GetAllObjectives($idSucursal: Int!) {
    getAllObjectives(idSucursal: $idSucursal) {
      id
      idSucursal
      brand
      codAdviser
      nameAdviser
      brandGoalUnits
      brandGoalAmount
      createdAt
    }
  }
`;

export default class ObjectivesQueryProvider {
  getObjectivesAdviser = async (): Promise<Objectives[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ADVISER,
        variables: {},
      });
      if (error || errors) return [];
      return data.getObjectivesAdviser;
    } catch (error) {
      console.log('Error getObjectivesAdviser', error.message);
      return [];
    }
  };

  getObjectivesAccessories = async (): Promise<ObjectivesAccessories[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ACCESSORIES,
        variables: {},
      });
      if (error || errors) return [];
      return data.getObjectivesAccessories;
    } catch (error) {
      console.log('Error getObjectivesAccessories', error.message);
      return [];
    }
  };

  getObjectivesAccessoriesResult = async (firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAccessories[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ACCESSORIES_RESULT,
        variables: {
          firstDate,
          secondDate,
          counted,
          credit
        },
      });
      if (error || errors) return [];
      return data.getObjectivesAccessoriesResult;
    } catch (error) {
      console.log('Error getObjectivesAccessories', error.message);
      return [];
    }
  };

  getObjectivesSalesResult = async (firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<Objectives[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_SALES_RESULT,
        variables: {
          firstDate,
          secondDate,
          counted,
          credit
        },
      });
      if (error || errors) return [];
      return data.getObjectivesSalesResult;
    } catch (error) {
      console.log('Error getObjectivesSalesResult', error.message);
      return [];
    }
  };

  getObjectivesAlliesResult = async (firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAllies[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ALLIES_RESULT,
        variables: {
          firstDate,
          secondDate,
          counted,
          credit
        },
      });
      if (error || errors) return [];
      return data.getObjectivesAlliesResult;
    } catch (error) {
      console.log('Error getObjectivesAlliesResult', error.message);
      return [];
    }
  };

  getObjectivesAccessoriesResultByIdAdviser = async (id: number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAccessories[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ACCESSORIES_RESULT_BY_IDADVISER,
        variables: {
          id,
          firstDate,
          secondDate,
          counted,
          credit
        },
      });
      if (error || errors) return [];
      return data.getObjectivesAccessoriesResultByIdAdviser;
    } catch (error) {
      console.log('Error getObjectivesAccessories', error.message);
      return [];
    }
  };

  getObjectivesAlliesResultByIdAdviser = async (id: number, firstDate: string,
    secondDate: string, counted: number, credit: number): Promise<ObjectivesAllies[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ALLIES_RESULT_BY_IDADVISER,
        variables: {
          id,
          firstDate,
          secondDate,
          counted,
          credit
        },
      });
      if (error || errors) return [];
      return data.getObjectivesAlliesResultByIdAdviser;
    } catch (error) {
      console.log('Error getObjectivesAlliesResultByIdAdviser', error.message);
      return [];
    }
  };

  getObjectivesAllies = async (): Promise<ObjectivesAllies[]> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_ALLIES,
        variables: {},
      });
      if (error || errors) return [];
      return data.getObjectivesAllies;
    } catch (error) {
      console.log('Error getObjectivesAllies', error.message);
      return [];
    }
  };
  getObjectivesByIdAdviser = async (id: number, firstDate: string,
    secondDate: string): Promise<Objectives[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_OBJECTIVES_BY_IDADVISER,
        variables: {
          id,
          firstDate,
          secondDate
        },
      });
      if (error || errors) return [];
      return data.getObjectivesByIdAdviser;
    } catch (error) {
      console.log('Error getObjectivesByIdAdviser', error.message);
      return [];
    }
  };

  getAllObjectives = async (idSucursal: number): Promise<Objectives[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_ALL_OBJECTIVES,
        variables: {
          idSucursal
        },
      });
      if (error || errors) return null;
      return data.getAllObjectives;
    } catch (error) {
      console.log('Error getAllObjectives', error.message);
      return null;
    }
  };
}
