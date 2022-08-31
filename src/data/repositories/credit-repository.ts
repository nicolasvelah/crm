import CreditRepositoryInterface, {
  CreditWithBirthdate,
} from '../repositories-interfaces/credit-repository-interface';
import CreditQueryProvider from '../providers/apollo/queries/credit';
import Credits from '../models/Credits';
import CreditMutationProvider, {
  CreditRequestInput,
  QuoteData,
} from '../providers/apollo/mutations/credit';

export default class CreditRepository implements CreditRepositoryInterface {
  creditQueryProvider: CreditQueryProvider;

  creditMutationProvider: CreditMutationProvider;

  constructor(
    creditQueryProvider: CreditQueryProvider,
    creditMutationProvider: CreditMutationProvider
  ) {
    this.creditQueryProvider = creditQueryProvider;
    this.creditMutationProvider = creditMutationProvider;
  }

  getCreditByClientId(clientId: string): Promise<CreditWithBirthdate | null> {
    return this.creditQueryProvider.getCreditByClientId(clientId);
  }

  insertOrUpdateCredit(
    credit: CreditRequestInput,
    quoteData: QuoteData,
    isFleet?: boolean | null
  ): Promise<boolean> {
    return this.creditMutationProvider.insertOrUpdateCredit(credit, quoteData, isFleet);
  }
}
