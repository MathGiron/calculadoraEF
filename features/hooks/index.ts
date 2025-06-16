export *from "./types";
export *from "./api";
export *from "./useEnergyCalculation";
import { useQuery } from "@tanstack/react-query";
import { Response, Produto, CalculoResponse, fetchData, createHeaders, BASE_URL } from ".";
import { Appliance } from "./types";

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
    retry: 1,
  });
}

export function useFetchScenarios(environmentId: string) {
  return useQuery({
    queryKey: ["scenarios", environmentId],
    queryFn: () => fetchData<Response[]>(`${BASE_URL}/scenarios?environmentId=${environmentId}`),
    retry: 1,
  });
}

export function useFetchEnvironments() {
  return useQuery({
    queryKey: ["environments"],
    queryFn: async () => {
      const data = await fetchData<Response[]>(`${BASE_URL}/environments`);
      return data.filter((environment) => environment.id !== "others");
    },
    retry: 1,
  });
}

export function useFetchProducts(watts?: number) {
  return useQuery<Produto[], Error>({
    queryKey: ["calculo", watts],
    queryFn: async () => {
      if (!watts || watts <= 0) return [];
      const url = `${BASE_URL}/calculo?wh=${watts}`;
      try {
        const data = await fetchData<CalculoResponse>(url);
        return data.produtos || [];
      } catch (error) {
        return [];
      }
    },
    retry: 1,
    enabled: !!watts && watts > 0,
  });
}

export function useFetchHighCapacityProducts() {
  const FIXED_WATTS = 3500;
  return useQuery<Produto[], Error>({
    queryKey: ["highCapacityProducts", FIXED_WATTS],
    queryFn: async () => {
      const url = `${BASE_URL}/calculo?wh=${FIXED_WATTS}`;
      try {
        const data = await fetchData<CalculoResponse>(url);
        return data.produtos || [];
      } catch (error) {
        return [];
      }
    },
    retry: 1,
  });
}
export function useFetchProductImages() {
  return useQuery<Produto[], Error>({
    queryKey: ["productImages"],
    queryFn: async () => {
      const url = `${BASE_URL}/produtos`;
      const data = await fetchData<Produto[]>(url);
      return data;
    },
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
  } catch (error) {}
}