import Financial from '../models/Financial';
import {FinancialEntityInput, UpdateFinancialEntityInput} from '../providers/apollo/mutations/financial'

export default interface FinancialRepositoryInterface {
  createFinancialEntity(
    financialEntityInput: FinancialEntityInput,
  ): Promise<boolean>;

  updateFinancialEntity(
    idFinancial: number,
    updateFinancialEntityInput: UpdateFinancialEntityInput,
  ): Promise<boolean>;

  deleteFinancialEntity(
    idFinancial: number,
  ): Promise<boolean>;

  getFinancialsBySucursal(idSucursal: string, typeFinancial: string): Promise<Financial[] | null>;
  getAllFinancials(id: number): Promise<Financial[] | null>;
}
