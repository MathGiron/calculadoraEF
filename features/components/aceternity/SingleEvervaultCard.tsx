// singleevervaultcard.tsx
"use client";
import React from "react";
import Image from "next/image";
import { cn } from "lib";

interface SingleEvervaultCardProps {
  text: string;           // Texto exibido abaixo do card
  backgroundImg?: string; // Caminho da imagem no /public
  selected?: boolean;     // Define se o card está selecionado
  icon?: string;          // Caminho do SVG no canto inferior esquerdo
  onClick?: () => void;   // Função a ser executada ao clicar no card
}

export function SingleEvervaultCard({
  text,
  backgroundImg,
  selected = false,
  icon,
  onClick,
}: SingleEvervaultCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center cursor-pointer", // Adiciona cursor pointe
      )}
      onClick={onClick} // Executa a função onClick ao clicar no card
    >
      <div
        className={cn(
          "relative h-[20rem] w-[14rem] rounded-2xl overflow-hidden",
          selected
            ? "border border-[#2673ff]"
            : "border border-black/[0.2] dark:border-white/[0.2]"
        )}
      >
        {/* Imagem de fundo */}
        {backgroundImg && (
          <Image
            src={backgroundImg}
            alt={text}
            fill
            className="object-cover object-center"
          />
        )}
        {/* SVG no canto inferior esquerdo */}
        {icon && (
          <div className="absolute bottom-2 left-2 z-10">
            <Image
              src={icon}
              alt="Icon"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>
        )}
      </div>
      <h2 className="dark:text-white text-black mt-4 text-base font-light text-center">
        {text}
      </h2>
    </div>
  );
}