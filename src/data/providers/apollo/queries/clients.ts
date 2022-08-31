import { gql } from '@apollo/client';
import apolloClient from '..';
import Client from '../../../models/Client';

export const QUERY_GET_CLIENTS_BY_IDENTIFICATION = gql`
  query GetClientsByIdentification($identification: String!) {
    getClientsByIdentification(identification: $identification) {
      id
      name
      lastName
      birthdate
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      isPerson
      createdAt
      leads {
        id
        state
        temperature
        workPage
        city
        createdAt
        discount
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        inquiry {
          question
          answer
        }
        saleDown
        user {
          id
          nombre
          apellido
          codUsuario
          typeConcessionaire {
            code
            type
          }
        }
        prebill {
          id
          notes {
            id
            type
            name
            texto
          }
          status
          descuento
          payThirdPerson
          idPrefacturaCRM
          accepted
          updateAt
          createdAt
        }
        quotes {
          exonerated {
            type
            percentage
          }
          id
          sendEmailFinancialToClient
          idAccesories {
            code
            name
            cost
            dimension
            id
            id_Vh
            brand
            model
            urlPhoto {
              link
            }
            quantity
          }
          vehiculo {
            cantidad
            code
            brand
            model
            year
            cost
            pvp
            description
            cylinder
            numPassengers
            doors
            fuel
            stock
            margen
            imgs
            pdf {
              link
            }
            color {
              color
              id
              stock
              urlPhoto {
                link
              }
            }
          }
          type
          payThirdPerson
          reserveValue
          chosenEntity {
            type
            entity
          }
          accesoriesValue
          closed
          servicesValue
          services {
            nombre
            items {
              codigo
              descripcion
              exonerado
              forma_pago
              iva
              marcas
              total
              valor
            }
          }
          inputAmount
          rate
          device {
            cost
            years
          }
          registration
          months
          monthly
          documentCredit
          quoteFinancial {
            id
            responseBank
            createdAt
            financial {
              nameEntityFinancial
              phoneEntityFinancial
              nameContact
              lastNameContact
              emailcontact
              idSucursal
            }
          }
          insuranceCarrier {
            name
            cost
            years
            monthlyPayment
          }
          vimVehiculo
          vimVehiculoData {
            codigo
            descripcion
            antiguedad
            color
            dealer
            estado
            id_color
            id_dealer
            id_sucursal
            sucursal
            vin
            margen
          }
          delivery {
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
            createdAt
            finalDocuments {
              url
              name
              invoice
              walletState
            }
          }
          discount
        }
      }

      tracings {
        id
        type
        motive
        priority
        executionDate
        closeDate
        openingNote
        closeNote
        updateAt
        createdAt
        user {
          id
          nombre
          apellido
          typeConcessionaire {
            code
            type
          }
        }
      }
    }
  }
`;

export const QUERY_GET_ONE_CLIENT_BY_IDENTIFICATION = gql`
  query GetOneClientByIdentification($identification: String!) {
    getOneClientByIdentification(identification: $identification) {
      id
      name
      lastName
      birthdate
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      isPerson
      createdAt
      leads {
        id
        state
        temperature
        workPage
        city
        createdAt
        discount
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        inquiry {
          question
          answer
        }
        saleDown
        user {
          id
          nombre
          apellido
          codUsuario
          typeConcessionaire {
            code
            type
          }
        }
      }
    }
  }
`;

export const QUERY_GET_CLIENTS_BY_DATES = gql`
  query GetClientsByDates($firstDate: String!, $secondDate: String!) {
    getClientsByDates(firstDate: $firstDate, secondDate: $secondDate) {
      id
      name
      lastName
      birthdate
      phone
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
      tracings {
        id
        type
        motive
        priority
        executionDate
        closeDate
        openingNote
        closeNote
        updateAt
        createdAt
      }
    }
  }
`;

