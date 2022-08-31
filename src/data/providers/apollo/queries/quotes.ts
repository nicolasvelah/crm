import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import Quotes from '../../../models/Quotes';
import Tracings from '../../../models/Tracings';
import { QUERY_GET_TRACINGS_BY_DATES } from './tracing';

export const QUERY_GET_QUOTES_BY_LEAD = gql`
  query GetQuotesByLead($idLead: Int!) {
    getQuotesByLead(idLead: $idLead) {
      vimVehiculo
      observations
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
      id
      vehiculo {
        cantidad
        code
        brand
        model
        idModel
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
      accesoriesValue
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
      closed
      payThirdPerson
      documentCredit
      acceptedAppraisal
      chosenEntity {
        type
        entity
      }
      mechanicalAppraisalQuote {
        brand
        model
        year
        mileage
        desiredPrice
      }
      insuranceCarrier {
        name
        cost
        years
        monthlyPayment
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }
      quoteFinancial {
        id
        responseBank
        selected
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
      discount
      reserveValue
      exonerated {
        type
        percentage
      }
    }
  }
`;

const GET_CLOSED_QUOTE_BY_LEAD = gql`
  query GetQuoteClosed($idLead: Int!) {
    getQuoteClosed(idLead: $idLead) {
      vimVehiculo
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
        createdAt
      }
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
      id
      vehiculo {
        code
        cantidad
        code
        brand
        model
        idModel
        year
        cost
        pvp
        description
        cylinder
        imgs
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
      accesoriesValue
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
      servicesValue
      inputAmount
      rate
      device {
        cost
        years
      }
      registration
      monthly
      months
      closed
      documentCredit
      mechanicalAppraisalQuote {
        brand
        model
        year
        mileage
        desiredPrice
      }
      insuranceCarrier {
        name
        cost
        years
        monthlyPayment
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }
      acceptedAppraisal
      discount
      exonerated {
        type
        percentage
      }
      payThirdPerson
      reserveValue
      chosenEntity {
        entity
        type
      }
    }
  }
`;

const GET_QUOTES_WITH_CREDITS = gql`
  query GetQuotesWithCredits(
    $concessionaireInput: String!
    $succursalInput: String!
  ) {
    getQuotesWithCredits(
      concessionaireInput: $concessionaireInput
      succursalInput: $succursalInput
    ) {
      id
      createdAt
      leads {
        client {
          name
          lastName
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
      quoteFinancial {
        id
        responseBank
        selected
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
    }
  }
`;

const GET_QUOTE_BY_ID = gql`
  query GetQuoteById($id: Int!) {
    getQuoteById(id: $id) {
      reserveValue
      accesoriesValue
      registration
      inputAmount
      sendToFyI
      observationsFyI
      leads {
        city
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        user {
          id
          codUsuario
          nombre
          apellido
          role
          concessionaire
          brand
          CRMTransactionToken
          timeExpiration
          updateAt
          createdAt
          typeConcessionaire {
            code
            type
          }
        }
        client {
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
          city
          address {
            houseType
            address
            neighborhood
            parish
          }
          credits {
            id
            applicant {
              placeOfBirth
              nationality
              civilStatus
            }
            applicantActivity {
              company
              employmentRelationship
              workAddress
              workPhone
              workPosition
              yearsOfWork
            }
            currentAddress {
              cellPhone
              homePhone
              houseAddress
              neighborhood
              parish
              typeOfHousing
            }
            bankReferences {
              accountNumber
              accountType
              bank
            }
            spouseData {
              dateOfBirth
              identification
              lastNames
              names
              placeOfBirth
            }
            income {
              monthlySalary
              monthlySpouseSalary
              otherIncome
              otherSpouseIncome
            }
            personalReferences {
              lastNames
              names
              phone
              relationship
            }
            goods {
              goodHouse
              goodVehicle
              goodOthers
            }
            passives {
              debtsToPay
              creditCards
              passivesOthers
            }
            commercialReferences {
              company
              sector
              phone
              placeCompany
              referenceName
              position
            }
          }
        }
      }
      id
      vehiculo {
        cantidad
        brand
        code
        model
        idModel
        year
        cost
        pvp
        cylinder
        numPassengers
        imgs
        doors
        color {
          id
          color
          stock
        }
        fuel
        description
      }
      idAccesories {
        id
        name
        cost
        quantity
        es_kit
      }
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
      monthly
      months
      insuranceCarrier {
        name
        cost
        years
        monthlyPayment
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }

      mechanicalAppraisalQuote {
        brand
        model
        year
        mileage
        desiredPrice
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }
      quoteFinancial {
        id
        responseBank
        selected
        opinion
        createdAt
        withFile
        financial {
          nameEntityFinancial
          phoneEntityFinancial
          nameContact
          lastNameContact
          emailcontact
          idSucursal
        }
      }

      documentCredit
      type
      vimVehiculo
      vimVehiculoData {
        color
        descripcion
        antiguedad
        codigo
        dealer
        estado
        id_color
        id_dealer
        id_sucursal
        margen
        sucursal
        vin
      }
      acceptedAppraisal
      discount
      exonerated {
        type
        percentage
      }
      payThirdPerson
      rate
    }
  }
`;

