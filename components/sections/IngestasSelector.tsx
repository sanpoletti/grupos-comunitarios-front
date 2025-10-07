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
  // Funciones de ejemplo para los botones
  const handleRetiro = () => {
    console.log('Retiro presionado');
    onChange('desayuna', false);
    onChange('almuerza', false);
    onChange('merienda', false);
    onChange('cena', false);
    // más adelante podrías activar un flag de "Retiro"
  };

  const handleIngesta = () => {
    console.log('Ingesta presionado');
    onChange('desayuna', true);
    onChange('almuerza', true);
    onChange('merienda', true);
    onChange('cena', true);
  };

  const handleAceptar = () => {
    console.log('Aceptar presionado');
    // lógica futura
  };

  return (
    <div className="mt-3 mb-5 p-3 border rounded bg-light">
      <label className="form-label fw-bold mb-2 d-block">Ingestas / Retira</label>

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

      {/* Botones debajo */}
      <div className="mt-3" style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          style={{
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
          onClick={handleRetiro}
        >
          Retiro
        </button>
        <button
          type="button"
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
          onClick={handleIngesta}
        >
          Ración
        </button>
        <button
          type="button"
          style={{
            backgroundColor: '#198754',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
          }}
          onClick={handleAceptar}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default IngestasSelector;
