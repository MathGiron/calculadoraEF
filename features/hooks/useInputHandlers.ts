// hooks/useInputHandlers.ts
import { useState } from "react";

export function useInputHandlers<T extends string | number>(initialValues: Record<string, T>) {
  const [values, setValues] = useState<Record<string, T>>(initialValues);

  // Função genérica para lidar com mudanças nos inputs
  const handleInputChange = (id: string, value: string) => {
    const numericValue = value ? (parseFloat(value) as T) : (0 as T);
    setValues((prev) => ({ ...prev, [id]: numericValue }));
  };

  return { values, handleInputChange };
}