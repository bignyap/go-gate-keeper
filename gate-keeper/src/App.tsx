import './App.css';
import {  
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route 
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Error from './components/Common/Error';

import NotFound from './pages/NotFound';
import { OrganizationPage } from './pages/Organization/Organizations';
import SubTierPage from './pages/SubTiers';
import EndpointPage from './pages/Endpoints';
import ResourcePage from './pages/Resources';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route 
        path="/" 
        element={<Navbar title='GATE|KEEPER'/>}
        errorElement={<Error />}
      >
        <Route 
          path ="organizations" 
          element={<OrganizationPage />} 
          errorElement={<Error />}
        />
        <Route 
          path ="endpoints" 
          element={<EndpointPage />} 
          errorElement={<Error />}
          // loader={chatLoader}
        />
        <Route 
          path ="resources" 
          element={<ResourcePage />} 
          errorElement={<Error />}
          // loader={chatLoader}
        />
        <Route 
          path ="tiers" 
          element={<SubTierPage />} 
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
