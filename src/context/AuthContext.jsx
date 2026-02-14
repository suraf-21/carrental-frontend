// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          console.log('🔍 Initializing auth with token:', token.substring(0, 20) + '...');
          const response = await authService.getCurrentUser();
          console.log('🔍 Init auth FULL response:', response);
          console.log('🔍 Init auth response.data:', response.data);
          
          // Try different response structures
          let userData = null;
          
          if (response.data?.data) {
            // Structure: { success: true, data: { user: {...} } }
            userData = response.data.data;
            console.log('🔍 Using response.data.data structure');
          } else if (response.data?.user) {
            // Structure: { success: true, user: {...} }
            userData = response.data.user;
            console.log('🔍 Using response.data.user structure');
          } else if (response.data) {
            // Structure: { user: {...} } directly
            userData = response.data;
            console.log('🔍 Using response.data directly');
          }
          
          console.log('🔍 Extracted user data:', userData);
          
          if (!userData) {
            throw new Error('No user data found in response');
          }
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user: userData, token } 
          });
        } catch (error) {
          console.error('❌ Auth init error:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('🔍 Login attempt with:', email);
      const response = await authService.login({ email, password });
      console.log('🔍 Login FULL response:', response);
      console.log('🔍 Login response.data:', response.data);
      console.log('🔍 Login response.status:', response.status);
      console.log('🔍 Login response.headers:', response.headers);
      
      // Log the entire structure to see what we're getting
      console.log('🔍 Response structure:', Object.keys(response.data));
      
      // Try different response structures to find where user and token are
      let user = null;
      let token = null;
      
      // Check for nested data.data structure (your backend)
      if (response.data?.data) {
        console.log('🔍 Found response.data.data');
        const nestedData = response.data.data;
        console.log('🔍 nestedData keys:', Object.keys(nestedData));
        
        if (nestedData.user && nestedData.token) {
          user = nestedData.user;
          token = nestedData.token;
          console.log('🔍 Found user and token in data.data');
        } else if (nestedData) {
          // Maybe the whole data.data is the user and token is separate?
          console.log('🔍 Checking if nestedData is the user object');
          user = nestedData;
          // Try to find token elsewhere
        }
      }
      
      // Check for direct data.user structure
      if (!user && response.data?.user) {
        console.log('🔍 Found response.data.user');
        user = response.data.user;
      }
      
      // Check for token in different places
      if (!token) {
        if (response.data?.token) {
          token = response.data.token;
          console.log('🔍 Found token in response.data.token');
        } else if (response.data?.data?.token) {
          token = response.data.data.token;
          console.log('🔍 Found token in response.data.data.token');
        }
      }
      
      console.log('🔍 Extracted user:', user);
      console.log('🔍 Extracted token:', token ? token.substring(0, 20) + '...' : null);
      
      if (!user || !token) {
        console.error('❌ Missing user or token in response');
        console.log('❌ Full response data:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response structure: missing user or token');
      }
      
      // Store token
      localStorage.setItem('token', token);
      console.log('🔍 Token stored in localStorage');
      
      // Dispatch success
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token } 
      });
      
      console.log('🔍 Login success dispatched');
      toast.success('Login successful!');
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('🔍 Register attempt:', userData.email);
      const response = await authService.register(userData);
      console.log('🔍 Register response:', response.data);
      
      // Similar structure handling as login
      let user = null;
      let token = null;
      
      if (response.data?.data?.user && response.data?.data?.token) {
        user = response.data.data.user;
        token = response.data.data.token;
      } else if (response.data?.user && response.data?.token) {
        user = response.data.user;
        token = response.data.token;
      }
      
      if (!user || !token) {
        throw new Error('Invalid response structure');
      }
      
      localStorage.setItem('token', token);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token } 
      });
      
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      console.error('❌ Register error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};