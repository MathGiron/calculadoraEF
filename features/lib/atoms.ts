// lib/atoms.ts
import { atom } from "jotai";

export const selectedEnvironmentAtom = atom<string | null>(null);
export const selectedScenarioAtom = atom<string | null>(null);
export const currentStepAtom = atom<"environments" | "scenarios" | "appliances" | "products">("environments");
export const selectedCardAtom = atom<string | null>(null);
export const totalWattsAtom = atom<number>(0);

export interface SelectedAppliance {
  id: string;
  name: string;
  powerW: number;
  hoursPerDay: number;
  quantity: number;
  svgName?: string;
}

export const selectedAppliancesAtom = atom<SelectedAppliance[]>([]);