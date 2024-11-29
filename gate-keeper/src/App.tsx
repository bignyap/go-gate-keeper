import './App.css';
import {  
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route 
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Error from './components/Common/Error';

import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Navbar />}>
    <Route 
      path ="item1" 
      element={<ContactPage />} 
      errorElement={<Error />}
      // loader={chatLoader}
    />
    <Route 
      path="item2" 
      element={<ContactPage />} 
    />
    <Route
      path="item3"
      element={<ContactPage />}
      errorElement={<Error />}
    />
    <Route path="*" element={<NotFound />} />
  </Route>
))

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
