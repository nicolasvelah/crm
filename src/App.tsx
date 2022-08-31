import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import moment from 'moment';

import client from './data/providers/apollo';
import './styles/sass/app.scss';
import './index.css';

import Login from './pages/Login';
import CatalogV2 from './pages/catalog/components/Catalog';
import NotFound from './pages/NotFound';
import SplashPage from './pages/SplashPage';
import Dashboard from './pages/dashboard/Dashboard';
import Catalog from './pages/catalog/Catalog';
import MainFollowPage from './pages/Follow/MainFollowPage';
import Lead from './pages/lead/Lead';
import MainProspect from './pages/Prospect/MainProspect';
import NewProspectForm from './pages/Prospect/NewProspectForm';
import DetailsProspect from './pages/Prospect/DetailsProspect';
import CreditAplicationList from './pages/credit/CreditAplicationList';
import MechanicalAppraisalPage from './pages/MechanicalAppraisal/MechanicalAppraisalPage';
import { compose } from './dependency-injection';
import FormFollowPage from './pages/Follow/FormFollowPage';
import DetailFollowPage from './pages/Follow/DetailFollowPage';
import ClosurePage from './pages/Closure/ClosurePage';
import MainWalletPage from './pages/wallet/MainWalletPage';
import VehicleRegistrationPage from './pages/VehicleRegistrationPage';
import VehicleReservationPage from './pages/VehicleReservationPage';
import VehicleDeliveryConfirmationPage from './pages/VehicleDeliveryConfirmationPage';
import MainHostPage from './pages/host/MainHostPage';
import DetailCreditApplication from './pages/credit/DetailCreditApplication';
import BankResponseCreditPage from './pages/BankResponseCreditPage';
import SettingsPage from './pages/settings/SettingsPage';
import 'moment/locale/es';
import DeliveryPage from './pages/Delivery/DeliveryPage';
import Business from './pages/business/Business';
import MainHelpPage from './pages/Help/MainHelpPage';
import MainStadisticPage from './pages/Stadistic/MainStadisticPage';
import MainMessageUsers from './pages/MessageUsers/MainMessageUsers';
import Vchat from './pages/Vchat/Vchat';
import VchatClient from './pages/vchat-client/VchatClient';
import VchatContext from './pages/Vchat/components/VchatContext';
import Contactar from './pages/contactar/Contactar';
import PublicCatalog from './pages/public-catalog/PublicCatalog';
import { PrivateRoute } from './utils/PrivateRoute';
import RedirectVchat from './pages/redirectVchat/RedirectVchat';
import MainReasign from './pages/Reasign/MainReasign';
import PrintPrefecture from './pages/quote/components/PrintPrefecture ';

moment.locale('es');

const App = () => {
  const url = window.location.href;

  const [vchatActivated, setVchatActivated] = useState(false);
  const [codeVchat, setCodeVchat] = useState(null);

  return compose(
    <ApolloProvider client={client}>
      <VchatContext.Provider
        value={{
          vchatActivated,
          setVchatActivated,
          code: codeVchat,
          setCode: setCodeVchat,
        }}
      >
        <Router>
          <Switch>
            <Route exact path="/contactar" component={Contactar} />
            <Route exact path="/public-catalog" component={PublicCatalog} />
            <Route exact path="/" component={Login} />

            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route path="/splashpage" component={SplashPage} />
            <PrivateRoute path="/catalog" component={Catalog} />
            {/* <Route path="/prospect" component={Prospect} /> */}
            {/* Prospecto */}
            <PrivateRoute exact path="/prospect" component={MainProspect} />
            <Route exact path="/prospect/form" component={NewProspectForm} />
            <Route exact path="/prospect/details" component={DetailsProspect} />

            <PrivateRoute exact path="/business" component={Business} />
            <PrivateRoute exact path="/settings" component={SettingsPage} />

            <PrivateRoute exact path="/tracing" component={MainFollowPage} />
            <Route exact path="/tracing/form/" component={FormFollowPage} />
            <Route
              exact
              path="/tracing/details/"
              component={DetailFollowPage}
            />

            <Route exact path="/anfitrion" component={MainHostPage} />

            <Route exact path="/closure" component={ClosurePage} />
            {/* <Route exact path="/wallet" component={WalletPageMain} /> */}

            {/* Delivery */}
            <Route exact path="/delivery" component={DeliveryPage} />
            <PrivateRoute
              exact
              path="/stadistic"
              component={MainStadisticPage}
            />

            <Route
              exact
              path="/lead/id-lead=:lead/identification=:id"
              component={Lead}
            />
            <PrivateRoute path="/wallet" component={MainWalletPage} />
            {/*  <Route exact path="/lead/:lead/:id/:step" render={() => Lead} /> */}
            {/* --RUTA DE PRUEBA--- */}

            <Route exact path="/credit/list" component={CreditAplicationList} />
            <Route
              exact
              path="/credit/list/:id/:type"
              component={DetailCreditApplication}
            />
            <Route
              exact
              //path="/entity?token=:token/idQuoteFinancial=:idQuoteFinancial"
              //http://localhost:3000/entity?token=token/idQuoteFinancial=idQuoteFinancial
              path="/entity/token=:token/idQuoteFinancial=:idQuoteFinancial/user=:idUserFyI"
              component={BankResponseCreditPage}
            />
            <PrivateRoute
              exact
              path="/mechanical-appraisal/list"
              component={MechanicalAppraisalPage}
            />
            <Route
              exact
              path="/vehicle-registration"
              component={VehicleRegistrationPage}
            />
            <Route
              exact
              path="/vehicle-reservation"
              component={VehicleReservationPage}
            />
            <Route
              exact
              path="/delivery-confirmation"
              component={VehicleDeliveryConfirmationPage}
            />
            <PrivateRoute exact path="/re-asign" component={MainReasign} />
            <Route exact path="/messages" component={MainMessageUsers} />
            <Route exact path="/messages/:id" component={MainMessageUsers} />
            <Route exact path="/help" component={MainHelpPage} />
            {/* <Route path="/vchat/:code" component={Vchat} /> */}
            <Route path="/vchat/:code" component={VchatClient} />
            <Route
              path="/redirect/:idTracingVchat/:idLeadVchat/:idUserVchat"
              component={RedirectVchat}
            />
            <Route component={NotFound} />
          </Switch>
        </Router>
        {vchatActivated && (
          <Vchat
            setVchatActivated={setVchatActivated}
            codeVchat={codeVchat}
            setCode={setCodeVchat}
          />
        )}
      </VchatContext.Provider>
    </ApolloProvider>
  );
};

export default App;
