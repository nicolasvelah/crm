import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';
import TestDriver from '../../../models/TestDriver';

export const QUERY_GET_TEST_DRIVER_BY_LEAD = gql`
  query GetQuotesById($idLead: Int!) {
    getTestDriverId(idLead: $idLead) {
      id
      testDrivePrint
      codeVehicle
      brandVehicle
      vin
      route
      drivers {
        name
        lastName
        urlLicenceImage
        key
        validLicense
      }
      dateCreatedTestDriver
      dateUpdateTestDriver
      dateTestDriver
      dateTestConfirmation
      startKm
      endKm
      observations
      phase
      urlImageVehicle
      modelVehicle
      yearVehicle
      priceVehicle
      confirmTestDrive
    }
  }
`;

export default class TestDriverQueryProvider {
  getTestDriverId = async (idLead: number): Promise<TestDriver[] | null> => {
    try {
      const { data, error, errors } = await apolloClient.query({
        query: QUERY_GET_TEST_DRIVER_BY_LEAD,
        variables: {
          idLead,
        },
      });
      if (error || errors) return null;
      return data.getTestDriverId;
    } catch (error) {
      //console.log('Error getTestDriverById', error.message);
      return null;
    }
  };
}
