// lib/atoms.ts
import { atom } from "jotai";

// Atom para o ambiente selecionado
export const selectedEnvironmentAtom = atom<string | null>(null);

// Atom para o cenário selecionado
export const selectedScenarioAtom = atom<string | null>(null);

// Atom para controlar a etapa atual (ambientes ou cenários)
export const currentStepAtom = atom<"environments" | "scenarios">("environments");

// Atom para o card selecionado
export const selectedCardAtom = atom<string | null>(null);

// Atom para as horas personalizadas por aparelho
export const applianceHoursAtom = atom<Record<string, number>>({});

// Atom para os watts personalizados por aparelho
export const appliancePowerAtom = atom<Record<string, number>>({});

// Função para atualizar as horas de um aparelho específico
export const setApplianceHoursAtom = atom(
  null,
  (get, set, { applianceId, hours }: { applianceId: string; hours: number }) => {
    set(applianceHoursAtom, (prev) => ({
      ...prev,
      [applianceId]: hours,
    }));
  }
);

// Função para atualizar os watts de um aparelho específico
export const setAppliancePowerAtom = atom(
  null,
  (get, set, { applianceId, power }: { applianceId: string; power: number }) => {
    set(appliancePowerAtom, (prev) => ({
      ...prev,
      [applianceId]: power,
    }));
  }
);