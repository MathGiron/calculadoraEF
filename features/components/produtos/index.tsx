"use client";
import React from "react";
import { useFetchProducts, useFetchProductImages, Produto } from "hooks";
import { ProductCard } from "aceternity";
import { Button } from "ui/button";
import { useAtom } from "jotai";
import { currentStepAtom } from "lib/atoms";

interface ProductIndexProps {
  totalWatts: number;
  products?: Produto[];
  productImages?: Produto[];
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

  if (!products || !Array.isArray(products) || products.length === 0) {
    console.log("Nenhum produto válido retornado:", { products });
    return <p className="text-center">Nenhum produto recomendado disponível.</p>;
  }

  console.log("Produtos brutos da API (/calculo):", products);
  console.log("Produtos com imagens (/produtos):", productImages || "Sem imagens");

  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id, product])).values()
  );
  console.log("Produtos únicos filtrados:", uniqueProducts);

  const recommendedProducts = uniqueProducts
    .map((product) => {
      console.log(`Processando produto ${product.id}:`, product);

      if (!product || !product.id || !product.title || !product.variants || !Array.isArray(product.variants)) {
        console.error("Produto inválido, sem id, title ou variants:", product);
        return null;
      }

      let image: string | undefined;
      if (productImages && Array.isArray(productImages)) {
        const productWithImage = productImages.find((p) => p.id === product.id);
        image = productWithImage?.image || product.image;
      } else {
        image = product.image;
      }

      if (!image && product.metafields && Array.isArray(product.metafields)) {
        console.log(`Buscando em metafields para ${product.id}:`, product.metafields);
        const imageMetafield = product.metafields.find(
          (m) => m.key.toLowerCase().includes("image") || m.key.toLowerCase().includes("photo")
        );
        image = imageMetafield?.value;
      }

      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      if (!image || !isValidUrl(image)) {
        console.warn(`Imagem inválida ou ausente para ${product.id}:`, image);
        image = "/placeholder-image.png";
      } else {
        console.log(`Imagem válida para ${product.id}:`, image);
      }

      const availableVariant = product.variants.find((v) => v.inventoryQuantity > 0) || product.variants[0];

      return {
        id: product.id,
        title: product.title,
        image,
        price: availableVariant.price,
        inventoryQuantity: availableVariant.inventoryQuantity,
        purchaseLink: `https://ecoflow-timber.com.br/products/${product.id}`,
      };
    })
    .filter((p): p is NonNullable<typeof p> => {
      if (!p) console.warn("Produto filtrado como inválido:", p);
      return !!p;
    });

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