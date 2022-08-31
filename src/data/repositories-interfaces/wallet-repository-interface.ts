import { ClientInput } from '../providers/apollo/mutations/clients';
import { DocumentsVerifyInput } from '../providers/apollo/mutations/delivery';
import { PrebillInput, VehiclePrebillInput } from '../providers/apollo/mutations/prebills';
import { ClientWalletInput, IdsWalletInput, ValuesWalletInput } from '../providers/apollo/mutations/wallet';

export default interface WalletRepositoryInterface {
  createWallet(
    client: ClientWalletInput,
    values: ValuesWalletInput,
    vehicles: VehiclePrebillInput[],
    invoices: DocumentsVerifyInput[],
    ids: IdsWalletInput
  ): Promise<boolean>;

  authorizeOrDeny(
    id: number,
    answer: boolean
  ): Promise<boolean>;
}
