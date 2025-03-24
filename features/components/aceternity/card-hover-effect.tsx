// card-hover-effect.tsx
"use client";
import { cn } from "lib";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
  }[];
  className?: string;
  selectedIds: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCardClick = (id: string, event: React.MouseEvent<HTMLDivElement>) => {
    // Ignora o clique se for num input
    if ((event.target as HTMLElement).tagName === "INPUT") {
      return;
    }
    const isSelected = selectedIds.includes(id);
    const newSelectedIds = isSelected
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ", className)}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={(e) => handleCardClick(item.id, e)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                key={`hover-background-${idx}`}
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.3 } }}
              />
            )}
          </AnimatePresence>
          <Card isSelected={selectedIds.includes(item.id)}>
            <div className="mb-2 flex justify-start">{item.icon}</div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
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
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-transparent border dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        isSelected ? "border-black border-2" : "border",
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
  return <h4 className={cn("text-black font-bold tracking-wide", className)}>{children}</h4>;
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn("mt-2 text-zinc-400 tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};