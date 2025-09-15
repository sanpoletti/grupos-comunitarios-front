import React from 'react';

interface IngestasSelectorProps {
  desayuna: boolean;
  almuerza: boolean;
  merienda: boolean;
  cena: boolean;
  onChange: (field: string, value: boolean) => void;
}

const IngestasSelector: React.FC<IngestasSelectorProps> = ({
  desayuna,
  almuerza,
  merienda,
  cena,
  onChange,
}) => {
  return (
    <div className="mt-3 mb-5 p-3 border rounded bg-light">
      <label className="form-label fw-bold mb-2 d-block">Ingestas / Retira</label>

      {/* FORZAMOS flex en línea */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'nowrap',
        }}
      >
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={desayuna}
            onChange={(e) => onChange('desayuna', e.target.checked)}
          />
          Desayuno
        </label>
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={almuerza}
            onChange={(e) => onChange('almuerza', e.target.checked)}
          />
          Almuerzo
        </label>
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={merienda}
            onChange={(e) => onChange('merienda', e.target.checked)}
          />
          Merienda
        </label>
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input me-1"
            checked={cena}
            onChange={(e) => onChange('cena', e.target.checked)}
          />
          Cena
        </label>
      </div>
    </div>
  );
};

export default IngestasSelector;
