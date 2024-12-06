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
import { PricingPage } from './pages/Pricing/Pricing';
import { SubscriptionPage } from './pages/Subscription/Subscription';
import { UsagePage } from './pages/Usage/Usage';
import { SettingsPage } from './pages/Settings/Settings';

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
          path ="organizations" 
          element={<OrganizationPage />} 
          errorElement={<Error />}
        />
        <Route 
          path ="subscriptions" 
          element={<SubscriptionPage />} 
          errorElement={<Error />}
          // loader={chatLoader}
        />
        <Route 
          path ="pricings" 
          element={<PricingPage />} 
          errorElement={<Error />}
          // loader={chatLoader}
        />
        <Route 
          path ="usage" 
          element={<UsagePage />} 
          errorElement={<Error />}
          // loader={chatLoader}
        />
        <Route 
          path ="settings/:tab?" 
          element={<SettingsPage />} 
          errorElement={<Error />}
          // loader={chatLoader}
        />
      </Route>,
      <Route path="*" element={<NotFound />} />
    </>
))

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
