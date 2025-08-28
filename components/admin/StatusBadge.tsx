"use client";

import { cn } from "@/lib/utils";

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        active
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      )}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}
