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
import { UsagePage } from './pages/Usage/Usage';
import { SettingsPage } from './pages/Settings/Settings';
import { EndpointTab } from './pages/Settings/Endpoint/Endpoint';
import { ResourceTypeTab } from './pages/Settings/ResourceType/ResourceType';
import { ViewTierPricingPage } from './pages/Pricing/ViewPricing';

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
        />
        <Route 
          path="organizations/:id" 
          errorElement={<Error />}
          element={<ViewOrganizationPage />}
        />
        <Route 
          path="subTier" 
          element={<PricingPage />} 
          errorElement={<Error />}
        />
        <Route 
          path="subTier/:id" 
          element={<ViewTierPricingPage />} 
          errorElement={<Error />}
        />
        <Route 
          path="usage" 
          element={<UsagePage />} 
          errorElement={<Error />}
        />
        <Route path="resources" element={<SettingsPage />} errorElement={<Error />}>
          <Route 
            index 
            element={<Navigate to="types" replace />}
            errorElement={<Error />}
          />
          <Route path="endpoints" element={<EndpointTab />} errorElement={<Error />} />
          <Route path="types" element={<ResourceTypeTab />} errorElement={<Error />} />
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