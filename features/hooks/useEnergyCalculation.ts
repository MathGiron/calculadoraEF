// hooks/useEnergyCalculation.ts
export function useEnergyCalculation() {
  const calculateKwh = (powerW: number, hoursPerDay: number): number => {
    return (powerW * hoursPerDay) / 1000; // kWh/dia
  };

  const calculateWattsPerHour = (powerW: number): number => {
    return powerW; // W/h (potência por hora)
  };

  const calculateTotalKwh = (
    selectedIds: string[],
    customValues: { [key: string]: { powerW: number; hoursPerDay: number } }
  ): number => {
    return selectedIds.reduce((total, id) => {
      const item = customValues[id];
      if (!item) return total;
      const { powerW, hoursPerDay } = item;
      return total + calculateKwh(powerW, hoursPerDay);
    }, 0);
  };

  const calculateTotalWattsPerHour = (
    selectedIds: string[],
    customValues: { [key: string]: { powerW: number; hoursPerDay: number } }
  ): number => {
    return selectedIds.reduce((total, id) => {
      const item = customValues[id];
      if (!item) return total;
      const { powerW } = item;
      return total + calculateWattsPerHour(powerW);
    }, 0);
  };

  return { calculateKwh, calculateTotalKwh, calculateWattsPerHour, calculateTotalWattsPerHour };
}