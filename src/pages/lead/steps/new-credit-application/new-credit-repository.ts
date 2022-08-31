/* eslint-disable no-unused-vars */
import graphqlRoute from '../../../../data/providers/api/api-graphql';
import { NewCreditGlobalState } from './new-credit-controller';
import creditQueryMutation from './new-credit-query-mutation';

const insertOrUpdateCredit = async (
  clientId: string,
  dataCredit: NewCreditGlobalState
):Promise<{ data: any, message: string }> => {
  const query = creditQueryMutation.insertOrUpdatCreditString(
    clientId,
    dataCredit
  );
  const resp = await graphqlRoute(query);
  return resp;
};

export default { insertOrUpdateCredit };
