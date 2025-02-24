export const calculateRentalCost = (vehicle, startDate, endDate) => {
  if (endDate < startDate) {
    return 0;
  }

  const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
  return days * vehicle.dailyRate;
};
