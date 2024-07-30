import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ME_QUERY, LOGIN_MUTATION } from '../graphql/queries/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const client = useApolloClient();

  const { data, loading, error } = useQuery(ME_QUERY, {
    skip: !localStorage.getItem('token'),
    onCompleted: (data) => setUser(data.getUserByToken),
  });

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (!loading && !data && error) {
      navigate('/login');
    }
  }, [error, loading, data, navigate]);

  const login = async (email, password) => {
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if (data && data.loginUser) {
        localStorage.setItem('token', data.loginUser);

        const { data: userData } = await client.query({
          query: ME_QUERY,
          context: {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
          fetchPolicy: 'network-only',
        });
        setUser(userData.getUserByToken);
        return userData.getUserByToken;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      return error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