const GET_QUOTE_OBJECTIVES_BY_ADVISER = gql`
  query GetQuoteById($id: Int!, $firstDate: String!, $secondDate: String!) {
    getQuoteObjectivesByIdAdviser(
      id: $id
      firstDate: $firstDate
      secondDate: $secondDate
    ) {
      id
      vimVehiculoData {
        margen
      }
    }
  }
`;

const GET_QUOTE_OBJECTIVES = gql`
  query GetQuoteObjectives($firstDate: String!, $secondDate: String!) {
    getQuoteObjectives(firstDate: $firstDate, secondDate: $secondDate) {
      id
      vimVehiculoData {
        margen
      }
      exonerated {
        type
        percentage
      }
    }
  }
`;

const GET_QUOTE_OBJECTIVES_ACCESSORIES = gql`
  query GetQuoteObjectivesAccessories(
    $firstDate: String!
    $secondDate: String!
    $counted: Int
    $credit: Int
  ) {
    getQuoteObjectivesAccessories(
      firstDate: $firstDate
      secondDate: $secondDate
      counted: $counted
      credit: $credit
    ) {
      id
      vimVehiculoData {
        margen
      }
      exonerated {
        type
        percentage
      }
      accesoriesValue
    }
  }
`;

const GET_QUOTE_OBJECTIVES_ALLIES = gql`
  query GetQuoteObjectivesAllies(
    $firstDate: String!
    $secondDate: String!
    $counted: Int
    $credit: Int
  ) {
    getQuoteObjectivesAllies(
      firstDate: $firstDate
      secondDate: $secondDate
      counted: $counted
      credit: $credit
    ) {
      id
      vimVehiculoData {
        margen
      }
      exonerated {
        type
        percentage
      }
      accesoriesValue
      servicesValue
      insuranceCarrier {
        cost
      }
      mechanicalAppraisalQuote {
        desiredPrice
      }

      preOwnedSupplier {
        acceptedAppraisal
        appraisalValue
      }
      device {
        cost
      }
    }
  }
`;

const GET_QUOTE_OBJECTIVES_ACCESSORIES_BY_IDADVISER = gql`
  query GetQuoteObjectivesAccessoriesByIdAdviser(
    $id: Int!
    $firstDate: String!
    $secondDate: String!
    $counted: Int
    $credit: Int
  ) {
    getQuoteObjectivesAccessoriesByIdAdviser(
      id: $id
      firstDate: $firstDate
      secondDate: $secondDate
      counted: $counted
      credit: $credit
    ) {
      id
      vimVehiculoData {
        margen
      }
      exonerated {
        type
        percentage
      }
      accesoriesValue
    }
  }
`;

const GET_QUOTE_OBJECTIVES_ALLIES_BY_IDADVISER = gql`
  query GetQuoteObjectivesAlliesByIdAdviser(
    $id: Int!
    $firstDate: String!
    $secondDate: String!
    $counted: Int
    $credit: Int
  ) {
    getQuoteObjectivesAlliesByIdAdviser(
      id: $id
      firstDate: $firstDate
      secondDate: $secondDate
      counted: $counted
      credit: $credit
    ) {
      id
      vimVehiculoData {
        margen
      }
      exonerated {
        type
        percentage
      }
      accesoriesValue
      servicesValue
      leads {
        id
        user {
          id
          codUsuario
        }
      }
      insuranceCarrier {
        cost
      }
      mechanicalAppraisalQuote {
        desiredPrice
      }
      preOwnedSupplier {
        acceptedAppraisal
        appraisalValue
      }
      device {
        cost
      }
      createdAt
    }
  }
`;

