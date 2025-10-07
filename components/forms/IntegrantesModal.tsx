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

type Titular = {
  nombre: string
  apellido: string
  tipoDocumento?: string
  nroDocumento?: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSave: (items: Integrante[]) => void
  integrantes: Integrante[]
  tiposDocumento: { id: number; nombre: string }[]
  tiposParentesco: string[]
  titular?: Titular
}

export default function IntegrantesModal({
  open,
  onClose,
  onSave,
  integrantes,
  tiposDocumento,
  tiposParentesco,
  titular,
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
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [errorDocumento, setErrorDocumento] = useState('')

  useEffect(() => setLista(integrantes), [integrantes])

  if (!open) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'dni' && !/^\d{0,8}$/.test(value)) return

    // Poner nombre y apellido en mayúsculas
    const newValue =
      name === 'nombre' || name === 'apellido' ? value.toUpperCase() : value

    setNuevo(prev => ({ ...prev, [name]: newValue }))
  }

  const handleDocumentoBlur = async () => {
    if (!nuevo.dni || nuevo.dni.length !== 8) {
      setErrorDocumento('')
      return
    }

    setBuscando(true)
    setErrorDocumento('')

    try {
      const res = await fetch(`http://localhost:3000/api/personas?nroDocumento=${nuevo.dni}`)
      const data = await res.json()

      if (data.length > 0) {
        const p = data[0]
        setNuevo(prev => ({
          ...prev,
          nombre: p.nombre,
          apellido: p.apellido,
          fechaNacimiento: p.fechaNacimiento,
          tipoDocumento: 'DNI', // ajustá según tu lógica
        }))
        setErrorDocumento('Persona ya registrada')
      } else {
        setErrorDocumento('')
      }
    } catch {
      setErrorDocumento('Error al verificar documento')
    } finally {
      setBuscando(false)
    }
  }

  const agregarIntegrante = () => {
    if (!nuevo.nombre && !nuevo.apellido && !nuevo.dni && !nuevo.fechaNacimiento) return

    if (editIndex !== null) {
      // Editando un integrante existente
      setLista(prev => prev.map((i, idx) => (idx === editIndex ? nuevo : i)))
      setEditIndex(null)
    } else {
      // Agregar nuevo
      setLista(prev => [...prev, nuevo])
    }

    setNuevo({ nombre: '', apellido: '', dni: '', tipoDocumento: '', fechaNacimiento: '', relacionParentesco: '' })
    setErrorDocumento('')
  }

  const editarIntegrante = (index: number) => {
    setNuevo(lista[index])
    setEditIndex(index)
  }

  const eliminarIntegrante = (index: number) => {
    setLista(prev => prev.filter((_, i) => i !== index))
    if (editIndex === index) {
      setNuevo({ nombre: '', apellido: '', dni: '', tipoDocumento: '', fechaNacimiento: '', relacionParentesco: '' })
      setEditIndex(null)
    }
  }

  const handleGuardar = () => {
    onSave(lista)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-bold mb-2 text-sky-600">Agregar Integrantes</h2>

        {titular && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm font-medium">
            Titular de retiro: {titular.tipoDocumento && `${titular.tipoDocumento}: `}
            {titular.nroDocumento && `${titular.nroDocumento} - `}
            {titular.nombre} {titular.apellido}
          </div>
        )}

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
            onBlur={handleDocumentoBlur}
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

        {errorDocumento && (
          <div className="text-red-600 text-sm mb-2">{errorDocumento}</div>
        )}

        <button
          type="button"
          onClick={agregarIntegrante}
          disabled={buscando}
          className="mb-4 w-full p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:bg-gray-400"
        >
          {editIndex !== null ? 'Actualizar' : 'Agregar'}
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
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => editarIntegrante(idx)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarIntegrante(idx)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    X
                  </button>
                </div>
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
