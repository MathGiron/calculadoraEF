// components/appliances/card-hover-effect.tsx
"use client";
import { cn } from "lib";
import { useState, useEffect } from "react";
import { Input } from "@/features/components/ui/input";
import { useEnergyCalculation } from "hooks";
import { Appliance } from "hooks";

export const HoverEffect = ({
  items,
  className,
  selectedIds,
  onSelectionChange,
  onTotalKwhChange,
  onTotalWattsPerHourChange,
}: {
  items: Appliance[];
  className?: string;
  selectedIds: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onTotalKwhChange?: (totalKwh: number) => void;
  onTotalWattsPerHourChange?: (totalWattsPerHour: number) => void;
}) => {
  const [powerValues, setPowerValues] = useState<{ [key: string]: number }>(
    Object.fromEntries(items.map((item) => [item.id, item.powerW]))
  );
  const [hoursValues, setHoursValues] = useState<{ [key: string]: number }>(
    Object.fromEntries(items.map((item) => [item.id, item.hoursPerDay]))
  );

  const { calculateKwh, calculateTotalKwh, calculateTotalWattsPerHour } = useEnergyCalculation();

  const handleCardSelection = (id: string) => {
    const isSelected = selectedIds.includes(id);
    const newSelectedIds = isSelected
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (selectedIds.length === items.length) {
        onSelectionChange([]);
      } else {
        onSelectionChange(items.map((item) => item.id));
      }
    }
  };

  const handleInputChange = (
    id: string,
    field: "powerW" | "hoursPerDay",
    value: string
  ) => {
    const numericValue = value ? parseFloat(value) : 0;
    if (field === "powerW") {
      setPowerValues((prev) => ({ ...prev, [id]: numericValue }));
    } else if (field === "hoursPerDay") {
      setHoursValues((prev) => ({ ...prev, [id]: numericValue }));
    }
  };

  const customValues = items.reduce((acc, item) => {
    acc[item.id] = {
      powerW: powerValues[item.id] ?? item.powerW,
      hoursPerDay: hoursValues[item.id] ?? item.hoursPerDay,
    };
    return acc;
  }, {} as { [key: string]: { powerW: number; hoursPerDay: number } });

  const totalKwh = calculateTotalKwh(selectedIds, customValues);
  const totalWattsPerHour = calculateTotalWattsPerHour(selectedIds, customValues);

  useEffect(() => {
    if (onTotalKwhChange) {
      onTotalKwhChange(totalKwh);
    }
    if (onTotalWattsPerHourChange) {
      onTotalWattsPerHourChange(totalWattsPerHour);
    }
  }, [totalKwh, totalWattsPerHour, onTotalKwhChange, onTotalWattsPerHourChange]);

  return (
    <div>
      
      <div className="flex justify-end mb-4">
        <button
          className="text-sm text-blue-500 hover:underline"
          onClick={handleSelectAll}
        >
          {selectedIds.length === items.length ? "Desmarcar Todos" : "Marcar Todos"}
        </button>
      </div>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2", className)}>
        {items.map((item) => {
          const currentPower = powerValues[item.id] ?? item.powerW;
          const currentHours = hoursValues[item.id] ?? item.hoursPerDay;
          const kwh = calculateKwh(currentPower, currentHours);

          return (
            <label
              key={item.id}
              className="relative block p-2 h-full w-full cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleCardSelection(item.id)}
                className="hidden"
              />
              <Card isSelected={selectedIds.includes(item.id)}>
                <div className="mb-2 flex justify-between items-center">
                  <div>{item.icon}</div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={powerValues[item.id]}
                        onChange={(e) => handleInputChange(item.id, "powerW", e.target.value)}
                        className="w-24 h-8 text-zinc-500 text-sm p-2 border-1 rounded-md"
                      />
                      <span className="text-zinc-500 text-sm">W</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={hoursValues[item.id]}
                        onChange={(e) => handleInputChange(item.id, "hoursPerDay", e.target.value)}
                        className="w-24 h-8 text-zinc-500 text-sm p-2 border-1 rounded-md"
                      />
                      <span className="text-zinc-500 text-sm">h/dia</span>
                    </div>
                  </div>
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <div className="mt-2 text-black text-sm">
                  Consumo: {kwh.toFixed(2)} kWh/dia
                </div>
              </Card>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
  isSelected,
}: {
  className?: string;
  children: React.ReactNode;
  isSelected: boolean;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-transparent border relative z-20",
        isSelected ? "border-slate-700 border-2" : "border",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-5 text-left">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-black font-bold tracking-wide", className)}>{children}</h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn("mt-2 text-zinc-400 tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};