import React from 'react';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const Anonymous = () => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
};

const RouterHandle = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Anonymous />}>
          <Route path='/login' element={<LoginPage />} />
        </Route>
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
        </Route>
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default RouterHandle;
