import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { useEffect } from 'react';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { Login } from '../../pages/Login';
import { ProtectedRoute } from '../ProtectedRoute';
import { Register } from '../../pages/Register';
import { ForgotPassword } from '../../pages/ForgotPassword';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route
          path='/register/'
          element={<Register />}
        />
       <Route
  path='/home/'
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>

<Route
  path='/history/'
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>
<Route
  path='/forgot-password/'
  element={<ForgotPassword />}
/>

<Route
  path='/settings/'
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
       <Route
  path='/about-pomodoro/'
  element={
    <ProtectedRoute>
      <AboutPomodoro />
    </ProtectedRoute>
  }
/>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}