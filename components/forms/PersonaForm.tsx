'use client';

import React from 'react';

type TipoFamiliar = {
  idtipodefamiliar: number;
  nombre: string;
};

type Props = {
  formData: {
    nombre: string;
    apellido: string;
    sexo: string;
    fechaNacimiento: string;
    lugarResidencia: string;
    observaciones: string;
    cantidadRaciones: number;
    cantidadPersonasHogar: number | '';
    idTipoFamiliar: number | '';
  };
  tiposFamiliares: TipoFamiliar[];
  personaYaRegistrada: boolean;
  buscando: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function PersonaForm({
  formData,
  tiposFamiliares,
  personaYaRegistrada,
  buscando,
  onChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nombre y Apellido */}
      {!personaYaRegistrada && (
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold text-sky-700">
              Nombre
            </label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold text-sky-700">
              Apellido
            </label>
            <input
              name="apellido"
              value={formData.apellido}
              onChange={onChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        </div>
      )}

      {/* Parentesco */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-sky-700">
          Parentesco
        </label>
        <select
          name="idTipoFamiliar"
          value={formData.idTipoFamiliar}
          onChange={onChange}
          disabled={buscando}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value="">Seleccione…</option>
          {tiposFamiliares.map((t) => (
            <option key={t.idtipodefamiliar} value={t.idtipodefamiliar}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Sexo y Fecha de Nacimiento */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-semibold text-sky-700">
            Sexo
          </label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value="CABA">CABA</option>
          <option value="PBA">PBA</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      {/* Cantidad de Raciones y Personas en Hogar */}
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
            onChange={onChange}
            disabled={buscando}
            className="w-24 border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-semibold text-sky-700">
            Cantidad Personas en el Hogar
          </label>
          <input
            type="number"
            name="cantidadPersonasHogar"
            min={1}
            value={formData.cantidadPersonasHogar || ''}
            onChange={onChange}
            disabled={buscando}
            className="w-24 border border-gray-300 p-2 rounded"
            placeholder="0"
          />
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
          onChange={onChange}
          disabled={buscando}
          rows={3}
          className="w-full border border-gray-300 p-2 rounded resize-none"
          placeholder="Notas adicionales, comentarios..."
        />
      </div>
    </form>
  );
}
