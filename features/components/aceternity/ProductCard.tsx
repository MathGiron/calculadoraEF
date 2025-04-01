// components/produtos/ProductCard.tsx
"use client";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  inventoryQuantity: number;
  purchaseLink?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  console.log("ProductCard renderizado com product:", product);
  const price = parseFloat(product.price).toFixed(2);

  return (
    <div className="mx-auto w-80">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            layout="fill"
            objectFit="contain" // Mudado de "cover" para "contain"
            className="transform transition duration-200 group-hover:scale-95 group-hover:rounded-2xl"
          />
        </div>
        <div className="p-4">
          <h2 className="my-4 text-lg font-bold text-zinc-700">{product.title}</h2>
          <h2 className="my-4 text-sm font-normal text-zinc-500">
            Preço: R$ {price}
          </h2>
          <div className="mt-10 flex flex-row items-center justify-between">
            <span className="text-sm text-gray-500">
              Estoque: {product.inventoryQuantity} unidades
            </span>
            <a
              href={product.purchaseLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 block rounded-md bg-black px-6 py-2 text-xs font-bold text-white"
            >
              Comprar Agora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const TitleComponent = ({ title }: { title: string }) => (
  <div className="flex items-center space-x-2">
    <p>{title}</p>
  </div>
);