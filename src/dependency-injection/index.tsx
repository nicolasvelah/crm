import React from 'react';
import CRMProvider from '../data/providers/api/api-CRM';
import ClientsMutationProvider from '../data/providers/apollo/mutations/clients';
import QuotesMutationProvider from '../data/providers/apollo/mutations/quotes';
import ClientsQueryProvider from '../data/providers/apollo/queries/clients';
import ClientsRepository from '../data/repositories/clients-repository';
import CRMRepository from '../data/repositories/CRM-repository';
import TracingsRepository from '../data/repositories/tracings-repository';
import TracingsProvider from '../data/providers/apollo/queries/tracing';
import TracingMutationProvider from '../data/providers/apollo/mutations/tracing';
import UserQueryProvider from '../data/providers/apollo/queries/user';
import UserRepository from '../data/repositories/user-repository';
import QuotesRepository from '../data/repositories/quotes-repository';
import CreditQueryProvider from '../data/providers/apollo/queries/credit';
import CreditRepository from '../data/repositories/credit-repository';
import CreditMutationProvider from '../data/providers/apollo/mutations/credit';
import QuoteFinancialMutationProvider from '../data/providers/apollo/mutations/quote-financial';
import QuoteFinancialRepository from '../data/repositories/quote-financial-repository';
import PreBillQueryProvider from '../data/providers/apollo/queries/prebills';
import PreBillsMutationProvider from '../data/providers/apollo/mutations/prebills';
import PreBillsRepository from '../data/repositories/prebills-repository';
import TestDriverRepository from '../data/repositories/testDriver-repository';
import LeadsQueryProvider from '../data/providers/apollo/queries/leads';
import LeadsMutationProvider from '../data/providers/apollo/mutations/leads';
import TestDriverMutationProvider from '../data/providers/apollo/mutations/testDriver';
import LeadsRepository from '../data/repositories/leads-repository';
import QuotesQueryProvider from '../data/providers/apollo/queries/quotes';
import DeliveryRepository from '../data/repositories/delivery-repository';
import DeliveryMutationProvider from '../data/providers/apollo/mutations/delivery';
import Client from '../data/models/Client';
import Get from '../utils/Get';
import QuotesFinancialQueryProvider from '../data/providers/apollo/queries/quote-financial';
import TestDriverQueryProvider from '../data/providers/apollo/queries/testDriver';
import DeliveryQueryProvider from '../data/providers/apollo/queries/delivery';
import WalletMutationProvider from '../data/providers/apollo/mutations/wallet';
import WalletRepository from '../data/repositories/wallet-repository';
import WalletQueryProvider from '../data/providers/apollo/queries/wallet';
import NotificationsRepository from '../data/repositories/notifications-repository';
import NotificationsAPI from '../data/providers/api/api-notifications';
import FinancialQueryProvider from '../data/providers/apollo/queries/financial';
import FinancialMutationProvider from '../data/providers/apollo/mutations/financial';
import FinancialRepository from '../data/repositories/financial-repository';
import ReassignedMutationProvider from '../data/providers/apollo/mutations/reassigned';
import ReassignedRepository from '../data/repositories/reassigned-repository';
import FunnelRespository from '../data/repositories/funnel-respository';
import FunnelQueryProvider from '../data/providers/apollo/queries/funnel';
import SettingsQueryProvider from '../data/providers/apollo/queries/setting';
import SettingsRepository from '../data/repositories/settings-repository';
import SettingsMutationProvider from '../data/providers/apollo/mutations/settings';
import StadisticQueryProvider from '../data/providers/apollo/queries/stadistic';
import StadisticRepository from '../data/repositories/stadistic-repository';
import MessagesMutationProvider from '../data/providers/apollo/mutations/messages';
import MessagesQueryProvider from '../data/providers/apollo/queries/messages';
import MessagesRepository from '../data/repositories/messages-repository';
import UserMutationProvider from '../data/providers/apollo/mutations/user';
import LeadQuoteFinancialRepository from '../data/repositories/leads-quote-financial-repository';
import LeadQuoteFinancialMutationProvider from '../data/providers/apollo/mutations/leads-quote-financial';
import LeadQuoteFinancialQueryProvider from '../data/providers/apollo/queries/lead-quote-financial';
import ObjectivesQueryProvider from '../data/providers/apollo/queries/objectives';
import ObjectivesRepository from '../data/repositories/objetives-repository';
import ObjectivesMutationProvider from '../data/providers/apollo/mutations/objectives';