export const GET_QUOTES_BY_DATES = gql`
  query GetQuotesByDates(
    $firstDate: String!
    $secondDate: String!
    $concessionaireInput: String!
    $succursalInput: String!
  ) {
    getQuotesByDates(
      firstDate: $firstDate
      secondDate: $secondDate
      concessionaireInput: $concessionaireInput
      succursalInput: $succursalInput
    ) {
      id
      createdAt
      leads {
        client {
          name
          lastName
        }
        user {
          nombre
          apellido
          concessionaire
          typeConcessionaire {
            code
            type
          }
        }
      }
      quoteFinancial {
        id
        responseBank
        selected
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
    }
  }
`;

export const GET_QUOTES_BY_ASESOR_OR_PROSPECT = gql`
  query GetQuotesByAsesorOrProspect(
    $lastname: String!
    $userorclient: Int!
    $concessionaireInput: String!
    $succursalInput: String!
  ) {
    getQuotesByAsesorOrProspect(
      lastname: $lastname
      userorclient: $userorclient
      concessionaireInput: $concessionaireInput
      succursalInput: $succursalInput
    ) {
      id
      createdAt
      leads {
        client {
          name
          lastName
        }
        user {
          nombre
          apellido
          concessionaire
          typeConcessionaire {
            code
            type
          }
        }
      }
      quoteFinancial {
        id
        responseBank
        selected
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
    }
  }
`;

const GET_QUOTES_CREDIT = gql`
  query GetQuotesCredits(
    $identificationClient: String
    $firstDate: String
    $secondDate: String
    $concessionaireInput: String
    $sucursalInput: String
  ) {
    getQuotesCredits(
      identificationClient: $identificationClient
      firstDate: $firstDate
      secondDate: $secondDate
      concessionaireInput: $concessionaireInput
      sucursalInput: $sucursalInput
    ) {
      id
      sendToFyI
      createdAt
      leads {
        id
        client {
          name
          lastName
          identification
          birthdate
          credits {
            id
            applicant {
              placeOfBirth
              nationality
              civilStatus
            }
            applicantActivity {
              company
              employmentRelationship
              workAddress
              workPhone
              workPosition
              yearsOfWork
            }
            currentAddress {
              cellPhone
              homePhone
              houseAddress
              neighborhood
              parish
              typeOfHousing
              province
              canton
            }
            bankReferences {
              accountNumber
              accountType
              bank
            }
            spouseData {
              dateOfBirth
              identification
              lastNames
              names
              placeOfBirth
            }
            income {
              monthlySalary
              monthlySpouseSalary
              otherIncome
              otherSpouseIncome
            }
            personalReferences {
              lastNames
              names
              phone
              relationship
            }
            goods {
              goodHouse
              goodVehicle
              goodOthers
            }
            passives {
              debtsToPay
              creditCards
              passivesOthers
            }
            commercialReferences {
              company
              sector
              phone
              placeCompany
              referenceName
              position
            }
          }
        }
        user {
          nombre
          apellido
          concessionaire
          typeConcessionaire {
            code
            type
          }
        }
      }
      quoteFinancial {
        id
        selected
        responseBank
        createdAt
        opinion
        financial {
          nameEntityFinancial
          phoneEntityFinancial
          nameContact
          lastNameContact
          emailcontact
          idSucursal
        }
      }
    }
  }
`;

