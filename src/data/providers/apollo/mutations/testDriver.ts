import { gql } from '@apollo/client';
import apolloClient from '..';
import auth from '../../../../utils/auth';

export interface TestDriverInput {
  testDrivePrint?: boolean;
  colorVehicle: string | null;
  codeVehicle?: string | null;
  brandVehicle?: string;
  vin: string | null;
  route: string | null;
  drivers?: any;
  dateCreatedTestDriver?: string;
  dateUpdateTestDriver?: string;
  dateTestDriver?: string;
  dateTestConfirmation?: string;
  starKm?: number;
  endKm?: number;
  urlImageVehicle?: string | null;
  modelVehicle?: string;
  yearVehicle: number | null;
  priceVehicle?: number;
}

export interface TestDriverInputUpdate {
  drivers?: any;

  dateUpdateTestDriver?: string;

  dateTestDriver?: string;

  dateTestConfirmation?: string;

  startKm?: number | null;

  endKm?: number | null;

  observations?: string;

  confirmTestDrive?: boolean;
}

export const MUTATION_CREATE_TESTDRIVER = gql`
  mutation CreateTestDriver(
    $testDriverInsert: TestDriverInput!
    $idLead: Int!
  ) {
    createTestDriver(testDriverInsert: $testDriverInsert, idLead: $idLead)
  }
`;

export const MUTATION_UPDATE_TESTDRIVER = gql`
  mutation UpdateTestDriver(
    $id: Int!
    $testDriverUpdate: TestDriverInputUpdate!
  ) {
    updateTestDriver(id: $id, testDriverUpdate: $testDriverUpdate)
  }
`;
export default class TestDriverMutationProvider {
  createTestDriver = async (
    testDriverInsert: TestDriverInput,
    idLead: number
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_CREATE_TESTDRIVER,
        variables: {
          testDriverInsert,
          idLead,
        },
      });

      if (errors) return false;
      //console.log('createQuote', data);
      return true;
    } catch (e) {
      //console.error(e);
      return false;
    }
  };

  updateTestDriver = async (
    id: number,
    testDriverUpdate: TestDriverInputUpdate
  ): Promise<boolean> => {
    try {
      const { errors, data } = await apolloClient.mutate({
        mutation: MUTATION_UPDATE_TESTDRIVER,
        variables: {
          id,
          testDriverUpdate,
        },
      });

      if (errors) return false;
      //console.log('Update Test Drive', data);
      return true;
    } catch (e) {
      //console.error('Error Test Drive', e.message);
      return false;
    }
  };
}