export enum Dependencies {
  clients = 'clients',
  CRM = 'CRM',
  tracings = 'tracings',
  quotes = 'quotes',
  credit = 'credit',
  quoteFinancial = 'quoteFinancial',
  prebills = 'prebills',
  leads = 'leads',
  testDriver = 'testDriver',
  delivery = 'delivery',
  users = 'users',
  wallet = 'wallet',
  notifications = 'notifications',
  financial = 'financial',
  reassigned = 'reassigned',
  funnel = 'funnel',
  settings = 'settings',
  stadistic = 'stadistic',
  messages = 'messages',
  leadQuoteFinancial = 'leadQuoteFinancial',
  objectives = 'objectives',
}

// DATA PROVIDERS API o GRAPHQL
const clientsQueryProvider = new ClientsQueryProvider();
const clientsMutationProvider = new ClientsMutationProvider();
const CRMProvider = new CRMProvider();
const tracingsProvider = new TracingsProvider();
const tracingsMutationProvider = new TracingMutationProvider();
const userQueryProvider = new UserQueryProvider();
const userMutationProvider = new UserMutationProvider();
const quotesMutationProvider = new QuotesMutationProvider();
const quotesQueryProvider = new QuotesQueryProvider();
const creditQueryProvider = new CreditQueryProvider();
const creditMutationProvider = new CreditMutationProvider();
const quoteFinancialMutationProvider = new QuoteFinancialMutationProvider();
const quoteFinancialQueryProvider = new QuotesFinancialQueryProvider();
const preBillQueryProvider = new PreBillQueryProvider();
const preBillMutationProvider = new PreBillsMutationProvider();
const testDriverMutationProvider = new TestDriverMutationProvider();
const leadsQueryProvider = new LeadsQueryProvider();
const leadsMutationProvider = new LeadsMutationProvider();
const deliveryMutationProvider = new DeliveryMutationProvider();
const deliveryQueryProvider = new DeliveryQueryProvider();
const testDriverQueryProvider = new TestDriverQueryProvider();
const financialQueryProvider = new FinancialQueryProvider();
const financialMutationProvider = new FinancialMutationProvider();
//const CRMProvider = new CRMFakeProvider();
const walletMutationProvider = new WalletMutationProvider();
const walletQueryProvider = new WalletQueryProvider();
const reassignedMutationProvider = new ReassignedMutationProvider();
const funnelQueryProvider = new FunnelQueryProvider();
const settingsQueryProvider = new SettingsQueryProvider();
const settingsMutationProvider = new SettingsMutationProvider();
const stadisticQueryProvider = new StadisticQueryProvider();
const messagesQueryProvider = new MessagesQueryProvider();
const messagesMutationProvider = new MessagesMutationProvider();
const leadQuoteFinancialMutationProvider =
  new LeadQuoteFinancialMutationProvider();
const leadQuoteFinancialQueryProvider = new LeadQuoteFinancialQueryProvider();
const objectivesQueryProvider = new ObjectivesQueryProvider();
const objectivesMutationProvider = new ObjectivesMutationProvider();

// REPOSITORIES

const clientsRepository = new ClientsRepository(
  clientsQueryProvider,
  clientsMutationProvider
);

const CRMRepository = new CRMRepository(CRMProvider);

const tracingsRepository = new TracingsRepository(
  tracingsProvider,
  tracingsMutationProvider
);

const usersRepository = new UserRepository(
  userQueryProvider,
  userMutationProvider
);

