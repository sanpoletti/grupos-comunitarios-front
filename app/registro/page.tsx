'use client';

import { useEffect, useState } from 'react';

type Hogar = {
  idHogar: number;
  NombreGrupo: string;
};

export default function RegistroPage() {
  const hoyStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const initialState = {
    IDTIPODOCUMENTO: 1,
    nroDocumento: '',
    nombre: '',
    apellido: '',
    sexo: 'F',
    fechaNacimiento: '',
    lugarResidencia: 'CABA',
    cantidadRaciones: 1,
    IDHogar: '',
    observaciones: '',
    fechaRetiro: hoyStr, // default a hoy
  };

  const [formData, setFormData] = useState(initialState);
  const [hogares, setHogares] = useState<Hogar[]>([]);
  const [personaYaRegistrada, setPersonaYaRegistrada] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [errorDocumento, setErrorDocumento] = useState('');

  useEffect(() => {
    const fetchHogares = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/hogares');
        if (!res.ok) throw new Error('Error al obtener hogares');
        const data = await res.json();
        setHogares(data);
      } catch (error) {
        console.error('Error al cargar hogares:', error);
        alert('No se pudieron cargar los grupos comunitarios.');
      }
    };

    fetchHogares();
  }, []);

  const handleDocumentBlur = async () => {
    const nro = formData.nroDocumento;
    if (nro.length !== 8) {
      setPersonaYaRegistrada(false);
      setErrorDocumento('');
      return;
    }
    setBuscando(true);
    setErrorDocumento('');
    try {
      const res = await fetch(`http://localhost:3000/api/personas?nroDocumento=${nro}`);
      const data = await res.json();

      if (data.length > 0) {
        setPersonaYaRegistrada(true);
        setErrorDocumento('Persona ya registrada. Solo completar raciones, grupo y fecha de retiro.');
        setFormData(prev => ({
          ...prev,
          nombre: data[0].nombre,
          apellido: data[0].apellido,
          fechaNacimiento: data[0].fechaNacimiento,
          sexo: data[0].sexo,
          lugarResidencia: data[0].lugarResidencia,
          observaciones: '',
          fechaRetiro: data[0].fechaRetiro || hoyStr, // si ya tiene fechaRetiro, la carga, sino hoy por default
        }));
      } else {
        setPersonaYaRegistrada(false);
        setErrorDocumento('');
        setFormData(prev => ({ ...prev, fechaRetiro: hoyStr })); // si no está registrada, fechaRetiro default hoy
      }
    } catch {
      setErrorDocumento('Error al verificar documento.');
    } finally {
      setBuscando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'nombre' || name === 'apellido') {
      newValue = value.toUpperCase();
    }

    if (name === 'nroDocumento' && !/^\d{0,8}$/.test(newValue)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'IDTIPODOCUMENTO' ||
        name === 'cantidadRaciones' ||
        name === 'IDHogar'
          ? Number(newValue)
          : newValue,
    }));

    if (name === 'nroDocumento') {
      setPersonaYaRegistrada(false);
      setErrorDocumento('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hoy = new Date();

    if (formData.fechaNacimiento) {
      const nacimiento = new Date(formData.fechaNacimiento);
      if (nacimiento > hoy) {
        alert('La fecha de nacimiento no puede ser mayor a la fecha actual.');
        return;
      }
    }

    if (formData.fechaRetiro) {
      const retiro = new Date(formData.fechaRetiro);
      if (retiro > hoy) {
        alert('La fecha de retiro no puede ser mayor a la fecha actual.');
        return;
      }
    }

    const res = await fetch('http://localhost:3000/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert(personaYaRegistrada ? 'Asistencia registrada' : 'Persona registrada correctamente');
      setFormData(initialState);
      setPersonaYaRegistrada(false);
      setErrorDocumento('');
    } else {
      alert('Error al registrar');
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-sky-600 text-center">
        Registro de Persona
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fila 1: Tipo Documento + Número */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold text-sky-700">
              Tipo Documento
            </label>
            <select
              name="IDTIPODOCUMENTO"
              value={formData.IDTIPODOCUMENTO}
              onChange={handleChange}
              disabled={personaYaRegistrada || buscando}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value={1}>DNI</option>
              <option value={2}>PRC</option>
              <option value={3}>Otro</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold text-sky-700">
              Número de Documento
            </label>
            <input
              name="nroDocumento"
              value={formData.nroDocumento}
              onChange={handleChange}
              onBlur={handleDocumentBlur}
              disabled={buscando}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="8 dígitos"
              required
            />
            {buscando && <p className="mt-1 text-sm text-gray-500">Verificando…</p>}
            {errorDocumento && (
              <p className="mt-1 text-sm text-red-600">{errorDocumento}</p>
            )}
          </div>
        </div>

        {/* Mostrar campos para persona registrada o nueva */}

        {!personaYaRegistrada ? (
          <>
            {/* Campos para persona nueva */}
            {/* Fila 2: Nombre + Apellido */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-sky-700">Nombre</label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-sky-700">Apellido</label>
                <input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
            </div>

            {/* Fila 3: Sexo + Fecha de Nacimiento */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-sky-700">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                  <option value="O">Otro</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-sky-700">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
            </div>

            {/* Lugar de Residencia */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-sky-700">
                Lugar de Residencia
              </label>
              <select
                name="lugarResidencia"
                value={formData.lugarResidencia}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="CABA">CABA</option>
                <option value="PBA">PBA</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Fecha Retiro */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-sky-700">
                Fecha de Retiro
              </label>
              <input
                type="date"
                name="fechaRetiro"
                value={formData.fechaRetiro}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </>
        ) : (
          <>
            {/* Campos para persona ya registrada */}
            {/* Solo mostrar fechaRetiro editable */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-sky-700">
                Fecha de Retiro
              </label>
              <input
                type="date"
                name="fechaRetiro"
                value={formData.fechaRetiro}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
          </>
        )}

        {/* Raciones + Grupo */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold text-sky-700">
              Cantidad de Raciones
            </label>
            <input
              type="number"
              name="cantidadRaciones"
              min={1}
              value={formData.cantidadRaciones}
              onChange={handleChange}
              disabled={buscando}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold text-sky-700">
              Grupo Comunitario
            </label>
            <select
              name="IDHogar"
              value={formData.IDHogar}
              onChange={handleChange}
              disabled={buscando}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Seleccionar grupo…</option>
              {hogares.map(h => (
                <option key={h.idHogar} value={h.idHogar}>
                  {h.NombreGrupo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-sky-700">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            disabled={buscando}
            rows={3}
            className="w-full border border-gray-300 p-2 rounded resize-none"
            placeholder="Notas adicionales, comentarios..."
          />
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={buscando}
            className={`flex-1 p-2 rounded text-white ${buscando
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-sky-400 hover:bg-sky-500'
              }`}
          >
            Registrar
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData(initialState);
              setPersonaYaRegistrada(false);
              setErrorDocumento('');
            }}
            className="flex-1 p-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
