export const calculateBookingPrice = (car, startDate, endDate, withDriver = false) => {
  const days = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  ) || 1;
  
  const basePrice = days * car.pricePerDay;
  const driverFee = withDriver && car.withDriver ? days * (car.driverPricePerDay || 0) : 0;
  
  return {
    days,
    basePrice,
    driverFee,
    total: basePrice + driverFee
  };
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};