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
  const [, setCurrentStep] = useAtom(currentStepAtom);

  // Se estiver carregando, exibe um indicador de carregamento
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se ocorrer um erro, exibe uma mensagem de erro
  if (isError) {
    return <div className="flex justify-center items-center h-screen">Erro ao buscar ambientes.</div>;
  }

  // Define o número de colunas com base na quantidade de cards
  const gridCols = environments.length === 4 ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-black font-bold text-center mb-8">Estou escolhendo um gerador solar para :</h1>

      {/* Grid Centralizado */}
      <div
        className={`grid ${gridCols} gap-15 justify-center max-w-4xl mx-auto`}
      >
        {/* Mapeia os ambientes e renderiza um card para cada um */}
        {environments?.map((environment) => (
          <div key={environment.id} className="flex justify-center">
            <SingleEvervaultCard
              text={environment.name} // Exibe o nome do ambiente no texto do card
              backgroundImg={`/ambientes/${environment.id}.webp`} // Caminho da imagem de fundo
              selected={selectedEnvironment === environment.id} // Define se o card deve ter borda azul
              onClick={() => setSelectedEnvironment(environment.id)} // Salva o ID do ambiente selecionado
            />
          </div>
        ))}
      </div>

      {/* Botão Próximo */}
      {selectedEnvironment && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
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