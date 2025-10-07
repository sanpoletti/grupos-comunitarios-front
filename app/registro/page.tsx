'use client'

import React, { useEffect, useState } from 'react'

import GrupoSelector, { Hogar as HogarSelectorType } from '@/components/selectors/GrupoSelector'
import DocumentoInput from '@/components/forms/DocumentoInput'
import PersonaForm from '@/components/forms/PersonaForm'
import IngestasSelector from '@/components/sections/IngestasSelector'
import CardSection from '@/components/layout/CardSection'
import IntegrantesModal, { Integrante } from '@/components/forms/IntegrantesModal'

type Hogar = HogarSelectorType
type TipoFamiliar = { idtipodefamiliar: number; nombre: string }

export default function RegistroPage() {
  const initialState = {
    IDTIPODOCUMENTO: 3,
    nroDocumento: '',
    nombre: '',
    apellido: '',
    sexo: 'F',
    fechaNacimiento: '',
    lugarResidencia: 'CABA',
    cantidadRaciones: 1,
    cantidadPersonasHogar: 0,
    IDHogar: '' as number | '',
    observaciones: '',
    desayuna: false,
    almuerza: true,
    merienda: false,
    cena: true,
  }

  const [formData, setFormData] = useState(initialState)
  const [hogares, setHogares] = useState<Hogar[]>([])
  const [tiposFamiliares, setTiposFamiliares] = useState<TipoFamiliar[]>([])
  const [personaYaRegistrada, setPersonaYaRegistrada] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [errorDocumento, setErrorDocumento] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [integrantes, setIntegrantes] = useState<Integrante[]>([])

  // contar personas únicas
  const computeHouseholdCount = (
    integrantesList: Integrante[],
    titularDoc: { tipo?: string | number; nro?: string }
  ) => {
    const ids = integrantesList
      .map(i => `${i.tipoDocumento || ''}-${(i.dni || '').trim()}`)
      .filter(Boolean)
    if (titularDoc.nro) ids.push(`${titularDoc.tipo}-${titularDoc.nro.trim()}`)
    return new Set(ids).size
  }

  useEffect(() => {
    const count = computeHouseholdCount(integrantes, {
      tipo: formData.IDTIPODOCUMENTO,
      nro: formData.nroDocumento,
    })
    setFormData(prev => ({ ...prev, cantidadPersonasHogar: count }))
  }, [integrantes, formData.IDTIPODOCUMENTO, formData.nroDocumento])

  useEffect(() => {
    const fetchHogares = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/hogares')
        if (!res.ok) throw new Error('Error al obtener hogares')
        const data = await res.json()
        setHogares(
          data.map((h: any) => ({
            idHogar: h.idHogar,
            NombreGrupo: h.NombreGrupo?.trim() || '',
            nroRegistro: Number(h.nroRegistro),
          }))
        )
      } catch (error) {
        console.error('Error al cargar hogares:', error)
        alert('No se pudieron cargar los grupos comunitarios.')
      }
    }
    fetchHogares()
  }, [])

  useEffect(() => {
    const fetchTiposFamiliares = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tipos-familiares')
        if (!res.ok) throw new Error('Error al obtener parentescos')
        setTiposFamiliares(await res.json())
      } catch (error) {
        console.error('Error al cargar tipos familiares:', error)
        alert('No se pudieron cargar los tipos de familiares.')
      }
    }
    fetchTiposFamiliares()
  }, [])

  const handleDocumentBlur = async () => {
    const nro = formData.nroDocumento
    if (nro.length !== 8) {
      setPersonaYaRegistrada(false)
      setErrorDocumento('')
      return
    }
    setBuscando(true)
    setErrorDocumento('')
    try {
      const res = await fetch(`http://localhost:3000/api/personas?nroDocumento=${nro}`)
      const data = await res.json()

      if (data.length > 0) {
        setPersonaYaRegistrada(true)
        setErrorDocumento('Persona ya registrada.')
        setFormData(prev => ({
          ...prev,
          nombre: data[0].nombre,
          apellido: data[0].apellido,
          fechaNacimiento: data[0].fechaNacimiento,
          sexo: data[0].sexo,
          lugarResidencia: data[0].lugarResidencia,
          observaciones: data[0].observaciones || '',
          desayuna: data[0].desayuna ?? false,
          almuerza: data[0].almuerza ?? false,
          merienda: data[0].merienda ?? false,
          cena: data[0].cena ?? false,
        }))
      } else {
        setPersonaYaRegistrada(false)
        setErrorDocumento('')
      }
    } catch {
      setErrorDocumento('Error al verificar documento.')
    } finally {
      setBuscando(false)
    }
  }

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type, checked } = e.target as HTMLInputElement;

  let newValue: string | number | boolean = value;

  // Checkbox
  if (type === 'checkbox') newValue = checked;

  // Convertir nombre y apellido a mayúsculas
  if (name === 'nombre' || name === 'apellido') newValue = value.toUpperCase();

  // Validar nroDocumento: máximo 8 dígitos
  if (name === 'nroDocumento' && !/^\d{0,8}$/.test(newValue as string)) return;

  if (name === 'nroDocumento') {
    // Cuando cambia el documento, blanquear datos de persona y lista de integrantes
    setFormData(prev => ({
      ...prev,
      nroDocumento: value, // nuevo documento
      nombre: '',
      apellido: '',
      sexo: 'F',
      fechaNacimiento: '',
      lugarResidencia: 'CABA',
      observaciones: '',
      cantidadRaciones: 1,
      cantidadPersonasHogar: 0,
      IDHogar: prev.IDHogar, // mantener grupo
    }));

    setIntegrantes([]); // limpiamos la lista de integrantes
    setPersonaYaRegistrada(false);
    setErrorDocumento('');
    return; // salimos porque ya seteamos los valores
  }

  // Para los demás campos
  setFormData(prev => ({
    ...prev,
    [name]:
      name === 'IDTIPODOCUMENTO' ||
      name === 'cantidadRaciones' ||
      name === 'cantidadPersonasHogar'
        ? newValue === '' ? '' : Number(newValue)
        : name === 'IDHogar'
        ? newValue === '' ? '' : Number(newValue)
        : newValue,
  }));

  // Si el usuario modifica tipo de documento, reiniciamos chequeo
  if (name === 'IDTIPODOCUMENTO') {
    setPersonaYaRegistrada(false);
    setErrorDocumento('');
  }
};


  const handleGrupoChange = (val: number | '') => {
    setFormData(prev => ({ ...prev, IDHogar: val }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const hoy = new Date()
    if (formData.fechaNacimiento && new Date(formData.fechaNacimiento) > hoy) {
      alert('La fecha de nacimiento no puede ser mayor a la fecha actual.')
      return
    }

    const res = await fetch('http://localhost:3000/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert(personaYaRegistrada ? 'Asistencia registrada' : 'Persona registrada correctamente')
      setFormData(initialState)
      setPersonaYaRegistrada(false)
      setErrorDocumento('')
      setIntegrantes([])
    } else {
      alert('Error al registrar')
    }
  }

  return (
    <main className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-sky-600 text-center">Registro de Personas - Hogares</h1>

      <form onSubmit={handleSubmit}>
        <CardSection title="">
          <GrupoSelector
            hogares={hogares}
            value={formData.IDHogar}
            onChange={handleGrupoChange}
            disabled={buscando}
          />

          <IngestasSelector
            desayuna={formData.desayuna ?? false}
            almuerza={formData.almuerza ?? false}
            merienda={formData.merienda ?? false}
            cena={formData.cena ?? false}
            onChange={(field, value) =>
              setFormData(prev => ({ ...prev, [field]: value }))
            }
          />

          <DocumentoInput
            IDTIPODOCUMENTO={formData.IDTIPODOCUMENTO}
            nroDocumento={formData.nroDocumento}
            buscando={buscando}
            personaYaRegistrada={personaYaRegistrada}
            errorDocumento={errorDocumento}
            onChange={handleChange}
            onBlur={handleDocumentBlur}
          />

          <PersonaForm
            formData={formData}
            tiposFamiliares={tiposFamiliares}
            personaYaRegistrada={personaYaRegistrada}
            buscando={buscando}
            onChange={handleChange}
           
          />

          <div className="mt-4 text-sm font-semibold">
            Total personas en el hogar: {formData.cantidadPersonasHogar}
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 w-full p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Agregar Integrantes
          </button>

          {integrantes.length > 0 && (
            <div className="mt-4 grid gap-2 text-sm">
              {integrantes.map((i, idx) => (
                <div key={idx} className="flex justify-between p-2 border rounded bg-gray-50">
                  <div>
                    <strong>{i.nombre} {i.apellido}</strong>
                    {i.dni && ` - DNI: ${i.dni}`}
                    {i.fechaNacimiento && ` - Nac: ${i.fechaNacimiento}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardSection>

        <IntegrantesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={setIntegrantes}
          integrantes={integrantes}
          tiposDocumento={[
            { id: 3, nombre: 'DNI' },
            { id: 10, nombre: 'PRC' },
            { id: 1, nombre: 'LC' },
            { id: 2, nombre: 'LE' },
            { id: 13, nombre: 'CI' },
            { id: 0, nombre: 'SD' },
          ]}
          tiposParentesco={(tiposFamiliares || []).map(f => f.nombre)}
        />

        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            disabled={buscando}
            className={`flex-1 p-2 rounded text-white ${
              buscando ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-400 hover:bg-sky-500'
            }`}
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(initialState)
              setPersonaYaRegistrada(false)
              setErrorDocumento('')
              setIntegrantes([])
            }}
            className="flex-1 p-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}
