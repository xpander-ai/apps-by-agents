import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import Portfolio from './components/portfolio/Portfolio';
import Budget from './components/budget/Budget';
import Expenses from './components/expenses/Expenses';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Settings from './components/settings/Settings';
import NotFound from './components/layout/NotFound';
import Alert from './components/layout/Alert';

// Context
import AuthContext from './context/auth/authContext';
import AlertContext from './context/alert/alertContext';
import SocketContext from './context/socket/socketContext';

// Utils
import setAuthToken from './utils/setAuthToken';

// CSS
import './App.css';

const App = () => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  });

  const [alertState, setAlertState] = useState([]);
  const [socket, setSocket] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
        
        try {
          const res = await axios.get('/api/auth/user');
          
          setAuthState({
            ...authState,
            isAuthenticated: true,
            loading: false,
            user: res.data
          });
          
          // Set theme from user preferences
          if (res.data.preferences && res.data.preferences.theme) {
            setTheme(res.data.preferences.theme);
          }
        } catch (err) {
          localStorage.removeItem('token');
          
          setAuthState({
            ...authState,
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
            error: err.response?.data?.message || 'Authentication error'
          });
        }
      } else {
        setAuthState({
          ...authState,
          isAuthenticated: false,
          loading: false
        });
      }
    };
    
    loadUser();
    // eslint-disable-next-line
  }, []);

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !socket) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.token
        }
      });
      
      setSocket(newSocket);
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, [authState.isAuthenticated, socket]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth context actions
  const login = async (email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const res = await axios.post('/api/auth/login', { email, password }, config);
      
      localStorage.setItem('token', res.data.token);
      
      setAuthState({
        ...authState,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      
      loadUser();
    } catch (err) {
      setAuthState({
        ...authState,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: err.response?.data?.message || 'Invalid credentials'
      });
      
      setAlert(err.response?.data?.message || 'Invalid credentials', 'danger');
    }
  };
  
  const register = async (name, email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const res = await axios.post('/api/auth/register', { name, email, password }, config);
      
      localStorage.setItem('token', res.data.token);
      
      setAuthState({
        ...authState,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      
      loadUser();
    } catch (err) {
      setAuthState({
        ...authState,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: err.response?.data?.message || 'Registration failed'
      });
      
      setAlert(err.response?.data?.message || 'Registration failed', 'danger');
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    
    setAuthState({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null
    });
  };
  
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      
      try {
        const res = await axios.get('/api/auth/user');
        
        setAuthState({
          ...authState,
          isAuthenticated: true,
          loading: false,
          user: res.data,
          error: null
        });
        
        // Set theme from user preferences
        if (res.data.preferences && res.data.preferences.theme) {
          setTheme(res.data.preferences.theme);
        }
      } catch (err) {
        localStorage.removeItem('token');
        
        setAuthState({
          ...authState,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: err.response?.data?.message || 'Authentication error'
        });
      }
    }
  };
  
  const updateUserPreferences = async (preferences) => {
    try {
      const res = await axios.put('/api/auth/preferences', preferences);
      
      setAuthState({
        ...authState,
        user: res.data
      });
      
      if (preferences.theme) {
        setTheme(preferences.theme);
      }
      
      setAlert('Preferences updated', 'success');
    } catch (err) {
      setAlert(err.response?.data?.message || 'Failed to update preferences', 'danger');
    }
  };
  
  const clearErrors = () => {
    setAuthState({
      ...authState,
      error: null
    });
  };

  // Alert context actions
  const setAlert = (msg, type, timeout = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setAlertState([...alertState, { id, msg, type }]);
    
    setTimeout(() => removeAlert(id), timeout);
  };
  
  const removeAlert = (id) => {
    setAlertState(alertState.filter(alert => alert.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        loading: authState.loading,
        user: authState.user,
        error: authState.error,
        login,
        register,
        logout,
        loadUser,
        updateUserPreferences,
        clearErrors,
        theme,
        setTheme
      }}
    >
      <AlertContext.Provider
        value={{
          alerts: alertState,
          setAlert,
          removeAlert
        }}
      >
        <SocketContext.Provider value={{ socket }}>
          <Router>
            <div className={`app ${theme}`}>
              {authState.isAuthenticated && <Navbar />}
              <div className="container">
                <Alert />
                {authState.isAuthenticated && <Sidebar />}
                <main className={authState.isAuthenticated ? 'main-content' : 'main-content-full'}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        authState.isAuthenticated ? (
                          <Dashboard />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/portfolio"
                      element={
                        authState.isAuthenticated ? (
                          <Portfolio />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/budget"
                      element={
                        authState.isAuthenticated ? (
                          <Budget />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/expenses"
                      element={
                        authState.isAuthenticated ? (
                          <Expenses />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        authState.isAuthenticated ? (
                          <Settings />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        !authState.isAuthenticated ? (
                          <Login />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        !authState.isAuthenticated ? (
                          <Register />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </Router>
        </SocketContext.Provider>
      </AlertContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;