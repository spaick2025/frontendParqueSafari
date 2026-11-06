import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MapaMesas({ mesaSeleccionada, setMesaSeleccionada }) {
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    api.get('mesas/mesas/')
      .then(response => setMesas(response.data))
      .catch(error => console.error("Error al cargar mesas:", error));
  }, []);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>Salón Principal - Mapa de Mesas (A1 - H7)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        {mesas.map(mesa => {
          const isSelected = mesaSeleccionada?.id === mesa.id;
          const isLibre = mesa.estado === 'LIBRE';

          return (
            <button 
              key={mesa.id}
              onClick={() => setMesaSeleccionada(mesa)}
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: isSelected ? '4px solid #1e272e' : '2px solid transparent',
                background: isLibre ? '#2ed573' : '#ff4757',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              Mesa {mesa.codigo}
              <div style={{ fontSize: '13px', fontWeight: 'normal', marginTop: '6px', opacity: 0.9 }}>
                {mesa.estado}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MapaMesas;