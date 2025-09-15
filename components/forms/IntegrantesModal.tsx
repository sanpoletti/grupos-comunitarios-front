'use client'

import { useState, useEffect } from 'react'

export type Integrante = {
  nombre: string
  apellido: string
  dni?: string
  tipoDocumento?: string
  fechaNacimiento?: string
  relacionParentesco?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSave: (items: Integrante[]) => void
  integrantes: Integrante[]
  tiposDocumento: { id: number; nombre: string }[]
  tiposParentesco: string[]
}

export default function IntegrantesModal({
  open,
  onClose,
  onSave,
  integrantes,
  tiposDocumento,
  tiposParentesco,
}: Props) {
  const [lista, setLista] = useState<Integrante[]>([])
  const [nuevo, setNuevo] = useState<Integrante>({
    nombre: '',
    apellido: '',
    dni: '',
    tipoDocumento: '',
    fechaNacimiento: '',
    relacionParentesco: '',
  })

  useEffect(() => setLista(integrantes), [integrantes])

  if (!open) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'dni' && !/^\d{0,8}$/.test(value)) return
    setNuevo(prev => ({ ...prev, [name]: value }))
  }

  const agregarIntegrante = () => {
    if (!nuevo.nombre && !nuevo.apellido && !nuevo.dni && !nuevo.fechaNacimiento) return
    setLista(prev => [...prev, nuevo])
    setNuevo({ nombre: '', apellido: '', dni: '', tipoDocumento: '', fechaNacimiento: '', relacionParentesco: '' })
  }

  const eliminarIntegrante = (index: number) => {
    setLista(prev => prev.filter((_, i) => i !== index))
  }

  const handleGuardar = () => {
    onSave(lista)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-bold mb-4 text-sky-600">Agregar Integrantes</h2>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <select
            name="tipoDocumento"
            value={nuevo.tipoDocumento}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Tipo de documento</option>
            {tiposDocumento.map(td => (
              <option key={td.id} value={td.nombre}>{td.nombre}</option>
            ))}
          </select>

          <input
            name="dni"
            value={nuevo.dni}
            onChange={handleChange}
            placeholder="Número de documento"
            className="border p-2 rounded"
          />

          <input
            name="nombre"
            value={nuevo.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 rounded"
          />
          <input
            name="apellido"
            value={nuevo.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="fechaNacimiento"
            value={nuevo.fechaNacimiento}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="relacionParentesco"
            value={nuevo.relacionParentesco}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Parentesco</option>
            {tiposParentesco.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={agregarIntegrante}
          className="mb-4 w-full p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Agregar
        </button>

        {lista.length > 0 && (
          <ul className="mb-4 max-h-48 overflow-y-auto border rounded p-2 text-sm">
            {lista.map((i, idx) => (
              <li key={idx} className="flex justify-between items-center mb-1">
                <span>
                  {i.tipoDocumento && `${i.tipoDocumento}: `}{i.dni && `${i.dni} - `}
                  {i.nombre} {i.apellido}
                  {i.fechaNacimiento && ` (Nac: ${i.fechaNacimiento})`}
                  {i.relacionParentesco && ` - ${i.relacionParentesco}`}
                </span>
                <button
                  type="button"
                  onClick={() => eliminarIntegrante(idx)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleGuardar}
            className="flex-1 p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 p-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
