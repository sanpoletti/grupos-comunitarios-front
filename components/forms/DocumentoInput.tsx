'use client';

import React from 'react';

type Props = {
  IDTIPODOCUMENTO: number;
  nroDocumento: string;
  buscando: boolean;
  personaYaRegistrada: boolean;
  errorDocumento: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
};

export default function DocumentoInput({
  IDTIPODOCUMENTO,
  nroDocumento,
  buscando,
  personaYaRegistrada,
  errorDocumento,
  onChange,
  onBlur,
}: Props) {
  return (
    <div className="flex space-x-4">
      {/* Tipo de documento */}
      <div className="flex-1">
        <label className="block mb-1 text-sm font-semibold text-sky-700">
          Tipo Documento
        </label>
        <select
          name="IDTIPODOCUMENTO"
          value={IDTIPODOCUMENTO}
          onChange={onChange}
          disabled={personaYaRegistrada || buscando}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value={3}>D.N.I.</option>
          <option value={10}>PRC</option>
          <option value={1}>L.C.</option>
          <option value={2}>L.E.</option>
          <option value={13}>C.I.</option>
          <option value={0}>S.D.</option>
        </select>
      </div>

      {/* Número de documento */}
      <div className="flex-1">
        <label className="block mb-1 text-sm font-semibold text-sky-700">
          Número de Documento
        </label>
        <input
          name="nroDocumento"
          value={nroDocumento}
          onChange={onChange}
          onBlur={onBlur}
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
  );
}
