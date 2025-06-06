// types.ts
export interface Response {
  id: string;
  name: string;
  powerW?: number;
  hoursPerDay?: number;
  svgName: string;
}

export interface Variant {
  id: string;
  price: string;
  inventoryQuantity: number;
}

export interface Produto {
  id: string;
  title: string;
  image?: string;
  variants: Variant[];
  metafields?: { key: string; value: string }[];
  capacidade?: number;
}

export interface CalculoResponse {
  consumo_informado: number;
  produtos: Produto[];
}

export interface Appliance {
  id: string;
  name: string;
  powerW: number;
  hoursPerDay: number;
  svgName?: string;
  icon?: React.ReactNode;
  description?: string | React.ReactNode;
}