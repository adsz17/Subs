"use client";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function DrawerForm({ open, title, children, onClose }: Props) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow transition-transform dark:bg-gray-900 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose}>×</button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