const quotesRepository = new QuotesRepository(
  quotesMutationProvider,
  quotesQueryProvider
);

const creditRepository = new CreditRepository(
  creditQueryProvider,
  creditMutationProvider
);

const quoteFinancialRepository = new QuoteFinancialRepository(
  quoteFinancialMutationProvider,
  quoteFinancialQueryProvider
);

const prebillsRepository = new PreBillsRepository(
  preBillQueryProvider,
  preBillMutationProvider
);

const leadsRepository = new LeadsRepository(
  leadsQueryProvider,
  leadsMutationProvider
);

const testDriverRepository = new TestDriverRepository(
  testDriverMutationProvider,
  testDriverQueryProvider
);

const settingsRepository = new SettingsRepository(
  settingsQueryProvider,
  settingsMutationProvider
);

const deliveryRepository = new DeliveryRepository(
  deliveryMutationProvider,
  deliveryQueryProvider
);

const walletRepository = new WalletRepository(
  walletMutationProvider,
  walletQueryProvider
);

const notificationsRepository = new NotificationsRepository(
  new NotificationsAPI()
);

const financialRepository = new FinancialRepository(
  financialQueryProvider,
  financialMutationProvider
);

const reassignedRepository = new ReassignedRepository(
  reassignedMutationProvider
);

const funnelRepository = new FunnelRespository(funnelQueryProvider);

const stadisticRepository = new StadisticRepository(stadisticQueryProvider);

const messagesRepository = new MessagesRepository(
  messagesQueryProvider,
  messagesMutationProvider
);

const leadQuoteFinancialRepository = new LeadQuoteFinancialRepository(
  leadQuoteFinancialMutationProvider,
  leadQuoteFinancialQueryProvider
);

const objectivesRepository = new ObjectivesRepository(
  objectivesQueryProvider,
  objectivesMutationProvider
);

//START DEPENDENCY INJECTION
Get.put(clientsRepository, { name: Dependencies.clients });
Get.put(CRMRepository, { name: Dependencies.CRM });
Get.put(tracingsRepository, { name: Dependencies.tracings });
Get.put(quotesRepository, { name: Dependencies.quotes });
Get.put(creditRepository, { name: Dependencies.credit });
Get.put(quoteFinancialRepository, { name: Dependencies.quoteFinancial });
Get.put(prebillsRepository, { name: Dependencies.prebills });
Get.put(leadsRepository, { name: Dependencies.leads });
Get.put(testDriverRepository, { name: Dependencies.testDriver });
Get.put(deliveryRepository, { name: Dependencies.delivery });
Get.put(usersRepository, { name: Dependencies.users });
Get.put(walletRepository, { name: Dependencies.wallet });
Get.put(settingsRepository, { name: Dependencies.settings });
Get.put(financialRepository, { name: Dependencies.financial });
Get.put(notificationsRepository, { name: Dependencies.notifications });
Get.put(reassignedRepository, { name: Dependencies.reassigned });
Get.put(funnelRepository, { name: Dependencies.funnel });
Get.put(stadisticRepository, { name: Dependencies.stadistic });
Get.put(messagesRepository, { name: Dependencies.messages });
Get.put(leadQuoteFinancialRepository, {
  name: Dependencies.leadQuoteFinancial,
});
Get.put(objectivesRepository, { name: Dependencies.objectives });
//END DEPENDENCY INJECTION

class UserLogged {
  data: Client | null = null;

  setData = (data: Client | null) => {
    this.data = data;
  };
}
// GLOBAL STATES
export const UserLoggedContext = React.createContext<UserLogged>(
  new UserLogged()
);

const contexts: { context: React.Context<any>; value: any }[] = [
  { context: UserLoggedContext, value: new UserLogged() },
];

// combine all contexts and creates the dependency injection
export const compose = (children: any) => {
  return contexts.reduce((acc, item): any => {
    return (
      <item.context.Provider value={item.value}>{acc}</item.context.Provider>
    );
  }, children);
};
