import './App.css';
import {  
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Error from './components/Common/Error';
import NotFound from './pages/NotFound';
import { HomePage } from './pages/Home/Home';
import { OrganizationPage } from './pages/Organization/Organizations';
import { ViewOrganizationPage } from './pages/Organization/ViewOrganization';
import { PricingPage } from './pages/Pricing/Pricing';
import { SubscriptionPage } from './pages/Subscription/Subscription';
import { UsagePage } from './pages/Usage/Usage';
import { SettingsPage } from './pages/Settings/Settings';
import { EndpointTab } from './pages/Settings/Endpoint/Endpoint';
import { SubScriptionTierTab } from './pages/Settings/SubscriptionTier/SubscriptionTier';
import { OrganizationTypeTab } from './pages/Settings/OrganizationType/OrganizationType';
import { ResourceTypeTab } from './pages/Settings/ResourceType/ResourceType';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route 
        path="/" 
        element={<Navbar title='GATE|KEEPER'/>}
        errorElement={<Error />}
      >
        <Route 
          index 
          element={<Navigate to="/home" replace />}
        />
        <Route 
          path="home" 
          element={<HomePage />}
          errorElement={<Error />}
        />
        <Route 
          path="organizations" 
          element={<OrganizationPage />} 
          errorElement={<Error />}
        >
          <Route 
            path=":id" 
            element={<ViewOrganizationPage />} 
            errorElement={<Error />}
          />
        </Route>
        <Route 
          path="subscriptions" 
          element={<SubscriptionPage />} 
          errorElement={<Error />}
        />
        <Route 
          path="pricings" 
          element={<PricingPage />} 
          errorElement={<Error />}
        />
        <Route 
          path="usage" 
          element={<UsagePage />} 
          errorElement={<Error />}
        />
        <Route path="settings" element={<SettingsPage />}>
          <Route 
            index 
            element={<Navigate to="endpoints" replace />}
          />
          <Route path="endpoints" element={<EndpointTab />} />
          <Route path="organization-types" element={<OrganizationTypeTab />} />
          <Route path="resources" element={<ResourceTypeTab />} />
          <Route path="subscription-tiers" element={<SubScriptionTierTab />} />
        </Route>
      </Route>,
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}