export const QUERY_GET_CLIENTS_BY_IDENTIFICATION_OR_LASTNAME = gql`
  query GetClientsByIdentificationOrLastName($value: String!) {
    getClientsByIdentificationOrLastName(value: $value) {
      id
      name
      lastName
      birthdate
      phone
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
      leads {
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        id
        user {
          id
          typeConcessionaire {
            code
            type
          }
        }
      }
    }
  }
`;

export const QUERY_GET_ALL_CLIENTS = gql`
  {
    getAllClients {
      id
      name
      lastName
      birthdate
      phone
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
    }
  }
`;

export const QUERY_GET_CLIENTS_BY_BOSSES = gql`
  query getClientsByBosses($firstDate: String!, $secondDate: String!) {
    getClientsByBosses(firstDate: $firstDate, secondDate: $secondDate) {
      id
      name
      lastName
      birthdate
      phone
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
      leads {
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        id
        quotes {
          id
        }
      }
      tracings {
        id
        type
        motive
        priority
        executionDate
        closeDate
        openingNote
        closeNote
        updateAt
        createdAt
      }
    }
  }
`;

export const QUERY_GET_CLIENTS_LABEL_DASHBOARD = gql`
  query getClientsLabelDashboard($firstDate: String!, $secondDate: String!) {
    getClientsLabelDashboard(firstDate: $firstDate, secondDate: $secondDate) {
      id
      name
      lastName
      birthdate
      phone
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
      leads {
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        id
        quotes {
          id
        }
      }
      tracings {
        id
        type
        motive
        priority
        executionDate
        closeDate
        openingNote
        closeNote
        updateAt
        createdAt
      }
    }
  }
`;

export const QUERY_GET_CLIENTS_BY_BOSSES_BY_ID = gql`
  query getClientsByBossesById(
    $idUser: Int!
    $firstDate: String!
    $secondDate: String!
  ) {
    getClientsByBossesById(
      idUser: $idUser
      firstDate: $firstDate
      secondDate: $secondDate
    ) {
      id
      name
      lastName
      birthdate
      phone
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
      leads {
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        id
        quotes {
          id
        }
      }
      tracings {
        id
        type
        motive
        priority
        executionDate
        closeDate
        openingNote
        closeNote
        updateAt
        createdAt
      }
    }
  }
`;

// identifiction o lastname o email
export const QUERY_GET_CLIENTS_BY_OPTIONS = gql`
  query GetClientsByOptions($optionInput: String!) {
    getClientsByOptions(optionInput: $optionInput) {
      id
      name
      lastName
      birthdate
      cellphone
      socialRazon
      email
      typeIdentification
      identification
      chanel
      campaign
      createdAt
      leads {
        id
        state
        temperature
        workPage
        inquiry {
          question
          answer
        }
        saleDown
        user {
          id
          nombre
          apellido
          typeConcessionaire {
            code
            type
          }
        }
        quotes {
          id
          vehiculo {
            cantidad
            code
            brand
            model
            year
            cost
            pvp
            description
            cylinder
            numPassengers
            doors
            fuel
            stock
            margen
            imgs
            pdf {
              link
            }
            color {
              color
              id
              stock
              urlPhoto {
                link
              }
            }
          }
          type
          sendEmailFinancialToClient
          accesoriesValue
          closed
          servicesValue
          inputAmount
          rate
          device {
            cost
            years
          }
          registration
          months
          monthly
          documentCredit
          quoteFinancial {
            id
            responseBank
            opinion
            createdAt
            financial {
              nameEntityFinancial
              phoneEntityFinancial
              nameContact
              lastNameContact
              emailcontact
              idSucursal
            }
          }
          vimVehiculo
          discount
        }
      }
      tracings {
        id
        type
        motive
        priority
        executionDate
        closeDate
        openingNote
        closeNote
        updateAt
        createdAt
        user {
          id
          nombre
          apellido
          typeConcessionaire {
            code
            type
          }
        }
      }
    }
  }
`;

