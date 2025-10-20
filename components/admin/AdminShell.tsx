"use client";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Topbar, type TopbarShortcut } from "./Topbar";
import { ToastProvider } from "./Toast";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");

  const shortcuts = useMemo<TopbarShortcut[]>(
    () => [
      {
        label: "Nuevo servicio",
        href: "/admin/servicios/nuevo",
        shortcut: "N",
        icon: <Plus className="h-4 w-4" />,
      },
    ],
    []
  );

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Topbar
            onMenu={() => setSidebarOpen(true)}
            globalSearchValue={globalQuery}
            onGlobalSearch={setGlobalQuery}
            shortcuts={shortcuts}
          />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
