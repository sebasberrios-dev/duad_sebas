import api from '../api/axios.js';
import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useContext, useEffect } from 'react';
import {
  showSessionExpired,
  showLogoutSuccess,
} from '../components/Messages-States/Alerts.jsx';

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const isTokenExpired = (decoded) => {
  if (!decoded?.exp) return false;
  return decoded.exp < Date.now() / 1000;
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token') || null;
  const [user, setUser] = useState(
    storedToken ? decodeToken(storedToken) : null
  );
  const [token, setToken] = useState(storedToken);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!token || !user?.exp) return;

    if (isTokenExpired(user)) {
      clearAuth();
      showSessionExpired();
      return;
    }

    const msUntilExpiry = user.exp * 1000 - Date.now();
    const timerId = setTimeout(() => {
      clearAuth();
      showSessionExpired();
    }, msUntilExpiry);

    return () => clearTimeout(timerId);
  }, [token, user]);

  const saveAuth = (newToken) => {
    setToken(newToken);
    setUser(decodeToken(newToken));
    localStorage.setItem('token', newToken);
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const login = async (credentials) => {
    try {
      setIsLoggingOut(false);
      setLoginError(null);
      const response = await api.post('/login', credentials);
      saveAuth(response.data.token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      const credentialsError = error.response && error.response.status === 401;
      credentialsError
        ? setLoginError('Crendenciales incorrectas!')
        : setLoginError('Error de conexión. Inténtalo de nuevo.');
      return false;
    }
  };

  const registerUser = async (userData) => {
    try {
      setRegisterError(null);
      const response = await api.post('/register', userData);
      saveAuth(response.data.token);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      const emailExistsError =
        error.response &&
        error.response.status === 409 &&
        error.response.data.error === 'email already exists';
      emailExistsError
        ? setRegisterError('El correo ya está registrado! Intenta con otro.')
        : setRegisterError('Error de conexión. Inténtalo de nuevo.');
      return false;
    }
  };

  const handleLogout = (navigate) => {
    setIsLoggingOut(true);
    clearAuth();
    showLogoutSuccess();
    navigate('/');
    setTimeout(() => setIsLoggingOut(false), 0);
  };

  const isLogged = !!token && !isTokenExpired(user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        handleLogout,
        isLogged,
        isAdmin,
        isLoggingOut,
        loginError,
        registerError,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
