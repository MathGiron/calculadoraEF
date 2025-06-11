"use client";
import React from "react";
import { useAtom } from "jotai";
import { selectedAppliancesAtom } from "lib/atoms";
import { Appliance } from "hooks";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/components/ui/select";

interface ApplianceCardProps {
  index: number;
  appliances: Appliance[];
}

export const ApplianceCard = ({ index, appliances }: ApplianceCardProps) => {
  const [selectedAppliances, setSelectedAppliances] = useAtom(selectedAppliancesAtom);
  const currentAppliance = selectedAppliances[index];

  const handleUpdate = (field: keyof typeof currentAppliance, value: string | number) => {
    const updatedAppliances = [...selectedAppliances];
    if (field === "id") {
      const selected = appliances.find((a) => a.id === value);
      updatedAppliances[index] = {
        ...updatedAppliances[index],
        id: value as string,
        name: selected?.name || "",
        powerW: selected?.powerW || 0,
        hoursPerDay: selected?.hoursPerDay || 0,
        svgName: selected?.svgName || "",
      };
    } else {
      updatedAppliances[index] = {
        ...updatedAppliances[index],
        [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
      };
    }
    setSelectedAppliances(updatedAppliances);
    console.log("Appliance atualizado:", updatedAppliances[index]);
  };

  const handleRemove = () => {
    const updatedAppliances = selectedAppliances.filter((_, i) => i !== index);
    setSelectedAppliances(updatedAppliances);
    console.log("Appliance removido, índice:", index);
  };

  return (
    <div className="w-80 mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <Select
          value={currentAppliance.id}
          onValueChange={(value) => handleUpdate("id", value)}
        >
          <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800 text-lg font-semibold hover:bg-gray-100 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/50">
            <SelectValue placeholder="Selecione um eletrodoméstico" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {appliances.map((appliance) => (
              <SelectItem
                key={appliance.id}
                value={appliance.id}
                className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
              >
                <div className="flex items-center">
                  {appliance.svgName && (
                    <Image
                      src={`/svg/${appliance.svgName}`}
                      alt={appliance.name}
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                  )}
                  {appliance.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={handleRemove}
          className="ml-2 text-gray-600 hover:text-blue-800 transition-colors duration-200"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Potência (Watts)</label>
          <input
            type="number"
            value={currentAppliance.powerW}
            onChange={(e) => handleUpdate("powerW", e.target.value)}
            min="0"
            className="mt-2 p-1 block w-full rounded-md border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/50 hover:bg-gray-100 transition-all duration-200 sm:text-sm"
            placeholder="Ex.: 1200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Horas por Dia</label>
          <input
            type="number"
            value={currentAppliance.hoursPerDay}
            onChange={(e) => handleUpdate("hoursPerDay", e.target.value)}
            min="0"
            max="24"
            step="0.1"
            className="mt-2 p-1 block w-full rounded-md border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/50 hover:bg-gray-100 transition-all duration-200 sm:text-sm"
            placeholder="Ex.: 4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Quantidade</label>
          <input
            type="number"
            value={currentAppliance.quantity}
            onChange={(e) => handleUpdate("quantity", e.target.value)}
            min="1"
            className="mt-2 p-1 block w-full rounded-md border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/50 hover:bg-gray-100 transition-all duration-200 sm:text-sm"
            placeholder="Ex.: 1"
          />
        </div>
      </div>
    </div>
  );
};