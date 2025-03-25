// components/cenarios/index.tsx
"use client";
import React from "react";
import { useFetchScenarios } from "hooks"; // Importa o hook para buscar cenários
import { SingleEvervaultCard } from "aceternity"; // Importa o componente SingleEvervaultCard
import { useAtom } from "jotai";
import { selectedScenarioAtom } from "lib/atoms"; // Importa o átomo para o cenário selecionado

const Cenarios = ({ environmentId }: { environmentId: string }) => {
  // Usa o hook useFetchScenarios para buscar os dados dos cenários
  const { data: scenarios, isLoading, isError } = useFetchScenarios(environmentId);

  // Estado global para o cenário selecionado
  const [selectedScenario, setSelectedScenario] = useAtom(selectedScenarioAtom);

  // Se estiver carregando, exibe um indicador de carregamento
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se ocorrer um erro, exibe uma mensagem de erro
  if (isError) {
    return <div className="flex justify-center items-center h-screen">Erro ao buscar cenários.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Cenários para o Ambiente: <span className="text-blue-500">{environmentId}</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Mapeia os cenários e renderiza um card para cada um */}
        {scenarios?.map((scenario) => (
          <SingleEvervaultCard
            key={scenario.id} // Use o ID do cenário como chave única
            text={scenario.name} // Exibe o nome do cenário no texto do card
            backgroundImg={`/cenarios/${scenario.id}.webp`} // Caminho da imagem de fundo
            selected={selectedScenario === scenario.id} // Define se o card deve ter borda azul
            onClick={() => setSelectedScenario(scenario.id)} // Salva o ID do cenário selecionado
          />
        ))}
      </div>
    </div>
  );
};

export default Cenarios;