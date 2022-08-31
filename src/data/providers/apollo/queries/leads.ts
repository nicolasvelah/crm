import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import Leads from '../../../models/Leads';

const QUERY_GET_ALL_LEADS = gql`
  {
    getAllLeads {
      id
      idAgency
      temperature
      chanel
      state
      city
      secondoryAdvisers {
        advisers
      }
      dataFromHubspot {
        vid
      }
      inquiry {
        question
      }
      saleDown
      invoices {
        url
        name
        invoice
        walletState
      }
      workPage
      updateAt
      createdAt
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
      }
      meets {
        id
      }
      quotes {
        id
        observations
        sendEmailFinancialToClient
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
        leadsQuoteFinancial {
          quoteFinancial {
            opinion
          }
        }
        vimVehiculo
        discount
      }
    }
  }
`;

const QUERY_GET_LEAD_BY_ID = gql`
  query GetLeadById($id: Int!) {
    getLeadById(id: $id) {
      client {
        id
        isPerson
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
        createdAt
      }
      id
      isFleet
      state
      temperature
      workPage
      city
      createdAt
      discount
      campaign
      chanel
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
      saleDownExtra {
        idModelo
        marca
      }
      statusSaleDown
      commentSaleDown
      user {
        id
        nombre
        apellido
        codUsuario
        role
        typeConcessionaire {
          code
          type
        }
        concesionario
        sucursal
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
      testDriver {
        id
        testDrivePrint
        codeVehicle
        brandVehicle
        vin
        drivers {
          name
          lastName
          key
          urlLicenceImage
        }
        dateCreatedTestDriver
        dateUpdateTestDriver
        dateTestDriver
        dateTestConfirmation
        startKm
        endKm
        observations
        confirmTestDrive
        urlImageVehicle
        modelVehicle
        yearVehicle
        colorVehicle
        priceVehicle
      }
      leadsQuoteFinancial {
        id
        observationsFyI
        documents
        sendToFyI
        updateAt
        createdAt
        quoteFinancial {
          id
          selected
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
        quotes {
          id
          quoteFinancial {
            id
            selected
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
        }
      }
      quotes {
        id
        observations
        observationsFyI
        exonerated {
          type
          percentage
        }
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
          es_kit
        }
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
          selected
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
          acceptedAppraisal
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
          approvedBy
          idBusinessHubspot
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
          updateAt
        }
        discount
      }
    }
  }
`;

const QUERY_GET_LEADS_WITH_PREBILL_APPROVED = gql`
  query GetLeadsToWallet(
    $identificationClient: String
    $firstDate: String
    $secondDate: String
    $concessionaireInput: String
    $sucursalInput: String
  ) {
    getLeadsToWallet(
      identificationClient: $identificationClient
      firstDate: $firstDate
      secondDate: $secondDate
      concessionaireInput: $concessionaireInput
      sucursalInput: $sucursalInput
    ) {
      id
      state
      city
      concesionario {
        code
        name
      }
      createdAt
      sucursal {
        code
        name
      }
      user {
        apellido
        codUsuario
        id
        nombre
        typeConcessionaire {
          code
          type
        }
      }

      workPage
      prebill {
        id
        createdAt
        status
        descuento
        idPrefacturaCRM
        notes {
          id
          type
          name
          texto
        }
        payThirdPerson
        status
        updateAt
      }
      idAgency
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
      }
      temperature
      chanel
      discount
      inquiry {
        question
        answer
      }
      quotes {
        type
        closed
        id
        observations
        inputAmount
        sendEmailFinancialToClient
        chosenEntity {
          entity
          type
        }
        delivery {
          authorizathionStatus
          id
        }
        reserveValue
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
          imgs
          color {
            id
            color
            urlPhoto {
              link
            }
          }
        }
        insuranceCarrier {
          name
          cost
          years
          monthlyPayment
        }
        registration
        vimVehiculo
        mechanicalAppraisalQuote {
          brand
          model
          year
          mileage
          desiredPrice
        }
        vimVehiculoData {
          codigo
          descripcion
          antiguedad
          color
          dealer
          estado
          id_color
          id_sucursal
          sucursal
          vin
          margen
        }
        exonerated {
          type
          percentage
        }
        idAccesories {
          code
          name
          cost
          quantity
        }
        accesoriesValue
        months
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
      }

      invoices {
        url
        name
        invoice
      }
    }
  }
`;

const QUERY_LABEL_DASHBOARD = gql`
  query GetLabelDashboard($firstDate: String, $secondDate: String) {
    getLabelDashboard(firstDate: $firstDate, secondDate: $secondDate) {
      id
      workPage
      inquiry {
        question
      }
      temperature
      state
      statusSaleDown
      commentSaleDown
      saleDown
      quotes {
        id
        closed
        observations
        sendEmailFinancialToClient
        vehiculo {
          model
          year
          description
          pvp
          brand
        }
        exonerated {
          type
          percentage
        }
        idAccesories {
          name
          cost
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
        registration
        type
        insuranceCarrier {
          cost
        }
        inputAmount
        rate
        months
        monthly
        insuranceCarrier {
          name
          cost
        }
        delivery {
          deliveryFinal
        }
        vimVehiculo
        quoteFinancial {
          selected
        }
      }
    }
  }
`;

