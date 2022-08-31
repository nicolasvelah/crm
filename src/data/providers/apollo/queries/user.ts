import { gql } from '@apollo/client';
import apolloClient from '..';
import User from '../../../models/User';

export const QUERY_GET_USERS_FOR_MESSAGES = gql`
  query GetUsersForMessages {
    getUsersForMessages {
      id
      codUsuario
      nombre
      apellido
      role
      concesionario
      sucursal
    }
  }
`;

export const QUERY_GET_EMPLOYEES_BY_ID_BOSS = gql`
  query GetEmployeesByIdBoss($idInput: Int!) {
    getEmployeesByIdBoss(idInput: $idInput) {
      id
      nombre
      apellido
      role
    }
  }
`;

export const QUERY_GET_EMPLOYEES_BY_BOSS = gql`
  query GetEmployeesByBoss {
    getEmployeesByBoss {
      id
      nombre
      apellido
      codUsuario
      role
      sucursal
      concesionario
    }
  }
`;

export const QUERY_GET_EMPLOYEES_BY_CONCESIONAIRE = gql`
  query GetEmployeesByConcesionaire {
    getEmployeesByConcesionaire {
      id
      nombre
      apellido
      codUsuario
      role
      sucursal
      concesionario
    }
  }
`;

export const QUERY_USER_BY_LEAD = gql`
  query GetUserByLead($idLead: Int!) {
    getUserByLead(idLead: $idLead) {
      id
      nombre
      apellido
      role
    }
  }
`;

export const QUERY_GET_BOSSES_FROM_USER = gql`
  query GetBossesFromUser {
    getBossesFromUser {
      id
      nombre
      apellido
      role
    }
  }
`;

export default class UserQueryProvider {
  getUsersForMessages = async (): Promise<User[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: QUERY_GET_USERS_FOR_MESSAGES,
      });
      if (error) return null;
      return data.getUsersForMessages;
    } catch (error) {
      //console.log('Error getUsersForMessages', error.message);
      return null;
    }
  };

  getEmployeesByIdBoss = async (idInput: number): Promise<User[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: QUERY_GET_EMPLOYEES_BY_ID_BOSS,
        variables: { idInput },
      });
      if (error) return null;
      return data.getEmployeesByIdBoss;
    } catch (error) {
      //console.log('Error getEmployeesByIdBoss', error.message);
      return null;
    }
  };

  getEmployeesByBoss = async (): Promise<User[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: QUERY_GET_EMPLOYEES_BY_BOSS,
      });
      if (error) return null;
      return data.getEmployeesByBoss;
    } catch (error) {
      //console.log('Error getEmployeesByBoss', error.message);
      return null;
    }
  };
  getEmployeesByConcesionaire = async (): Promise<User[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: QUERY_GET_EMPLOYEES_BY_CONCESIONAIRE,
      });
      if (error) return null;
      return data.getEmployeesByConcesionaire;
    } catch (error) {
      return null;
    }
  }

  getUserByLead = async (idLead: number): Promise<User | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: QUERY_USER_BY_LEAD,
        variables: { idLead },
      });
      if (error) return null;
      return data.getUserByLead;
    } catch (error) {
      //console.log('getUserByLead', error);
      return null;
    }
  };

  getBossesFromUser = async (): Promise<User[] | null> => {
    try {
      const { data, error } = await apolloClient.query({
        query: QUERY_GET_BOSSES_FROM_USER,
      });
      if (error) return null;
      return data.getBossesFromUser;
    } catch (error) {
      //console.log('getUserByLead', error);
      return null;
    }
  };
}
