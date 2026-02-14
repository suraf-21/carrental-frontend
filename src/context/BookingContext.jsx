// src/context/BookingContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import { bookingService } from '../services/booking.service';

const BookingContext = createContext();

const initialState = {
  currentBooking: null,
  bookings: [],
  isLoading: false,
  error: null
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'FETCH_BOOKINGS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_BOOKINGS_SUCCESS':
      return { 
        ...state, 
        bookings: action.payload || [], 
        isLoading: false 
      };
    case 'FETCH_BOOKINGS_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload,
        bookings: [] 
      };
    case 'ADD_BOOKING':
      return { 
        ...state, 
        bookings: [action.payload, ...(state.bookings || [])] 
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: (state.bookings || []).map(booking =>
          booking._id === action.payload._id ? action.payload : booking
        )
      };
    default:
      return state;
  }
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const createBooking = async (bookingData) => {
    try {
      const response = await bookingService.createBooking(bookingData);
      // Handle nested response structure
      const booking = response.data?.data || response.data;
      dispatch({ type: 'ADD_BOOKING', payload: booking });
      toast.success('Booking created successfully!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
      throw error;
    }
  };

  const fetchMyBookings = useCallback(async () => {
    dispatch({ type: 'FETCH_BOOKINGS_START' });
    try {
      const response = await bookingService.getMyBookings();
      console.log('Bookings response:', response.data);
      
      // Handle different response structures
      const bookingsData = response.data?.data || response.data || [];
      dispatch({ 
        type: 'FETCH_BOOKINGS_SUCCESS', 
        payload: bookingsData 
      });
    } catch (error) {
      console.error('Fetch bookings error:', error);
      dispatch({ 
        type: 'FETCH_BOOKINGS_FAILURE', 
        payload: error.message 
      });
    }
  }, []);

  const setCurrentBooking = (booking) => {
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
  };

  return (
    <BookingContext.Provider value={{
      ...state,
      createBooking,
      fetchMyBookings,
      setCurrentBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};