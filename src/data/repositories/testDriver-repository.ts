import TestDriverRepositoryInterface from '../repositories-interfaces/testDriver-repository-interface';
import TestDriverMutationProvider, { TestDriverInput, TestDriverInputUpdate } from '../providers/apollo/mutations/testDriver';
import TestDriverQueryProvider from '../providers/apollo/queries/testDriver'
import TestDriver from '../models/TestDriver';
export default class TestDriverRepository implements TestDriverRepositoryInterface {
    testDriverMutationProvider: TestDriverMutationProvider;
    testDriverQueryProvider: TestDriverQueryProvider;

    constructor(
        testDriverMutationProvider: TestDriverMutationProvider,
        testDriverProvider: TestDriverQueryProvider
    ) {
        this.testDriverMutationProvider = testDriverMutationProvider;
        this.testDriverQueryProvider = testDriverProvider;
    }
    getTestDriverId(idLead: number): Promise<TestDriver[] | null> {
        return this.testDriverQueryProvider.getTestDriverId(idLead);
    }
    createTestDriver(testDriver: TestDriverInput, idLead: number): Promise<boolean> {
        return this.testDriverMutationProvider.createTestDriver(testDriver, idLead);
    }

    updateTestDriver(id: number, testDriverUpdate: TestDriverInputUpdate): Promise<boolean> {
        return this.testDriverMutationProvider.updateTestDriver(id, testDriverUpdate);
    }
}
