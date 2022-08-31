import { DocumentsVerifyInput } from '../providers/apollo/mutations/delivery';
import { VehiclePrebillInput } from '../providers/apollo/mutations/prebills';
import WalletMutationProvider, {
  ClientWalletInput,
  IdsWalletInput,
  ValuesWalletInput,
} from '../providers/apollo/mutations/wallet';
import WalletQueryProvider from '../providers/apollo/queries/wallet';
import WalletRepositoryInterface from '../repositories-interfaces/wallet-repository-interface';

export default class WalletRepository implements WalletRepositoryInterface {
  walletMutationProvider: WalletMutationProvider;
  walletQueryProvider: WalletQueryProvider;

  constructor(
    walletMutationProvider: WalletMutationProvider,
    walletQueryProvider: WalletQueryProvider
  ) {
    this.walletMutationProvider = walletMutationProvider;
    this.walletQueryProvider = walletQueryProvider;
  }

  createWallet(
    client: ClientWalletInput,
    values: ValuesWalletInput,
    vehicles: VehiclePrebillInput[],
    invoices: DocumentsVerifyInput[],
    ids: IdsWalletInput
  ): Promise<boolean> {
    return this.walletMutationProvider.createWallet(
      client,
      values,
      vehicles,
      invoices,
      ids
    );
  }

  authorizeOrDeny(id: number, answer: boolean): Promise<boolean> {
    return this.walletMutationProvider.authorizeOrDeny(id, answer);
  }
}
