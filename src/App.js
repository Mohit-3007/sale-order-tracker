import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import DashBoard from './Pages/DashBoard';
import Create from './Pages/Create';
import Signup from './Pages/Signup';
import Login from './Pages/Login';

function ProtectedRoute({ children }) {
  const login = localStorage.getItem('login');
  console.log(login);
  if (login === true) {
    return <Navigate to={'/'} />;
  }
  return children;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashBoard />} />
      <Route path="create" element={<Create />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