export const QUERY_GET_CHEMICAL_BY_OPTIONS_CLIENTS = gql`
  query GetChemicalByOptionsClients($optionInput: String!) {
    getChemicalByOptionsClients(optionInput: $optionInput) {
      leads {
        quotes {
          id
          mechanicalAppraisalQuote {
            brand
            model
            year
            mileage
            desiredPrice
          }
          acceptedAppraisal
          sendEmailFinancialToClient
          preOwnedSupplier {
            bussinessName
            identification
            phone
            email
            appraisalValue
          }
        }
        client {
          name
          lastName
          identification
          email
          cellphone
        }
        user {
          nombre
          apellido
          typeConcessionaire {
            code
            type
          }
        }
      }
    }
  }
`;

export default class ClientsQueryProvider {
  getClientsByIdentification = async (
    identification: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_BY_IDENTIFICATION,
        variables: {
          identification,
        },
      });
      //console.log({ data, error, errors });
      if (error || errors) return null;
      return data.getClientsByIdentification;
    } catch (error) {
      //console.log('Error getClientsByIdentification', error.message);
      return null;
    }
  };

  getOneClientByIdentification = async (
    identification: string
  ): Promise<Client | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_ONE_CLIENT_BY_IDENTIFICATION,
        variables: {
          identification,
        },
      });
      //console.log({ data, error, errors });
      if (error || errors) return null;
      return data.getOneClientByIdentification;
    } catch (error) {
      //console.log('Error getOneClientByIdentification', error.message);
      return null;
    }
  };

  getClientsByOptions = async (
    optionInput: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_BY_OPTIONS,
        variables: {
          optionInput,
        },
      });
      if (error || errors) return null;
      return data.getClientsByOptions;
    } catch (error) {
      //console.log('Error getClientsByOptions', error.message);
      return null;
    }
  };

  getChemicalByOptionsClients = async (
    optionInput: string
  ): Promise<any | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CHEMICAL_BY_OPTIONS_CLIENTS,
        variables: {
          optionInput,
        },
      });
      if (error || errors) return null;
      return data.getChemicalByOptionsClients;
    } catch (error) {
      //console.log('Error getChemicalByOptionsClients', error.message);
      return null;
    }
  };

  getClientsByDates = async (
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_BY_DATES,
        variables: {
          firstDate,
          secondDate,
        },
      });
      if (error || errors) return null;
      return data.getClientsByDates;
    } catch (error) {
      //console.log('Error getClientsByDates', error.message);
      return null;
    }
  };

  getClientsByBosses = async (
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_BY_BOSSES,
        variables: {
          firstDate,
          secondDate,
        },
      });
      if (error || errors) return null;
      //console.log('get Client boss🚀', data.getClientsByBosses);
      return data.getClientsByBosses;
    } catch (error) {
      //console.log('Error getClientsByBosses', error.message);
      return null;
    }
  };

  getClientsLabelDashboard = async (
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_LABEL_DASHBOARD,
        variables: {
          firstDate,
          secondDate,
        },
      });
      if (error || errors) return null;
      //console.log('get Client boss🚀', data.getClientsByBosses)
      return data.getClientsLabelDashboard;
    } catch (error) {
      console.log('Error getClientsLabelDashboard', error.message);
      return null;
    }
  };

  getClientsByBossesById = async (
    idUser: number,
    firstDate: string,
    secondDate: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_BY_BOSSES_BY_ID,
        variables: {
          idUser,
          firstDate,
          secondDate,
        },
      });
      if (error || errors) return null;
      return data.getClientsByBossesById;
    } catch (error) {
      //console.log('Error getClientsByBosses', error.message);
      return null;
    }
  };
  getClientsByIdentificationOrLastName = async (
    value: string
  ): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CLIENTS_BY_IDENTIFICATION_OR_LASTNAME,
        variables: {
          value,
        },
      });
      if (error || errors) return null;
      return data.getClientsByIdentificationOrLastName;
    } catch (error) {
      //console.log('Error getClientsByIdentificationOrLastName', error.message);
      return null;
    }
  };

  getAllClients = async (): Promise<Client[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_ALL_CLIENTS,
      });
      if (error || errors) return null;
      return data.getAllClients;
    } catch (error) {
      //console.log('Error getAllClients', error.message);
      return null;
    }
  };
}
