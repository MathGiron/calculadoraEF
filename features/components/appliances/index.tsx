// components/appliances/index.tsx
"use client";
import React from "react";
import { HoverEffect } from "aceternity";
import { Button } from "ui/button";
import { useAtom } from "jotai";
import {
  selectedScenarioAtom,
  selectedAppliancesAtom,
  currentStepAtom,
} from "lib/atoms";
import Image from "next/image";
import { useFetchAppliances } from "hooks";

const Appliances = () => {
  const [selectedScenario] = useAtom(selectedScenarioAtom);
  const [selectedAppliances, setSelectedAppliances] = useAtom(selectedAppliancesAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  const { data: appliances, isLoading, isError } = useFetchAppliances(selectedScenario || "");

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando appliances...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Erro ao buscar appliances.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl text-black font-bold text-center mb-8">
        Aparelhos Disponíveis para o Cenário:{" "}
        
      </h1>

      {appliances && appliances.length > 0 ? (
        <HoverEffect
          items={appliances.map((appliance) => ({
            id: appliance.id,
            title: appliance.name,
            description: `${appliance.hoursPerDay}h/dia`,
            icon: (
              <Image
                src={`/svg/${appliance.svgName}`} // Caminho para o SVG
                alt={appliance.name}
                width={40}
                height={40}
                className="object-contain"
              />
            ),
            powerW: appliance.powerW,
            hoursPerDay: appliance.hoursPerDay,
          }))}
          selectedIds={selectedAppliances}
          onSelectionChange={(newSelectedIds) => setSelectedAppliances(newSelectedIds)}
        />
      ) : (
        <div className="flex justify-center items-center h-20">Nenhum aparelho disponível.</div>
      )}

      {/* Botões Voltar e Próximo */}
      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep("scenarios")} // Retorna à seleção de cenários
        >
          Voltar
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("Aparelhos selecionados:", selectedAppliances);
            // Lógica para avançar para a próxima etapa
          }}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default Appliances;