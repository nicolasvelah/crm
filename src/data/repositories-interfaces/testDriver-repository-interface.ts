/* eslint-disable semi */
import TestDriver from '../models/TestDriver';
import { TestDriverInput, TestDriverInputUpdate } from '../providers/apollo/mutations/testDriver';

export default interface TestDriverRepositoryInterface {
  createTestDriver(testDriverInsert: TestDriverInput, idLead: number): Promise<boolean>;
 
  getTestDriverId(idLead: number): Promise<TestDriver[] | null>;

  updateTestDriver(id: number, testDriverUpdate: TestDriverInputUpdate): Promise<boolean>;
}
