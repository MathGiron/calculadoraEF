"use client";
import React from "react";
import { useFetchEnvironments } from "hooks"; // Importa o hook para buscar environments
import  SingleEvervaultCard  from "aceternity/SingleEvervaultCard"; // Importa o componente SingleEvervaultCard

const Ambientes = () => {
  // Usa o hook useFetchEnvironments para buscar os dados
  const { data: environments, isLoading, isError } = useFetchEnvironments();

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
      <h1 className="text-2xl font-bold text-center mb-8">Ambientes Disponíveis</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Mapeia os ambientes e renderiza um card para cada um */}
        {environments?.map((environment) => (
          <SingleEvervaultCard
            key={environment.id} // Use o ID do ambiente como chave única
            text={environment.name} // Exibe o nome do ambiente no texto do card
            backgroundImg={`/ambientes/${environment.id}.webp`} // Caminho da imagem de fundo
          />
        ))}
      </div>
    </div>
  );
};

export default Ambientes;