"use client";
import React from "react";
import { useAtom } from "jotai";
import { selectedEnvironmentAtom, selectedScenarioAtom } from "lib/atoms"; // Caminho correto para os átomos
import Ambientes from "components/ambientes"; // Certifique-se de que o caminho está correto
import Cenarios from "components/cenarios"; // Certifique-se de que o caminho está correto

const Page = () => {
  // Estado global para o ambiente selecionado
  const [selectedEnvironment] = useAtom(selectedEnvironmentAtom);

  // Estado global para o cenário selecionado
  const [selectedScenario] = useAtom(selectedScenarioAtom);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Passo 1: Seleção de Ambiente */}
      <section>
        <h1 className="text-3xl font-bold text-center mb-8">Selecione um Ambiente</h1>
        <Ambientes />
      </section>

      {/* Passo 2: Seleção de Cenário (apenas se um ambiente foi selecionado) */}
      {selectedEnvironment && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Cenários para o Ambiente: <span className="text-blue-500">{selectedEnvironment}</span>
          </h2>
          <Cenarios environmentId={selectedEnvironment} />
        </section>
      )}

      {/* Resumo dos Selecionados */}
      <section className="mt-12">
        <h3 className="text-xl font-bold text-center mb-4">Resumo da Seleção</h3>
        <div className="text-center">
          <p>
            <strong>Ambiente Selecionado:</strong>{" "}
            {selectedEnvironment || "Nenhum ambiente selecionado"}
          </p>
          <p>
            <strong>Cenário Selecionado:</strong>{" "}
            {selectedScenario || "Nenhum cenário selecionado"}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;