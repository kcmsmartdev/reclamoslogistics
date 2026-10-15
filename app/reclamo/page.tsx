'use client'

import { useState } from 'react'
import { createClaim } from '@/actions/claims'

const DEPARTMENTS = [
  "Amazonas", "Ancash", "Apurimac", "Arequipa", "Ayacucho", "Cajamarca", "Cusco",
  "Huancavelica", "Huanuco", "Ica", "Junin", "La Libertad", "Lambayeque", "Lima",
  "Loreto", "Madre De Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martin",
  "Tacna", "Tumbes", "Ucayali"
];

export default function ClaimPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Contadores para los límites de caracteres
  const [descLength, setDescLength] = useState<number>(0)
  const [requestLength, setRequestLength] = useState<number>(0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const formElement = event.currentTarget
    const formData = new FormData(formElement)
    const response = await createClaim(formData)

    setLoading(false)

    if (response.success && response.tracking_code) {
      setResult(response.tracking_code)
      formElement.reset()
      setDescLength(0)
      setRequestLength(0)
    } else {
      setError(response.error || 'Ocurrió un error inesperado.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Libro de Reclamaciones Virtual
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Conforme a lo establecido en el Código de Protección y Defensa del Consumidor.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          {result ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
              <h3 className="text-xl font-medium text-green-800">¡Reclamo registrado con éxito!</h3>
              <p className="mt-2 text-sm text-green-700">
                Su código de seguimiento es:
              </p>
              <span className="mt-2 inline-block font-mono text-xl font-bold bg-white px-4 py-2 rounded border border-green-300 text-green-900">
                {result}
              </span>
              <p className="mt-4 text-xs text-green-600">
                Guarde este código para consultar el estado de su solicitud posteriormente. Se ha generado correctamente en el sistema.
              </p>
              <button
                onClick={() => setResult(null)}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium text-sm"
              >
                Registrar otro reclamo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* SECCIÓN 1: Identificación */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  1° Identificación de la persona que presenta el reclamo
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Documento *</label>
                    <select
                      name="doc_type"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-900"
                    >
                      <option value="">Seleccione</option>
                      <option value="DNI">DNI</option>
                      <option value="C.E">C.E</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Documento *</label>
                    <input
                      name="doc_number"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Nombres Completos *</label>
                    <input
                      name="client_name"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Domicilio *</label>
                    <input
                      name="address"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Departamento *</label>
                    <select
                      name="department"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-900"
                    >
                      <option value="">Seleccione</option>
                      {DEPARTMENTS.map((dep) => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provincia *</label>
                    <input
                      name="province"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Distrito *</label>
                    <input
                      name="district"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono / Celular *</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
                    <input
                      name="client_email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center">
                    <input
                      name="is_minor"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Soy menor de edad
                    </label>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: Identificación del bien contratado */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  2° Identificación del bien contratado
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descripción de producto o servicio contratado *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="Servicio contratado"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monto Reclamado (S/)</label>
                    <input
                      name="claimed_amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: Detalle de reclamación */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  3° Detalle de reclamación
                </h3>

                <div className="space-y-4 mb-4 bg-gray-50 p-4 rounded-md text-xs text-gray-600">
                  <p><strong>Reclamo:</strong> Disconformidad relacionada a los productos o servicios.</p>
                  <p><strong>Queja:</strong> Disconformidad no relacionada a los productos y servicios; o malestar o descontento a la atención al público.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de solicitud *</label>
                    <div className="mt-2 flex gap-6">
                      <label className="inline-flex items-center">
                        <input type="radio" name="claim_type" value="Reclamo" defaultChecked className="form-radio text-indigo-600" />
                        <span className="ml-2 text-sm text-gray-900">Reclamo</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="claim_type" value="Queja" className="form-radio text-indigo-600" />
                        <span className="ml-2 text-sm text-gray-900">Queja</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700">Detalle *</label>
                      <span className="text-xs text-gray-500">{descLength}/700 caracteres</span>
                    </div>
                    <textarea
                      name="description"
                      rows={4}
                      maxLength={700}
                      required
                      onChange={(e) => setDescLength(e.target.value.length)}
                      placeholder="Explique detalladamente los hechos..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700">Pedido (Qué solicita)</label>
                      <span className="text-xs text-gray-500">{requestLength}/700 caracteres</span>
                    </div>
                    <textarea
                      name="request_detail"
                      rows={3}
                      maxLength={700}
                      onChange={(e) => setRequestLength(e.target.value.length)}
                      placeholder="Qué solución espera por parte de la empresa..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>

                  <div className="flex items-center pt-2">
                    <input
                      name="accept_privacy"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      He leído y acepto la política de protección de datos personales. *
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Registrando Reclamo...' : 'Enviar Reclamo'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}