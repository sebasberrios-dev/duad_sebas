import api from '../api/axios.js';
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token') || null;
  const [user, setUser] = useState(
    storedToken ? decodeToken(storedToken) : null
  );
  const [token, setToken] = useState(storedToken);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoginError(null);
      const response = await api.post('/login', credentials);
      const token = response.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUser(decodeToken(token));
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
      const token = response.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      setUser(decodeToken(token));
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

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isLogged = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLogged,
        isAdmin,
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
