// components/produtos/index.tsx
"use client";
import React from "react";
import { useFetchProducts, useFetchProductImages } from "hooks";
import { ProductCard } from "aceternity";
import { Button } from "ui/button";
import { useAtom } from "jotai";
import { currentStepAtom } from "lib/atoms";

interface ProductIndexProps {
  totalWatts: number;
}

export const ProductIndex = ({ totalWatts }: ProductIndexProps) => {
  console.log("ProductIndex renderizado com totalWatts:", totalWatts);
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useFetchProducts(totalWatts);
  const { data: productImages, isLoading: isLoadingImages, isError: isErrorImages, error: errorImages } = useFetchProductImages();
  const [, setCurrentStep] = useAtom(currentStepAtom);

  console.log("Estado do useFetchProducts:", { isLoadingProducts, isErrorProducts, products });
  console.log("Estado do useFetchProductImages:", { isLoadingImages, isErrorImages, productImages });

  if (isLoadingProducts || isLoadingImages) {
    console.log("Está no estado de carregamento...");
    return <div className="text-center">Carregando produtos recomendados...</div>;
  }

  if (isErrorProducts || isErrorImages) {
    console.error("Erro no fetch:", { errorProducts, errorImages });
    return (
      <div className="text-center text-red-500">
        Erro ao buscar produtos recomendados: {(errorProducts || errorImages)?.message || "Erro desconhecido"}
      </div>
    );
  }

  if (!products || !Array.isArray(products) || products.length === 0 || !productImages || !Array.isArray(productImages)) {
    console.log("Nenhum produto válido retornado:", { products, productImages });
    return <p className="text-center">Nenhum produto recomendado disponível.</p>;
  }

  console.log("Produtos brutos da API (/calculo):", products);
  console.log("Produtos com imagens (/produtos):", productImages);

  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id, product])).values()
  );
  console.log("Produtos únicos filtrados:", uniqueProducts);

  const recommendedProducts = uniqueProducts
    .map((product) => {
      if (!product || !product.id || !product.title || !product.variants || !Array.isArray(product.variants)) {
        console.error("Produto inválido, sem id, title ou variants:", product);
        return null;
      }

      const productWithImage = productImages.find(p => p.id === product.id);
      let image: string | undefined = productWithImage?.image || product.image;
      if (!image && product.metafields) {
        console.log(`Imagem ausente para produto ${product.id}, buscando em metafields:`, product.metafields);
        const imageMetafield = product.metafields.find(
          m => m.key.toLowerCase().includes("image") || m.key.toLowerCase().includes("photo")
        );
        image = imageMetafield?.value;
      }

      if (!image) {
        console.warn(`Produto ${product.id} sem imagem válida, será ignorado`);
        return null;
      }

      const availableVariant = product.variants.find(v => v.inventoryQuantity > 0) || product.variants[0];

      console.log(`Imagem selecionada para produto ${product.id}:`, image);

      return {
        id: product.id,
        title: product.title,
        image,
        price: availableVariant.price,
        inventoryQuantity: availableVariant.inventoryQuantity,
        purchaseLink: `https://ecoflow-timber.com.br/products/${product.id}`,
      };
    })
    .filter(Boolean) as { id: string; title: string; image: string; price: string; inventoryQuantity: number; purchaseLink: string }[];

  console.log("Produtos recomendados preparados:", recommendedProducts);

  if (recommendedProducts.length === 0) {
    console.log("Nenhum produto válido após filtragem");
    return <p className="text-center">Nenhum produto recomendado válido encontrado.</p>;
  }

  const handleBackToStart = () => {
    setCurrentStep("environments");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl text-black font-bold text-center mb-4">
        Produtos Recomendados
      </h2>
      <div
        className={
          recommendedProducts.length === 1
            ? "flex justify-center"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
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