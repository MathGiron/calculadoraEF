// components/ambientes/index.tsx
"use client";
import React from "react";
import { useFetchEnvironments } from "hooks"; // Importa o hook para buscar ambientes
import { SingleEvervaultCard } from "aceternity"; // Importa o componente SingleEvervaultCard
import { Button } from "ui/button"; // Importa o componente Button
import { useAtom } from "jotai";
import {
  selectedEnvironmentAtom,
  currentStepAtom,
} from "lib/atoms"; // Importa os átomos

const Ambientes = () => {
  // Usa o hook useFetchEnvironments para buscar os dados dos ambientes
  const { data: environments, isLoading, isError } = useFetchEnvironments();

  // Estado global para o ambiente selecionado
  const [selectedEnvironment, setSelectedEnvironment] = useAtom(selectedEnvironmentAtom);

  // Estado global para a etapa atual
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  // Se estiver carregando, exibe um indicador de carregamento
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se ocorrer um erro, exibe uma mensagem de erro
  if (isError) {
    return <div className="flex justify-center items-center h-screen">Erro ao buscar ambientes.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Selecione um Ambiente</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Mapeia os ambientes e renderiza um card para cada um */}
        {environments?.map((environment) => (
          <SingleEvervaultCard
            key={environment.id} // Use o ID do ambiente como chave única
            text={environment.name} // Exibe o nome do ambiente no texto do card
            backgroundImg={`/ambientes/${environment.id}.webp`} // Caminho da imagem de fundo
            selected={selectedEnvironment === environment.id} // Define se o card deve ter borda azul
            onClick={() => setSelectedEnvironment(environment.id)} // Salva o ID do ambiente selecionado
          />
        ))}
      </div>

      {/* Botão Próximo */}
      {selectedEnvironment && (
        <div className="flex justify-center mt-8">
          <Button
            variant="default"
            onClick={() => setCurrentStep("scenarios")} // Avança para a próxima etapa
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
};

export default Ambientes;