"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useFetchHighCapacityProducts, useFetchProductImages } from "hooks";
import { Button } from "@/features/components/ui/button";
import { ProductCard } from "aceternity";
import { useAtom } from "jotai";
import { currentStepAtom, totalWattsAtom } from "lib";

interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  inventoryQuantity: number;
  purchaseLink?: string;
}

const ErrorPage = () => {
  
  const [totalWatts] = useAtom(totalWattsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const { data: recommendedProducts, isLoading: isProductsLoading, isError: isProductsError } = useFetchHighCapacityProducts();
  const { data: productImages, isLoading: isImagesLoading, isError: isImagesError } = useFetchProductImages();

    const handleBackToStart = () => {
    setCurrentStep("environments");
  };

  // Combina produtos com imagens
  const products: Product[] =
    recommendedProducts
      ?.filter((product) => product.capacidade && product.capacidade >= 3000)
      .slice(0, 3)
      .map((product) => {
        const imageData = productImages?.find((img) => img.id === product.id);
        return {
          id: product.id,
          title: product.title,
          image: imageData?.image || "/placeholder-image.png",
          price: product.variants[0]?.price || "0.00",
          inventoryQuantity: product.variants[0]?.inventoryQuantity ?? 0,
          purchaseLink: product.metafields?.find((m) => m.key === "purchaseLink")?.value,
        };
      }) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl text-gray-800 font-bold text-center mb-6">
          Consumo Muito Alto
        </h1>
        <p className="text-base text-gray-600 text-center mb-8">
          O consumo de{" "}
          <span className="font-bold text-gray-800">{totalWatts.toFixed(0)} W/h</span>{" "}
          é muito alto, mas uma boa opção com alta capacidade são os produtos abaixo:
        </p>
        {isProductsLoading || isImagesLoading ? (
          <p className="text-center text-gray-600">Carregando recomendações...</p>
        ) : isProductsError || isImagesError ? (
          <p className="text-center text-gray-600">Erro ao carregar recomendações.</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Nenhum produto recomendado disponível.</p>
        )}
        <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={handleBackToStart}>
                  Voltar ao Início
                </Button>
              </div>
      </div>
    </div>
  );
};

export default ErrorPage;