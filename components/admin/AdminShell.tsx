"use client";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Topbar, type TopbarShortcut } from "./Topbar";
import { ToastProvider } from "./Toast";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/30" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/20" />
        </div>
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col rounded-[32px] border border-white/10 bg-white/80 shadow-[0_40px_120px_-50px_rgba(30,64,175,0.65)] backdrop-blur-2xl transition-colors dark:border-slate-800/60 dark:bg-slate-950/70">
          <div className="flex flex-1">
            <AppSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            />
            <div className="flex flex-1 flex-col">
              <Topbar
                onMenu={() => setSidebarOpen(true)}
                globalSearchValue={globalQuery}
                onGlobalSearch={setGlobalQuery}
                shortcuts={shortcuts}
              />
              <main className="flex-1 overflow-x-hidden">
                <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
                  <div className="space-y-10">{children}</div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
