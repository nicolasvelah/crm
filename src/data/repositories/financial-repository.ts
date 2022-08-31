import FinancialRepositoryInterface from '../repositories-interfaces/financial-repository-interface';
import Financial from '../models/Financial';
import FinancialQueryProvider from '../providers/apollo/queries/financial';
import FinancialMutationProvider, {
  FinancialEntityInput,
  UpdateFinancialEntityInput,
} from '../providers/apollo/mutations/financial';

type TypeFinancial = 'CONSORTIUM' | 'FINANCIAL' | 'ALL';
export default class FinancialRepository
  implements FinancialRepositoryInterface {
  financialQueryProvider: FinancialQueryProvider;
  financialMutationProvider: FinancialMutationProvider;

  constructor(
    financialQueryProvider: FinancialQueryProvider,
    financialMutationProvider: FinancialMutationProvider
  ) {
    this.financialQueryProvider = financialQueryProvider;
    this.financialMutationProvider = financialMutationProvider;
  }

  deleteFinancialEntity(idFinancial: number): Promise<boolean> {
    return this.financialMutationProvider.deleteFinancialEntity(
      idFinancial,
    );
  }

  updateFinancialEntity(
    idFinancial: number,
    updateFinancialEntityInput: UpdateFinancialEntityInput
  ): Promise<boolean> {
    return this.financialMutationProvider.updateFinancialEntity(
      idFinancial,
      updateFinancialEntityInput
    );
  }

  createFinancialEntity(
    financialEntityInput: FinancialEntityInput
  ): Promise<boolean> {
    return this.financialMutationProvider.createFinancialEntity(
      financialEntityInput
    );
  }

  getAllFinancials(id: number,): Promise<Financial[] | null> {
    return this.financialQueryProvider.getAllFinancials(id);
  }
  getFinancialsBySucursal(
    idSucursal: string,
    typeFinancial: TypeFinancial
  ): Promise<Financial[] | null> {
    return this.financialQueryProvider.getFinancialsBySucursal(
      idSucursal,
      typeFinancial
    );
  }
}
