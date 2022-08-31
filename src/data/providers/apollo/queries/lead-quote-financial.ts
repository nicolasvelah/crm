import { gql } from '@apollo/client';
import Financial from '../../../models/Financial';
import apolloClient from '..';
import LeadsQuoteFinancial from '../../../models/LeadsQuoteFinancial';

const QUERY_GET_LEADS_QUOTEFINANCIAL_BY_ID = gql`
  query GetLeadsQuoteFinancialById($id: Int!) {
    getLeadsQuoteFinancialById(id: $id) {
      id
      observationsFyI
      documents
      sendToFyI
      quotes {
        reserveValue
        accesoriesValue
        registration
        inputAmount
        sendToFyI
        observationsFyI
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
      quoteFinancial {
        id
        selected
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
      leads {
        id
        city
        concesionario {
          code
          name
        }
        sucursal {
          code
          name
        }
        client {
          id
          isPerson
          name
          lastName
          cellphone
          identification
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
    }
  }
`;

const GET_LEADS_QUOTESFINANCIAL_CREDIT = gql`
  query GetLeadsQuotesFinancialCredits(
    $identificationClient: String
    $firstDate: String
    $secondDate: String
    $concessionaireInput: String
    $sucursalInput: String
  ) {
    getLeadsQuotesFinancialCredits(
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

export default class LeadsQuoteFinancialQueryProvider {
  getLeadsQuoteFinancialById = async (
    id: number
  ): Promise<LeadsQuoteFinancial | null> => {
    try {
      const { errors, error, data } = await apolloClient.query({
        query: QUERY_GET_LEADS_QUOTEFINANCIAL_BY_ID,
        variables: {
          id,
        },
      });

      if (error || errors) {
        return null;
      }
      return data.getLeadsQuoteFinancialById;
    } catch (e) {
      //console.error(e);
      return null;
    }
  };

  getLeadsQuotesFinancialCredits = async (
    identificationClient: string | null,
    firstDate: string | null,
    secondDate: string | null,
    concessionaireInput: string | null,
    sucursalInput: string | null
  ): Promise<LeadsQuoteFinancial[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: GET_LEADS_QUOTESFINANCIAL_CREDIT,
        variables: {
          identificationClient,
          firstDate,
          secondDate,
          concessionaireInput,
          sucursalInput,
        },
      });
      if (error || errors) return null;
      return data.getLeadsQuotesFinancialCredits;
    } catch (error) {
      //console.log('Error getQuotesCredits', error.message);
      return null;
    }
  };
}
