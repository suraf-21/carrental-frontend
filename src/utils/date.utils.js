import { format, differenceInDays, addDays, isBefore, isAfter } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const calculateDays = (startDate, endDate) => {
  return differenceInDays(new Date(endDate), new Date(startDate));
};

export const getMinDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getMaxDate = (days = 30) => {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
};

export const isDateAvailable = (date, bookings) => {
  const checkDate = new Date(date);
  return !bookings.some(booking => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return isBefore(checkDate, end) && isAfter(checkDate, start);
  });
};