// components/produtos/index.tsx
"use client";
import React from "react";
import { useFetchProducts } from "hooks";
import { ProductCard } from "aceternity"; // Assumindo que "aceternity" é o caminho correto
import { Button } from "ui/button";
import { useAtom } from "jotai";
import { currentStepAtom } from "lib/atoms";

interface ProductIndexProps {
  totalWatts: number;
}

export const ProductIndex = ({ totalWatts }: ProductIndexProps) => {
  console.log("ProductIndex renderizado com totalWatts:", totalWatts);
  const { data: products, isLoading, isError, error } = useFetchProducts(totalWatts);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  console.log("Estado do useFetchProducts:", { isLoading, isError, products });

  if (isLoading) {
    console.log("Está no estado de carregamento...");
    return <div className="text-center">Carregando produtos recomendados...</div>;
  }

  if (isError) {
    console.error("Erro no fetch do cálculo:", error);
    return (
      <div className="text-center text-red-500">
        Erro ao buscar produtos recomendados: {error?.message || "Erro desconhecido"}
      </div>
    );
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    console.log("Nenhum produto válido retornado do cálculo:", products);
    return <p className="text-center">Nenhum produto recomendado disponível.</p>;
  }

  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id, product])).values()
  );

  const recommendedProducts = products.map((product) => {
    if (!product || !product.variants || !Array.isArray(product.variants)) {
      console.error("Produto inválido ou sem variants:", product);
      return null; // Pula produtos inválidos
    }
    const availableVariant = product.variants.find(v => v.inventoryQuantity > 0) || product.variants[0];
    return {
      id: product.id,
      title: product.title,
      image: product.image,
      price: availableVariant.price,
      inventoryQuantity: availableVariant.inventoryQuantity,
      purchaseLink: `https://ecoflow-timber.com.br/products/${product.id}`,
    };
  }).filter(Boolean); // Remove nulls de produtos inválidos

  console.log("Produtos recomendados preparados:", recommendedProducts);

  const handleBackToStart = () => {
    setCurrentStep("environments"); // Volta ao início
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl text-black font-bold text-center mb-4">
        Produtos Recomendados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={handleBackToStart}>
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
};

export default ProductIndex;