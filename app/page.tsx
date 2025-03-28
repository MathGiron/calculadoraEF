// page.tsx
"use client";
import React from "react";
import { useAtom } from "jotai";
import { currentStepAtom, selectedEnvironmentAtom } from "lib"; // Importa os átomos
import Ambientes from "components/ambientes"; // Importa o componente de Ambientes
import Cenarios from "components/cenarios"; // Importa o componente de Cenários
import Appliances from "components/appliances"; // Importa o componente de Appliances

const Page = () => {
  // Estado global para a etapa atual
  const [currentStep] = useAtom(currentStepAtom);

  // Estado global para o ambiente selecionado
  const [selectedEnvironment] = useAtom(selectedEnvironmentAtom);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-8">
      {/* Renderiza Ambientes, Cenários ou Appliances com base na etapa atual */}
      {currentStep === "environments" ? (
        <Ambientes />
      ) : currentStep === "scenarios" ? (
        <Cenarios environmentId={selectedEnvironment || ""} />
      ) : (
        <Appliances />
      )}
    </div>
  );
};

export default Page;