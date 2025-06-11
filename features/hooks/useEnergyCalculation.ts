// hooks/useEnergyCalculation.ts
import { useAtom } from "jotai";
import { selectedAppliancesAtom } from "lib/atoms";

export function useEnergyCalculation() {
  const [selectedAppliances] = useAtom(selectedAppliancesAtom);

  const calculateKwh = (powerW: number, hoursPerDay: number, quantity: number): number => {
    return (powerW * hoursPerDay * quantity) / 1000; // kWh/dia
  };

  const calculateWattsPerHour = (powerW: number, hoursPerDay: number, quantity: number): number => {
    return powerW * hoursPerDay * quantity; // Wh/dia
  };

  const totalKwh = selectedAppliances.reduce((total, appliance) => {
    return total + calculateKwh(appliance.powerW, appliance.hoursPerDay, appliance.quantity);
  }, 0);

  const totalWatts = selectedAppliances.reduce((total, appliance) => {
    return total + calculateWattsPerHour(appliance.powerW, appliance.hoursPerDay, appliance.quantity);
  }, 0);

  console.log("Total kWh calculado:", totalKwh);
  console.log("Total watts calculado:", totalWatts);

  return { calculateKwh, calculateWattsPerHour, totalKwh, totalWatts };
}