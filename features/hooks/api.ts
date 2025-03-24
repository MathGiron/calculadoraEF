
// Função para criar headers padrão
export const createHeaders = () => {
    const myHeaders = new Headers();
    return myHeaders;
  };
  
  export const BASE_URL = "http://172.16.99.182:8081";
  
  // Função genérica para fazer requisições GET
 export async function fetchData<T>(url: string): Promise<T> {
    const headers = createHeaders();
    const requestOptions: RequestInit = {
      method: "GET",
      headers,
      redirect: "follow",
    };
  
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }