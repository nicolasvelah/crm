import { gql } from '@apollo/client';
import apolloClient from '..';
import { CreditWithBirthdate } from '../../../repositories-interfaces/credit-repository-interface';

export const QUERY_GET_CREDIT_BY_CLIENTID = gql`
  query GetCreditByClientId($clientId: String!) {
    getCreditByClientId(clientId: $clientId) {
      credit {
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
      birthdate
    }
  }
`;

export default class CreditQueryProvider {
  getCreditByClientId = async (
    clientId: string
  ): Promise<CreditWithBirthdate | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_CREDIT_BY_CLIENTID,
        variables: { clientId },
      });
      if (error || errors) return null;
      return data.getCreditByClientId;
    } catch (error) {
      //console.log('Error getCreditByClientId', error.message);
      return null;
    }
  };
}
