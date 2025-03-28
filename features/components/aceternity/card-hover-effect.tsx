// components/appliances/card-hover-effect.tsx
"use client";
import { cn } from "lib";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/features/components/ui/input";

export const HoverEffect = ({
  items,
  className,
  selectedIds,
  onSelectionChange,
}: {
  items: {
    id: string;
    title: string;
    description: string | React.ReactNode;
    link: string;
    icon?: React.ReactNode;
    powerW: number; // Valor de potência em watts
    hoursPerDay: number; // Horas de uso por dia
  }[];
  className?: string;
  selectedIds: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [powerValues, setPowerValues] = useState<{ [key: string]: number }>(
    Object.fromEntries(items.map((item) => [item.id, item.powerW]))
  );

  // Função para lidar com a seleção do card
  const handleCardSelection = (id: string) => {
    const isSelected = selectedIds.includes(id);
    const newSelectedIds = isSelected
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  // Função para selecionar/desselecionar todos os cards
  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (selectedIds.length === items.length) {
        onSelectionChange([]); // Desseleciona todos
      } else {
        onSelectionChange(items.map((item) => item.id)); // Seleciona todos
      }
    }
  };

  // Função para atualizar o valor de potência
  const handlePowerChange = (id: string, value: string) => {
    const numericValue = value ? parseInt(value, 10) : 0;
    setPowerValues((prev) => ({ ...prev, [id]: numericValue || 0 }));
  };

  return (
    <div>
      {/* Botão para selecionar/desselecionar todos */}
      <div className="flex justify-end mb-4">
        <button
          className="text-sm text-blue-500 hover:underline"
          onClick={handleSelectAll}
        >
          {selectedIds.length === items.length ? "Desmarcar Todos" : "Marcar Todos"}
        </button>
      </div>

      {/* Grid de Cards */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2", className)}>
        {items.map((item, idx) => (
          <label
            key={item.id}
            className="relative group block p-2 h-full w-full cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => handleCardSelection(item.id)}
              className="hidden" // Esconde o input nativo
            />
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  key={`hover-background-${idx}`}
                  className="absolute inset-0 h-full w-full bg-slate-700/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.3 } }}
                />
              )}
            </AnimatePresence>
            <Card isSelected={selectedIds.includes(item.id)}>
              <div className="mb-2 flex justify-between items-center">
                {/* Ícone */}
                <div>{item.icon}</div>
                {/* Campo de Entrada para Potência */}
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={powerValues[item.id]}
                    onChange={(e) => handlePowerChange(item.id, e.target.value)}
                    className="w-24 h-8 text-zinc-500 group-hover:text-white text-sm p-2 border-1 rounded-md"
                  />
                  <span className="text-zinc-500 group-hover:text-white text-sm">W</span>
                </div>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </label>
        ))}
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
  isSelected,
}: {
  className?: string;
  children: React.ReactNode;
  isSelected: boolean;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-transparent border relative z-20",
        isSelected ? "border-slate-700 border-2" : "border",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-5 text-left">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-black group-hover:text-white font-bold tracking-wide",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-zinc-400 group-hover:text-white tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};