export const GET_MECHANICAL_APPRAISAL = gql`
  query GetMechanicalAppraisal($firstDate: String!, $secondDate: String!) {
    getMechanicalAppraisal(firstDate: $firstDate, secondDate: $secondDate) {
      id
      mechanicalAppraisalQuote {
        brand
        model
        year
        mileage
        desiredPrice
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }
      acceptedAppraisal
      leads {
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

export const GET_APPRAISAL = gql`
  query GetAppraisal(
    $identificationClient: String
    $firstDate: String
    $secondDate: String
    $concessionaireInput: String
    $sucursalInput: String
  ) {
    getAppraisal(
      identificationClient: $identificationClient
      firstDate: $firstDate
      secondDate: $secondDate
      concessionaireInput: $concessionaireInput
      sucursalInput: $sucursalInput
    ) {
      id
      type
      createdAt
      vehiculo {
        cantidad
        brand
        code
        model
        idModel
        year
        cost
        pvp
        cylinder
        numPassengers
        imgs
        doors
        color {
          id
          color
          stock
        }
        fuel
        description
      }
      mechanicalAppraisalQuote {
        brand
        model
        year
        mileage
        desiredPrice
      }
      preOwnedSupplier {
        bussinessName
        identification
        phone
        email
        appraisalValue
      }
      acceptedAppraisal
      leads {
        id
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
export default class QuotesQueryProvider {
  getQuotesByLead = async (idLead: number): Promise<Quotes[] | null> => {
    try {
      //console.log('Llego 1')

      //console.log('Llego 2')
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_QUOTES_BY_LEAD,
        variables: {
          idLead,
        },
      });
      if (error || errors) return null;
      return data.getQuotesByLead;
    } catch (error) {
      //console.log('Error getQuotesByLead', error.message);
      return null;
    }
  };

  getClosedQuote = async (idLead: number): Promise<any> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_CLOSED_QUOTE_BY_LEAD,
        variables: {
          idLead,
        },
      });

      if (errors || error) {
        //console.log(error);
        //console.log(errors);
        return null;
      }

      return data.getQuoteClosed;
    } catch (e) {
      //console.error('getQuotesByLed', e.message);
      return null;
    }
  };

  getQuotesWithCredits = async (
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null> => {
    try {
      //console.log(
      //   'entro getQuotesWithCredits',
      //   concessionaireInput,
      //   succursalInput
      // );
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTES_WITH_CREDITS,
        variables: {
          concessionaireInput,
          succursalInput,
        },
        context,
      });

      if (errors || error) {
        //console.log(error);
        //console.log(errors);
        return null;
      }

      return data.getQuotesWithCredits;
    } catch (e) {
      //console.error('getQuotesWithCredits', e.message);
      return null;
    }
  };

  getQuoteById = async (id: number): Promise<Quotes | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_BY_ID,
        variables: {
          id,
        },
      });
      if (errors || error) {
        //console.log(error);
        //console.log(errors);
        return null;
      }
      return data.getQuoteById;
    } catch (e) {
      //console.error('getQuoteById', e.message);
      return null;
    }
  };

  getQuoteObjectivesByIdAdviser = async (
    id: number,
    firstDate: string,
    secondDate: string
  ): Promise<Quotes[] | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_OBJECTIVES_BY_ADVISER,
        variables: {
          id,
          firstDate,
          secondDate,
        },
      });
      if (errors || error) {
        return null;
      }
      return data.getQuoteObjectivesByIdAdviser;
    } catch (e) {
      return null;
    }
  };

  getQuoteObjectives = async (
    firstDate: string,
    secondDate: string
  ): Promise<Quotes[] | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_OBJECTIVES,
        variables: {
          firstDate,
          secondDate,
        },
      });
      if (errors || error) {
        return null;
      }
      return data.getQuoteObjectives;
    } catch (e) {
      return null;
    }
  };

  getQuoteObjectivesAccessories = async (
    firstDate: string,
    secondDate: string,
    counted: number,
    credit: number
  ): Promise<Quotes[] | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_OBJECTIVES_ACCESSORIES,
        variables: {
          firstDate,
          secondDate,
          counted,
          credit,
        },
      });
      if (errors || error) {
        return null;
      }
      return data.getQuoteObjectivesAccessories;
    } catch (e) {
      return null;
    }
  };

  getQuoteObjectivesAllies = async (
    firstDate: string,
    secondDate: string,
    counted: number,
    credit: number
  ): Promise<Quotes[] | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_OBJECTIVES_ALLIES,
        variables: {
          firstDate,
          secondDate,
          counted,
          credit,
        },
      });
      if (errors || error) {
        return null;
      }
      return data.getQuoteObjectivesAllies;
    } catch (e) {
      return null;
    }
  };

  getQuoteObjectivesAccessoriesByIdAdviser = async (
    id: number,
    firstDate: string,
    secondDate: string,
    counted: number,
    credit: number
  ): Promise<Quotes[] | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_OBJECTIVES_ACCESSORIES_BY_IDADVISER,
        variables: {
          id,
          firstDate,
          secondDate,
          counted,
          credit,
        },
      });
      if (errors || error) {
        return null;
      }
      return data.getQuoteObjectivesAccessoriesByIdAdviser;
    } catch (e) {
      return null;
    }
  };

  getQuoteObjectivesAlliesByIdAdviser = async (
    id: number,
    firstDate: string,
    secondDate: string,
    counted: number,
    credit: number
  ): Promise<Quotes[] | null> => {
    try {
      const { error, errors, data } = await apolloClient.query({
        query: GET_QUOTE_OBJECTIVES_ALLIES_BY_IDADVISER,
        variables: {
          id,
          firstDate,
          secondDate,
          counted,
          credit,
        },
      });
      if (errors || error) {
        return null;
      }
      return data.getQuoteObjectivesAlliesByIdAdviser;
    } catch (e) {
      return null;
    }
  };

  getQuotesByDates = async (
    firstDate: string,
    secondDate: string,
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { data, error, errors } = await apolloClient.query({
        query: GET_QUOTES_BY_DATES,
        variables: {
          firstDate,
          secondDate,
          concessionaireInput,
          succursalInput,
        },
        context,
      });
      if (error || errors) return null;
      return data.getQuotesByDates;
    } catch (error) {
      //console.log('Error getQuotesByDates', error.message);
      return null;
    }
  };

  getQuotesByAsesorOrProspect = async (
    lastname: string,
    userorclient: number,
    concessionaireInput: string,
    succursalInput: string
  ): Promise<Quotes[] | null> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { data, error, errors } = await apolloClient.query({
        query: GET_QUOTES_BY_ASESOR_OR_PROSPECT,
        variables: {
          lastname,
          userorclient,
          concessionaireInput,
          succursalInput,
        },
        context,
      });
      if (error || errors) return null;
      return data.getQuotesByAsesorOrProspect;
    } catch (error) {
      //console.log('Error getQuotesByAsesorOrProspect', error.message);
      return null;
    }
  };

  getQuotesCredits = async (
    identificationClient: string | null,
    firstDate: string | null,
    secondDate: string | null,
    concessionaireInput: string | null,
    sucursalInput: string | null
  ): Promise<Quotes[] | null> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { data, error, errors } = await apolloClient.query({
        query: GET_QUOTES_CREDIT,
        variables: {
          identificationClient,
          firstDate,
          secondDate,
          concessionaireInput,
          sucursalInput,
        },
        context,
      });
      if (error || errors) return null;
      return data.getQuotesCredits;
    } catch (error) {
      //console.log('Error getQuotesCredits', error.message);
      return null;
    }
  };

  getMechanicalAppraisal = async (
    firstDate: string,
    secondDate: string
  ): Promise<any> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { data, error, errors } = await apolloClient.query({
        query: GET_MECHANICAL_APPRAISAL,
        variables: {
          firstDate,
          secondDate,
        },
        context,
      });
      if (error || errors) return null;
      return data.getMechanicalAppraisal;
    } catch (error) {
      //console.log('Error getMechanicalAppraisal', error.message);
      return null;
    }
  };

  getAppraisal = async (
    identificationClient: string | null,
    firstDate: string | null,
    secondDate: string | null,
    concessionaireInput: string | null,
    sucursalInput: string | null
  ): Promise<any> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { data, error, errors } = await apolloClient.query({
        query: GET_APPRAISAL,
        variables: {
          identificationClient,
          firstDate,
          secondDate,
          concessionaireInput,
          sucursalInput,
        },
        context,
      });
      if (error || errors) return null;
      return data.getAppraisal;
    } catch (error) {
      //console.log('Error getAppraisal', error.message);
      return null;
    }
  };
}
