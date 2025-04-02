// components/appliances/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { HoverEffect } from "aceternity";
import { ProductIndex } from "../produtos";
import { Button } from "ui/button";
import { useAtom } from "jotai";
import {
  selectedScenarioAtom,
  selectedAppliancesAtom,
  currentStepAtom,
} from "lib/atoms";
import Image from "next/image";
import { useFetchAppliances } from "hooks";
import { Appliance } from "hooks";

const Appliances = () => {
  const [selectedScenario] = useAtom(selectedScenarioAtom);
  const [selectedAppliances, setSelectedAppliances] = useAtom(selectedAppliancesAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [totalKwh, setTotalKwh] = useState<number>(0);
  const [totalWattsPerHour, setTotalWattsPerHour] = useState<number>(0);
  const [debouncedWatts, setDebouncedWatts] = useState<number>(0);
  const [showProduct, setShowProduct] = useState<boolean>(false);

  const { data: appliances, isLoading, isError } = useFetchAppliances(selectedScenario || "");

  useEffect(() => {
    if (showProduct) {
      const timeout = setTimeout(() => {
        setDebouncedWatts(totalWattsPerHour);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [totalWattsPerHour, showProduct]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando appliances...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Erro ao buscar appliances.</div>;
  }

  const handleTotalKwhChange = (total: number) => {
    setTotalKwh(total);
  };

  const handleTotalWattsPerHourChange = (total: number) => {
    console.log("totalWattsPerHour atualizado:", total);
    setTotalWattsPerHour(total);
  };

  const handleNextClick = () => {
    console.log("Aparelhos selecionados:", selectedAppliances);
    console.log("Consumo total em kWh/dia:", totalKwh);
    console.log("Consumo total em W/h:", totalWattsPerHour);
    setShowProduct(true);
  };

  // Se showProduct for true, renderiza apenas o ProductIndex
  if (showProduct && debouncedWatts > 0) {
    return <ProductIndex totalWatts={debouncedWatts} />;
  }

  // Caso contrário, renderiza a interface de seleção de aparelhos
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl text-black font-bold text-center mb-8">
        Aparelhos Disponíveis para o Cenário:{" "}
        
      </h1>

      {selectedAppliances.length > 0 && (
        <div className="flex justify-center mb-4">
          <p className="text-black text-sm">
          Consumo diário de energia*:  <span className=" text-black font-bold text-lg "> {totalWattsPerHour.toFixed(0)} W/h</span>
          </p>
        </div>
      )}

      {appliances && appliances.length > 0 ? (
        <HoverEffect
          items={appliances.map((appliance: Appliance) => ({
            id: appliance.id,
            name: appliance.name,
            description: `${appliance.hoursPerDay}h/dia`,
            icon: appliance.svgName ? (
              <Image
                src={`/svg/${appliance.svgName}`}
                alt={appliance.name}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : null,
            powerW: appliance.powerW,
            hoursPerDay: appliance.hoursPerDay,
          }))}
          selectedIds={selectedAppliances}
          onSelectionChange={(newSelectedIds) => setSelectedAppliances(newSelectedIds)}
          onTotalKwhChange={handleTotalKwhChange}
          onTotalWattsPerHourChange={handleTotalWattsPerHourChange}
        />
      ) : (
        <div className="flex justify-center items-center h-20">Nenhum aparelho disponível.</div>
      )}

      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep("scenarios")}
        >
          Voltar
        </Button>
        <Button
          variant="outline"
          onClick={handleNextClick}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default Appliances;