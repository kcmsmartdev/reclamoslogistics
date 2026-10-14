"use client";

import { useState } from "react";
import { getClaimByTrackingCode } from "@/actions/claims";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Tag,
  ShieldAlert,
} from "lucide-react";

interface FullClaimDetails {
  id?: string;
  tracking_code: string;
  doc_type: string;
  doc_number: string;
  client_name: string;
  address: string;
  department: string;
  province: string;
  district: string;
  phone: string;
  client_email: string;
  is_minor: boolean;
  title: string;
  claimed_amount: number | null;
  claim_type: string;
  description: string;
  request_detail: string | null;
  status: string;
  created_at: string;
}

export default function ClaimSearch() {
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claim, setClaim] = useState<FullClaimDetails | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError(null);
    setClaim(null);

    const res = await getClaimByTrackingCode(trackingCode);
    setLoading(false);

    if (res.success && res.data) {
      setClaim(res.data as FullClaimDetails);
    } else {
      setError(res.error || "No se encontró ningún reclamo con ese código.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pendiente":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
        };
      case "en proceso":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Clock,
        };
      case "resuelto":
      case "atendido":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Search size={20} className="text-blue-600" />
          Consulta de Estado de Reclamo
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Ingresa el código único (ej. REC-20261014-XXXX) para ver todos los detalles.
        </p>
      </div>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            placeholder="REC-XXXXX-XXXX"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono tracking-wider text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all uppercase outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Buscando...</span>
          ) : (
            <>
              <Search size={16} />
              <span>Consultar Detalles Completos</span>
            </>
          )}
        </button>
      </form>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resultado con todos los datos */}
      {claim && (
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-6 animate-in fade-in duration-300">
          
          {/* Header con Código y Estado */}
          {(() => {
            const badge = getStatusBadge(claim.status);
            const StatusIcon = badge.icon;
            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 font-mono block">CÓDIGO DE SEGUIMIENTO</span>
                  <span className="text-base font-bold font-mono text-gray-900">{claim.tracking_code}</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${badge.bg}`}>
                  <StatusIcon size={15} />
                  <span>{claim.status}</span>
                </div>
              </div>
            );
          })()}

          {/* 1° Identificación del consumidor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
              1. Datos del Solicitante
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <User size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Nombre completo</p>
                  <p className="font-semibold text-gray-800">{claim.client_name} {claim.is_minor && "(Menor de edad)"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <Tag size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Documento</p>
                  <p className="font-semibold text-gray-800">{claim.doc_type}: {claim.doc_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <Mail size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Correo Electrónico</p>
                  <p className="font-semibold text-gray-800 break-all">{claim.client_email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <Phone size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Teléfono</p>
                  <p className="font-semibold text-gray-800">{claim.phone}</p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Domicilio</p>
                  <p className="font-semibold text-gray-800">
                    {claim.address} — {claim.district}, {claim.province}, {claim.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2° Identificación del bien contratado */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1">
              2. Bien Contratado
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2 flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <FileText size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Descripción del Producto / Servicio</p>
                  <p className="font-semibold text-gray-800">{claim.title}</p>
                </div>
              </div>

              {claim.claimed_amount !== null && claim.claimed_amount !== undefined && (
                <div className="flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                  <DollarSign size={15} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-gray-400 font-medium">Monto Reclamado</p>
                    <p className="font-semibold text-gray-800">
                      S/ {Number(claim.claimed_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg">
                <Calendar size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-gray-400 font-medium">Fecha de Registro</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(claim.created_at).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3° Detalle de la reclamación */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-1 flex items-center justify-between">
              <span>3. Detalle de Reclamación</span>
              <span className="font-semibold text-indigo-600 normal-case">Tipo: {claim.claim_type}</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <p className="text-gray-400 font-medium mb-1">Detalle / Motivo:</p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/60 leading-relaxed text-gray-800 whitespace-pre-wrap">
                  {claim.description}
                </div>
              </div>

              {claim.request_detail && (
                <div>
                  <p className="text-gray-400 font-medium mb-1">Pedido del Solicitante:</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/60 leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {claim.request_detail}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}