const QUERY_LEAD_BY_IDUSER = gql`
  query GetLeadByIdUser(
    $idUser: Int!
    $firstDate: String
    $secondDate: String
  ) {
    getLeadByIdUser(
      idUser: $idUser
      firstDate: $firstDate
      secondDate: $secondDate
    ) {
      id
      workPage
      inquiry {
        question
      }
      temperature
      state
      statusSaleDown
      commentSaleDown
      saleDown
      quotes {
        id
        closed
        observations
        sendEmailFinancialToClient
        vehiculo {
          model
          year
          description
          pvp
          brand
        }
        exonerated {
          type
          percentage
        }
        idAccesories {
          name
          cost
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
        registration
        type
        insuranceCarrier {
          cost
        }
        inputAmount
        rate
        months
        monthly
        insuranceCarrier {
          name
          cost
        }
        delivery {
          deliveryFinal
        }
        vimVehiculo
        quoteFinancial {
          selected
        }
      }
    }
  }
`;

const QUERY_GET_LEADS_FOR_USER = gql`
  query GetLeadsForUser(
    $firstDate: String
    $secondDate: String
    $value: String!
  ) {
    getLeadsForUser(
      firstDate: $firstDate
      secondDate: $secondDate
      value: $value
    ) {
      client {
        id
        isPerson
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
        createdAt
      }
      id
      isFleet
      state
      temperature
      workPage
      city
      createdAt
      discount
      campaign
      chanel
      toReasign
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
      saleDownExtra {
        idModelo
        marca
      }
      statusSaleDown
      commentSaleDown
      user {
        id
        nombre
        apellido
        codUsuario
        brand
        typeConcessionaire {
          code
          type
        }
        concesionario
        sucursal
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
      testDriver {
        id
        testDrivePrint
        codeVehicle
        brandVehicle
        vin
        drivers {
          name
          lastName
          key
          urlLicenceImage
        }
        dateCreatedTestDriver
        dateUpdateTestDriver
        dateTestDriver
        dateTestConfirmation
        startKm
        endKm
        observations
        confirmTestDrive
        urlImageVehicle
        modelVehicle
        yearVehicle
        colorVehicle
        priceVehicle
      }
      leadsQuoteFinancial {
        id
        observationsFyI
        documents
        sendToFyI
        updateAt
        createdAt
        quoteFinancial {
          id
          selected
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
        quotes {
          id
          quoteFinancial {
            id
            selected
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
        }
      }
      quotes {
        id
        observations
        observationsFyI
        exonerated {
          type
          percentage
        }
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
          es_kit
        }
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
        sendToFyI
        documentCredit
        quoteFinancial {
          id
          selected
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
          acceptedAppraisal
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
          idBusinessHubspot
          registration {
            state
            plateNumber
          }
          approvedBy
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
          updateAt
        }
        discount
        createdAt
      }
    }
  }
`;

const QUERY_GET_LEADS_TO_REASIGN = gql`
  {
    getLeadsToReasign {
      id
      client {
        name
        lastName
        identification
      }
      toReasign
      user {
        id
        nombre
        apellido
        role
        codUsuario
      }
      sucursal {
        code
        name
      }
      concesionario {
        code
        name
      }
      createdAt
    }
  }
`;

export default class LeadsQueryProvider {
  getLeadById = async (id: number): Promise<Leads | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_LEAD_BY_ID,
        variables: {
          id,
        },
      });

      if (error || errors) return null;

      return data.getLeadById;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  getAllLeads = async (): Promise<Leads[] | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_ALL_LEADS,
      });

      if (error || errors) return null;

      return data.getAllLeads;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  getLeadsToWallet = async (
    identificationClient: string | null,
    firstDate: string | null,
    secondDate: string | null,
    concessionaireInput: string | null,
    sucursalInput: string | null
  ): Promise<any> => {
    try {
      const context = await auth.getApolloContext();
      if (!context) return null;
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_LEADS_WITH_PREBILL_APPROVED,
        variables: {
          identificationClient,
          firstDate,
          secondDate,
          concessionaireInput,
          sucursalInput,
        },
        context,
      });

      if (error || errors) {
        //console.log('Error', error, errors);
        return null;
      }

      //console.log('RESP_LEADS_WALLET', data);
      return data.getLeadsToWallet;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  getLeadsForUser = async (
    firstDate: string | null,
    secondDate: string | null,
    value: string
  ): Promise<Leads[] | null> => {
    try {
      //const context = await auth.getApolloContext();
      //if (!context) return null;
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_LEADS_FOR_USER,
        variables: {
          firstDate,
          secondDate,
          value,
        },
        //context,
      });
      if (error || errors) return null;
      return data.getLeadsForUser;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };
  getLabelDashboard = async (
    firstDate: string | null,
    secondDate: string | null
  ): Promise<Leads[] | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_LABEL_DASHBOARD,
        variables: {
          firstDate,
          secondDate,
        },
      });
      if (error || errors) return null;
      return data.getLabelDashboard;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  getLeadByIdUser = async (
    idUser: number | null,
    firstDate: string | null,
    secondDate: string | null
  ): Promise<Leads[] | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_LEAD_BY_IDUSER,
        variables: {
          idUser,
          firstDate,
          secondDate,
        },
      });
      if (error || errors) return null;
      return data.getLeadByIdUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  getLeadsToReasign = async (): Promise<Leads[] | null> => {
    try {
      const context = await auth.getApolloContext();
      //if (!context) return null;
      console.log('lleg');
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_LEADS_TO_REASIGN,
        context,
      });

      if (error || errors) return null;
      return data.getLeadsToReasign;
    } catch (e) {
      //console.error('Error en getLeadsToReasign:', e.message);
      return null;
    }
  };
}
