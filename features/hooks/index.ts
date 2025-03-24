export * from "./types"
export * from "./api"
import { useQuery } from "@tanstack/react-query";
import { Response, Produto, fetchData, createHeaders, BASE_URL } from ".";

// Hooks para buscar dados usando TanStack Query
export function useFetchAppliances(scenarioId: string) {
  return useQuery({
    queryKey: ["appliances", scenarioId],
    queryFn: () => fetchData<Response[]>(`${BASE_URL}/appliances?scenarioId=${scenarioId}`),
    onError: (error) => console.error("Erro ao buscar appliances:", error),
    retry: 1, // Tentar novamente apenas uma vez em caso de falha
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
    queryFn: () => fetchData<Response[]>(`${BASE_URL}/environments`),
    onError: (error) => console.error("Erro ao buscar environments:", error),
    retry: 1,
  });
}

//----------SESSÃO DE PRODUTOS----------\\

export function useFetchProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchData<Produto[]>(`${BASE_URL}/products`),
    onError: (error) => console.error("Erro ao buscar products:", error),
    retry: 1,
  });
}

// Função para recarregar produtos (não usa TanStack Query diretamente)
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