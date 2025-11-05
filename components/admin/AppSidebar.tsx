"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Settings,
  MessageSquare,
  X,
  Image,
  GalleryHorizontalEnd,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    label: "Resumen",
    links: [
      { href: "/admin", label: "Dashboard", icon: Home },
      { href: "/admin/servicios", label: "Servicios", icon: Package },
      { href: "/admin/proyectos", label: "Proyectos", icon: Image },
      { href: "/admin/logos", label: "Logos", icon: GalleryHorizontalEnd },
    ],
  },
  {
    label: "Operaciones",
    links: [
      { href: "/admin/compras", label: "Compras", icon: ShoppingCart },
      { href: "/admin/mensajes", label: "Mensajes", icon: MessageSquare },
    ],
  },
  {
    label: "Configuración",
    links: [{ href: "/admin/ajustes", label: "Ajustes", icon: Settings }],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ open, onClose, collapsed, onToggleCollapse }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "group/sidebar fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-slate-950/95 via-slate-900/80 to-slate-950/60 p-5 text-slate-100 shadow-2xl backdrop-blur-xl transition-all duration-300 md:static md:h-auto md:border-white/10 md:bg-transparent md:shadow-none",
        collapsed ? "md:w-24" : "md:w-72",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <div className={cn("flex items-center gap-3", collapsed && "md:hidden")}>
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
            <Sparkles className="h-5 w-5" />
          </span>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Subs Admin</p>
              <p className="text-xs text-white/60">Panel de control</p>
            </div>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={open ? onClose : onToggleCollapse}
          className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20 md:bg-white/5"
          aria-label={open ? "Cerrar menú" : collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {open ? <X className="h-4 w-4" /> : collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
        {navigation.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {section.label}
              </p>
            )}
            <div className="space-y-1.5">
              {section.links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => {
                      if (open) onClose();
                    }}
                    className={cn(
                      "relative flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all",
                      collapsed && "md:justify-center md:px-0",
                      active
                        ? "bg-white/15 text-white shadow-lg ring-1 ring-white/30"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white",
                        active && "bg-gradient-to-tr from-blue-500 via-cyan-400 to-sky-400 text-white shadow",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {!collapsed && <span className="truncate">{label}</span>}
                    {active && !collapsed && (
                      <span className="absolute right-2 h-8 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" aria-hidden />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("mt-6 rounded-2xl border border-white/10 bg-white/10 p-3", collapsed && "md:p-2")}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white/20">
            <AvatarImage src="/admin-avatar.png" alt="Administrador" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Administrador</p>
              <p className="truncate text-xs text-white/60">Equipo Subs</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
