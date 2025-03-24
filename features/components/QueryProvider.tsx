"use client"; // Indica que este é um componente do lado do cliente

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Cria uma instância do QueryClient
const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}