'use client';

import { useState } from 'react';

export type Hogar = {
  idHogar: number;
  NombreGrupo: string;
  nroRegistro: number;
};

type Props = {
  hogares: Hogar[];
  value: number | '';
  onChange: (val: number | '') => void;
  disabled?: boolean;
};

export default function GrupoSelector({ hogares, value, onChange, disabled }: Props) {
  const [search, setSearch] = useState('');

  const filtered = hogares.filter(
    h =>
      h.NombreGrupo.toLowerCase().includes(search.toLowerCase()) ||
      String(h.nroRegistro).includes(search)
  );

  return (
    <div>
      <label className="block mb-1 text-sm font-semibold text-sky-700">
        Grupo
      </label>
      <input
        type="text"
        placeholder="Buscar por nombre o nro de registro"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-2"
        disabled={disabled}
      />
      <select
        name="IDHogar"
        value={value}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        disabled={disabled}
        className="w-full border border-gray-300 p-2 rounded"
        required
      >
        <option value="">Seleccionar grupo…</option>
        {filtered.map(h => (
          <option key={h.idHogar} value={h.idHogar}>
            {h.nroRegistro} - {h.NombreGrupo}
          </option>
        ))}
      </select>
    </div>
  );
}
