"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Files,
  ReceiptText,
  FileSearch,
  MessageSquareWarning,
  MessageCircleWarning,
  Globe,
  X,
} from "lucide-react";

const navigation = [
  { label: "Búsqueda", href: "https://aurumlogistics.com.pe/tracking/", icon: Search },
  { label: "Tus Documentos", href: "https://aurumlogistics.com.pe/tracking/documentos-user/", icon: Files },
  { label: "Tarifas", href: "https://aurumlogistics.com.pe/tracking/tarifas/", icon: ReceiptText },
  {
    label: "Consulta de DAM",
    href: "https://ww3.sunat.gob.pe/aduanas/informao/HR10Poliza.htm",
    icon: FileSearch,
    external: true,
  },
  { label: "Reclamos", href: "/reclamo", icon: MessageSquareWarning },

  { label: "Estado de reclamo", href: "/reclamo/seguimiento", icon: MessageCircleWarning },
  {
    label: "Website",
    href: "https://www.aurumlogistics.com.pe/",
    icon: Globe,
    external: true,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col border-r border-gray-200
          bg-white transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="flex h-24 shrink-0 items-center justify-between border-b border-gray-100 px-6">
          <Link
            href="https://aurumlogistics.com.pe/"
            onClick={onClose}
            aria-label="Ir al inicio del dashboard"
            className="flex items-center"
          >
            <Image
              src="/aurum-logistics-1.png"
              alt="Aurum Logistics"
              width={160}
              height={40}
              priority
              className="h-auto w-36 object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="h-full flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menú principal
          </p>

          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                !item.external &&
                (item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`));

              const linkClasses = `
                flex items-center gap-3 rounded-xl px-3 py-3
                text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }
              `;

              return (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                      <Icon size={19} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link href={item.href} onClick={onClose} aria-current={isActive ? "page" : undefined} className={linkClasses}>
                      <Icon size={19} strokeWidth={1.8} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="shrink-0 border-t border-gray-100 px-6 py-5">
          <p className="text-xs leading-5 text-gray-500">
            © {year || "2026"} Aurum Logistics.
            <br />
            Derechos Reservados.
          </p>
        </footer>
      </aside>
    </>
  );
}