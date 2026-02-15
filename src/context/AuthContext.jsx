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
          console.log('🔍 Init auth response:', response.data);
          
          // Handle different response structures
          let userData = null;
          
          if (response.data?.data) {
            userData = response.data.data;
            console.log('🔍 Using response.data.data structure');
          } else if (response.data?.user) {
            userData = response.data.user;
            console.log('🔍 Using response.data.user structure');
          } else if (response.data) {
            userData = response.data;
            console.log('🔍 Using response.data directly');
          }
          
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
      console.log('🔍 Login response:', response.data);
      
      let user = null;
      let token = null;
      
      // Handle nested data.data structure
      if (response.data?.data) {
        console.log('🔍 Found response.data.data');
        const nestedData = response.data.data;
        
        // Case 1: data.data contains user and token properties
        if (nestedData.user && nestedData.token) {
          user = nestedData.user;
          token = nestedData.token;
          console.log('🔍 Found user and token in data.data');
        }
        // Case 2: data.data is the user object and token is in data.data.token
        else if (nestedData._id && nestedData.email) {
          user = nestedData;
          if (nestedData.token) {
            token = nestedData.token;
          }
          console.log('🔍 Using data.data as user object');
        }
      }
      
      // Check for token in other places if not found
      if (!token) {
        if (response.data?.token) {
          token = response.data.token;
          console.log('🔍 Found token in response.data.token');
        } else if (response.data?.data?.token) {
          token = response.data.data.token;
          console.log('🔍 Found token in response.data.data.token');
        }
      }
      
      // Check for user in other places if not found
      if (!user && response.data?.user) {
        user = response.data.user;
        console.log('🔍 Found user in response.data.user');
      }
      
      console.log('🔍 Extracted user:', user);
      console.log('🔍 Extracted token:', token ? token.substring(0, 20) + '...' : null);
      
      if (!user || !token) {
        console.error('❌ Missing user or token in response');
        console.log('❌ Full response:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid response structure: missing user or token');
      }
      
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success('Login successful!');
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
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
      console.log('🔍 Register status:', response.status);
      
      let user = null;
      let token = null;
      
      // Handle nested data.data structure
      if (response.data?.data) {
        console.log('🔍 Found response.data.data');
        const nestedData = response.data.data;
        console.log('🔍 nestedData keys:', Object.keys(nestedData));
        
        // Case 1: data.data contains user and token properties
        if (nestedData.user && nestedData.token) {
          user = nestedData.user;
          token = nestedData.token;
          console.log('🔍 Found user and token in data.data');
        }
        // Case 2: data.data is the user object (has _id, email, etc.)
        else if (nestedData._id || nestedData.email) {
          user = nestedData;
          console.log('🔍 Using data.data as user object');
          
          // Look for token in different places
          if (nestedData.token) {
            token = nestedData.token;
          } else if (response.data.data.token) {
            token = response.data.data.token;
          }
        }
        // Case 3: data.data has token and user is elsewhere
        else if (nestedData.token && response.data.data.user) {
          token = nestedData.token;
          user = response.data.data.user;
        }
      }
      
      // Check for token in other places if not found
      if (!token) {
        if (response.data?.token) {
          token = response.data.token;
          console.log('🔍 Found token in response.data.token');
        } else if (response.data?.data?.token) {
          token = response.data.data.token;
          console.log('🔍 Found token in response.data.data.token');
        }
      }
      
      // Check for user in other places if not found
      if (!user) {
        if (response.data?.user) {
          user = response.data.user;
          console.log('🔍 Found user in response.data.user');
        } else if (response.data?.data?.user) {
          user = response.data.data.user;
          console.log('🔍 Found user in response.data.data.user');
        } else if (response.data?._id || response.data?.email) {
          user = response.data;
          console.log('🔍 Using response.data as user object');
        }
      }
      
      console.log('🔍 Extracted user:', user);
      console.log('🔍 Extracted token:', token ? token.substring(0, 20) + '...' : null);
      
      if (!user || !token) {
        console.error('❌ Missing user or token in response');
        console.log('❌ Full response data:', JSON.stringify(response.data, null, 2));
        
        // Check specific error for user already exists
        if (response.data?.message?.includes('already exists')) {
          throw new Error('User already exists');
        }
        throw new Error('Invalid response structure: missing user or token');
      }
      
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      console.error('❌ Register error:', error);
      
      // Handle specific error messages
      let message = 'Registration failed';
      if (error.message === 'User already exists' || error.response?.data?.message?.includes('already exists')) {
        message = 'User already exists. Please login instead.';
      } else {
        message = error.response?.data?.message || error.message || 'Registration failed';
      }
      
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

  // Debug logs for state changes
  useEffect(() => {
    console.log('🔍 Auth state:', {
      user: state.user?.email,
      role: state.user?.role,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading
    });
  }, [state]);

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