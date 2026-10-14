"use client";

import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="w-full bg-black px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between min-h-24">
      <div className="flex items-center gap-4">
        {/* Botón de Hamburguesa: visible SOLO en móviles y tablets (< lg) */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="p-2 text-white hover:bg-gray-800 rounded-lg lg:hidden focus:outline-none transition-colors"
        >
          <Menu size={28} />
        </button>

        {/* Título de la sección */}
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Libro de Reclamaciones
        </h1>
      </div>
    </nav>
  );
}