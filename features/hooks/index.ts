// hooks/index.ts
export * from "./types";
export * from "./api";
export * from "./useEnergyCalculation";
import { useQuery } from "@tanstack/react-query";
import { Response, Produto, CalculoResponse, fetchData, createHeaders, BASE_URL } from ".";
import { Appliance } from "hooks";

const transformToAppliance = (response: Response): Appliance => ({
  id: response.id,
  name: response.name,
  powerW: response.powerW ?? 0,
  hoursPerDay: response.hoursPerDay ?? 0,
  svgName: response.svgName,
});

export function useFetchAppliances(scenarioId: string) {
  return useQuery({
    queryKey: ["appliances", scenarioId],
    queryFn: async () => {
      const data = await fetchData<Response[]>(`${BASE_URL}/appliances?scenarioId=${scenarioId}`);
      return data.map(transformToAppliance);
    },
    onError: (error) => console.error("Erro ao buscar appliances:", error),
    retry: 1,
  });
}

export function useFetchScenarios(environmentId: string) {
  return useQuery({
    queryKey: ["scenarios", environmentId],
    queryFn: () => fetchData<Response[]>(`${BASE_URL}/scenarios?environmentId=${environmentId}`),
    onError: (error) => console.error("Erro ao buscar scenarios:", error),
    retry: 1,
  });
}

export function useFetchEnvironments() {
  return useQuery({
    queryKey: ["environments"],
    queryFn: async () => {
      const data = await fetchData<Response[]>(`${BASE_URL}/environments`);
      const filteredData = data.filter((environment) => environment.id !== "others");
      console.log("Environments filtrados (sem 'others'):", filteredData);
      return filteredData;
    },
    onError: (error) => console.error("Erro ao buscar environments:", error),
    retry: 1,
  });
}

export function useFetchProducts(watts?: number) {
  console.log("useFetchProducts chamado com watts:", watts);
  return useQuery<Produto[], Error>({
    queryKey: ["calculo", watts],
    queryFn: async () => {
      const url = `${BASE_URL}/calculo${watts ? `?wh=${watts}` : ""}`;
      console.log("Buscando cálculo na URL:", url);
      const data = await fetchData<CalculoResponse>(url);
      console.log("Resposta completa do cálculo:", data);
      console.log("Produtos extraídos:", data.produtos);
      return data.produtos;
    },
    onError: (error) => console.error("Erro ao buscar cálculo:", error),
    retry: 1,
    enabled: !!watts && watts > 0,
  });
}

export function useFetchProductImages() {
  return useQuery<Produto[], Error>({
    queryKey: ["productImages"],
    queryFn: async () => {
      const url = `${BASE_URL}/produtos`;
      console.log("Buscando imagens na URL:", url);
      const data = await fetchData<Produto[]>(url);
      console.log("Produtos com imagens recebidos:", data);
      return data;
    },
    onError: (error) => console.error("Erro ao buscar imagens:", error),
    retry: 1,
  });
}

export async function reloadProducts(): Promise<void> {
  try {
    const headers = createHeaders();
    const requestOptions: RequestInit = {
      method: "GET",
      headers,
      redirect: "follow",
    };
    const response = await fetch(`${BASE_URL}/reload-products`, requestOptions);
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    console.log("Produtos recarregados com sucesso");
  } catch (error) {
    console.error("Erro ao recarregar products:", error);
  }
}