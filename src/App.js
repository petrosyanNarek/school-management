import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { Container } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ApolloProvider from './provider/apolloProvider';
import Login from './pages/login';
import AdminDashboard from './pages/admin-dashboard';

const App = () => {
  return (
    <ApolloProvider>
      <Router>
        <AuthProvider>
          <Container>
            <Routes>
              <Route path="/" element={<DashboardRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </Container>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
};

const DashboardRedirect = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  if (!user) {
    return navigate('login');
  }

  switch (user.role) {
    case 'ADMIN':
      return navigate('/admin-dashboard');
    default:
      return navigate('/login');
  }
};

export default App;
