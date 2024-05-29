import React from 'react';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import DashBoard from './Pages/DashBoard';
import Create from './Pages/Create';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<DashBoard />} />
      <Route path="create" element={<Create />} />
    </Route>
  )
)

function App() {
  return (
   <RouterProvider router={router} />

  );
}

export default App;
