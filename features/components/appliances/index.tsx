// components/appliances/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useFetchAppliances } from "hooks";
import { useAtom } from "jotai";
import { selectedScenarioAtom, selectedAppliancesAtom, currentStepAtom } from "lib/atoms";
import { ApplianceCard } from "aceternity";
import { ProductIndex } from "../produtos";
import { Button } from "ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEnergyCalculation } from "hooks";

const AppliancesPage = () => {
  const [selectedScenario] = useAtom(selectedScenarioAtom);
  const [selectedAppliances, setSelectedAppliances] = useAtom(selectedAppliancesAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [showProduct, setShowProduct] = useState<boolean>(false);
  const [debouncedWatts, setDebouncedWatts] = useState<number>(0);
  const { data: appliances, isLoading, isError, error } = useFetchAppliances(selectedScenario || "");
  const { totalWatts } = useEnergyCalculation();

  useEffect(() => {
    if (showProduct) {
      const timeout = setTimeout(() => {
        setDebouncedWatts(totalWatts);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [totalWatts, showProduct]);

  console.log("AppliancesPage renderizado com scenarioId:", selectedScenario);
  console.log("Estado do useFetchAppliances:", { isLoading, isError, appliances });
  console.log("Total watts calculado:", totalWatts);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando eletrodomésticos...</div>;
  }

  if (isError) {
    console.error("Erro ao buscar appliances:", error);
    const errorMessage = error instanceof Error ? error.message : String(error) || "Erro desconhecido";
    return <div className="flex justify-center items-center h-screen">Erro ao buscar eletrodomésticos: {errorMessage}</div>;
  }

  if (!appliances || appliances.length === 0) {
    console.log("Nenhum appliance disponível para scenarioId:", selectedScenario);
    return <p className="flex justify-center items-center h-screen">Nenhum eletrodoméstico disponível.</p>;
  }

  if (showProduct && debouncedWatts > 0) {
    return <ProductIndex totalWatts={debouncedWatts} />;
  }

  const handleAddAppliance = () => {
    const defaultAppliance = appliances[0];
    setSelectedAppliances([
      ...selectedAppliances,
      {
        id: defaultAppliance.id,
        name: defaultAppliance.name,
        powerW: defaultAppliance.powerW || 0,
        hoursPerDay: defaultAppliance.hoursPerDay || 0,
        quantity: 1,
        svgName: defaultAppliance.svgName || "",
      },
    ]);
    console.log("Novo appliance adicionado:", selectedAppliances);
  };

  const handleProceed = () => {
    console.log("Aparelhos selecionados:", selectedAppliances);
    console.log("Consumo total em W/h:", totalWatts);
    setShowProduct(true);
    setCurrentStep("products");
  };

  const handleBack = () => {
    setCurrentStep("scenarios");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl text-gray-800 font-bold text-center mb-8">
        Selecione os Eletrodomésticos
      </h1>
      {selectedAppliances.length > 0 && (
        <div className="flex justify-center mb-4">
          <p className="text-gray-600 text-sm">
            Consumo diário de energia*: <span className="text-gray-800 font-bold text-lg">{totalWatts.toFixed(0)} W/h</span>
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedAppliances.map((appliance, index) => (
          <ApplianceCard
            key={index}
            index={index}
            appliances={appliances}
          />
        ))}
        <div
          className="flex items-center justify-center w-80 h-80 mx-auto border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all duration-200"
          onClick={handleAddAppliance}
        >
          <PlusIcon className="w-12 h-12 text-gray-500" />
        </div>
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-gray-300  focus:ring-2  transition-all duration-200"
        >
          Voltar
        </Button>
        <Button
          variant="outline"
          onClick={handleProceed}
          disabled={selectedAppliances.length === 0}
          className="border-gray-300 text-gray-80 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default AppliancesPage;