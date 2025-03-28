// components/cenarios/index.tsx
"use client";
import React from "react";
import { useFetchScenarios } from "hooks"; // Hook para buscar cenários
import { SingleEvervaultCard } from "aceternity"; // Card de cenários
import { Button } from "ui/button"; // Botão
import { useAtom } from "jotai";
import {
  selectedScenarioAtom,
  currentStepAtom,
} from "lib/atoms"; // Átomos globais

const Cenarios = ({ environmentId }: { environmentId: string }) => {
  // Estado global para o cenário selecionado
  const [selectedScenario, setSelectedScenario] = useAtom(selectedScenarioAtom);

  // Estado global para a etapa atual
  const [, setCurrentStep] = useAtom(currentStepAtom);

  // Hook para buscar cenários
  const { data: scenarios, isLoading, isError } = useFetchScenarios(environmentId);

  // Se estiver carregando, exibe um indicador de carregamento
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se ocorrer um erro, exibe uma mensagem de erro
  if (isError) {
    return <div className="flex justify-center items-center h-screen">Erro ao buscar cenários.</div>;
  }

  // Define o número de colunas com base na quantidade de cenários
  const gridCols = scenarios.length === 4 ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl text-black  font-bold text-center mb-8">
        Cenários para o Ambiente: 
      </h1>

      {/* Grid Centralizado */}
      <div
        className={`grid ${gridCols} gap-6 justify-center max-w-4xl mx-auto`}
      >
        {/* Mapeia os cenários e renderiza um card para cada um */}
        {scenarios?.map((scenario) => (
          <div key={scenario.id} className="flex justify-center">
            <SingleEvervaultCard
              text={scenario.name} // Exibe o nome do cenário no texto do card
              backgroundImg={`/cenarios/${scenario.id}.webp`} // Caminho da imagem de fundo
              selected={selectedScenario === scenario.id} // Define se o card deve ter borda azul
              onClick={() => setSelectedScenario(scenario.id)} // Salva o ID do cenário selecionado
            />
          </div>
        ))}
      </div>

      {/* Botões Voltar e Próximo */}
      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep("environments"); // Retorna à seleção de ambientes
          }}
        >
          Voltar
        </Button>
        {selectedScenario && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep("appliances")} // Avança para a próxima etapa
          >
            Próximo
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cenarios;